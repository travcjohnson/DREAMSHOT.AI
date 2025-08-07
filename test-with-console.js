const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Show browser
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Check page content
    const pageContent = await page.content();
    if (pageContent.includes('Error') || pageContent.includes('error')) {
      console.log('Found error references in page');
    }
    
    // Try to get the actual error message
    const errorElement = await page.$('[role="alert"], .error, .text-red-600');
    if (errorElement) {
      const errorText = await errorElement.textContent();
      console.log('Error element found:', errorText);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: false });
    
    // Keep browser open for 5 seconds to see
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();