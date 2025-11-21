// scrapers/lead-scraper.js - Production Version
require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

class PriorityLeadScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.leads = [];
        
        // Priority industries as specified by Tribearium
        this.priorityIndustries = [
            'Administrative and office support',
            'Legal industry', 
            'Retail',
            'construction',
            'Manufacturing',
            'Utilities/Energy',
            'Car dealerships',
            'Commercial real estate',
            'Wholesaling'
        ];
        
        // Search terms optimized for high-revenue companies
        this.industrySearchTerms = {
            'construction': ['construction company owner', 'general contractor CEO', 'construction firm president'],
            'Legal industry': ['law firm partner', 'attorney owner', 'legal practice president'],
            'Manufacturing': ['manufacturing CEO', 'factory owner', 'industrial company president'],
            'Retail': ['retail chain owner', 'store owner CEO', 'retail company president'],
            'Car dealerships': ['car dealership owner', 'auto dealer principal', 'dealership general manager'],
            'Commercial real estate': ['commercial real estate owner', 'property management CEO', 'real estate developer'],
            'Utilities/Energy': ['energy company CEO', 'utility company president', 'power company owner'],
            'Wholesaling': ['wholesale company owner', 'distribution CEO', 'wholesale business president'],
            'Administrative and office support': ['business services CEO', 'office management company owner', 'administrative services president']
        };
        
        this.serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    }

    async init() {
        console.log('Initializing priority lead scraper...');
        
        this.browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === 'production' ? 'new' : false,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ],
            defaultViewport: { width: 1366, height: 768 },
            ignoreDefaultArgs: ['--disable-extensions'],
            executablePath: puppeteer.executablePath() // Force specific Chrome path
        });
        
        console.log('Browser launched successfully');
        
        this.page = await this.browser.newPage();
        
        // Set user agent to avoid bot detection
        await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        
        console.log('Browser initialized successfully');
    }
    // LinkedIn scraper focused on high-revenue decision makers
    async scrapeLinkedInByIndustry(industry, searchTerm, maxResults = 20) {
        console.log(`Scraping LinkedIn for ${industry}: "${searchTerm}"`);
        
        try {
            // Use LinkedIn public profiles (no login required)
            const searchUrl = `https://www.google.com/search?q=site:linkedin.com/in "${searchTerm}" "${industry}"`;
            await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Random delay
            await this.randomDelay(2000, 4000);
            
            // Extract LinkedIn profile links
            const profileLinks = await this.page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a[href*="linkedin.com/in/"]'));
                return links.map(link => link.href).slice(0, 10);
            });
            
            console.log(`Found ${profileLinks.length} LinkedIn profiles for ${industry}`);
            
            const leads = [];
            
            for (const profileUrl of profileLinks.slice(0, maxResults)) {
                try {
                    await this.page.goto(profileUrl, { waitUntil: 'networkidle2', timeout: 20000 });
                    await this.randomDelay(3000, 5000);
                    
                    const profileData = await this.page.evaluate((industry) => {
                        const name = document.querySelector('h1')?.textContent?.trim() || '';
                        const title = document.querySelector('[data-generated-suggestion-target]')?.textContent?.trim() || 
                                     document.querySelector('.text-body-medium')?.textContent?.trim() || '';
                        const location = document.querySelector('.not-first-middot')?.textContent?.trim() || '';
                        
                        // Try to extract company from title
                        let company = '';
                        if (title.includes(' at ')) {
                            company = title.split(' at ')[1]?.trim();
                        } else if (title.includes(' | ')) {
                            company = title.split(' | ')[1]?.trim();
                        }
                        
                        return {
                            name,
                            title,
                            company,
                            location,
                            industry,
                            linkedin_url: window.location.href,
                            source: 'linkedin_scraper'
                        };
                    }, industry);
                    
                    if (profileData.name && profileData.company) {
                        // Estimate revenue based on company size indicators and industry
                        profileData.estimated_revenue = this.estimateCompanyRevenue(profileData.company, profileData.title, industry);
                        
                        // Generate email patterns
                        profileData.email_patterns = this.generateEmailPatterns(profileData.name, profileData.company);
                        
                        leads.push(profileData);
                        console.log(`Extracted: ${profileData.name} - ${profileData.company} (Est. Revenue: $${profileData.estimated_revenue})`);
                    }
                    
                } catch (error) {
                    console.log(`Failed to scrape profile ${profileUrl}: ${error.message}`);
                }
                
                // Rate limiting
                await this.randomDelay(3000, 6000);
            }
            
            return leads;
            
        } catch (error) {
            console.error(`Error scraping LinkedIn for ${industry}:`, error.message);
            return [];
        }
    }

    // Google Maps scraper for local businesses with revenue indicators
    async scrapeGoogleMapsByIndustry(industry, location = 'United States', maxResults = 15) {
        console.log(`Scraping Google Maps for ${industry} in ${location}`);
        
        try {
            // Search for businesses with revenue indicators
            const searchQuery = `${industry} company owner ${location}`;
            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
            
            await this.page.goto(mapsUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            await this.randomDelay(3000, 5000);
            
            // Scroll to load more results
            await this.page.evaluate(() => {
                const scrollContainer = document.querySelector('[role="main"]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            });
            
            await this.randomDelay(2000, 3000);
            
            const businesses = await this.page.evaluate((industry) => {
                const businessElements = document.querySelectorAll('[data-result-index]');
                const results = [];
                
                businessElements.forEach((element, index) => {
                    if (index >= 15) return; // Limit results
                    
                    try {
                        const nameElement = element.querySelector('[class*="fontHeadlineSmall"]');
                        const addressElement = element.querySelector('[class*="fontBodyMedium"] span');
                        const ratingElement = element.querySelector('[class*="fontBodyMedium"] span[aria-label*="star"]');
                        const reviewElement = element.querySelector('[class*="fontBodyMedium"] span[aria-label*="review"]');
                        
                        const businessName = nameElement?.textContent?.trim();
                        const address = addressElement?.textContent?.trim();
                        const rating = ratingElement?.getAttribute('aria-label');
                        const reviews = reviewElement?.getAttribute('aria-label');
                        
                        if (businessName && businessName.length > 3) {
                            results.push({
                                company: businessName,
                                address: address || '',
                                rating: rating || '',
                                reviews: reviews || '',
                                industry: industry,
                                location: address ? address.split(',').pop()?.trim() : '',
                                source: 'google_maps'
                            });
                        }
                    } catch (e) {
                        console.log('Error extracting business data:', e);
                    }
                });
                
                return results;
            }, industry);
            
            console.log(`Found ${businesses.length} businesses for ${industry}`);
            
            // Enrich business data with contact information
            const enrichedLeads = [];
            
            for (const business of businesses) {
                try {
                    // Estimate revenue based on reviews and rating
                    business.estimated_revenue = this.estimateRevenueFromMaps(business.reviews, business.rating, industry);
                    
                    // Try to find owner/decision maker info
                    const ownerInfo = await this.findBusinessOwner(business.company, business.location);
                    
                    if (ownerInfo.name) {
                        const lead = {
                            name: ownerInfo.name,
                            title: ownerInfo.title || 'Owner',
                            company: business.company,
                            location: business.location,
                            industry: industry,
                            estimated_revenue: business.estimated_revenue,
                            source: 'google_maps_enriched',
                            email_patterns: this.generateEmailPatterns(ownerInfo.name, business.company)
                        };
                        
                        enrichedLeads.push(lead);
                        console.log(`Enriched: ${lead.name} - ${lead.company} (Est. Revenue: $${lead.estimated_revenue})`);
                    }
                    
                } catch (error) {
                    console.log(`Failed to enrich ${business.company}: ${error.message}`);
                }
                
                await this.randomDelay(2000, 4000);
            }
            
            return enrichedLeads;
            
        } catch (error) {
            console.error(`Error scraping Google Maps for ${industry}:`, error.message);
            return [];
        }
    }

    // Find business owner information
    async findBusinessOwner(companyName, location) {
        try {
            const searchQuery = `"${companyName}" owner CEO president ${location}`;
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            
            await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 20000 });
            await this.randomDelay(1000, 2000);
            
            const ownerInfo = await this.page.evaluate(() => {
                const textContent = document.body.innerText.toLowerCase();
                const namePattern = /(?:owner|ceo|president|founder)[:\s]+([a-z\s]{3,30})/gi;
                const matches = textContent.match(namePattern);
                
                if (matches && matches.length > 0) {
                    const fullMatch = matches[0];
                    const namePart = fullMatch.split(/owner|ceo|president|founder/i)[1];
                    if (namePart) {
                        const name = namePart.replace(/[^\w\s]/g, '').trim();
                        const title = fullMatch.includes('ceo') ? 'CEO' :
                                     fullMatch.includes('president') ? 'President' :
                                     fullMatch.includes('founder') ? 'Founder' : 'Owner';
                        
                        return { name: name, title: title };
                    }
                }
                
                return { name: '', title: '' };
            });
            
            return ownerInfo;
            
        } catch (error) {
            console.log(`Error finding owner for ${companyName}:`, error.message);
            return { name: '', title: '' };
        }
    }

    // Estimate company revenue based on various indicators
    estimateCompanyRevenue(company, title, industry) {
        let baseRevenue = 50000; // Base monthly revenue estimate
        
        // Industry-based revenue adjustments
        const industryMultipliers = {
            'construction': 1.5,
            'manufacturing': 2.0,
            'legal industry': 1.8,
            'commercial real estate': 2.2,
            'utilities/Energy': 3.0,
            'car dealerships': 1.7,
            'wholesaling': 1.6,
            'retail': 1.2,
            'administrative and office support': 1.0
        };
        
        baseRevenue *= (industryMultipliers[industry] || 1.0);
        
        // Title-based adjustments
        const titleLower = (title || '').toLowerCase();
        if (titleLower.includes('ceo') || titleLower.includes('president')) {
            baseRevenue *= 1.8;
        } else if (titleLower.includes('owner') || titleLower.includes('founder')) {
            baseRevenue *= 1.6;
        } else if (titleLower.includes('director') || titleLower.includes('vp')) {
            baseRevenue *= 1.4;
        }
        
        // Company name indicators
        const companyLower = (company || '').toLowerCase();
        if (companyLower.includes('llc') || companyLower.includes('inc') || companyLower.includes('corp')) {
            baseRevenue *= 1.3;
        }
        if (companyLower.includes('group') || companyLower.includes('enterprises')) {
            baseRevenue *= 1.5;
        }
        
        return Math.round(baseRevenue);
    }

    // Estimate revenue from Google Maps data
    estimateRevenueFromMaps(reviews, rating, industry) {
        let baseRevenue = 30000;
        
        // Extract review count
        const reviewMatch = (reviews || '').match(/(\d+)/);
        const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : 0;
        
        // Extract rating
        const ratingMatch = (rating || '').match(/([\d.]+)/);
        const ratingValue = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
        
        // Revenue estimation based on online presence
        if (reviewCount > 100) baseRevenue *= 2.0;
        else if (reviewCount > 50) baseRevenue *= 1.5;
        else if (reviewCount > 20) baseRevenue *= 1.2;
        
        if (ratingValue >= 4.5) baseRevenue *= 1.3;
        else if (ratingValue >= 4.0) baseRevenue *= 1.1;
        
        // Industry adjustment
        const industryMultipliers = {
            'construction': 1.4,
            'manufacturing': 1.8,
            'car dealerships': 1.6,
            'commercial real estate': 2.0,
            'legal industry': 1.5
        };
        
        baseRevenue *= (industryMultipliers[industry] || 1.0);
        
        return Math.round(baseRevenue);
    }

    // Generate email patterns for lead
    generateEmailPatterns(name, company) {
        if (!name || !company) return [];
        
        const firstName = name.split(' ')[0]?.toLowerCase() || '';
        const lastName = name.split(' ')[1]?.toLowerCase() || '';
        const domain = this.extractDomain(company);
        
        if (!firstName || !domain) return [];
        
        return [
            `${firstName}.${lastName}@${domain}`,
            `${firstName}${lastName}@${domain}`,
            `${firstName}@${domain}`,
            `${firstName.charAt(0)}${lastName}@${domain}`,
            `${firstName}${lastName.charAt(0)}@${domain}`
        ];
    }

    // Extract domain from company name
    extractDomain(company) {
        if (!company) return '';
        
        return company.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '')
            .replace(/(llc|inc|corp|ltd|company|co)$/i, '')
            + '.com';
    }

    // Random delay to avoid bot detection
    async randomDelay(min = 2000, max = 5000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Send leads to server
    async sendLeadsToServer(leads) {
        if (!leads || leads.length === 0) return { success: false, message: 'No leads to send' };
        
        try {
            console.log(`Sending ${leads.length} leads to server...`);
            
            const response = await axios.post(`${this.serverUrl}/api/batch-add-leads`, {
                leads: leads
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });
            
            console.log(`Server response:`, response.data);
            return response.data;
            
        } catch (error) {
            console.error('Error sending leads to server:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Main execution function
    async runScraping(maxLeadsPerIndustry = 10) {
        await this.init();
        
        try {
            console.log(`Starting priority industry scraping for ${this.priorityIndustries.length} industries...`);
            
            let totalLeads = [];
            
            for (const industry of this.priorityIndustries) {
                console.log(`\n--- Processing ${industry} ---`);
                
                const searchTerms = this.industrySearchTerms[industry] || [`${industry} owner`, `${industry} CEO`];
                const industryLeads = [];
                
                // LinkedIn scraping
                for (const searchTerm of searchTerms.slice(0, 2)) { // Limit to 2 search terms per industry
                    try {
                        const linkedInLeads = await this.scrapeLinkedInByIndustry(industry, searchTerm, 5);
                        industryLeads.push(...linkedInLeads);
                        
                        if (industryLeads.length >= maxLeadsPerIndustry) break;
                    } catch (error) {
                        console.error(`LinkedIn scraping failed for ${searchTerm}:`, error.message);
                    }
                }
                
                // Google Maps scraping if we need more leads
                if (industryLeads.length < maxLeadsPerIndustry) {
                    try {
                        const mapsLeads = await this.scrapeGoogleMapsByIndustry(industry, 'United States', maxLeadsPerIndustry - industryLeads.length);
                        industryLeads.push(...mapsLeads);
                    } catch (error) {
                        console.error(`Google Maps scraping failed for ${industry}:`, error.message);
                    }
                }
                
                // Process and validate leads
                const validLeads = industryLeads
                    .filter(lead => lead.name && (lead.email_patterns?.length > 0 || lead.company))
                    .slice(0, maxLeadsPerIndustry)
                    .map(lead => ({
                        ...lead,
                        email: lead.email_patterns?.[0] || `info@${this.extractDomain(lead.company)}`,
                        estimated_revenue: lead.estimated_revenue || this.estimateCompanyRevenue(lead.company, lead.title, industry)
                    }));
                
                console.log(`Collected ${validLeads.length} valid leads for ${industry}`);
                totalLeads.push(...validLeads);
                
                // Send leads to server in batches
                if (validLeads.length > 0) {
                    await this.sendLeadsToServer(validLeads);
                }
                
                // Delay between industries
                await this.randomDelay(5000, 10000);
            }
            
            console.log(`\n=== SCRAPING COMPLETED ===`);
            console.log(`Total leads collected: ${totalLeads.length}`);
            console.log(`Industries processed: ${this.priorityIndustries.length}`);
            
            return {
                success: true,
                totalLeads: totalLeads.length,
                leads: totalLeads,
                industriesProcessed: this.priorityIndustries.length
            };
            
        } finally {
            if (this.browser) {
                await this.browser.close();
                console.log('Browser closed');
            }
        }
    }
}

// CLI execution
if (require.main === module) {
    const scraper = new PriorityLeadScraper();
    
    scraper.runScraping(8) // 8 leads per industry = ~72 leads total
        .then(results => {
            console.log('\n=== FINAL RESULTS ===');
            console.log(results);
            process.exit(0);
        })
        .catch(error => {
            console.error('Scraping failed:', error);
            process.exit(1);
        });
}

module.exports = PriorityLeadScraper;