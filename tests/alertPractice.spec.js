const{test,expect} = require('@playwright/test');


test('Alert And multple windows handaling',async ({page})=>{

    await page.goto('/');
    
    const aleartNavigation = page.locator('a[href="javaScript-alert.php"]').first();
    await aleartNavigation.click();

    page.once('dialog', async dialog=>{
        console.log(dialog.message());
        await page.waitForTimeout(3000);
        await dialog.accept();
    })
    await page.getByRole('button',{name:'Show Alert'}).click();

    page.once('dialog', async dialog=>{
        console.log(dialog.message());
        await page.waitForTimeout(3000);
        await dialog.accept('Hello');
    })
    await page.getByRole('button',{name:'Show Prompt'}).click();

    const iframeNav = page.locator('a[href="iframe.php"]');
    await iframeNav.click();

    // const frame = page.frameLocator("iframe[name='frame1']");
    // await frame.locator('#massage').fill('Hello I am in frame');
    // await page.waitForTimeout(3000);


    const downloadPage = page.locator('a[href="file-download.php"]').first();
    await downloadPage.click();
    const[Download] = await Promise.all([
        page.waitForEvent('download'),
        await page.locator('#downloadLink').first().click()
    ]);

    await page.pause();// pause the test execution to inspect the page
});