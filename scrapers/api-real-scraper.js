// scrapers/api-real-scraper.js - ScraperCity Direct + LinkedIn Enrichment
require('dotenv').config();
const axios = require('axios');
const Papa = require('papaparse');

class ScraperCityDirectScraper {
    constructor() {
        this.serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
        
        // ScraperCity configuration
        this.scraperCityApiKey = process.env.SCRAPERCITY_API_KEY || '8c547dc5-b997-466b-8c59-03cacb45778a';
        this.scraperCityBaseUrl = 'https://app.scrapercity.com/api/v1';
        
        // SIEMPRE 500 contactos máximo
        this.MAX_CONTACTS = 500;
        // TOP leads para enriquecer con LinkedIn
        this.TOP_LEADS_FOR_LINKEDIN = 10;
        
        this.priorityIndustries = [
            'Manufacturing', 'construction', 'Logistics & Supply Chain', 'Industrial Services', 'Waste Management',
            'HVAC', 'Electrical Services', 'Plumbing', 'Facility Maintenance', 'Auto Repair', 'Fleet Services',
            'Accounting & Bookkeeping', 'Legal Services', 'Insurance Agencies', 'Management Consulting', 
            'HR & Staffing Firms', 'Compliance Services', 'Pest Control', 'Landscaping', 
            'Janitorial & Cleaning Services', 'Roofing & Exterior Maintenance', 'Security Companies',
            'Distribution & Wholesale', 'Wholesale Trade', 'Import/Export', 'Packaging & Fulfillment',
            'Dental Practices', 'Physical Therapy', 'Chiropractors', 'Private Clinics', 
            'Home Healthcare', 'Behavioral Health Services', 'Vocational Schools', 
            'Online Training Providers', 'Corporate Training Companies', 'Driving Schools', 
            'Private K-12 Institutions', 'Print Services', 'Office Equipment Suppliers', 
            'Safety Equipment Providers', 'Commercial Furniture', 'Signage & Displays',
            'Commercial Property Management', 'Real Estate Investment Groups', 'construction Project Management',
            'Architectural Services', 'Building Inspection Services', 'Outsourced Customer Support',
            'Technical Support Providers', 'BPO Firms'
        ];

        this.targetTitles = [
            'Owner', 'Business Owner', 'Company Owner', 'Managing Director', 'MD',
            'CEO', 'Chief Executive Officer', 'President', 'Founder', 'Co-Founder',
            'CFO', 'Chief Financial Officer', 'COO', 'Chief Operating Officer', 
            'CTO', 'Chief Technology Officer', 'VP', 'Vice President',
            'VP Operations', 'VP Finance', 'VP Sales', 'Director', 'Operations Director', 
            'IT Director', 'Finance Director', 'Business Development Director',
            'General Manager', 'Regional Manager', 'Operations Manager', 'Office Manager', 
            'Admin Manager', 'Finance Manager', 'IT Manager', 'Facilities Manager',
            'Head of Finance', 'Head of Operations'
        ];
        
        // 🔴 NUEVO - Variables para tracking
        this.currentRunId = null;
        this.currentSearchQuery = null;
    }

    // ========== FUNCIÓN PRINCIPAL ==========
    
