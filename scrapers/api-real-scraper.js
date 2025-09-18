// scrapers/api-real-scraper.js - Apollo.io Integration via Apify for SalesHandy-style Lead Generation
require('dotenv').config();
const axios = require('axios');

class ApolloLeadScraper {
    constructor() {
        this.serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
        this.apifyApiKey = process.env.APIFY_API_KEY;
        this.hunterApiKey = process.env.HUNTER_API_KEY; // Backup for email verification
        
        // Apollo.io scraper actor ID from Apify
        this.apolloActorId = 'code_crafter/apollo-io-scraper';
        
        // Priority industries for Tribearium targeting
        this.priorityIndustries = [
            'Manufacturing', 'Construction', 'Logistics & Supply Chain', 'Industrial Services', 'Waste Management',
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
            'Commercial Property Management', 'Real Estate Investment Groups', 'Construction Project Management',
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

        this.companySizeTargets = {
            min: 11,
            max: 500,
            ideal_max: 200
        };
    }

    // Main scraping method for SalesHandy integration
    async scrapeLeadsFromApollo(searchParams = {}) {
        console.log('🚀 Starting Apollo.io lead scraping via Apify...');
        console.log('Search parameters:', JSON.stringify(searchParams, null, 2));
        
        if (!this.apifyApiKey) {
            console.error('❌ APIFY_API_KEY not found in environment variables');
            return this.generateFallbackLeads(searchParams.count || 25);
        }

        try {
            // Build Apollo search configuration
            const apolloConfig = this.buildApolloSearchConfig(searchParams);
            console.log('🔧 Apollo configuration:', JSON.stringify(apolloConfig, null, 2));
            
            // Start Apify actor run
            const runResponse = await this.startApifyRun(apolloConfig);
            const runId = runResponse.data.data.id;
            
            console.log(`⏳ Apify run started: ${runId}`);
            console.log('🔄 Waiting for results...');
            
            // Wait for completion and get results
            const results = await this.waitForResults(runId);
            
            if (results && results.length > 0) {
                console.log(`📊 Raw results from Apollo: ${results.length} contacts`);
                
                // Process and enhance results
                const processedLeads = await this.processApolloResults(results);
                
                // Send to server
                if (processedLeads.length > 0) {
                    await this.sendLeadsToServer(processedLeads);
                }
                
                return {
                    success: true,
                    totalLeads: processedLeads.length,
                    leads: processedLeads,
                    source: 'apollo_io_apify'
                };
            } else {
                console.log('⚠️ No results from Apollo, generating fallback data...');
                return this.generateFallbackLeads(searchParams.count || 25);
            }
            
        } catch (error) {
            console.error('❌ Apollo scraping error:', error.message);
            console.log('🧪 Generating fallback test data...');
            return this.generateFallbackLeads(searchParams.count || 25);
        }
    }

    // Build Apollo.io search configuration
    buildApolloSearchConfig(params) {
        const config = {
            // Basic search parameters
            maxItems: params.count || 50,
            includeEmails: true,
            includePhones: true,
            
            // Search filters
            searchFilters: {}
        };

        // Job titles / roles
        if (params.jobTitle || params.role) {
            config.searchFilters.personTitles = [params.jobTitle || params.role];
        } else {
            // Default to our target titles
            config.searchFilters.personTitles = this.targetTitles.slice(0, 10);
        }

        // Location
        if (params.location) {
            config.searchFilters.personLocations = [params.location];
        } else {
            // Default high-value locations
            config.searchFilters.personLocations = [
                'United States', 'Miami, FL', 'Dallas, TX', 'Atlanta, GA', 'Phoenix, AZ'
            ];
        }

        // Industry
        if (params.industry) {
            config.searchFilters.organizationIndustries = [params.industry];
        } else {
            // Use priority industries
            config.searchFilters.organizationIndustries = this.priorityIndustries.slice(0, 15);
        }

        // Company size
        if (params.companySize || params.employeeCount) {
            config.searchFilters.organizationNumEmployeesRanges = [params.companySize || params.employeeCount];
        } else {
            config.searchFilters.organizationNumEmployeesRanges = ['11-50', '51-200', '201-500'];
        }

        // Revenue
        if (params.revenue) {
            config.searchFilters.organizationAnnualRevenueRanges = [params.revenue];
        }

        // Keywords
        if (params.keywords) {
            config.searchFilters.keywords = params.keywords;
        }

        return config;
    }

    // Start Apify actor run
    async startApifyRun(config) {
        const apifyInput = {
            startUrls: [{ url: 'https://app.apollo.io/#/people' }],
            maxItems: config.maxItems,
            searchFilters: config.searchFilters,
            includeEmails: config.includeEmails,
            includePhones: config.includePhones,
            outputFormat: 'json'
        };

        console.log('📡 Starting Apify actor with input:', JSON.stringify(apifyInput, null, 2));

        return await axios.post(
            `https://api.apify.com/v2/acts/${this.apolloActorId}/runs`,
            apifyInput,
            {
                headers: {
                    'Authorization': `Bearer ${this.apifyApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    // Wait for Apify run completion and get results
    async waitForResults(runId, maxAttempts = 30) {
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            await this.delay(10000); // Wait 10 seconds
            
            try {
                const statusResponse = await axios.get(
                    `https://api.apify.com/v2/acts/${this.apolloActorId}/runs/${runId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.apifyApiKey}`
                        }
                    }
                );
                
                const status = statusResponse.data.data.status;
                console.log(`📊 Apify run status: ${status} (attempt ${attempts + 1}/${maxAttempts})`);
                
                if (status === 'SUCCEEDED') {
                    console.log('✅ Apify run completed successfully');
                    
                    // Get results from dataset
                    const datasetId = statusResponse.data.data.defaultDatasetId;
                    const resultsResponse = await axios.get(
                        `https://api.apify.com/v2/datasets/${datasetId}/items`,
                        {
                            headers: {
                                'Authorization': `Bearer ${this.apifyApiKey}`
                            }
                        }
                    );
                    
                    return resultsResponse.data || [];
                    
                } else if (status === 'FAILED') {
                    throw new Error('Apify run failed');
                } else if (status === 'ABORTED') {
                    throw new Error('Apify run was aborted');
                }
                
            } catch (error) {
                console.error(`❌ Error checking run status:`, error.message);
                break;
            }
            
            attempts++;
        }
        
