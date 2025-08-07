const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:3000...');
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('Response status:', response.status());
    
    // Check if page loaded successfully
    if (response.status() === 200) {
      console.log('✅ Page loaded successfully!');
      
      // Get page title
      const title = await page.title();
      console.log('Page title:', title);
      
      // Check for main elements
      const heroText = await page.textContent('h1');
      console.log('Hero text:', heroText);
      
      // Check if MyPromptBench branding exists
      const brandingExists = await page.locator('text=MyPromptBench').count();
      console.log('MyPromptBench branding found:', brandingExists > 0);
      
      // Take a screenshot
      await page.screenshot({ path: 'site-screenshot.png', fullPage: false });
      console.log('Screenshot saved as site-screenshot.png');
      
    } else {
      console.log('❌ Page failed to load properly');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();