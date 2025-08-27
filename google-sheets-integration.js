// dashboard/google-sheets-integration.js
const axios = require('axios');

// Tu Google Sheets ID extraído de la URL
const GOOGLE_SHEETS_ID = '1B0fupQ2HwKM8rmWB6pjFVSM1zKSvbfSA6gPUMR0ilps';
const SHEET_GID = '1607019060';

// Función para obtener datos en vivo de Google Sheets
async function fetchLiveGoogleSheets() {
    try {
        // URL para obtener datos en formato CSV desde Google Sheets público
        const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv&gid=${SHEET_GID}`;
        
        console.log('📡 Obteniendo datos en vivo de Google Sheets...');
        
        const response = await axios.get(csvUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'LeadsAutomationBot/1.0'
            }
        });
        
        if (response.status === 200) {
            console.log('✅ Datos obtenidos exitosamente');
            return response.data;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('❌ Error obteniendo datos de Google Sheets:', error.message);
        
        // Si falla, usar datos locales como fallback
        console.log('🔄 Usando datos locales como respaldo...');
        const fs = require('fs');
        const path = require('path');
        
        try {
            const localCsvPath = path.join(__dirname, '../data/leads.csv');
            return fs.readFileSync(localCsvPath, 'utf8');
        } catch (localError) {
            console.error('❌ Error leyendo archivo local:', localError.message);
            throw new Error('No se pudieron obtener datos ni de Google Sheets ni localmente');
        }
    }
}

// Función para procesar CSV de Google Sheets
function processGoogleSheetsCSV(csvData) {
    console.log('📊 Iniciando procesamiento del CSV...');
    console.log(`📄 Tamaño del CSV: ${csvData.length} caracteres`);
    
    const lines = csvData.split('\n');
    console.log(`📋 Total de líneas en CSV: ${lines.length}`);
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    console.log(`📑 Headers encontrados: ${headers.length}`);
    
    const processedLeads = [];
    let skippedRows = 0;
    let validRows = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.length < 10) {
            skippedRows++;
            continue; // Skip empty or very short lines
        }
        
        // Parsear CSV de manera más robusta
        const values = parseCSVLine(line);
        
        if (values.length < 5) {
            skippedRows++;
            continue; // Skip incomplete rows
        }
        
        const leadObj = {};
        headers.forEach((header, index) => {
            leadObj[header] = values[index] || '';
        });
        
        // Solo procesar si tiene email válido
        const email = leadObj['Email'] ? leadObj['Email'].trim() : '';
        if (!email || email === '') {
            skippedRows++;
            continue;
        }
        
        // Procesar lead
        const processedLead = {
            id: i, // Usar índice de fila como ID para preservar orden
            csvRowNumber: i + 1, // Número de fila real en el CSV (empezando desde 1)
            firstName: leadObj['First Name'] || '',
            lastName: leadObj['Last Name'] || '',
            fullName: `${leadObj['First Name'] || ''} ${leadObj['Last Name'] || ''}`.trim(),
            email: email,
            company: leadObj['Company'] || '',
            title: leadObj['Title'] || '',
            industry: leadObj['Industry'] || 'Other',
            employees: parseInt(leadObj['# Employees']) || 0,
            stage: leadObj['Stage'] || 'Cold',
            emailStatus: leadObj['Email Status'] || 'Unknown',
            phone: leadObj['Mobile Phone'] || leadObj['Work Direct Phone'] || '',
            city: leadObj['City'] || '',
            country: leadObj['Country'] || '',
            technologies: leadObj['Technologies'] || '',
            website: leadObj['Website'] || '',
            linkedinUrl: leadObj['Person Linkedin Url'] || '',
            emailSent: leadObj['Email Sent'] === 'TRUE' || leadObj['Email Sent'] === true,
            emailOpen: leadObj['Email Open'] === 'TRUE' || leadObj['Email Open'] === true,
            replied: leadObj['Replied'] === 'TRUE' || leadObj['Replied'] === true,
            score: calculateLeadScore(leadObj),
            lastUpdated: new Date().toISOString(),
            source: 'google_sheets_live'
        };
        
        processedLeads.push(processedLead);
        validRows++;
    }
    
    console.log(`✅ Procesamiento completado:`);
    console.log(`   - Filas válidas: ${validRows}`);
    console.log(`   - Filas omitidas: ${skippedRows}`);
    console.log(`   - Total procesados: ${processedLeads.length}`);
    
    if (processedLeads.length > 0) {
        console.log(`📊 Últimos 5 leads procesados:`);
        processedLeads.slice(-5).forEach((lead, index) => {
            console.log(`   ${processedLeads.length - 4 + index}. Fila ${lead.csvRowNumber}: ${lead.fullName} (${lead.company}) - ${lead.email}`);
        });
    }
    
    return processedLeads;
}

// Función auxiliar para parsear líneas CSV
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Función de scoring (reutilizada)
function calculateLeadScore(lead) {
    let score = 5; // Base score
    
    if (lead['Email Status'] === 'Verified') score += 2;
    if (lead['Person Linkedin Url']) score += 1;
    if (lead['# Employees'] && lead['# Employees'] > 50) score += 2;
    if (lead['Technologies'] && (
        lead['Technologies'].includes('Google') ||
        lead['Technologies'].includes('AWS') ||
        lead['Technologies'].includes('Shopify') ||
        lead['Technologies'].includes('Microsoft')
    )) score += 1;
    if (lead['Website']) score += 0.5;
    
    const techIndustries = ['technology', 'software', 'consulting', 'computer'];
    if (lead['Industry'] && techIndustries.some(tech => 
        lead['Industry'].toLowerCase().includes(tech)
    )) score += 1;
    
    return Math.min(Math.round(score * 10) / 10, 10);
}

// Función para detectar cambios
async function detectChanges(previousData, currentData) {
    const changes = {
        added: [],
        modified: [],
        total: currentData.length,
        timestamp: new Date().toISOString()
    };
    
    // Detectar nuevos leads
    const previousEmails = new Set(previousData.map(lead => lead.email));
    changes.added = currentData.filter(lead => 
        lead.email && !previousEmails.has(lead.email)
    );
    
    // Detectar modificaciones (simplificado por email)
    currentData.forEach(currentLead => {
        const previousLead = previousData.find(p => p.email === currentLead.email);
        if (previousLead && 
            (previousLead.stage !== currentLead.stage || 
             previousLead.score !== currentLead.score)) {
            changes.modified.push(currentLead);
        }
    });
    
    return changes;
}

module.exports = {
    fetchLiveGoogleSheets,
    processGoogleSheetsCSV,
    detectChanges
};