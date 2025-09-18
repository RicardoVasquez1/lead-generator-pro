require('dotenv').config();
const { Pool } = require('pg');

async function setupDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔧 Setting up database...');
        await pool.query('SELECT NOW()');
        console.log('✅ Connection successful');
        
        // Drop existing tables first
        await pool.query('DROP TABLE IF EXISTS email_logs');
        await pool.query('DROP TABLE IF EXISTS leads');
        
        // Create comprehensive leads table
        await pool.query(`
            CREATE TABLE leads (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                title VARCHAR(255),
                company VARCHAR(255),
                phone VARCHAR(50),
                website VARCHAR(500),
                linkedin_url VARCHAR(500),
                location VARCHAR(255),
                industry VARCHAR(100),
                company_size VARCHAR(50),
                estimated_revenue INTEGER,
                source VARCHAR(50) DEFAULT 'scraper',
                score INTEGER DEFAULT 0,
                qualified BOOLEAN DEFAULT FALSE,
                email_sequence_status VARCHAR(50) DEFAULT 'not_started',
                last_contact TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Create email logs table
        await pool.query(`
            CREATE TABLE email_logs (
                id SERIAL PRIMARY KEY,
                lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
                email_address VARCHAR(255),
                subject VARCHAR(500),
                body TEXT,
                status VARCHAR(50) DEFAULT 'sent',
                tracking_id VARCHAR(100),
                bounce_reason TEXT,
                sent_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // Create indexes for performance
        await pool.query(`
            CREATE INDEX idx_leads_industry ON leads(industry);
            CREATE INDEX idx_leads_revenue ON leads(estimated_revenue DESC);
            CREATE INDEX idx_leads_qualified ON leads(qualified);
            CREATE INDEX idx_leads_score ON leads(score DESC);
        `);
        
        console.log('📊 Complete leads table created');
        console.log('📧 Email logs table created');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

setupDatabase();