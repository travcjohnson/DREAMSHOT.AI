const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Take screenshots of key sections
    await page.screenshot({ path: 'hero-section.png', fullPage: false });
    console.log('Hero section screenshot saved');
    
    // Scroll to problem section
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'problem-section.png', fullPage: false });
    console.log('Problem section screenshot saved');
    
    // Scroll to solution section
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'solution-section.png', fullPage: false });
    console.log('Solution section screenshot saved');
    
    // Test interactivity - type in the prompt input
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.type('Write a poem about AI progress');
      console.log('✅ Prompt input is interactive');
    }
    
    // Check for any console errors
    const logs = [];
    page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
    
    // Final full page screenshot
    await page.screenshot({ path: 'full-site-final.png', fullPage: true });
    console.log('Full page screenshot saved');
    
    if (logs.length > 0) {
      console.log('Console logs:', logs);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();