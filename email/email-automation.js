// email/email-automation.js - SalesHandy-style Manual Email Sequence Management
require('dotenv').config();
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

class SalesHandyEmailSystem {
    constructor() {
        // PostgreSQL connection
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        // Email templates (Javier's content)
        this.emailTemplates = {
            day_1: {
                subject: "Quick automation question for {{company}}",
                body: `{spin}Hi|Hello|Hey there{endspin} {{name}},

Hope you're doing well. I wanted to reach out because we help {{industry}} teams like yours save hours every week by replacing time-consuming manual tasks with smart, AI-powered automations.

At Tribearium Solutions, we do more than just connect systems, we partner with your team to design automations that fit the way your business actually runs. Whether it's capturing leads, onboarding clients, or handling admin workflows, we tailor every solution to free up time, reduce errors, and help your team focus on what matters most.

To show you how this could work for your business, we're offering a free personalized demo. All we need is 3 minutes of your time to understand your workflows.

Our demos have helped founders:
• Cut down client onboarding time by 50%
• Automate internal requests & approvals
• Get visibility into ops with a live dashboard

Fill out this short form https://tally.so/r/w8BL6Y and we'll send you a custom automation or MVP prototype, no strings attached.

{spin}Best regards,|Sincerely,|Regards{endspin}
Javier

https://calendly.com/tribeariumsolutions/30min`
            },
            
            day_3: {
                subject: "Re: Automation for {{company}}",
                body: `Hi {{name}},

Just wanted to follow up in case my note got buried.

If saving time by automating lead capture, onboarding, or admin work is something you're considering, I'd be happy to show you what that could look like for your team.

We'd like to send you a quick proposal or even a free automation prototype; we just need a bit more information to tailor it.

You can:
• Book a 15-min call https://calendly.com/tribeariumsolutions/30min
• Fill out this short form https://tally.so/r/w8BL6Y
• Or just reply with what you're looking to improve

No pressure, we're happy to help if the timing's right.

Let me know what works best,
Javier`
            },
            
            day_7: {
                subject: "One question for {{name}} at {{company}}",
                body: `Hi {{name}},

If there's one manual task your team would love to get off their plate, what would it be?

We've helped other {{industry}} teams automate everything from intake forms to backend operations—and it's usually easier than it sounds.

If you'd like, I can take a quick look and let you know what's possible, no strings attached.

Best,
Javier

https://calendly.com/tribeariumsolutions/30min`
            },
            
            day_9: {
                subject: "Final note for {{name}} at {{company}}",
                body: `Hi {{name}},

I haven't heard back, so I'll assume timing might not be right. Totally understand.

If automation becomes a priority down the line, feel free to reach out. Always happy to help you identify ways to free up time and reduce busywork.

Wishing you and your team continued success,
Javier

https://calendly.com/tribeariumsolutions/30min`
            }
        };

        // SMTP configuration
        this.setupSMTP();
    }

    setupSMTP() {
        this.transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
        console.log('Gmail SMTP configured for SalesHandy-style manual sequences');
    }

    // =====================
    // SALESHANDY-STYLE MANUAL SEQUENCE MANAGEMENT
    // =====================

