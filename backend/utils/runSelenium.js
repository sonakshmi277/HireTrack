const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

async function runSelenium(user) {
    let driver;
    try {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.get("http://localhost:3000/applyNew"); 
        console.log("Auto-filling form with data for user:", user.Email);
        await driver.findElement(By.name("name")).sendKeys(user.Name || '');
        await driver.findElement(By.name("email")).sendKeys(user.Email || '');
        await driver.findElement(By.name("age")).sendKeys(user.Age ? user.Age.toString() : '');
        await driver.findElement(By.name("education")).sendKeys(user.Education || '');
        await driver.findElement(By.name("jobId")).sendKeys(user.JobType || '');
        await driver.findElement(By.css("button[type='submit']")).click();
    } catch (error) {
        console.error("Error in runSelenium:", error);
        throw error;
    } 
    finally {
        if (driver) {
            await driver.quit();
            console.log("Selenium driver quits");
        }
    }
}

module.exports = runSelenium;