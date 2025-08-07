const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Take a full page screenshot
    await page.screenshot({ path: 'full-page-screenshot.png', fullPage: true });
    console.log('Full page screenshot saved as full-page-screenshot.png');
    
    // Check for errors
    const errorText = await page.locator('.error, [role="alert"]').textContent().catch(() => null);
    if (errorText) {
      console.log('Error found on page:', errorText);
    }
    
    // Check if Will Smith grid is visible
    const gridExists = await page.locator('.grid.grid-cols-2').count();
    console.log('Will Smith grid found:', gridExists > 0);
    
    // Check if prompt input exists
    const promptInputExists = await page.locator('textarea').count();
    console.log('Prompt input found:', promptInputExists > 0);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();