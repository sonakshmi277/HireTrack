const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

async function runSelenium(user) {
    let driver;
    try {
        // Initialize WebDriver for Chrome
        driver = await new Builder().forBrowser("chrome").build();
        
        // Navigate to the job application form URL
        await driver.get("http://localhost:3000/applyNew"); 
        await driver.sleep(2000); // Give the page a moment to load

        console.log("Auto-filling form with data for user:", user.Email);

        // Find elements by their 'name' attribute and send keys
        // Ensure your frontend form fields have 'name' attributes corresponding to these.
        await driver.findElement(By.name("name")).sendKeys(user.Name || '');
        await driver.findElement(By.name("email")).sendKeys(user.Email || '');
        await driver.findElement(By.name("age")).sendKeys(user.Age ? user.Age.toString() : '');
        await driver.findElement(By.name("education")).sendKeys(user.Education || '');
        // For the Job ID, assuming it's a text input or a select where you can send the value directly
        await driver.findElement(By.name("jobId")).sendKeys(user.JobType || '');

        // Handle resume upload if the form supports it and Selenium needs to interact.
        // NOTE: This assumes your frontend /applyNew form has a <input type="file" name="resume">
        // If the resume is *already* handled by Multer on the backend during the /api/apply call,
        // and the frontend form doesn't actually require the file input for auto-submission,
        // you might omit this part of the Selenium script.
        // If your frontend form *does* require a file input to be filled even for auto-submit:
        // const resumePath = path.join(__dirname, '../uploads', user.Resume); // Path to the uploaded resume
        // if (fs.existsSync(resumePath)) {
        //     await driver.findElement(By.name("resume")).sendKeys(resumePath);
        //     console.log("Filled resume field with:", resumePath);
        // } else {
        //     console.warn("Resume file not found for auto-fill:", resumePath);
        // }


        // Click the submit button
        // Ensure your submit button has type="submit" or a recognizable class/ID
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.sleep(3000); // Wait for the form submission and any subsequent processing

        // Take a screenshot
        const screenshotFileName = `temp-submission-${Date.now()}.png`;
        const screenshotPath = path.join(__dirname, '..', screenshotFileName); // Saves in parent directory (root of project)
        const image = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, image, 'base64');
        console.log("Screenshot saved to:", screenshotPath);

        return screenshotPath;

    } catch (error) {
        console.error("❌ Error in runSelenium:", error);
        // Re-throw the error so the calling route can catch and respond with 500
        throw error;
    } finally {
        // Always quit the driver to close the browser
        if (driver) {
            await driver.quit();
            console.log("Selenium driver quit.");
        }
    }
}

module.exports = runSelenium;