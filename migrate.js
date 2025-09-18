// migrate.js - Ejecutar una sola vez para agregar columnas faltantes
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');
        
        // Agregar columnas faltantes a la tabla leads
        await pool.query(`
            ALTER TABLE leads 
            ADD COLUMN IF NOT EXISTS employee_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS seniority_level VARCHAR(50),
            ADD COLUMN IF NOT EXISTS target_match BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS real_email_verified BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS email_sequence_status VARCHAR(50) DEFAULT 'not_started',
            ADD COLUMN IF NOT EXISTS last_contact TIMESTAMP,
            ADD COLUMN IF NOT EXISTS last_email_status VARCHAR(50)
        `);
        console.log('✅ Added missing columns to leads table');

        // Crear tabla email_tracking
        await pool.query(`
            CREATE TABLE IF NOT EXISTS email_tracking (
                id SERIAL PRIMARY KEY,
                lead_id INTEGER REFERENCES leads(id),
                email_address VARCHAR(255),
                tracking_pixel_id UUID DEFAULT gen_random_uuid(),
                template_day VARCHAR(10),
                subject VARCHAR(500),
                sent_at TIMESTAMP DEFAULT NOW(),
                opened_at TIMESTAMP NULL,
                clicked_at TIMESTAMP NULL,
                replied_at TIMESTAMP NULL,
                bounced_at TIMESTAMP NULL,
                spam_at TIMESTAMP NULL,
                status VARCHAR(50) DEFAULT 'sent',
                open_count INTEGER DEFAULT 0,
                click_count INTEGER DEFAULT 0,
                user_agent TEXT,
                ip_address INET,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Created email_tracking table');

        // Crear índices
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_email_tracking_pixel ON email_tracking(tracking_pixel_id);
            CREATE INDEX IF NOT EXISTS idx_email_tracking_lead ON email_tracking(lead_id);
            CREATE INDEX IF NOT EXISTS idx_email_tracking_email ON email_tracking(email_address);
            CREATE INDEX IF NOT EXISTS idx_leads_seniority ON leads(seniority_level);
            CREATE INDEX IF NOT EXISTS idx_leads_target_match ON leads(target_match);
            CREATE INDEX IF NOT EXISTS idx_leads_email_status ON leads(email_sequence_status);
        `);
        console.log('✅ Created indexes');

        // Crear tabla email_metrics
        await pool.query(`
            CREATE TABLE IF NOT EXISTS email_metrics (
                id SERIAL PRIMARY KEY,
                date DATE UNIQUE,
                emails_sent INTEGER DEFAULT 0,
                emails_failed INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Created email_metrics table');

        // Actualizar leads existentes
        await pool.query(`
            UPDATE leads SET 
                target_match = true,
                seniority_level = 'C-Level/Owner',
                real_email_verified = true
            WHERE email IS NOT NULL AND email != ''
        `);
        console.log('✅ Updated existing leads');

        console.log('🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();