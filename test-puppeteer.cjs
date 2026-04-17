const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.goto('http://localhost:5173');
    
    try {
        console.log("Looking for PC Toggle button...");
        await delay(2000);
        const buttons = await page.$$('button');
        let pcButton = null;
        for (let btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('PC 버전')) {
                pcButton = btn;
                break;
            }
        }
        
        if (pcButton) {
            console.log("Clicking PC Toggle button...");
            await pcButton.click();
            await delay(1000);
            
            console.log("Looking for USER Login button...");
            const loginButtons = await page.$$('button');
            let loginButton = null;
            for (let btn of loginButtons) {
                const text = await page.evaluate(el => el.textContent, btn);
                if (text.includes('일반 로그인')) {
                    loginButton = btn;
                    break;
                }
            }
            
            if (loginButton) {
                console.log("Clicking USER Login button...");
                await loginButton.click();
                await delay(2000);
            } else {
                console.log("USER Login button not found.");
            }
            
            const bodyHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
            console.log("HTML snippet after login:", bodyHtml);
        } else {
            console.log("PC Toggle button not found.");
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
    
    await browser.close();
})();