    async scrapeLeadsFromApollo(searchParams = {}) {
        console.log('🚀 Starting ScraperCity Direct scraping...');
        console.log('📊 Max contacts limited to:', this.MAX_CONTACTS);
        console.log('⭐ Will enrich TOP', this.TOP_LEADS_FOR_LINKEDIN, 'leads with LinkedIn');
        console.log('Search parameters:', JSON.stringify(searchParams, null, 2));
        
        try {
            // Forzar máximo 500
            searchParams.count = Math.min(searchParams.count || 500, this.MAX_CONTACTS);
            
            const results = await this.scrapeWithScraperCity(searchParams);
            
            if (results.success && results.totalLeads > 0) {
                console.log('✅ ScraperCity Direct successful!');
                
                // NUEVO: Enriquecer TOP 10 con LinkedIn
                if (results.leads && results.leads.length > 0) {
                    const enrichedTopLeads = await this.enrichTopLeadsWithLinkedIn(results.leads);
                    
                    // Actualizar los leads enriquecidos en el array principal
                    if (enrichedTopLeads && enrichedTopLeads.length > 0) {
                        enrichedTopLeads.forEach(enrichedLead => {
                            const index = results.leads.findIndex(l => l.email === enrichedLead.email);
                            if (index !== -1) {
                                results.leads[index] = enrichedLead;
                            }
                        });
                        results.enrichedLeadsCount = enrichedTopLeads.length;
                    }
                }
                
                return results;
            } else {
                throw new Error('ScraperCity returned no results');
            }
            
        } catch (error) {
            console.error('❌ ScraperCity Direct error:', error.message);
            
            return {
                success: false,
                error: error.message,
                totalLeads: 0,
                leads: [],
                source: 'scrapercity_direct_error',
                message: `ScraperCity Direct failed: ${error.message}`
            };
        }
    }

    // ========== LINKEDIN ENRICHMENT FUNCTION ==========
    