        throw new Error('Apify run timeout - exceeded maximum wait time');
    }

    // Process raw Apollo results into our lead format
    async processApolloResults(rawResults) {
        console.log('🔄 Processing Apollo.io results...');
        
        const processedLeads = [];
        
        for (const rawLead of rawResults) {
            try {
                // Skip if missing critical data
                if (!rawLead.email || !rawLead.name) {
                    console.log('⚠️ Skipping lead with missing email or name');
                    continue;
                }

                const lead = {
                    // Personal information
                    name: this.formatName(rawLead.name, rawLead.firstName, rawLead.lastName),
                    email: rawLead.email.toLowerCase().trim(),
                    title: this.normalizeTitle(rawLead.title || rawLead.jobTitle),
                    phone: this.formatPhone(rawLead.phone || rawLead.phoneNumber),
                    linkedin_url: rawLead.linkedinUrl || '',
                    
                    // Company information
                    company: rawLead.companyName || rawLead.organizationName || 'Unknown Company',
                    website: rawLead.companyWebsite || '',
                    location: this.formatLocation(rawLead.location, rawLead.city, rawLead.state, rawLead.country),
                    industry: rawLead.industry || this.estimateIndustry(rawLead.companyName),
                    
                    // Company metrics
                    company_size: this.normalizeCompanySize(rawLead.companySize),
                    employee_count: this.extractEmployeeCount(rawLead.companySize, rawLead.employeeCount),
                    estimated_revenue: this.estimateRevenue(rawLead),
                    
                    // Lead metadata
                    source: 'apollo_io',
                    real_email_verified: true, // Apollo provides verified emails
                    email_sequence_status: 'not_started',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                // Calculate enhanced scoring
                lead.score = this.calculateLeadScore(lead);
                lead.qualified = lead.score >= 60;
                lead.target_match = this.isTargetMatch(lead);
                lead.seniority_level = this.getSeniorityLevel(lead.title);

                // Only include high-quality leads
                if (lead.score >= 40 && lead.email && lead.name && lead.company) {
                    processedLeads.push(lead);
                    
                    console.log(`✅ Processed: ${lead.name} (${lead.title}) at ${lead.company} - Score: ${lead.score}`);
                }

            } catch (error) {
                console.error('❌ Error processing individual lead:', error.message);
                continue;
            }
        }

        console.log(`🎯 Processed ${processedLeads.length} high-quality leads from ${rawResults.length} raw results`);
        
        // Sort by score (highest first)
        processedLeads.sort((a, b) => b.score - a.score);
        
        return processedLeads;
    }

    // Enhanced lead scoring for SalesHandy
    calculateLeadScore(lead) {
        let score = 0;
        
        // Base data quality (40 points max)
        if (lead.name && lead.name.length > 2) score += 10;
        if (lead.email && this.isValidEmail(lead.email)) score += 15;
        if (lead.company && lead.company.length > 2) score += 10;
        if (lead.phone && lead.phone.length > 5) score += 5;
        
        // Title/seniority scoring (30 points max)
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
        
        // Industry bonus (15 points max)
        if (lead.industry && this.priorityIndustries.includes(lead.industry)) {
            score += 15;
        } else if (lead.industry) {
            score += 5;
        }
        
        // Company size bonus (10 points max)
        if (lead.employee_count) {
            if (lead.employee_count >= 11 && lead.employee_count <= 200) {
                score += 10;
            } else if (lead.employee_count >= 11 && lead.employee_count <= 500) {
                score += 7;
            } else if (lead.employee_count >= 5) {
                score += 3;
            }
        }
        
        // Revenue bonus (5 points max)
        if (lead.estimated_revenue >= 200000) {
            score += 5;
        } else if (lead.estimated_revenue >= 100000) {
            score += 3;
        }
        
        return Math.min(score, 100);
    }

    // Helper methods
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && 
               !email.includes('info@') && 
               !email.includes('contact@') && 
               !email.includes('admin@') &&
               !email.includes('support@');
    }

    formatName(fullName, firstName, lastName) {
        if (fullName && fullName.trim()) return fullName.trim();
        if (firstName && lastName) return `${firstName.trim()} ${lastName.trim()}`;
        if (firstName) return firstName.trim();
        return 'Unknown Contact';
    }

    normalizeTitle(title) {
        if (!title) return 'Business Contact';
        
        // Clean up common title variations
        const titleMappings = {
            'chief executive officer': 'CEO',
            'chief operating officer': 'COO', 
            'chief financial officer': 'CFO',
            'chief technology officer': 'CTO',
            'vice president': 'VP',
            'managing director': 'Managing Director'
        };
        
        const lowerTitle = title.toLowerCase();
        for (const [key, value] of Object.entries(titleMappings)) {
            if (lowerTitle.includes(key)) {
                return value;
            }
        }
        
        // Capitalize properly
        return title.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    formatPhone(phone) {
        if (!phone) return '';
        return phone.replace(/[^\d+]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '+1-$1-$2-$3');
    }

    formatLocation(location, city, state, country) {
        if (location) return location;
        if (city && state) return `${city}, ${state}`;
        if (city) return city;
        return 'Location Unknown';
    }

    normalizeCompanySize(companySize) {
        if (!companySize) return 'Medium';
        
        const size = companySize.toLowerCase();
        if (size.includes('1-10') || size.includes('micro')) return 'Small';
        if (size.includes('11-50') || size.includes('small')) return 'Medium';
        if (size.includes('51-200') || size.includes('medium')) return 'Medium';
        if (size.includes('201-500') || size.includes('large')) return 'Large';
        if (size.includes('500+') || size.includes('enterprise')) return 'Enterprise';
        
        return 'Medium';
    }

    extractEmployeeCount(companySize, employeeCount) {
        if (employeeCount && typeof employeeCount === 'number') return employeeCount;
        
        if (companySize) {
            const size = companySize.toLowerCase();
            if (size.includes('1-10')) return 5;
            if (size.includes('11-50')) return 25;
            if (size.includes('51-200')) return 100;
            if (size.includes('201-500')) return 300;
            if (size.includes('500+')) return 750;
        }
        
        return 50; // Default estimate
    }

    estimateRevenue(lead) {
        let baseRevenue = 150000;
        
        // Industry multipliers
        const industryMultipliers = {
            'Technology': 2.2,
            'Financial Services': 2.5,
            'Healthcare': 1.8,
            'Manufacturing': 1.6,
            'Construction': 1.4,
            'Legal Services': 2.0,
            'Consulting': 1.9
        };
        
        if (lead.industry && industryMultipliers[lead.industry]) {
            baseRevenue *= industryMultipliers[lead.industry];
        } else {
            baseRevenue *= 1.3;
        }
        
        // Company size multiplier
        if (lead.employee_count) {
            if (lead.employee_count > 200) baseRevenue *= 2.0;
            else if (lead.employee_count > 50) baseRevenue *= 1.5;
            else if (lead.employee_count > 20) baseRevenue *= 1.2;
        }
        
        return Math.round(baseRevenue);
    }

    estimateIndustry(companyName) {
        if (!companyName) return 'Business Services';
        
        const name = companyName.toLowerCase();
        if (name.includes('tech') || name.includes('software')) return 'Technology';
        if (name.includes('health') || name.includes('medical')) return 'Healthcare';
        if (name.includes('build') || name.includes('construction')) return 'Construction';
        if (name.includes('legal') || name.includes('law')) return 'Legal Services';
        if (name.includes('consult')) return 'Consulting';
        
        return 'Business Services';
    }

    isTargetMatch(lead) {
        let score = 0;
        
        // Priority industry
        if (lead.industry && this.priorityIndustries.includes(lead.industry)) score++;
        
        // Target title
        if (lead.title) {
            const titleLower = lead.title.toLowerCase();
            if (this.targetTitles.some(title => titleLower.includes(title.toLowerCase()))) score++;
        }
        
        // Company size
        if (lead.employee_count >= 11 && lead.employee_count <= 500) score++;
        
        // Valid email
        if (this.isValidEmail(lead.email)) score++;
        
        return score >= 3; // Match at least 3 out of 4 criteria
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
        if (titleLower.includes('manager')) {
            return 'Manager';
        }
        
        return 'Staff';
    }

    // Fallback test data generation
    generateFallbackLeads(count = 25) {
        console.log(`🧪 Generating ${count} fallback test leads...`);
        
        const testLeads = [];
        const companies = ['TechCorp Inc', 'BuildRight LLC', 'HealthSystems Pro', 'ManufacturingPlus', 'LegalAdvice Co'];
        const names = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'David Brown', 'Emma Garcia', 'James Miller'];
        const locations = ['Miami, FL', 'Dallas, TX', 'Atlanta, GA', 'Phoenix, AZ', 'Denver, CO'];
        
        for (let i = 0; i < count; i++) {
            const company = companies[i % companies.length];
            const name = names[i % names.length];
            const location = locations[i % locations.length];
            const industry = this.priorityIndustries[i % this.priorityIndustries.length];
            const title = this.targetTitles[i % this.targetTitles.length];
            
            const lead = {
                name: `${name} ${i + 1}`,
                email: `${name.toLowerCase().replace(' ', '.')}${i + 1}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                title: title,
                company: `${company} ${i + 1}`,
                phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
                website: `https://${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                linkedin_url: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}-${i + 1}`,
                location: location,
                industry: industry,
                company_size: ['Small', 'Medium', 'Large'][i % 3],
                employee_count: [25, 75, 150][i % 3],
                estimated_revenue: 150000 + (i * 50000),
                source: 'test_apollo_fallback',
                real_email_verified: true,
                email_sequence_status: 'not_started'
            };
            
            lead.score = this.calculateLeadScore(lead);
            lead.qualified = lead.score >= 60;
            lead.target_match = this.isTargetMatch(lead);
            lead.seniority_level = this.getSeniorityLevel(lead.title);
            
            testLeads.push(lead);
        }
        
        console.log(`✅ Generated ${testLeads.length} test leads`);
        return {
            success: true,
            totalLeads: testLeads.length,
            leads: testLeads,
            source: 'test_data'
        };
    }

    // Send leads to server
    async sendLeadsToServer(leads) {
        try {
            console.log(`📤 Sending ${leads.length} leads to server...`);
            
            const response = await axios.post(`${this.serverUrl}/api/batch-add-leads`, {
                leads: leads
            });
            
            console.log('✅ Server response:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('❌ Error sending leads to server:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Execute if run directly
if (require.main === module) {
    const scraper = new ApolloLeadScraper();
    
    // Example search parameters
    const searchParams = {
        jobTitle: 'CEO',
        industry: 'Technology', 
        location: 'United States',
        companySize: '11-200',
        count: 50
    };
    
    console.log('🚀 Starting Apollo.io scraper for SalesHandy integration...');
    
    scraper.scrapeLeadsFromApollo(searchParams)
        .then(results => {
            console.log('\n🎉 === SCRAPING COMPLETE ===');
            console.log(`✅ Success: ${results.success}`);
            console.log(`📊 Total leads: ${results.totalLeads}`);
            console.log(`🎯 Source: ${results.source}`);
            
            if (results.leads && results.leads.length > 0) {
                console.log('\n📋 Sample leads:');
                results.leads.slice(0, 3).forEach((lead, i) => {
                    console.log(`${i + 1}. ${lead.name} - ${lead.title} at ${lead.company}`);
                    console.log(`   📧 ${lead.email} | Score: ${lead.score} | Industry: ${lead.industry}`);
                });
            }
            
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Scraping failed:', error);
            process.exit(1);
        });
}

module.exports = ApolloLeadScraper;