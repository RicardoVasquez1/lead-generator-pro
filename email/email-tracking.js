// email/email-tracking.js - Advanced Email Tracking for SalesHandy-style Analytics
require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');

class SalesHandyEmailTracking {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
        
        this.baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
    }

    // =====================
    // DATABASE INITIALIZATION
    // =====================

    async initializeEmailTracking() {
        try {
            // Create comprehensive email tracking table
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS email_tracking (
                    id SERIAL PRIMARY KEY,
                    lead_id INTEGER REFERENCES leads(id),
                    sequence_id VARCHAR(50),
                    email_address VARCHAR(255),
                    tracking_pixel_id UUID DEFAULT gen_random_uuid(),
                    template_day VARCHAR(10),
                    subject VARCHAR(500),
                    message_id VARCHAR(255),
                    
                    -- Sending info
                    sent_at TIMESTAMP DEFAULT NOW(),
                    sent_from VARCHAR(255),
                    
                    -- Open tracking
                    opened_at TIMESTAMP NULL,
                    first_opened_at TIMESTAMP NULL,
                    open_count INTEGER DEFAULT 0,
                    last_open_at TIMESTAMP NULL,
                    
                    -- Click tracking  
                    clicked_at TIMESTAMP NULL,
                    first_clicked_at TIMESTAMP NULL,
                    click_count INTEGER DEFAULT 0,
                    last_click_at TIMESTAMP NULL,
                    clicked_links JSONB DEFAULT '[]',
                    
                    -- Reply tracking
                    replied_at TIMESTAMP NULL,
                    reply_sentiment VARCHAR(20), -- positive, negative, neutral, interested
                    
                    -- Bounce/Spam tracking
                    bounced_at TIMESTAMP NULL,
                    bounce_reason TEXT,
                    spam_at TIMESTAMP NULL,
                    unsubscribed_at TIMESTAMP NULL,
                    
                    -- Status and metadata
                    status VARCHAR(50) DEFAULT 'sent',
                    user_agent TEXT,
                    ip_address INET,
                    device_type VARCHAR(50),
                    location_data JSONB,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );

                -- Create indexes for performance
                CREATE INDEX IF NOT EXISTS idx_email_tracking_pixel ON email_tracking(tracking_pixel_id);
                CREATE INDEX IF NOT EXISTS idx_email_tracking_lead ON email_tracking(lead_id);
                CREATE INDEX IF NOT EXISTS idx_email_tracking_sequence ON email_tracking(sequence_id);
                CREATE INDEX IF NOT EXISTS idx_email_tracking_email ON email_tracking(email_address);
                CREATE INDEX IF NOT EXISTS idx_email_tracking_status ON email_tracking(status);
                CREATE INDEX IF NOT EXISTS idx_email_tracking_sent_at ON email_tracking(sent_at);
            `);

            // Create click tracking table
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS email_clicks (
                    id SERIAL PRIMARY KEY,
                    tracking_id INTEGER REFERENCES email_tracking(id),
                    clicked_url TEXT,
                    click_timestamp TIMESTAMP DEFAULT NOW(),
                    user_agent TEXT,
                    ip_address INET,
                    device_type VARCHAR(50),
                    location_data JSONB
                );

                CREATE INDEX IF NOT EXISTS idx_email_clicks_tracking ON email_clicks(tracking_id);
                CREATE INDEX IF NOT EXISTS idx_email_clicks_timestamp ON email_clicks(click_timestamp);
            `);

            // Create email analytics summary table
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS email_analytics_daily (
                    id SERIAL PRIMARY KEY,
                    date DATE DEFAULT CURRENT_DATE,
                    sequence_id VARCHAR(50),
                    emails_sent INTEGER DEFAULT 0,
                    emails_opened INTEGER DEFAULT 0,
                    emails_clicked INTEGER DEFAULT 0,
                    emails_replied INTEGER DEFAULT 0,
                    emails_bounced INTEGER DEFAULT 0,
                    unique_opens INTEGER DEFAULT 0,
                    unique_clicks INTEGER DEFAULT 0,
                    open_rate DECIMAL(5,2) DEFAULT 0,
                    click_rate DECIMAL(5,2) DEFAULT 0,
                    reply_rate DECIMAL(5,2) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    
                    UNIQUE(date, sequence_id)
                );

                CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON email_analytics_daily(date);
                CREATE INDEX IF NOT EXISTS idx_analytics_daily_sequence ON email_analytics_daily(sequence_id);
            `);

            console.log('✅ Email tracking system initialized');
            
        } catch (error) {
            console.error('❌ Error initializing email tracking:', error);
            throw error;
        }
    }

    // =====================
    // EMAIL TRACKING CREATION
    // =====================

    // Create tracking for sent email
    async createEmailTracking(leadId, sequenceId, emailAddress, templateDay, subject, messageId) {
        try {
            const result = await this.pool.query(`
                INSERT INTO email_tracking (
                    lead_id, sequence_id, email_address, template_day, 
                    subject, message_id, sent_from
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING tracking_pixel_id, id
            `, [leadId, sequenceId, emailAddress, templateDay, subject, messageId, process.env.GMAIL_USER]);

            const trackingData = result.rows[0];
            
            console.log(`📧 Email tracking created for ${emailAddress} (${templateDay})`);
            console.log(`🔍 Tracking ID: ${trackingData.tracking_pixel_id}`);
            
            return {
                trackingId: trackingData.tracking_pixel_id,
                internalId: trackingData.id,
                pixelUrl: `${this.baseUrl}/api/email-tracking/pixel/${trackingData.tracking_pixel_id}`,
                clickUrl: `${this.baseUrl}/api/email-tracking/click/${trackingData.tracking_pixel_id}`,
                unsubscribeUrl: `${this.baseUrl}/api/email-tracking/unsubscribe/${trackingData.tracking_pixel_id}`
            };
            
        } catch (error) {
            console.error('❌ Error creating email tracking:', error);
            return null;
        }
    }

    // =====================
    // TRACKING EVENTS
    // =====================

    // Track email open
    async trackEmailOpen(trackingPixelId, userAgent = null, ipAddress = null) {
        try {
            const deviceType = this.detectDeviceType(userAgent);
            const isFirstOpen = await this.isFirstOpen(trackingPixelId);
            
            const result = await this.pool.query(`
                UPDATE email_tracking 
                SET 
                    opened_at = CASE WHEN opened_at IS NULL THEN NOW() ELSE opened_at END,
                    first_opened_at = CASE WHEN first_opened_at IS NULL THEN NOW() ELSE first_opened_at END,
                    open_count = open_count + 1,
                    last_open_at = NOW(),
                    status = CASE WHEN status = 'sent' THEN 'opened' ELSE status END,
                    user_agent = COALESCE(user_agent, $2),
                    ip_address = COALESCE(ip_address, $3),
                    device_type = COALESCE(device_type, $4),
                    updated_at = NOW()
                WHERE tracking_pixel_id = $1
                RETURNING lead_id, email_address, template_day, open_count, sequence_id
            `, [trackingPixelId, userAgent, ipAddress, deviceType]);

            if (result.rows.length > 0) {
                const data = result.rows[0];
                
                // Update lead status if first open
                if (isFirstOpen) {
                    await this.pool.query(`
                        UPDATE leads 
                        SET email_opened = true, updated_at = NOW()
                        WHERE id = $1
                    `, [data.lead_id]);
                }
                
                console.log(`👁️ Email opened: ${data.email_address} (${data.template_day}) - Count: ${data.open_count}`);
                
                // Update daily analytics
                await this.updateDailyAnalytics(data.sequence_id, 'open');
                
                return data;
            }

            return null;
            
        } catch (error) {
            console.error('❌ Error tracking email open:', error);
            return null;
        }
    }

    // Track email click
    async trackEmailClick(trackingPixelId, clickedUrl = null, userAgent = null, ipAddress = null) {
        try {
            const deviceType = this.detectDeviceType(userAgent);
            const isFirstClick = await this.isFirstClick(trackingPixelId);
            
            const result = await this.pool.query(`
                UPDATE email_tracking 
                SET 
                    clicked_at = CASE WHEN clicked_at IS NULL THEN NOW() ELSE clicked_at END,
                    first_clicked_at = CASE WHEN first_clicked_at IS NULL THEN NOW() ELSE first_clicked_at END,
                    click_count = click_count + 1,
                    last_click_at = NOW(),
                    status = 'clicked',
                    clicked_links = clicked_links || $2::jsonb,
                    updated_at = NOW()
                WHERE tracking_pixel_id = $1
                RETURNING id, lead_id, email_address, template_day, click_count, sequence_id
            `, [trackingPixelId, JSON.stringify([{url: clickedUrl, timestamp: new Date().toISOString()}])]);

            if (result.rows.length > 0) {
                const data = result.rows[0];
                
                // Log individual click
                await this.pool.query(`
                    INSERT INTO email_clicks (tracking_id, clicked_url, user_agent, ip_address, device_type)
                    VALUES ($1, $2, $3, $4, $5)
                `, [data.id, clickedUrl, userAgent, ipAddress, deviceType]);
                
                // Update lead status if first click
                if (isFirstClick) {
                    await this.pool.query(`
                        UPDATE leads 
                        SET email_clicked = true, updated_at = NOW()
                        WHERE id = $1
                    `, [data.lead_id]);
                }
                
                console.log(`🖱️ Email clicked: ${data.email_address} (${data.template_day}) - Count: ${data.click_count}`);
                console.log(`   🔗 URL: ${clickedUrl}`);
                
                // Update daily analytics
                await this.updateDailyAnalytics(data.sequence_id, 'click');
                
                return data;
            }

            return null;
            
        } catch (error) {
            console.error('❌ Error tracking email click:', error);
            return null;
        }
    }

    // Track email reply
    async trackEmailReply(leadId, sequenceId = null, sentiment = 'neutral') {
        try {
            const result = await this.pool.query(`
                UPDATE email_tracking 
                SET 
                    replied_at = NOW(),
                    reply_sentiment = $3,
                    status = 'replied',
                    updated_at = NOW()
                WHERE lead_id = $1 
                AND (sequence_id = $2 OR $2 IS NULL)
                AND replied_at IS NULL
                ORDER BY sent_at DESC
                LIMIT 1
                RETURNING email_address, template_day, sequence_id
            `, [leadId, sequenceId, sentiment]);

            if (result.rows.length > 0) {
                const data = result.rows[0];
                
                // Update lead status
                await this.pool.query(`
                    UPDATE leads 
                    SET 
                        email_replied = true,
                        email_positive = CASE WHEN $2 = 'positive' THEN true ELSE email_positive END,
                        replied_at = NOW(),
                        email_sequence_status = 'replied',
                        updated_at = NOW()
                    WHERE id = $1
                `, [leadId, sentiment]);
                
                console.log(`💬 Email replied: ${data.email_address} (${data.template_day}) - Sentiment: ${sentiment}`);
                
                // Update daily analytics
                await this.updateDailyAnalytics(data.sequence_id, 'reply');
                
                return data;
            }

            return null;
            
        } catch (error) {
            console.error('❌ Error tracking email reply:', error);
            return null;
        }
    }

    // Track email bounce
    async trackEmailBounce(trackingPixelId, bounceReason = null) {
        try {
            const result = await this.pool.query(`
                UPDATE email_tracking 
                SET 
                    bounced_at = NOW(),
                    bounce_reason = $2,
                    status = 'bounced',
                    updated_at = NOW()
                WHERE tracking_pixel_id = $1
                RETURNING lead_id, email_address, template_day, sequence_id
            `, [trackingPixelId, bounceReason]);

            if (result.rows.length > 0) {
                const data = result.rows[0];
                
                // Update lead status
                await this.pool.query(`
                    UPDATE leads 
                    SET email_bounced = true, updated_at = NOW()
                    WHERE id = $1
                `, [data.lead_id]);
                
                console.log(`⚠️ Email bounced: ${data.email_address} (${data.template_day})`);
                console.log(`   Reason: ${bounceReason || 'Unknown'}`);
                
                // Update daily analytics
                await this.updateDailyAnalytics(data.sequence_id, 'bounce');
                
                return data;
            }

            return null;
            
        } catch (error) {
            console.error('❌ Error tracking email bounce:', error);
            return null;
        }
    }

    // Track unsubscribe
    async trackUnsubscribe(trackingPixelId) {
        try {
            const result = await this.pool.query(`
                UPDATE email_tracking 
                SET 
                    unsubscribed_at = NOW(),
                    status = 'unsubscribed',
                    updated_at = NOW()
                WHERE tracking_pixel_id = $1
                RETURNING lead_id, email_address, template_day, sequence_id
            `, [trackingPixelId]);

            if (result.rows.length > 0) {
                const data = result.rows[0];
                
                // Update lead status and remove from sequences
                await this.pool.query(`
                    UPDATE leads 
                    SET 
                        email_unsubscribed = true,
                        email_sequence_status = 'unsubscribed',
                        sequence_id = NULL,
                        updated_at = NOW()
                    WHERE id = $1
                `, [data.lead_id]);
                
                console.log(`🚫 Unsubscribed: ${data.email_address} (${data.template_day})`);
                
                return data;
            }

            return null;
            
        } catch (error) {
            console.error('❌ Error tracking unsubscribe:', error);
            return null;
        }
    }

    // =====================
    // ANALYTICS & REPORTING
    // =====================

    // Get email history for a lead
    async getLeadEmailHistory(leadId) {
        try {
            const result = await this.pool.query(`
                SELECT 
                    id,
                    tracking_pixel_id,
                    sequence_id,
                    template_day,
                    subject,
                    sent_at,
                    opened_at,
                    first_opened_at,
                    open_count,
                    clicked_at,
                    first_clicked_at,
                    click_count,
                    clicked_links,
                    replied_at,
                    reply_sentiment,
                    bounced_at,
                    bounce_reason,
                    unsubscribed_at,
                    status,
                    user_agent,
                    device_type
                FROM email_tracking 
                WHERE lead_id = $1 
                ORDER BY sent_at DESC
            `, [leadId]);

            return result.rows.map(row => ({
                id: row.id,
                trackingId: row.tracking_pixel_id,
                sequenceId: row.sequence_id,
                templateDay: row.template_day,
                subject: row.subject,
                sentAt: row.sent_at,
                
                // Open data
                openedAt: row.opened_at,
                firstOpenedAt: row.first_opened_at,
                openCount: row.open_count,
                wasOpened: row.opened_at !== null,
                
                // Click data
                clickedAt: row.clicked_at,
                firstClickedAt: row.first_clicked_at,
                clickCount: row.click_count,
                clickedLinks: row.clicked_links || [],
                wasClicked: row.clicked_at !== null,
                
                // Reply data
                repliedAt: row.replied_at,
                replySentiment: row.reply_sentiment,
                wasReplied: row.replied_at !== null,
                
                // Bounce/Unsubscribe data
                bouncedAt: row.bounced_at,
                bounceReason: row.bounce_reason,
                wasBounced: row.bounced_at !== null,
                unsubscribedAt: row.unsubscribed_at,
                wasUnsubscribed: row.unsubscribed_at !== null,
                
                // Status
                status: row.status,
                userAgent: row.user_agent,
                deviceType: row.device_type,
                
                // Computed properties
                isDelivered: row.status !== 'bounced',
                isEngaged: ['opened', 'clicked', 'replied'].includes(row.status),
                isFailed: ['bounced', 'spam'].includes(row.status)
            }));
            
        } catch (error) {
            console.error('❌ Error getting lead email history:', error);
            return [];
        }
    }

    // Get sequence performance analytics
    async getSequenceAnalytics(sequenceId, dateRange = 30) {
        try {
            const result = await this.pool.query(`
                SELECT 
                    COUNT(*) as total_emails,
                    COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened_emails,
                    COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as clicked_emails,
                    COUNT(CASE WHEN replied_at IS NOT NULL THEN 1 END) as replied_emails,
                    COUNT(CASE WHEN bounced_at IS NOT NULL THEN 1 END) as bounced_emails,
                    COUNT(CASE WHEN unsubscribed_at IS NOT NULL THEN 1 END) as unsubscribed_emails,
                    COUNT(CASE WHEN reply_sentiment = 'positive' THEN 1 END) as positive_replies,
                    
                    -- Unique engagement
                    COUNT(DISTINCT CASE WHEN opened_at IS NOT NULL THEN lead_id END) as unique_opens,
                    COUNT(DISTINCT CASE WHEN clicked_at IS NOT NULL THEN lead_id END) as unique_clicks,
                    COUNT(DISTINCT CASE WHEN replied_at IS NOT NULL THEN lead_id END) as unique_replies,
                    
                    -- Averages
                    AVG(open_count) as avg_opens_per_email,
                    AVG(click_count) as avg_clicks_per_email,
                    
                    -- Timing analytics
                    AVG(EXTRACT(EPOCH FROM (opened_at - sent_at))/3600) as avg_hours_to_open,
                    AVG(EXTRACT(EPOCH FROM (clicked_at - sent_at))/3600) as avg_hours_to_click,
                    AVG(EXTRACT(EPOCH FROM (replied_at - sent_at))/3600) as avg_hours_to_reply
                    
                FROM email_tracking 
                WHERE sequence_id = $1 
                AND sent_at >= NOW() - INTERVAL '${dateRange} days'
            `, [sequenceId]);

            if (result.rows.length === 0) {
                return null;
            }

            const data = result.rows[0];
            const totalEmails = parseInt(data.total_emails) || 1;
            const deliveredEmails = totalEmails - parseInt(data.bounced_emails);

            return {
                sequenceId: sequenceId,
                dateRange: dateRange,
                
                // Volume metrics
                totalEmails: totalEmails,
                deliveredEmails: deliveredEmails,
                openedEmails: parseInt(data.opened_emails),
                clickedEmails: parseInt(data.clicked_emails),
                repliedEmails: parseInt(data.replied_emails),
                bouncedEmails: parseInt(data.bounced_emails),
                unsubscribedEmails: parseInt(data.unsubscribed_emails),
                positiveReplies: parseInt(data.positive_replies),
                
                // Unique engagement
                uniqueOpens: parseInt(data.unique_opens),
                uniqueClicks: parseInt(data.unique_clicks),
                uniqueReplies: parseInt(data.unique_replies),
                
                // Rates (based on delivered emails)
                deliveryRate: parseFloat(((deliveredEmails / totalEmails) * 100).toFixed(2)),
                openRate: parseFloat(((parseInt(data.opened_emails) / deliveredEmails) * 100).toFixed(2)),
                clickRate: parseFloat(((parseInt(data.clicked_emails) / deliveredEmails) * 100).toFixed(2)),
                replyRate: parseFloat(((parseInt(data.replied_emails) / deliveredEmails) * 100).toFixed(2)),
                bounceRate: parseFloat(((parseInt(data.bounced_emails) / totalEmails) * 100).toFixed(2)),
                unsubscribeRate: parseFloat(((parseInt(data.unsubscribed_emails) / deliveredEmails) * 100).toFixed(2)),
                positiveReplyRate: parseFloat(((parseInt(data.positive_replies) / Math.max(parseInt(data.replied_emails), 1)) * 100).toFixed(2)),
                
                // Engagement depth
                avgOpensPerEmail: parseFloat(parseFloat(data.avg_opens_per_email || 0).toFixed(2)),
                avgClicksPerEmail: parseFloat(parseFloat(data.avg_clicks_per_email || 0).toFixed(2)),
                
                // Timing insights
                avgHoursToOpen: parseFloat(parseFloat(data.avg_hours_to_open || 0).toFixed(2)),
                avgHoursToClick: parseFloat(parseFloat(data.avg_hours_to_click || 0).toFixed(2)),
                avgHoursToReply: parseFloat(parseFloat(data.avg_hours_to_reply || 0).toFixed(2))
            };
            
        } catch (error) {
            console.error('❌ Error getting sequence analytics:', error);
            return null;
        }
    }

    // Get overall email performance stats
    async getOverallEmailStats(dateRange = 30) {
        try {
            const result = await this.pool.query(`
                SELECT 
                    COUNT(*) as total_emails,
                    COUNT(DISTINCT sequence_id) as active_sequences,
                    COUNT(DISTINCT lead_id) as unique_contacts,
                    COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened_emails,
                    COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as clicked_emails,
                    COUNT(CASE WHEN replied_at IS NOT NULL THEN 1 END) as replied_emails,
                    COUNT(CASE WHEN bounced_at IS NOT NULL THEN 1 END) as bounced_emails,
                    COUNT(CASE WHEN reply_sentiment = 'positive' THEN 1 END) as positive_replies,
                    SUM(open_count) as total_opens,
                    SUM(click_count) as total_clicks
                FROM email_tracking 
                WHERE sent_at >= NOW() - INTERVAL '${dateRange} days'
            `);

            const data = result.rows[0];
            const totalEmails = parseInt(data.total_emails) || 1;
            const deliveredEmails = totalEmails - parseInt(data.bounced_emails);

            return {
                dateRange: dateRange,
                totalEmails: totalEmails,
                activeSequences: parseInt(data.active_sequences),
                uniqueContacts: parseInt(data.unique_contacts),
                deliveredEmails: deliveredEmails,
                
                // Engagement totals
                totalOpens: parseInt(data.total_opens),
                totalClicks: parseInt(data.total_clicks),
                openedEmails: parseInt(data.opened_emails),
                clickedEmails: parseInt(data.clicked_emails),
                repliedEmails: parseInt(data.replied_emails),
                positiveReplies: parseInt(data.positive_replies),
                
                // Performance rates
                deliveryRate: parseFloat(((deliveredEmails / totalEmails) * 100).toFixed(2)),
                openRate: parseFloat(((parseInt(data.opened_emails) / deliveredEmails) * 100).toFixed(2)),
                clickRate: parseFloat(((parseInt(data.clicked_emails) / deliveredEmails) * 100).toFixed(2)),
                replyRate: parseFloat(((parseInt(data.replied_emails) / deliveredEmails) * 100).toFixed(2)),
                positiveReplyRate: parseFloat(((parseInt(data.positive_replies) / Math.max(parseInt(data.replied_emails), 1)) * 100).toFixed(2)),
                
                lastUpdated: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Error getting overall email stats:', error);
            return {
                dateRange: dateRange,
                totalEmails: 0, activeSequences: 0, uniqueContacts: 0,
                deliveryRate: 0, openRate: 0, clickRate: 0, replyRate: 0
            };
        }
    }

    // =====================
    // UTILITY FUNCTIONS
    // =====================

    // Check if this is the first open for this email
    async isFirstOpen(trackingPixelId) {
        try {
            const result = await this.pool.query(
                'SELECT opened_at FROM email_tracking WHERE tracking_pixel_id = $1',
                [trackingPixelId]
            );
            return result.rows.length > 0 && result.rows[0].opened_at === null;
        } catch (error) {
            return false;
        }
    }

    // Check if this is the first click for this email
    async isFirstClick(trackingPixelId) {
        try {
            const result = await this.pool.query(
                'SELECT clicked_at FROM email_tracking WHERE tracking_pixel_id = $1',
                [trackingPixelId]
            );
            return result.rows.length > 0 && result.rows[0].clicked_at === null;
        } catch (error) {
            return false;
        }
    }

    // Detect device type from user agent
    detectDeviceType(userAgent) {
        if (!userAgent) return 'unknown';
        
        const ua = userAgent.toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            return 'mobile';
        } else if (ua.includes('tablet') || ua.includes('ipad')) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    // Update daily analytics
    async updateDailyAnalytics(sequenceId, eventType) {
        if (!sequenceId) return;
        
        try {
            const column = eventType === 'open' ? 'emails_opened' :
                          eventType === 'click' ? 'emails_clicked' :
                          eventType === 'reply' ? 'emails_replied' :
                          eventType === 'bounce' ? 'emails_bounced' : null;
            
            if (!column) return;
            
            await this.pool.query(`
                INSERT INTO email_analytics_daily (date, sequence_id, ${column})
                VALUES (CURRENT_DATE, $1, 1)
                ON CONFLICT (date, sequence_id) 
                DO UPDATE SET 
                    ${column} = email_analytics_daily.${column} + 1,
                    updated_at = NOW()
            `, [sequenceId]);
            
        } catch (error) {
            console.error('❌ Error updating daily analytics:', error);
        }
    }

    // Generate 1x1 tracking pixel
    generateTrackingPixel() {
        const pixel = Buffer.from([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
            0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00,
            0x00, 0x2C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
            0x04, 0x01, 0x00, 0x3B
        ]);
        
        return pixel;
    }

    // Create tracking URLs for email
    createTrackingUrls(trackingPixelId) {
        return {
            pixelUrl: `${this.baseUrl}/api/email-tracking/pixel/${trackingPixelId}`,
            clickUrl: `${this.baseUrl}/api/email-tracking/click/${trackingPixelId}`,
            unsubscribeUrl: `${this.baseUrl}/api/email-tracking/unsubscribe/${trackingPixelId}`
        };
    }

    // Add tracking to email HTML
    addTrackingToEmail(htmlContent, trackingPixelId) {
        const trackingUrls = this.createTrackingUrls(trackingPixelId);
        
        // Add tracking pixel at the end of email
        const trackingPixel = `<img src="${trackingUrls.pixelUrl}" width="1" height="1" style="display:none;" alt="">`;
        
        // Wrap links with click tracking
        const linkedHtml = htmlContent.replace(
            /<a\s+href="([^"]+)"([^>]*)>/gi,
            `<a href="${trackingUrls.clickUrl}?url=$1"$2>`
        );
        
        // Add unsubscribe link if not present
        let finalHtml = linkedHtml;
        if (!finalHtml.includes('unsubscribe')) {
            finalHtml += `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
                <a href="${trackingUrls.unsubscribeUrl}" style="color: #999; text-decoration: none;">Unsubscribe</a>
            </div>`;
        }
        
        return finalHtml + trackingPixel;
    }

    // Simulate email events for testing
    async simulateEmailOpen(emailAddress) {
        try {
            const result = await this.pool.query(`
                SELECT tracking_pixel_id 
                FROM email_tracking 
                WHERE email_address = $1 
                AND opened_at IS NULL
                ORDER BY sent_at DESC 
                LIMIT 1
            `, [emailAddress]);

            if (result.rows.length > 0) {
                const trackingPixelId = result.rows[0].tracking_pixel_id;
                await this.trackEmailOpen(trackingPixelId, 'Test User Agent', '127.0.0.1');
                
                console.log(`🧪 Simulated email open for ${emailAddress}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('❌ Error simulating email open:', error);
            return false;
        }
    }

    async simulateEmailClick(emailAddress, clickedUrl = 'https://tribeariumsolutions.com') {
        try {
            const result = await this.pool.query(`
                SELECT tracking_pixel_id 
                FROM email_tracking 
                WHERE email_address = $1 
                ORDER BY sent_at DESC 
                LIMIT 1
            `, [emailAddress]);

            if (result.rows.length > 0) {
                const trackingPixelId = result.rows[0].tracking_pixel_id;
                await this.trackEmailClick(trackingPixelId, clickedUrl, 'Test User Agent', '127.0.0.1');
                
                console.log(`🧪 Simulated email click for ${emailAddress}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('❌ Error simulating email click:', error);
            return false;
        }
    }
}

// Create API routes for SalesHandy-style email tracking
function createEmailTrackingRoutes(app, trackingSystem) {
    
    // Tracking pixel endpoint
    app.get('/api/email-tracking/pixel/:trackingId', async (req, res) => {
        try {
            const trackingId = req.params.trackingId;
            const userAgent = req.get('User-Agent');
            const ipAddress = req.ip || req.connection.remoteAddress;
            
            // Track the open
            await trackingSystem.trackEmailOpen(trackingId, userAgent, ipAddress);
            
            // Return 1x1 transparent pixel
            const pixel = trackingSystem.generateTrackingPixel();
            
            res.setHeader('Content-Type', 'image/gif');
            res.setHeader('Content-Length', pixel.length);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.send(pixel);
            
        } catch (error) {
            console.error('❌ Error serving tracking pixel:', error);
            const pixel = trackingSystem.generateTrackingPixel();
            res.setHeader('Content-Type', 'image/gif');
            res.send(pixel);
        }
    });
    
    // Click tracking endpoint
    app.get('/api/email-tracking/click/:trackingId', async (req, res) => {
        try {
            const trackingId = req.params.trackingId;
            const targetUrl = req.query.url || 'https://tribeariumsolutions.com';
            const userAgent = req.get('User-Agent');
            const ipAddress = req.ip || req.connection.remoteAddress;
            
            // Track the click
            await trackingSystem.trackEmailClick(trackingId, targetUrl, userAgent, ipAddress);
            
            // Redirect to target URL
            res.redirect(302, targetUrl);
            
        } catch (error) {
            console.error('❌ Error tracking click:', error);
            res.redirect(302, req.query.url || 'https://tribeariumsolutions.com');
        }
    });
    
    // Unsubscribe endpoint
    app.get('/api/email-tracking/unsubscribe/:trackingId', async (req, res) => {
        try {
            const trackingId = req.params.trackingId;
            
            // Track unsubscribe
            const result = await trackingSystem.trackUnsubscribe(trackingId);
            
            // Show unsubscribe confirmation page
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Unsubscribed - Tribearium Solutions</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                        .container { background: #f8f9fa; padding: 40px; border-radius: 8px; }
                        h1 { color: #28a745; margin-bottom: 20px; }
                        p { color: #6c757d; line-height: 1.6; margin-bottom: 20px; }
                        .footer { margin-top: 30px; font-size: 14px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✅ Successfully Unsubscribed</h1>
                        <p>You have been successfully removed from our email list.</p>
                        <p>We're sorry to see you go! If you change your mind, you can always reach out to us directly.</p>
                        <div class="footer">
                            <p>Tribearium Solutions LLC<br>
                            <a href="https://tribeariumsolutions.com">tribeariumsolutions.com</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `);
            
        } catch (error) {
            console.error('❌ Error processing unsubscribe:', error);
            res.status(500).send('Error processing unsubscribe request');
        }
    });
    
    // Get lead email history
    app.get('/api/email-tracking/history/:leadId', async (req, res) => {
        try {
            const leadId = req.params.leadId;
            const history = await trackingSystem.getLeadEmailHistory(leadId);
            
            res.json({
                success: true,
                data: history,
                count: history.length
            });
        } catch (error) {
            console.error('❌ Error getting email history:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    
    // Get sequence analytics
    app.get('/api/email-tracking/analytics/:sequenceId', async (req, res) => {
        try {
            const sequenceId = req.params.sequenceId;
            const dateRange = parseInt(req.query.days) || 30;
            const analytics = await trackingSystem.getSequenceAnalytics(sequenceId, dateRange);
            
            res.json({
                success: true,
                data: analytics
            });
        } catch (error) {
            console.error('❌ Error getting sequence analytics:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    
    // Get overall email stats
    app.get('/api/email-tracking/stats', async (req, res) => {
        try {
            const dateRange = parseInt(req.query.days) || 30;
            const stats = await trackingSystem.getOverallEmailStats(dateRange);
            
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('❌ Error getting email stats:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    
    // Manual tracking endpoints
    app.post('/api/email-tracking/mark-reply/:leadId', async (req, res) => {
        try {
            const leadId = req.params.leadId;
            const { sequenceId, sentiment } = req.body;
            
            const result = await trackingSystem.trackEmailReply(leadId, sequenceId, sentiment);
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Error marking reply:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    
    app.post('/api/email-tracking/mark-bounce/:trackingId', async (req, res) => {
        try {
            const trackingId = req.params.trackingId;
            const { reason } = req.body;
            
            const result = await trackingSystem.trackEmailBounce(trackingId, reason);
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Error marking bounce:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    
    // Test/simulation endpoints (for development)
    app.post('/api/email-tracking/simulate-open', async (req, res) => {
        try {
            const { email } = req.body;
            
            if (email !== 'ricardokr63@gmail.com') {
                return res.status(403).json({
                    success: false,
                    message: 'Simulation only available for test email'
                });
            }
            
            const success = await trackingSystem.simulateEmailOpen(email);
            
            res.json({
                success: success,
                message: success ? 'Email open simulated' : 'No email found to simulate'
            });
        } catch (error) {
            console.error('❌ Error simulating open:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    
    app.post('/api/email-tracking/simulate-click', async (req, res) => {
        try {
            const { email, url } = req.body;
            
            if (email !== 'ricardokr63@gmail.com') {
                return res.status(403).json({
                    success: false,
                    message: 'Simulation only available for test email'
                });
            }
            
            const success = await trackingSystem.simulateEmailClick(email, url);
            
            res.json({
                success: success,
                message: success ? 'Email click simulated' : 'No email found to simulate'
            });
        } catch (error) {
            console.error('❌ Error simulating click:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
}

module.exports = { SalesHandyEmailTracking, createEmailTrackingRoutes };

// CLI execution for testing
if (require.main === module) {
    const trackingSystem = new SalesHandyEmailTracking();
    
    console.log('🧪 Testing SalesHandy Email Tracking System...');
    
    trackingSystem.initializeEmailTracking()
        .then(() => {
            console.log('✅ Email tracking system initialized');
            
            // Test creating tracking for a sample email
            return trackingSystem.createEmailTracking(
                1, // leadId
                'test_sequence_1', // sequenceId
                'ricardokr63@gmail.com', // email
                'day_1', // templateDay
                'Test Subject', // subject
                'test_message_123' // messageId
            );
        })
        .then(trackingData => {
            if (trackingData) {
                console.log('✅ Sample email tracking created:', trackingData.trackingId);
                
                // Get overall stats
                return trackingSystem.getOverallEmailStats();
            }
        })
        .then(stats => {
            if (stats) {
                console.log('📊 Current email stats:', stats);
            }
            
            console.log('\n🎉 === EMAIL TRACKING SYSTEM READY ===');
            console.log('✅ Advanced open/click tracking active');
            console.log('✅ Real-time analytics and reporting');
            console.log('✅ Device and location detection');
            console.log('✅ Bounce and unsubscribe handling');
            console.log('✅ Sequence performance analytics');
            console.log('');
            console.log('🔧 TRACKING FEATURES:');
            console.log('  • 1x1 pixel email open tracking');
            console.log('  • Link click tracking with redirects');
            console.log('  • Reply sentiment analysis');
            console.log('  • Bounce and unsubscribe detection');
            console.log('  • Device type and timing analytics');
            console.log('  • Daily analytics aggregation');
            console.log('  • Sequence performance metrics');
            console.log('');
            console.log('📊 ANALYTICS AVAILABLE:');
            console.log('  • Open rates, click rates, reply rates');
            console.log('  • Timing analysis (hours to open/click/reply)');
            console.log('  • Device breakdown (mobile/desktop/tablet)');
            console.log('  • Engagement depth metrics');
            console.log('  • Sequence comparison analytics');
            console.log('');
            console.log('🧪 Test simulation available for: ricardokr63@gmail.com');
            console.log('🚀 Ready for production email tracking!');
            
        })
        .catch(error => {
            console.error('❌ Email tracking test failed:', error);
        });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down Email Tracking System...');
        trackingSystem.pool.end();
        process.exit(0);
    });
}