    async enrichTopLeadsWithLinkedIn(allLeads) {
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 LINKEDIN ENRICHMENT PROCESS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            // Filtrar y ordenar para encontrar los mejores leads
            const topLeads = allLeads
                .filter(lead => {
                    // Solo leads con LinkedIn URL
                    const hasLinkedIn = lead.linkedin_url && 
                                      lead.linkedin_url.length > 0 && 
                                      lead.linkedin_url.includes('linkedin.com');
                    if (!hasLinkedIn) return false;
                    
                    // Score mínimo de 60
                    if (lead.score < 60) return false;
                    
                    return true;
                })
                .sort((a, b) => {
                    // Sistema de puntuación para ordenar
                    let scoreA = a.score || 0;
                    let scoreB = b.score || 0;
                    
                    // Mega bonus por ser CEO/Owner/Founder (máxima prioridad)
                    const titleA = (a.title || '').toLowerCase();
                    const titleB = (b.title || '').toLowerCase();
                    
                    if (titleA.includes('ceo') || titleA.includes('owner') || titleA.includes('founder')) {
                        scoreA += 50;
                    }
                    if (titleB.includes('ceo') || titleB.includes('owner') || titleB.includes('founder')) {
                        scoreB += 50;
                    }
                    
                    // Bonus por C-Level
                    if (titleA.includes('cfo') || titleA.includes('coo') || titleA.includes('cto')) {
                        scoreA += 30;
                    }
                    if (titleB.includes('cfo') || titleB.includes('coo') || titleB.includes('cto')) {
                        scoreB += 30;
                    }
                    
                    // Bonus por VP/Director
                    if (titleA.includes('vp') || titleA.includes('vice president') || titleA.includes('director')) {
                        scoreA += 20;
                    }
                    if (titleB.includes('vp') || titleB.includes('vice president') || titleB.includes('director')) {
                        scoreB += 20;
                    }
                    
                    // Bonus por tamaño ideal de empresa (50-500 empleados)
                    const empA = a.employee_count || 0;
                    const empB = b.employee_count || 0;
                    
                    if (empA >= 50 && empA <= 500) scoreA += 15;
                    if (empB >= 50 && empB <= 500) scoreB += 15;
                    
                    // Bonus por tener teléfono
                    if (a.phone) scoreA += 5;
                    if (b.phone) scoreB += 5;
                    
                    return scoreB - scoreA;
                })
                .slice(0, this.TOP_LEADS_FOR_LINKEDIN); // TOP 10
            
            console.log(`✨ Found ${topLeads.length} premium leads for LinkedIn enrichment`);
            
            if (topLeads.length === 0) {
                console.log('⚠️ No leads qualified for LinkedIn enrichment');
                return [];
            }
            
            // Mostrar los leads seleccionados
            console.log('\n📋 Selected TOP leads:');
            topLeads.forEach((lead, index) => {
                console.log(`  ${index + 1}. ${lead.name} - ${lead.title} at ${lead.company} (Score: ${lead.score})`);
            });
            
            // Extraer URLs de LinkedIn
            const linkedInUrls = topLeads.map(lead => lead.linkedin_url);
            
            console.log(`\n💰 Estimated cost: $${(topLeads.length * 0.02).toFixed(2)} for LinkedIn enrichment`);
            console.log('📡 Calling LinkedIn Scraper API...');
            
            // Llamar a LinkedIn Scraper
            const enrichResponse = await axios.post(
                `${this.scraperCityBaseUrl}/scrape/linkedin`,
                {
                    profileUrls: linkedInUrls
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.scraperCityApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000
                }
            );
            
            if (enrichResponse.data && enrichResponse.data.runId) {
                console.log(`⏳ LinkedIn enrichment started: ${enrichResponse.data.runId}`);
                
                // Esperar resultados de LinkedIn
                const linkedInData = await this.waitForLinkedInResults(enrichResponse.data.runId);
                
                if (linkedInData && linkedInData.length > 0) {
                    console.log(`✅ LinkedIn enrichment completed for ${linkedInData.length} profiles`);
                    
                    // Merge datos de LinkedIn con los leads originales
                    const enrichedLeads = this.mergeLinkedInData(topLeads, linkedInData);
                    
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log(`⭐ ${enrichedLeads.length} PREMIUM LEADS ENRICHED`);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    
                    return enrichedLeads;
                }
            }
            
            console.log('⚠️ LinkedIn enrichment did not return results');
            return topLeads; // Devolver los leads sin enriquecer
            
        } catch (error) {
            console.error('❌ LinkedIn enrichment error:', error.message);
            console.log('⚠️ Continuing with basic leads data');
            return []; // No bloquear el proceso principal
        }
    }

    // Esperar resultados de LinkedIn Scraper
    async waitForLinkedInResults(runId, maxAttempts = 30) {
        let attempts = 0;
        
        console.log(`⏳ Waiting for LinkedIn results: ${runId}`);
        
        while (attempts < maxAttempts) {
            attempts++;
            await this.delay(5000); // 5 segundos entre intentos
            
            try {
                const statusResponse = await axios.get(
                    `${this.scraperCityBaseUrl}/scrape/status/${runId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.scraperCityApiKey}`
                        },
                        timeout: 30000
                    }
                );
                
                const status = statusResponse.data.status || statusResponse.data.state;
                
                if (status === 'SUCCEEDED' || status === 'succeeded' || status === 'completed') {
                    console.log('✅ LinkedIn scraping completed!');
                    
                    // Descargar resultados
                    if (statusResponse.data.outputUrl) {
                        const csvUrl = statusResponse.data.outputUrl.startsWith('/') 
                            ? `https://app.scrapercity.com${statusResponse.data.outputUrl}`
                            : statusResponse.data.outputUrl;
                        
                        return await this.downloadAndParseCsv(csvUrl);
                    }
                }
                
                if (status === 'FAILED' || status === 'failed') {
                    throw new Error('LinkedIn scraping failed');
                }
                
                console.log(`🔄 LinkedIn status: ${status} (${attempts}/${maxAttempts})`);
                
            } catch (error) {
                console.error(`⚠️ LinkedIn check attempt ${attempts} failed:`, error.message);
                
                if (attempts >= maxAttempts) {
                    throw error;
                }
            }
        }
        
        throw new Error('Timeout waiting for LinkedIn results');
    }

    // Merge LinkedIn data con los leads originales
    mergeLinkedInData(originalLeads, linkedInData) {
        const enrichedLeads = [];
        
        originalLeads.forEach(lead => {
            // Buscar datos de LinkedIn correspondientes
            const linkedInProfile = linkedInData.find(profile => {
                // Matching por URL o nombre
                return profile.url === lead.linkedin_url || 
                       profile.fullName === lead.name ||
                       profile.name === lead.name;
            });
            
            if (linkedInProfile) {
                // Crear lead enriquecido
                const enrichedLead = {
                    ...lead,
                    is_premium: true, // Marcar como premium
                    linkedin_enriched: true,
                    
                    // Datos adicionales de LinkedIn
                    linkedin_headline: linkedInProfile.headline || linkedInProfile.title,
                    linkedin_summary: linkedInProfile.summary || linkedInProfile.about,
                    linkedin_location: linkedInProfile.location,
                    linkedin_connections: linkedInProfile.connections,
                    linkedin_followers: linkedInProfile.followers,
                    
                    // Experiencia
                    current_position_duration: linkedInProfile.currentPositionDuration,
                    total_experience: linkedInProfile.experience,
                    previous_companies: linkedInProfile.previousCompanies || [],
                    
                    // Educación
                    education: linkedInProfile.education || [],
                    skills: linkedInProfile.skills || [],
                    languages: linkedInProfile.languages || [],
                    
                    // Actividad
                    linkedin_posts: linkedInProfile.recentPosts || [],
                    last_active: linkedInProfile.lastActive,
                    
                    // Score mejorado por tener datos de LinkedIn
                    score: Math.min(lead.score + 10, 100),
                    
                    enrichment_date: new Date().toISOString()
                };
                
                enrichedLeads.push(enrichedLead);
                console.log(`  ✅ Enriched: ${lead.name} - Added LinkedIn professional data`);
            } else {
                // Si no se encontró match, mantener el lead original pero marcado
                enrichedLeads.push({
                    ...lead,
                    is_premium: true,
                    linkedin_enriched: false
                });
                console.log(`  ⚠️ No match found for: ${lead.name}`);
            }
        });
        
        return enrichedLeads;
    }
    
    // ========== SCRAPERCITY NATIVE INTEGRATION ==========
    
    async scrapeWithScraperCity(searchParams = {}) {
        console.log('🚀 ScraperCity - Using FILTER-BASED endpoint (apollo-filters)...');
        
        // 🔴 NUEVO - Generar runId y searchQuery AQUÍ, al principio
        this.currentRunId = `scraperC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.currentSearchQuery = `${searchParams.jobTitle || ''} ${searchParams.industry || ''} ${searchParams.location || ''}`.trim() || 'Unknown search';
        
        console.log(`📦 Batch RunID: ${this.currentRunId}`);
        console.log(`🔍 Search Query: ${this.currentSearchQuery}`);
        
        try {
            // Usar el endpoint ALTERNATIVO con filtros
            const scraperPayload = {
                // Person filters
                personTitles: searchParams.jobTitle ? [searchParams.jobTitle] : [],
                personCities: searchParams.location ? [searchParams.location] : [],
                
                // Company filters
                companyIndustry: searchParams.industry || undefined,
                companySize: searchParams.companySize || undefined,
                
                // Control
                count: Math.min(searchParams.count || 500, this.MAX_CONTACTS),
                hasPhone: false,
                fileName: `leads_${Date.now()}`
            };
            
            // Limpiar undefined del payload
            Object.keys(scraperPayload).forEach(key => 
                scraperPayload[key] === undefined && delete scraperPayload[key]
            );
            
            console.log('📤 Filter-based payload:', JSON.stringify(scraperPayload, null, 2));
            
            // USAR EL ENDPOINT CORRECTO: apollo-filters
            const response = await axios.post(
                `${this.scraperCityBaseUrl}/scrape/apollo-filters`,
                scraperPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.scraperCityApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000
                }
            );
            
            console.log('✅ ScraperCity response received');
            
            let runId = response.data?.runId || response.data?.id || response.data?.scrapeId;
            
            if (runId) {
                console.log(`⏳ ScraperCity run started: ${runId}`);
                const results = await this.waitForScraperCityResults(runId);
                
                if (results && results.length > 0) {
                    const processedLeads = this.processScraperCityResults(results, searchParams);
                    
                    if (processedLeads.length > 0) {
                        await this.sendLeadsToServer(processedLeads);
                    }
                    
                    return {
                        success: true,
                        totalLeads: processedLeads.length,
                        leads: processedLeads,
                        source: 'scrapercity_filters',
                        runId: this.currentRunId,  // 🔴 NUEVO
                        searchQuery: this.currentSearchQuery,  // 🔴 NUEVO
                        message: `Extracted ${processedLeads.length} profiles via filter-based endpoint`
                    };
                }
            }
            
            throw new Error('No runId received from ScraperCity');
            
        } catch (error) {
            console.error('❌ ScraperCity error:', error.message);
            if (error.response) {
                console.error('Response:', error.response.data);
            }
            throw error;
        }
    }
    
    // Esperar resultados de ScraperCity
    async waitForScraperCityResults(runId, maxAttempts = 60) {
        let attempts = 0;
        
        console.log(`⏳ Waiting for ScraperCity results: ${runId}`);
        console.log('⚠️ This may take 3-5 minutes for 500 leads');
        
        while (attempts < maxAttempts) {
            attempts++;
            await this.delay(10000); // 10 segundos entre intentos
            
            console.log(`🔄 Attempt ${attempts}/${maxAttempts} - Checking status...`);
            
            try {
                // Verificar estado del scrape
                const statusResponse = await axios.get(
                    `${this.scraperCityBaseUrl}/scrape/status/${runId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.scraperCityApiKey}`
                        },
                        timeout: 30000
                    }
                );
                
                const scrapeData = statusResponse.data;
                const status = scrapeData.status || scrapeData.state || scrapeData.run_status;
                
                console.log(`📊 ScraperCity status: ${status}`);
                
                if (status === 'SUCCEEDED' || status === 'succeeded' || status === 'completed' || status === 'COMPLETED') {
                    console.log('✅ ScraperCity completed!');
                    
                    await this.delay(5000);
                    
                    let csvUrl = null;
                    
                    const possibleUrlFields = [
                        'outputUrl', 'downloadUrl', 'download_url', 
                        'resultUrl', 'result_url', 'csv_url', 'csvUrl',
                        'file_url', 'fileUrl', 'output', 'result'
                    ];
                    
                    for (const field of possibleUrlFields) {
                        if (scrapeData[field]) {
                            csvUrl = scrapeData[field];
                            console.log(`Found URL in field '${field}': ${csvUrl}`);
                            break;
                        }
                    }
                    
                    if (csvUrl && csvUrl.startsWith('/')) {
                        csvUrl = `https://app.scrapercity.com${csvUrl}`;
                    }
                    
                    if (csvUrl) {
                        console.log(`📥 Downloading CSV from: ${csvUrl}`);
                        return await this.downloadAndParseCsv(csvUrl);
                    } else {
                        console.log('⚠️ No CSV URL found in response');
                        console.log('Full response:', JSON.stringify(scrapeData, null, 2));
                        throw new Error('No CSV URL found in ScraperCity response');
                    }
                }
                
                if (status === 'RUNNING' || status === 'running' || status === 'IN_PROGRESS' || status === 'PENDING') {
                    console.log(`⏳ ScraperCity still processing... (${attempts}/${maxAttempts})`);
                    
                    if (scrapeData.progress) {
                        console.log(`📊 Progress: ${scrapeData.progress}%`);
                    }
                    if (scrapeData.rows_extracted) {
                        console.log(`📊 Rows extracted so far: ${scrapeData.rows_extracted}`);
                    }
                }
                
                if (status === 'FAILED' || status === 'failed' || status === 'ERROR') {
                    console.error('❌ ScraperCity failed');
                    console.error('Failure reason:', scrapeData.error || scrapeData.message || 'Unknown');
                    throw new Error('ScraperCity run failed');
                }
                
            } catch (error) {
                console.error(`❌ Error in attempt ${attempts}:`, error.message);
                
                if (attempts >= maxAttempts) {
                    throw error;
                }
                
                console.log(`↻ Continuing with next attempt in 10 seconds...`);
            }
        }
        
        throw new Error('Timeout waiting for ScraperCity results');
    }
    
    // Descargar y parsear CSV
    async downloadAndParseCsv(csvUrl) {
        console.log(`📥 Downloading CSV...`);
        
        let csvContent = null;
        let downloadAttempts = 0;
        const maxDownloadAttempts = 3;
        
        while (downloadAttempts < maxDownloadAttempts && !csvContent) {
            downloadAttempts++;
            try {
                console.log(`📦 Download attempt ${downloadAttempts}/${maxDownloadAttempts}...`);
                
                const csvResponse = await axios.get(csvUrl, {
                    headers: {
                        'Authorization': `Bearer ${this.scraperCityApiKey}`,
                        'Accept': 'text/csv, application/csv, text/plain, */*'
                    },
                    maxRedirects: 5,
                    responseType: 'text',
                    timeout: 60000,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                });
                
                csvContent = csvResponse.data;
                
                if (csvContent && csvContent.length > 0) {
                    console.log('✅ CSV downloaded successfully!');
                    console.log(`📊 CSV size: ${csvContent.length} characters`);
                    
                    const firstLines = csvContent.split('\n').slice(0, 3).join('\n');
                    console.log('First lines of CSV:', firstLines);
                }
                
            } catch (downloadError) {
                console.error(`⚠️ Download error attempt ${downloadAttempts}:`, downloadError.message);
                if (downloadAttempts < maxDownloadAttempts) {
                    console.log('↻ Retrying download in 3 seconds...');
                    await this.delay(3000);
                }
            }
        }
        
        if (csvContent && csvContent.length > 0) {
            console.log('📄 Parsing CSV...');
            
            const parsed = Papa.parse(csvContent, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                delimiter: ',',
                transformHeader: (header) => header.trim()
            });
            
            console.log(`📊 Parsed ${parsed.data.length} rows from CSV`);
            
            if (parsed.data.length > 0) {
                console.log('CSV Headers:', Object.keys(parsed.data[0]));
                console.log('Sample lead:', JSON.stringify(parsed.data[0], null, 2));
            }
            
            return parsed.data;
        } else {
            throw new Error('CSV content is empty');
        }
    }
    
    // Procesar resultados de ScraperCity - ACTUALIZADO para manejar el nuevo formato
    processScraperCityResults(rawResults, searchParams = {}) {
        console.log(`🔄 Processing ${rawResults.length} ScraperCity results...`);
        console.log(`📦 Using RunID: ${this.currentRunId}`);  // 🔴 NUEVO
        console.log(`🔍 Search Query: ${this.currentSearchQuery}`);  // 🔴 NUEVO
        
        const processedLeads = [];
        let skippedNoEmail = 0;
        
        for (const row of rawResults) {
            // Mapeo actualizado para el formato nuevo de ScraperCity
            const lead = {
                // Información básica
                name: row.fullName || row.full_name || row.name || row.Name || 
                      `${row.firstName || ''} ${row.lastName || ''}`.trim() || '',
                      
                email: (row.email || row.Email || '').toLowerCase().trim(),
                       
                title: row.position || row.title || row.Title || '',
                       
                company: row.orgName || row.company_name || row.company || row.Company || '',
                
                // Contacto adicional
                phone: row.phone || row.phoneRaw || row.Phone || '',
                       
                linkedin_url: row.linkedinUrl || row.linkedin || row.LinkedIn || '',
                
                // Ubicación
                location: `${row.city || ''} ${row.state || ''}`.trim() || row.location || '',
                city: row.city || row.City || '',
                state: row.state || row.State || '',
                country: row.country || row.Country || '',
                
                // Empresa
                website: row.orgWebsite || row.company_website || row.website || '',
                        
                industry: row.orgIndustry || row.industry || '',
                         
                company_size: row.orgSize || row.company_size || '',
                             
                employee_count: parseInt(row.orgSize || row.employees || 0),
                
                // Datos adicionales de ScraperCity
                seniority: row.seniority || '',
                email_status: row.emailStatus || '',
                company_description: row.orgDescription || '',
                company_specialities: row.orgSpecialities || '',
                
                // 🔴 NUEVO - Agregar runId y searchQuery a cada lead
                scraper_run_id: this.currentRunId,
                scraper_search_query: this.currentSearchQuery,
                
                // Metadata
                source: 'scrapercity_direct',
                scraping_method: 'scrapercity_native',
                scraping_date: new Date().toISOString(),
                real_email_verified: row.emailStatus === 'Verified',
                email_sequence_status: 'not_started'
            };
            
            // Limpiar campos de arrays que vienen como strings
            if (typeof lead.industry === 'string') {
                if (lead.industry.startsWith('[')) {
                    try {
                        // Convertir comillas simples a dobles para JSON válido
                        const cleanString = lead.industry.replace(/'/g, '"');
                        const parsed = JSON.parse(cleanString);
                        lead.industry = Array.isArray(parsed) ? parsed.join(', ') : parsed;
                    } catch (e) {
                        // Si falla el parse, limpiar manualmente
                        lead.industry = lead.industry.replace(/[\[\]']/g, '').trim();
                    }
                }
                // Limpiar espacios y capitalizar
                lead.industry = lead.industry.trim();
                if (lead.industry) {
                    // Capitalizar primera letra si es necesario
                    lead.industry = lead.industry.charAt(0).toUpperCase() + lead.industry.slice(1);
                }
            }

            // Si después de todo esto está vacío, usar el parámetro de búsqueda
            if (!lead.industry && searchParams && searchParams.industry) {
                lead.industry = searchParams.industry;
            }
            
            // Validación - solo requerir email
            if (lead.email && lead.email.includes('@')) {
                if (!lead.name) {
                    lead.name = lead.email.split('@')[0].replace(/[._-]/g, ' ');
                }
                
                lead.score = this.calculateRealDataScore(lead);
                lead.qualified = lead.score >= 60;
                lead.seniority_level = lead.seniority || this.getSeniorityLevel(lead.title);
                lead.target_match = this.isRealTargetMatch(lead);
                
                processedLeads.push(lead);
            } else {
                skippedNoEmail++;
            }
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ PROCESSING COMPLETED:`);
        console.log(`📊 Total in CSV: ${rawResults.length} rows`);
        console.log(`✅ Valid leads processed: ${processedLeads.length}`);
        console.log(`❌ Skipped without email: ${skippedNoEmail}`);
        console.log(`📦 All leads tagged with RunID: ${this.currentRunId}`);  // 🔴 NUEVO
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return processedLeads;
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    calculateRealDataScore(lead) {
        let score = 0;
        
        // Calidad de datos básicos (40 puntos max)
        if (lead.name && lead.name.length > 2) score += 10;
        if (lead.email && this.isValidEmail(lead.email)) score += 15;
        if (lead.company && lead.company.length > 2) score += 10;
        if (lead.phone && lead.phone.length > 5) score += 5;
        
        // Información profesional (30 puntos max)
        if (lead.title) {
            const title = lead.title.toLowerCase();
            if (title.includes('ceo') || title.includes('owner') || title.includes('founder') || title.includes('president')) {
                score += 30;
            } else if (title.includes('cfo') || title.includes('coo') || title.includes('cto') || title.includes('vp') || title.includes('vice president')) {
                score += 25;
            } else if (title.includes('director')) {
                score += 20;
            } else if (title.includes('manager') || title.includes('head')) {
                score += 15;
            } else {
                score += 5;
            }
        }
        
        // Bonificación por industria (15 puntos max)
        if (lead.industry && this.priorityIndustries.some(ind => 
            lead.industry.toLowerCase().includes(ind.toLowerCase()))) {
            score += 15;
        } else if (lead.industry) {
            score += 5;
        }
        
        // Bonificación por tamaño de empresa (10 puntos max)
        if (lead.employee_count) {
            if (lead.employee_count >= 11 && lead.employee_count <= 200) {
                score += 10;
            } else if (lead.employee_count >= 11 && lead.employee_count <= 500) {
                score += 7;
            } else if (lead.employee_count >= 5) {
                score += 3;
            }
        }
        
        // Bonificación por datos adicionales (5 puntos max)
        if (lead.linkedin_url) score += 2;
        if (lead.website) score += 2;
        
        // Bonificación por email verificado
        if (lead.email_status === 'Verified') score += 5;
        
        return Math.min(score, 100);
    }
    
    getSeniorityLevel(title) {
        if (!title) return 'Staff';
        
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('ceo') || titleLower.includes('owner') || titleLower.includes('founder') || titleLower.includes('president')) {
            return 'C-Level/Owner';
        }
        if (titleLower.includes('vp') || titleLower.includes('vice president') || titleLower.includes('managing director')) {
            return 'VP/Executive';
        }
        if (titleLower.includes('director')) {
            return 'Director';
        }
        if (titleLower.includes('manager') || titleLower.includes('head of')) {
            return 'Manager';
        }
        
        return 'Staff';
    }
    
    isRealTargetMatch(lead) {
        let matches = 0;
        
        // Industria objetivo
        if (lead.industry && this.priorityIndustries.some(ind => 
            lead.industry.toLowerCase().includes(ind.toLowerCase()))) matches++;
        
        // Título objetivo
        if (lead.title && this.targetTitles.some(title => 
            lead.title.toLowerCase().includes(title.toLowerCase()))) matches++;
        
        // Tamaño de empresa
        if (lead.employee_count >= 11 && lead.employee_count <= 500) matches++;
        
        // Email válido
        if (this.isValidEmail(lead.email)) matches++;
        
        return matches >= 3;
    }
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && 
               !email.includes('info@') && 
               !email.includes('contact@') && 
               !email.includes('admin@') &&
               !email.includes('support@');
    }
    
    // Enviar leads al servidor en lotes - ACTUALIZADO para incluir runId
    async sendLeadsToServer(leads) {
        try {
            console.log(`📤 Sending ${leads.length} leads to server...`);
            console.log(`📦 All leads include RunID: ${this.currentRunId}`);  // 🔴 NUEVO
            
            // Contar leads premium
            const premiumCount = leads.filter(l => l.is_premium).length;
            if (premiumCount > 0) {
                console.log(`⭐ Including ${premiumCount} PREMIUM leads with LinkedIn enrichment`);
            }
            
            const batchSize = 50;
            let totalProcessed = 0;
            
            for (let i = 0; i < leads.length; i += batchSize) {
                const batch = leads.slice(i, i + batchSize);
                
                console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1} - ${batch.length} leads`);
                
                await axios.post(`${this.serverUrl}/api/batch-add-leads`, {
                    leads: batch
                }, {
                    timeout: 30000
                });
                
                totalProcessed += batch.length;
                console.log(`✅ ${totalProcessed}/${leads.length} leads processed`);
                
                if (i + batchSize < leads.length) {
                    await this.delay(1000);
                }
            }
            
            console.log(`✅ ALL ${leads.length} leads sent to server with RunID: ${this.currentRunId}`);
            return { success: true, totalProcessed: leads.length };
            
        } catch (error) {
            console.error('❌ Error sending leads:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Función de compatibilidad para búsqueda por email
    async searchPersonByEmail(email) {
        try {
            console.log(`🔍 Email search not available in direct mode`);
            
            return {
                success: false,
                data: {
                    email_status: 'not_available',
                    message: 'Direct ScraperCity mode - email verification not available'
                }
            };
            
        } catch (error) {
            console.error('❌ Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Exportar con el nombre original para compatibilidad
module.exports = ScraperCityDirectScraper;

// Si se ejecuta directamente
if (require.main === module) {
    const scraper = new ScraperCityDirectScraper();
    
    const searchParams = {
        jobTitle: 'CEO',
        location: 'Miami',
        count: 500
    };
    
    console.log('🚀 Testing ScraperCity Direct with LinkedIn Enrichment...');
    console.log('💰 Estimated cost: $1.95 (Apollo) + $0.20 (LinkedIn TOP 10) = $2.15 total');
    
    scraper.scrapeLeadsFromApollo(searchParams)
        .then(results => {
            console.log('\n✅ Test complete!');
            console.log(`📊 Total leads: ${results.totalLeads}`);
            console.log(`📦 RunID: ${results.runId}`);  // 🔴 NUEVO
            console.log(`🔍 Search: ${results.searchQuery}`);  // 🔴 NUEVO
            console.log(`⭐ Premium enriched: ${results.enrichedLeadsCount || 0}`);
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Test failed:', error);
            process.exit(1);
        });
}