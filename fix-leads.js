require('dotenv').config();
const { Pool } = require('pg');

async function fixLeads() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Marcar todos los leads con score > 60 como calificados
        const result = await pool.query(`
            UPDATE leads 
            SET qualified = true 
            WHERE score >= 60 AND email IS NOT NULL
        `);
        
        console.log(`✅ Updated ${result.rowCount} leads as qualified`);
        
        // Mostrar leads calificados
        const qualified = await pool.query(`
            SELECT name, company, email, score, qualified, email_sequence_status 
            FROM leads 
            WHERE qualified = true
        `);
        
        console.log('\nQualified leads:');
        qualified.rows.forEach(lead => {
            console.log(`- ${lead.name} (${lead.company}) - Score: ${lead.score}`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

fixLeads();