    // Create a new sequence (manual control)
    async createSequence(sequenceData) {
        try {
            console.log('Creating new sequence:', sequenceData.name);
            
            const sequence = {
                id: Date.now().toString(),
                name: sequenceData.name,
                description: sequenceData.description || '',
                templates: sequenceData.templates || ['day_1', 'day_3', 'day_7', 'day_9'],
                status: 'draft',
                created_by: 'Tribearium',
                prospects_count: 0,
                contacted: 0,
                opened: 0,
                replied: 0,
                positive: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // Store in database (sequences table)
            await this.pool.query(`
                INSERT INTO sequences (id, name, description, templates, status, created_by, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    updated_at = NOW()
            `, [sequence.id, sequence.name, sequence.description, JSON.stringify(sequence.templates), sequence.status, sequence.created_by]);
            
            console.log(`Sequence created: ${sequence.name} (ID: ${sequence.id})`);
            return sequence;
            
        } catch (error) {
            console.error('Error creating sequence:', error);
            throw error;
        }
    }

    // Add prospects to sequence (manual control)
    async addProspectsToSequence(sequenceId, prospectIds) {
        try {
            console.log(`Adding ${prospectIds.length} prospects to sequence ${sequenceId}`);
            
            // Update prospects to be in this sequence
            const result = await this.pool.query(`
                UPDATE leads 
                SET 
                    email_sequence_status = 'in_sequence',
                    sequence_id = $1,
                    sequence_step = 'day_1',
                    sequence_added_at = NOW(),
                    updated_at = NOW()
                WHERE id = ANY($2)
                RETURNING id, name, email, company
            `, [sequenceId, prospectIds]);
            
            // Update sequence prospects count
            await this.pool.query(`
                UPDATE sequences 
                SET prospects_count = prospects_count + $1
                WHERE id = $2
            `, [result.rows.length, sequenceId]);
            
            console.log(`Successfully added ${result.rows.length} prospects to sequence`);
            return {
                success: true,
                added: result.rows.length,
                prospects: result.rows
            };
            
        } catch (error) {
            console.error('Error adding prospects to sequence:', error);
            throw error;
        }
    }

    // Get sequences with stats (for SalesHandy-style dashboard)
    async getSequences() {
        try {
            const result = await this.pool.query(`
                SELECT 
                    s.*,
                    COUNT(l.id) as prospects_count,
                    COUNT(CASE WHEN l.email_sequence_status = 'contacted' THEN 1 END) as contacted,
                    COUNT(CASE WHEN l.email_opened = true THEN 1 END) as opened,
                    COUNT(CASE WHEN l.email_replied = true THEN 1 END) as replied,
                    COUNT(CASE WHEN l.email_positive = true THEN 1 END) as positive
                FROM sequences s
                LEFT JOIN leads l ON s.id = l.sequence_id
                GROUP BY s.id, s.name, s.description, s.templates, s.status, s.created_by, s.created_at, s.updated_at
                ORDER BY s.created_at DESC
            `);
            
            return result.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                templates: typeof row.templates === 'string' ? JSON.parse(row.templates) : row.templates,
                status: row.status,
                created_by: row.created_by,
                prospects_count: parseInt(row.prospects_count),
                contacted: parseInt(row.contacted),
                opened: parseInt(row.opened),
                replied: parseInt(row.replied),
                positive: parseInt(row.positive),
                created_at: row.created_at,
                updated_at: row.updated_at
            }));
            
        } catch (error) {
            console.error('Error getting sequences:', error);
            return [];
        }
    }

    // Manual email sending (SalesHandy-style control)
    async sendSequenceEmail(prospectId, templateKey, sequenceId) {
        try {
            console.log(`Manually sending ${templateKey} email to prospect ${prospectId}`);
            
            // Get prospect data
            const prospectResult = await this.pool.query(
                'SELECT * FROM leads WHERE id = $1',
                [prospectId]
            );
            
            if (prospectResult.rows.length === 0) {
                throw new Error('Prospect not found');
            }
            
            const prospect = prospectResult.rows[0];
            
            // Get template
            const template = this.emailTemplates[templateKey];
            if (!template) {
                throw new Error(`Template ${templateKey} not found`);
            }
            
            // Personalize email content
            const { subject, body } = this.personalizeEmail(template, prospect);
            
            // Send email
            const emailResult = await this.sendPersonalizedEmail(prospect, subject, body, templateKey);
            
            if (emailResult.success) {
                // Update prospect status
                await this.pool.query(`
                    UPDATE leads 
                    SET 
                        email_sequence_status = 'contacted',
                        sequence_step = $1,
                        last_email_sent = NOW(),
                        emails_sent = COALESCE(emails_sent, 0) + 1,
                        updated_at = NOW()
                    WHERE id = $2
                `, [templateKey, prospectId]);
                
                // Log email sent
                await this.logEmailSent(prospectId, subject, body, 'sent', emailResult.messageId, templateKey);
                
                console.log(`Email sent successfully: ${templateKey} to ${prospect.email}`);
                return { success: true, messageId: emailResult.messageId };
            } else {
                throw new Error(emailResult.error);
            }
            
        } catch (error) {
            console.error('Error sending sequence email:', error);
            
            // Log failed email
            await this.logEmailSent(prospectId, '', '', 'failed', null, templateKey, error.message);
            
            return { success: false, error: error.message };
        }
    }

    // Bulk send emails for sequence step (manual trigger)
    async sendBulkSequenceEmails(sequenceId, templateKey, prospectIds = null) {
        try {
            console.log(`Bulk sending ${templateKey} emails for sequence ${sequenceId}`);
            
            let query = `
                SELECT * FROM leads 
                WHERE sequence_id = $1 
                AND sequence_step = $2
                AND email_sequence_status = 'in_sequence'
            `;
            let params = [sequenceId, templateKey];
            
            if (prospectIds && prospectIds.length > 0) {
                query += ' AND id = ANY($3)';
                params.push(prospectIds);
            }
            
            const prospects = await this.pool.query(query, params);
            
            console.log(`Found ${prospects.rows.length} prospects for bulk sending`);
            
            let sent = 0;
            let failed = 0;
            const results = [];
            
            for (const prospect of prospects.rows) {
                try {
                    const result = await this.sendSequenceEmail(prospect.id, templateKey, sequenceId);
                    
                    if (result.success) {
                        sent++;
                        results.push({ 
                            prospectId: prospect.id, 
                            email: prospect.email, 
                            status: 'sent',
                            messageId: result.messageId 
                        });
                    } else {
                        failed++;
                        results.push({ 
                            prospectId: prospect.id, 
                            email: prospect.email, 
                            status: 'failed',
                            error: result.error 
                        });
                    }
                    
                    // Delay between emails to avoid spam
                    await this.delay(2000);
                    
                } catch (error) {
                    failed++;
                    results.push({ 
                        prospectId: prospect.id, 
                        email: prospect.email, 
                        status: 'failed',
                        error: error.message 
                    });
                }
            }
            
            // Update sequence stats
            await this.pool.query(`
                UPDATE sequences 
                SET contacted = contacted + $1
                WHERE id = $2
            `, [sent, sequenceId]);
            
            console.log(`Bulk send completed: ${sent} sent, ${failed} failed`);
            
            return {
                success: true,
                sent: sent,
                failed: failed,
                results: results
            };
            
        } catch (error) {
            console.error('Error in bulk send:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================
    // EMAIL PROCESSING
    // =====================

    // Process spin syntax for email variations
    processSpinSyntax(text) {
        return text.replace(/\{spin\}([^{]+)\{endspin\}/g, (match, options) => {
            const choices = options.split('|');
            const randomIndex = Math.floor(Math.random() * choices.length);
            return choices[randomIndex];
        });
    }

    // Personalize email content
    personalizeEmail(template, prospectData) {
        let subject = template.subject;
        let body = template.body;
        
        const replacements = {
            '{{name}}': prospectData.name ? prospectData.name.split(' ')[0] : 'there',
            '{{company}}': prospectData.company || 'your company',
            '{{industry}}': prospectData.industry || 'your industry',
            '{{title}}': prospectData.title || ''
        };
        
        // Replace placeholders
        for (const [placeholder, value] of Object.entries(replacements)) {
            const regex = new RegExp(placeholder, 'g');
            subject = subject.replace(regex, value);
            body = body.replace(regex, value);
        }
        
        // Process spin syntax for variations
        subject = this.processSpinSyntax(subject);
        body = this.processSpinSyntax(body);
        
        return { subject, body };
    }

    // Send personalized email
    async sendPersonalizedEmail(prospect, subject, body, templateKey) {
        try {
            // Create email with Javier's signature
            const htmlBody = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    ${body.replace(/\n/g, '<br>')}
                    
                    <br><br>
                    <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                        <table style="border-collapse: collapse;">
                            <tr>
                                <td style="padding-right: 15px; vertical-align: top;">
                                    <img src="https://framerusercontent.com/images/vD3JnPphLTcWcxDoQ4c9UB15NVA.jpeg?width=100&height=100" 
                                         alt="Javier Alvarez" 
                                         style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
                                </td>
                                <td style="vertical-align: top;">
                                    <div style="font-weight: bold; font-size: 16px; color: #2c3e50;">Javier Alvarez</div>
                                    <div style="color: #7f8c8d; font-size: 14px;">Co-Founder, Tribearium Solutions LLC</div>
                                    <div style="color: #7f8c8d; font-size: 12px; margin-top: 5px;">
                                        📞 (817) 371 9079 | 🌐 tribeariumsolutions.com
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            `;
            
            const mailOptions = {
                from: 'Javier Alvarez - Tribearium Solutions <' + process.env.GMAIL_USER + '>',
                to: prospect.email,
                subject: subject,
                html: htmlBody,
                text: body + '\n\nJavier Alvarez\nCo-Founder, Tribearium Solutions LLC\n(817) 371 9079 | tribeariumsolutions.com'
            };
            
            const result = await this.transporter.sendMail(mailOptions);
            
            console.log(`Email sent successfully to ${prospect.email}: ${subject}`);
            return { success: true, messageId: result.messageId };
            
        } catch (error) {
            console.error(`Error sending email to ${prospect.email}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    // =====================
    // SEQUENCE MANAGEMENT
    // =====================

    // Pause sequence for prospect
    async pauseSequenceForProspect(prospectId) {
        try {
            await this.pool.query(`
                UPDATE leads 
                SET email_sequence_status = 'paused', updated_at = NOW()
                WHERE id = $1
            `, [prospectId]);
            
            console.log(`Sequence paused for prospect ${prospectId}`);
            return { success: true };
            
        } catch (error) {
            console.error('Error pausing sequence:', error);
            return { success: false, error: error.message };
        }
    }

    // Resume sequence for prospect
    async resumeSequenceForProspect(prospectId) {
        try {
            await this.pool.query(`
                UPDATE leads 
                SET email_sequence_status = 'in_sequence', updated_at = NOW()
                WHERE id = $1
            `, [prospectId]);
            
            console.log(`Sequence resumed for prospect ${prospectId}`);
            return { success: true };
            
        } catch (error) {
            console.error('Error resuming sequence:', error);
            return { success: false, error: error.message };
        }
    }

    // Mark prospect as replied (stops sequence)
    async markProspectAsReplied(prospectId, sequenceId = null) {
        try {
            await this.pool.query(`
                UPDATE leads 
                SET 
                    email_sequence_status = 'replied',
                    email_replied = true,
                    replied_at = NOW(),
                    updated_at = NOW()
                WHERE id = $1
            `, [prospectId]);
            
            // Update sequence stats
            if (sequenceId) {
                await this.pool.query(`
                    UPDATE sequences 
                    SET replied = replied + 1
                    WHERE id = $1
                `, [sequenceId]);
            }
            
            console.log(`Prospect ${prospectId} marked as replied`);
            return { success: true };
            
        } catch (error) {
            console.error('Error marking as replied:', error);
            return { success: false, error: error.message };
        }
    }

    // Remove prospect from sequence
    async removeProspectFromSequence(prospectId, sequenceId) {
        try {
            await this.pool.query(`
                UPDATE leads 
                SET 
                    email_sequence_status = 'removed',
                    sequence_id = NULL,
                    sequence_step = NULL,
                    updated_at = NOW()
                WHERE id = $1
            `, [prospectId]);
            
            // Update sequence prospects count
            await this.pool.query(`
                UPDATE sequences 
                SET prospects_count = prospects_count - 1
                WHERE id = $1
            `, [sequenceId]);
            
            console.log(`Prospect ${prospectId} removed from sequence ${sequenceId}`);
            return { success: true };
            
        } catch (error) {
            console.error('Error removing from sequence:', error);
            return { success: false, error: error.message };
        }
    }

    // =====================
    // ANALYTICS & REPORTING
    // =====================

    // Get sequence analytics
    async getSequenceAnalytics(sequenceId) {
        try {
            const sequenceData = await this.pool.query(`
                SELECT 
                    s.*,
                    COUNT(l.id) as total_prospects,
                    COUNT(CASE WHEN l.emails_sent > 0 THEN 1 END) as contacted,
                    COUNT(CASE WHEN l.email_opened = true THEN 1 END) as opened,
                    COUNT(CASE WHEN l.email_replied = true THEN 1 END) as replied,
                    COUNT(CASE WHEN l.email_positive = true THEN 1 END) as positive,
                    COUNT(CASE WHEN l.email_sequence_status = 'paused' THEN 1 END) as paused,
                    AVG(l.score) as avg_score
                FROM sequences s
                LEFT JOIN leads l ON s.id = l.sequence_id
                WHERE s.id = $1
                GROUP BY s.id
            `, [sequenceId]);
            
            if (sequenceData.rows.length === 0) {
                return null;
            }
            
            const data = sequenceData.rows[0];
            const total = parseInt(data.total_prospects) || 1;
            
            return {
                sequence: {
                    id: data.id,
                    name: data.name,
                    status: data.status,
                    created_at: data.created_at
                },
                stats: {
                    total_prospects: parseInt(data.total_prospects),
                    contacted: parseInt(data.contacted),
                    opened: parseInt(data.opened),
                    replied: parseInt(data.replied),
                    positive: parseInt(data.positive),
                    paused: parseInt(data.paused),
                    avg_score: parseFloat(data.avg_score) || 0,
                    open_rate: Math.round((parseInt(data.opened) / Math.max(parseInt(data.contacted), 1)) * 100),
                    reply_rate: Math.round((parseInt(data.replied) / Math.max(parseInt(data.contacted), 1)) * 100),
                    contact_rate: Math.round((parseInt(data.contacted) / total) * 100)
                }
            };
            
        } catch (error) {
            console.error('Error getting sequence analytics:', error);
            return null;
        }
    }

    // Get overall email automation stats
    async getOverallStats() {
        try {
            const stats = await this.pool.query(`
                SELECT 
                    COUNT(DISTINCT sequence_id) as total_sequences,
                    COUNT(*) as total_prospects,
                    COUNT(CASE WHEN emails_sent > 0 THEN 1 END) as contacted,
                    COUNT(CASE WHEN email_opened = true THEN 1 END) as opened,
                    COUNT(CASE WHEN email_replied = true THEN 1 END) as replied,
                    COUNT(CASE WHEN email_positive = true THEN 1 END) as positive,
                    SUM(COALESCE(emails_sent, 0)) as total_emails_sent
                FROM leads 
                WHERE sequence_id IS NOT NULL
            `);
            
            const data = stats.rows[0];
            const contacted = parseInt(data.contacted) || 1;
            
            return {
                total_sequences: parseInt(data.total_sequences) || 0,
                total_prospects: parseInt(data.total_prospects) || 0,
                contacted: parseInt(data.contacted) || 0,
                opened: parseInt(data.opened) || 0,
                replied: parseInt(data.replied) || 0,
                positive: parseInt(data.positive) || 0,
                total_emails_sent: parseInt(data.total_emails_sent) || 0,
                open_rate: Math.round((parseInt(data.opened) / contacted) * 100),
                reply_rate: Math.round((parseInt(data.replied) / contacted) * 100),
                positive_rate: Math.round((parseInt(data.positive) / contacted) * 100)
            };
            
        } catch (error) {
            console.error('Error getting overall stats:', error);
            return {
                total_sequences: 0, total_prospects: 0, contacted: 0,
                opened: 0, replied: 0, positive: 0, total_emails_sent: 0,
                open_rate: 0, reply_rate: 0, positive_rate: 0
            };
        }
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================

    // Log email sent to database
    async logEmailSent(leadId, subject, body, status, messageId, templateKey = null, errorMessage = null) {
        try {
            await this.pool.query(`
                INSERT INTO email_logs (lead_id, email_address, subject, body, status, tracking_id, bounce_reason, template_used, sent_at)
                SELECT l.id, l.email, $2, $3, $4, $5, $6, $7, NOW()
                FROM leads l WHERE l.id = $1
            `, [leadId, subject, body, status, messageId, errorMessage, templateKey]);
        } catch (error) {
            console.error('Error logging email:', error);
        }
    }

    // Delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize database tables if needed
    async initializeTables() {
        try {
            // Create sequences table
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS sequences (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    templates JSONB DEFAULT '[]',
                    status VARCHAR(50) DEFAULT 'draft',
                    created_by VARCHAR(255),
                    prospects_count INTEGER DEFAULT 0,
                    contacted INTEGER DEFAULT 0,
                    opened INTEGER DEFAULT 0,
                    replied INTEGER DEFAULT 0,
                    positive INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // Add sequence columns to leads table if they don't exist
            await this.pool.query(`
                ALTER TABLE leads 
                ADD COLUMN IF NOT EXISTS sequence_id VARCHAR(50),
                ADD COLUMN IF NOT EXISTS sequence_step VARCHAR(20),
                ADD COLUMN IF NOT EXISTS sequence_added_at TIMESTAMP,
                ADD COLUMN IF NOT EXISTS emails_sent INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS email_opened BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS email_replied BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS email_positive BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS last_email_sent TIMESTAMP,
                ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP
            `);
            
            console.log('Database tables initialized for SalesHandy-style sequences');
            
        } catch (error) {
            console.error('Error initializing tables:', error);
        }
    }
}

// Create API routes for SalesHandy-style email management
function createSalesHandyEmailRoutes(app, emailSystem) {
    
    // Create sequence
    app.post('/api/sequences', async (req, res) => {
        try {
            const sequence = await emailSystem.createSequence(req.body);
            res.json({ success: true, data: sequence });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Get all sequences
    app.get('/api/sequences', async (req, res) => {
        try {
            const sequences = await emailSystem.getSequences();
            res.json({ success: true, data: sequences });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Add prospects to sequence
    app.post('/api/sequences/:id/prospects', async (req, res) => {
        try {
            const result = await emailSystem.addProspectsToSequence(req.params.id, req.body.prospect_ids);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Send single email
    app.post('/api/sequences/:sequenceId/send-email/:prospectId', async (req, res) => {
        try {
            const { templateKey } = req.body;
            const result = await emailSystem.sendSequenceEmail(req.params.prospectId, templateKey, req.params.sequenceId);
            res.json({ success: result.success, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Bulk send emails
    app.post('/api/sequences/:sequenceId/send-bulk', async (req, res) => {
        try {
            const { templateKey, prospect_ids } = req.body;
            const result = await emailSystem.sendBulkSequenceEmails(req.params.sequenceId, templateKey, prospect_ids);
            res.json({ success: result.success, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Sequence analytics
    app.get('/api/sequences/:id/analytics', async (req, res) => {
        try {
            const analytics = await emailSystem.getSequenceAnalytics(req.params.id);
            res.json({ success: true, data: analytics });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Overall stats
    app.get('/api/email-automation/stats', async (req, res) => {
        try {
            const stats = await emailSystem.getOverallStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    // Prospect management
    app.post('/api/prospects/:id/pause-sequence', async (req, res) => {
        try {
            const result = await emailSystem.pauseSequenceForProspect(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    app.post('/api/prospects/:id/resume-sequence', async (req, res) => {
        try {
            const result = await emailSystem.resumeSequenceForProspect(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    app.post('/api/prospects/:id/mark-replied', async (req, res) => {
        try {
            const { sequenceId } = req.body;
            const result = await emailSystem.markProspectAsReplied(req.params.id, sequenceId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    app.delete('/api/prospects/:id/remove-from-sequence', async (req, res) => {
        try {
            const { sequenceId } = req.body;
            const result = await emailSystem.removeProspectFromSequence(req.params.id, sequenceId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}

module.exports = { SalesHandyEmailSystem, createSalesHandyEmailRoutes };

// CLI execution for testing SalesHandy-style sequences
if (require.main === module) {
    const emailSystem = new SalesHandyEmailSystem();
    
    console.log('🧪 Testing SalesHandy Email Automation System...');
    
    // Initialize database
    emailSystem.initializeTables()
        .then(() => {
            console.log('✅ Database initialized');
            
            // Test creating a sequence
            return emailSystem.createSequence({
                name: 'Tribearium First Sequence',
                description: 'Welcome sequence for new prospects',
                templates: ['day_1', 'day_3', 'day_7', 'day_9']
            });
        })
        .then(sequence => {
            console.log('✅ Test sequence created:', sequence.name);
            
            // Get overall stats
            return emailSystem.getOverallStats();
        })
        .then(stats => {
            console.log('📊 Current stats:', stats);
            
            console.log('\n🎉 === SALESHANDY EMAIL SYSTEM READY ===');
            console.log('✅ Manual sequence control enabled');
            console.log('✅ Bulk email operations ready');
            console.log('✅ Analytics and reporting active');
            console.log('✅ Javier\'s templates integrated');
            console.log('');
            console.log('🔧 KEY FEATURES:');
            console.log('  • Manual sequence creation and management');
            console.log('  • Bulk prospect addition to sequences');
            console.log('  • Manual email sending (no automation)');
            console.log('  • Real-time analytics and tracking');
            console.log('  • Prospect pause/resume/remove controls');
            console.log('  • Professional email templates with Javier\'s signature');
            console.log('');
            console.log('📧 EMAIL TEMPLATES AVAILABLE:');
            console.log('  • day_1: Introduction with automation focus');
            console.log('  • day_3: Follow-up with value proposition');
            console.log('  • day_7: Single question approach');
            console.log('  • day_9: Final touchpoint');
            console.log('');
            console.log('🚀 Ready for SalesHandy-style manual control!');
            
        })
        .catch(error => {
            console.error('❌ System test failed:', error);
        });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down SalesHandy Email System...');
        emailSystem.pool.end();
        process.exit(0);
    });
}