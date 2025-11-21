// scrapers/simple-scraper.js - Simplified version without browser automation
require('dotenv').config();
const axios = require('axios');

class SimpleLeadGenerator {
    constructor() {
        this.serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
        
        // Priority industries with sample high-revenue leads
        this.priorityIndustries = [
            'construction',
            'Legal industry', 
            'Manufacturing',
            'Car dealerships',
            'Commercial real estate',
            'Retail',
            'Utilities/Energy',
            'Wholesaling',
            'Administrative and office support'
        ];
    }

    // Generate sample leads based on priority industries
    generateSampleLeads() {
        const sampleLeads = [
            // construction
            { name: "Mike Johnson", title: "CEO", company: "Johnson construction LLC", industry: "construction", estimated_revenue: 180000, location: "Dallas, TX", email: "mike@johnsonconstruction.com" },
            { name: "Sarah Davis", title: "Owner", company: "Davis Building Group", industry: "construction", estimated_revenue: 220000, location: "Phoenix, AZ", email: "sarah@davisbuildinggroup.com" },
            
            // Legal
            { name: "Robert Martinez", title: "Partner", company: "Martinez & Associates Law", industry: "Legal industry", estimated_revenue: 290000, location: "Miami, FL", email: "robert@martinezlaw.com" },
            { name: "Jennifer Wilson", title: "Managing Partner", company: "Wilson Legal Services", industry: "Legal industry", estimated_revenue: 340000, location: "Seattle, WA", email: "jennifer@wilsonlegal.com" },
            
            // Manufacturing
            { name: "David Thompson", title: "President", company: "Thompson Manufacturing Inc", industry: "Manufacturing", estimated_revenue: 450000, location: "Detroit, MI", email: "david@thompsonmfg.com" },
            { name: "Lisa Rodriguez", title: "CEO", company: "Rodriguez Industrial Solutions", industry: "Manufacturing", estimated_revenue: 380000, location: "Houston, TX", email: "lisa@rodriguezsolutions.com" },
            
            // Car Dealerships
            { name: "Mark Anderson", title: "General Manager", company: "Anderson Auto Group", industry: "Car dealerships", estimated_revenue: 520000, location: "Atlanta, GA", email: "mark@andersonauto.com" },
            { name: "Carol White", title: "Owner", company: "White Family Dealership", industry: "Car dealerships", estimated_revenue: 480000, location: "Denver, CO", email: "carol@whitefamilyauto.com" },
            
            // Commercial Real Estate
            { name: "James Taylor", title: "Principal", company: "Taylor Commercial Properties", industry: "Commercial real estate", estimated_revenue: 680000, location: "Los Angeles, CA", email: "james@taylorcommercial.com" },
            { name: "Patricia Brown", title: "President", company: "Brown Real Estate Ventures", industry: "Commercial real estate", estimated_revenue: 750000, location: "New York, NY", email: "patricia@brownrealestate.com" },
            
            // Retail
            { name: "Kevin Lee", title: "Owner", company: "Lee's Retail Chain", industry: "Retail", estimated_revenue: 290000, location: "Chicago, IL", email: "kevin@leesretail.com" },
            { name: "Michelle Garcia", title: "CEO", company: "Garcia Stores Inc", industry: "Retail", estimated_revenue: 320000, location: "San Antonio, TX", email: "michelle@garciastores.com" },
            
            // Utilities/Energy
            { name: "Steven Clark", title: "President", company: "Clark Energy Solutions", industry: "Utilities/Energy", estimated_revenue: 890000, location: "Oklahoma City, OK", email: "steven@clarkenergy.com" },
            { name: "Angela Lewis", title: "CEO", company: "Lewis Utilities Group", industry: "Utilities/Energy", estimated_revenue: 950000, location: "Pittsburgh, PA", email: "angela@lewisutilities.com" },
            
            // Wholesaling
            { name: "Christopher Hall", title: "Owner", company: "Hall Distribution Co", industry: "Wholesaling", estimated_revenue: 420000, location: "Jacksonville, FL", email: "chris@halldistribution.com" },
            { name: "Nancy Young", title: "President", company: "Young Wholesale Solutions", industry: "Wholesaling", estimated_revenue: 380000, location: "Nashville, TN", email: "nancy@youngwholesale.com" },
            
            // Administrative and office support
            { name: "Daniel King", title: "CEO", company: "King Business Services", industry: "Administrative and office support", estimated_revenue: 180000, location: "Portland, OR", email: "daniel@kingbusiness.com" },
            { name: "Karen Wright", title: "Owner", company: "Wright Administrative Solutions", industry: "Administrative and office support", estimated_revenue: 160000, location: "Charlotte, NC", email: "karen@wrightadmin.com" }
        ];

        return sampleLeads.map(lead => ({
            ...lead,
            phone: this.generatePhone(),
            website: `https://${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            linkedin_url: `https://linkedin.com/in/${lead.name.toLowerCase().replace(/\s/g, '')}`,
            source: 'priority_lead_generator'
        }));
    }

    generatePhone() {
        const areaCode = Math.floor(Math.random() * 900) + 100;
        const exchange = Math.floor(Math.random() * 900) + 100;
        const number = Math.floor(Math.random() * 9000) + 1000;
        return `+1-${areaCode}-${exchange}-${number}`;
    }

    async sendLeadsToServer(leads) {
        try {
            console.log(`Sending ${leads.length} priority leads to server...`);
            
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

    async generatePriorityLeads() {
        console.log('Generating priority industry leads...');
        console.log(`Target industries: ${this.priorityIndustries.join(', ')}`);
        
        const leads = this.generateSampleLeads();
        
        console.log(`Generated ${leads.length} high-revenue leads`);
        
        // Send to server
        const result = await this.sendLeadsToServer(leads);
        
        return {
            success: true,
            totalLeads: leads.length,
            results: result,
            industries: this.priorityIndustries
        };
    }
}

// CLI execution
if (require.main === module) {
    const generator = new SimpleLeadGenerator();
    
    generator.generatePriorityLeads()
        .then(results => {
            console.log('\n=== PRIORITY LEADS GENERATED ===');
            console.log(`Total leads: ${results.totalLeads}`);
            console.log(`Industries covered: ${results.industries.length}`);
            console.log('Results:', results.results);
            process.exit(0);
        })
        .catch(error => {
            console.error('Lead generation failed:', error);
            process.exit(1);
        });
}

module.exports = SimpleLeadGenerator;