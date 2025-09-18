const puppeteer = require('puppeteer');

async function testPuppeteer() {
    try {
        console.log('Testing Puppeteer...');
        
        const browser = await puppeteer.launch({
            headless: false, // Mostrar el navegador para debug
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        
        const page = await browser.newPage();
        await page.goto('https://google.com');
        
        const title = await page.title();
        console.log('Page title:', title);
        
        await browser.close();
        console.log('Puppeteer working correctly!');
        
    } catch (error) {
        console.error('Puppeteer error:', error.message);
    }
}

testPuppeteer();