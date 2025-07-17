const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

async function runSelenium(user) {
    let driver;
    try {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.get("http://localhost:3000/applyNew"); 
        await driver.sleep(2000);

        console.log("Auto-filling form with data for user:", user.Email);
        await driver.findElement(By.name("name")).sendKeys(user.Name || '');
        await driver.findElement(By.name("email")).sendKeys(user.Email || '');
        await driver.findElement(By.name("age")).sendKeys(user.Age ? user.Age.toString() : '');
        await driver.findElement(By.name("education")).sendKeys(user.Education || '');
        await driver.findElement(By.name("jobId")).sendKeys(user.JobType || '');
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.sleep(3000); 

        const screenshotFileName = `temp-submission-${Date.now()}.png`;
        const screenshotPath = path.join(__dirname, '..', screenshotFileName); 
        const image = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, image, 'base64');
        console.log("Screenshot saved to:", screenshotPath);

        return screenshotPath;

    } catch (error) {
        console.error("Error in runSelenium:", error);
        throw error;
    } finally {
        if (driver) {
            await driver.quit();
            console.log("Selenium driver quit.");
        }
    }
}

module.exports = runSelenium;