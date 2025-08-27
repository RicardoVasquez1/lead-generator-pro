// dashboard/server.js
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors');
const { fetchLiveGoogleSheets, processGoogleSheetsCSV, detectChanges } = require('./google-sheets-integration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Variables para almacenar datos
let leadsData = [];
let previousLeadsData = [];
let stats = {};
let lastUpdateTime = null;

// Función principal para cargar datos (Google Sheets + fallback local)
async function loadLeadsData() {
    console.log('🔄 Cargando datos de leads...');
    
    try {
        // Intentar cargar desde Google Sheets primero
        const csvData = await fetchLiveGoogleSheets();
        const newLeadsData = processGoogleSheetsCSV(csvData);
        
        // Detectar cambios y marcar nuevos leads
        if (leadsData.length > 0) {
            const changes = await detectChanges(leadsData, newLeadsData);
            
            if (changes.added.length > 0) {
                console.log(`🆕 ${changes.added.length} nuevos leads detectados`);
                
                // Marcar nuevos leads con timestamp actual
                changes.added.forEach(newLead => {
                    const index = newLeadsData.findIndex(lead => lead.email === newLead.email);
                    if (index !== -1) {
                        newLeadsData[index].lastUpdated = new Date().toISOString();
                        newLeadsData[index].isNew = true;
                        console.log(`📝 Nuevo lead marcado: ${newLead.fullName} - ${newLead.company}`);
                    }
                });
            }
            
            if (changes.modified.length > 0) {
                console.log(`🔄 ${changes.modified.length} leads modificados`);
            }
        } else {
            // Primera carga - marcar todos con timestamp
            newLeadsData.forEach(lead => {
                lead.lastUpdated = new Date().toISOString();
            });
        }
        
        // Actualizar datos
        previousLeadsData = [...leadsData];
        leadsData = newLeadsData;
        lastUpdateTime = new Date().toISOString();
        
        console.log(`✅ Cargados ${leadsData.length} leads desde Google Sheets`);
        calculateStats();
        
    } catch (error) {
        console.error('❌ Error cargando desde Google Sheets:', error.message);
        
        // Fallback a datos locales
        await loadLocalCSVData();
    }
}

// Función fallback para datos locales
async function loadLocalCSVData() {
    console.log('🔄 Cargando datos locales como respaldo...');
    leadsData = [];
    
    const csvPath = path.join(__dirname, '../data/leads.csv');
    
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const processedLead = {
                    id: leadsData.length + 1,
                    firstName: row['First Name'] || '',
                    lastName: row['Last Name'] || '',
                    fullName: `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
                    email: row['Email'] || '',
                    company: row['Company'] || '',
                    title: row['Title'] || '',
                    industry: row['Industry'] || 'Other',
                    employees: parseInt(row['# Employees']) || 0,
                    stage: row['Stage'] || 'Cold',
                    emailStatus: row['Email Status'] || 'Unknown',
                    phone: row['Mobile Phone'] || row['Work Direct Phone'] || '',
                    city: row['City'] || '',
                    country: row['Country'] || '',
                    technologies: row['Technologies'] || '',
                    website: row['Website'] || '',
                    linkedinUrl: row['Person Linkedin Url'] || '',
                    emailSent: row['Email Sent'] === 'TRUE' || row['Email Sent'] === true,
                    emailOpen: row['Email Open'] === 'TRUE' || row['Email Open'] === true,
                    replied: row['Replied'] === 'TRUE' || row['Replied'] === true,
                    score: calculateLeadScore(row),
                    lastUpdated: new Date().toISOString(),
                    source: 'local_csv'
                };
                
                leadsData.push(processedLead);
            })
            .on('end', () => {
                console.log(`✅ Cargados ${leadsData.length} leads desde archivo local`);
                lastUpdateTime = new Date().toISOString();
                calculateStats();
                resolve();
            })
            .on('error', (error) => {
                console.error('❌ Error al cargar CSV local:', error);
                reject(error);
            });
    });
}

// Función para calcular estadísticas
function calculateStats() {
    console.log('📊 Calculando estadísticas...');
    
    stats = {
        total: leadsData.length,
        qualified: leadsData.filter(lead => lead.score >= 8).length,
        approaching: leadsData.filter(lead => lead.stage === 'Approaching').length,
        cold: leadsData.filter(lead => lead.stage === 'Cold').length,
        conversionRate: 0,
        byStage: {},
        byIndustry: {},
        byScore: {
            high: 0,    // 8-10
            medium: 0,  // 5-7
            low: 0      // 0-4
        },
        averageScore: 0,
        topIndustries: [],
        recentLeads: []
    };
    
    // Calcular estadísticas detalladas
    leadsData.forEach(lead => {
        // Por etapa
        stats.byStage[lead.stage] = (stats.byStage[lead.stage] || 0) + 1;
        
        // Por industria (limpiar y normalizar)
        let industry = lead.industry || 'Other';
        if (industry.length > 20) industry = industry.substring(0, 20) + '...';
        stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
        
        // Por score
        if (lead.score >= 8) stats.byScore.high++;
        else if (lead.score >= 5) stats.byScore.medium++;
        else stats.byScore.low++;
    });
    
    // Score promedio
    stats.averageScore = Math.round(
        (leadsData.reduce((sum, lead) => sum + lead.score, 0) / leadsData.length) * 10
    ) / 10;
    
    // Tasa de conversión (leads calificados / total)
    stats.conversionRate = Math.round((stats.qualified / stats.total) * 1000) / 10;
    
    // Top 5 industrias
    stats.topIndustries = Object.entries(stats.byIndustry)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([industry, count]) => ({ industry, count }));
    
    // Leads recientes (top 10 por score)
    stats.recentLeads = leadsData
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(lead => ({
            name: lead.fullName,
            company: lead.company,
            industry: lead.industry,
            status: lead.stage.toLowerCase(),
            score: lead.score,
            email: lead.email
        }));
    
    console.log(`📈 Stats calculadas: ${stats.qualified} calificados de ${stats.total} total`);
}

// Rutas de la API
app.get('/api/leads', (req, res) => {
    const { limit = 50, stage, minScore } = req.query;
    
    let filteredLeads = [...leadsData];
    
    // Filtros
    if (stage) {
        filteredLeads = filteredLeads.filter(lead => 
            lead.stage.toLowerCase() === stage.toLowerCase()
        );
    }
    
    if (minScore) {
        filteredLeads = filteredLeads.filter(lead => 
            lead.score >= parseFloat(minScore)
        );
    }
    
    // Limitar resultados
    filteredLeads = filteredLeads.slice(0, parseInt(limit));
    
    res.json({
        success: true,
        data: filteredLeads,
        total: filteredLeads.length
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        data: stats,
        lastUpdated: new Date().toISOString()
    });
});

app.get('/api/dashboard-data', (req, res) => {
    // Obtener los 10 leads más recientes (agregados más recientemente)
    const recentLeads = leadsData
        .slice() // Crear copia para no modificar el original
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)) // Ordenar por fecha más reciente
        .slice(0, 10) // Tomar los primeros 10
        .map(lead => ({
            name: lead.fullName,
            company: lead.company,
            industry: lead.industry.length > 30 ? lead.industry.substring(0, 30) + '...' : lead.industry,
            status: lead.stage.toLowerCase(),
            score: lead.score,
            email: lead.email,
            addedAt: lead.lastUpdated
        }));

    res.json({
        success: true,
        stats: {
            totalLeads: stats.total,
            qualifiedLeads: stats.qualified,
            approachingLeads: stats.approaching,
            conversionRate: stats.conversionRate
        },
        charts: {
            stageDistribution: stats.byStage,
            topIndustries: stats.topIndustries
        },
        recentLeads: recentLeads
    });
});

// Endpoint específico para leads recientes
app.get('/api/recent-leads', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`🔍 Solicitando ${limit} leads más recientes`);
    console.log(`📊 Total leads en memoria: ${leadsData.length}`);
    
    if (leadsData.length === 0) {
        return res.json({
            success: true,
            data: [],
            total: 0,
            message: 'No hay leads disponibles'
        });
    }
    
    // Filtrar leads válidos (con email y nombre)
    const validLeads = leadsData.filter(lead => {
        const hasEmail = lead.email && lead.email.trim() !== '';
        const hasName = lead.fullName && lead.fullName.trim() !== '';
        return hasEmail && hasName;
    });
    
    console.log(`✅ Leads válidos: ${validLeads.length} de ${leadsData.length}`);
    
    // Ordenar por número de fila CSV (los más altos son los más recientes)
    const sortedLeads = validLeads.sort((a, b) => b.csvRowNumber - a.csvRowNumber);
    
    // Tomar los primeros N (que son los más recientes)
    const recentLeads = sortedLeads
        .slice(0, limit)
        .map((lead, index) => ({
            name: lead.fullName,
            company: lead.company || 'N/A',
            industry: lead.industry && lead.industry.length > 35 ? 
                lead.industry.substring(0, 35) + '...' : 
                lead.industry || 'N/A',
            status: lead.stage ? lead.stage.toLowerCase() : 'cold',
            score: lead.score || 5,
            email: lead.email,
            csvRow: lead.csvRowNumber,
            addedAt: lead.lastUpdated
        }));

    console.log(`📋 Enviando los ${recentLeads.length} leads más recientes:`);
    recentLeads.forEach((lead, i) => {
        console.log(`   ${i+1}. Fila ${lead.csvRow}: ${lead.name} (${lead.company})`);
    });

    res.json({
        success: true,
        data: recentLeads,
        total: recentLeads.length,
        totalValid: validLeads.length,
        lastUpdate: lastUpdateTime,
        debug: {
            totalLeadsInMemory: leadsData.length,
            validLeadsCount: validLeads.length,
            highestRowNumber: validLeads.length > 0 ? Math.max(...validLeads.map(l => l.csvRowNumber)) : 0,
            lowestRowNumber: validLeads.length > 0 ? Math.min(...validLeads.map(l => l.csvRowNumber)) : 0
        }
    });
});

// Endpoint para forzar actualización desde Google Sheets
app.get('/api/refresh-data', async (req, res) => {
    try {
        await loadLeadsData();
        res.json({
            success: true,
            message: 'Datos actualizados desde Google Sheets',
            totalLeads: leadsData.length,
            lastUpdate: lastUpdateTime
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/data-source', (req, res) => {
    const source = leadsData.length > 0 ? leadsData[0].source : 'unknown';
    res.json({
        success: true,
        source: source,
        lastUpdate: lastUpdateTime,
        totalLeads: leadsData.length,
        googleSheetsUrl: 'https://docs.google.com/spreadsheets/d/1B0fupQ2HwKM8rmWB6pjFVSM1zKSvbfSA6gPUMR0ilps/edit?gid=1607019060#gid=1607019060'
    });
});

// Simular procesamiento de nuevo lead (para demo)
app.post('/api/process-lead', async (req, res) => {
    console.log('🔄 Procesando lead desde dashboard...');
    
    try {
        // Recargar datos desde Google Sheets para capturar cambios
        await loadLeadsData();
        
        res.json({
            success: true,
            message: 'Lead procesado exitosamente',
            newStats: stats,
            lastUpdate: lastUpdateTime,
            totalLeads: leadsData.length
        });
    } catch (error) {
        console.error('Error procesando lead:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Ruta principal - servir el dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Dashboard disponible en http://localhost:${PORT}`);
    
    // Cargar datos al iniciar
    loadLeadsData();
});

// Recargar datos cada 30 segundos (para demo)
setInterval(() => {
    console.log('🔄 Actualizando datos...');
    calculateStats();
}, 30000);