/**
 * Pagination Test: Verifies that the pagination controls function correctly,
 * ensuring that the correct number of records are displayed per page,
 * and that navigation between pages updates the displayed records appropriately.
 */

const { By, Builder, until } = require('selenium-webdriver');
const assert = require('chai').assert;
const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Uncomment to run headless

describe('Pagination Feature Tests', function() {
    let driver;
    this.timeout(30000); // Set timeout to 30 seconds

    before(async function() {
        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();
        await driver.get('http://localhost:5122/'); // Update with your actual URL
    });

    after(async function() {
        await driver.quit();
    });

    /**
     * Rows Per Page Test: Selects a specific number of rows per page (10) and
     * verifies that the correct number of rows are displayed.
     */
    it('should display the correct number of rows per page', async function() {
        // Assuming you have an element to trigger a search
        const searchButton = await driver.findElement(By.id('run-search'));
        await searchButton.click();

        // Select rows per page
        const rowsOption = await driver.findElement(By.xpath('//li[text()="10"]'));
        await rowsOption.click();

        // Wait for the results to load
        await driver.wait(until.elementLocated(By.css('.ag-row')), 10000);

        // Verify the number of rows displayed
        const rows = await driver.findElements(By.css('.ag-row'));
        assert.equal(rows.length, 10, 'Number of rows per page is not 10');
    });

    /**
     * Next Page Navigation Test: Clicks the "next page" button and verifies
     * that the page number updates correctly and new rows are displayed.
     */
    it('should navigate to the next page correctly', async function() {
        const nextPageButton = await driver.findElement(By.id('next-page-btn'));
        await nextPageButton.click();

        // Wait for the next page of results to load
        await driver.wait(until.elementLocated(By.css('.ag-row')), 10000);

        // Verify the page number
        const pageNumber = await driver.findElement(By.id('page-number')).getText();
        assert.include(pageNumber, 'Page 2', 'Did not navigate to the next page correctly');
    });

    /**
     * Previous Page Navigation Test: Clicks the "previous page" button and verifies
     * that the page number updates correctly and previous rows are displayed.
     */
    it('should navigate to the previous page correctly', async function() {
        const prevPageButton = await driver.findElement(By.id('prev-page-btn'));
        await prevPageButton.click();

        // Wait for the previous page of results to load
        await driver.wait(until.elementLocated(By.css('.ag-row')), 10000);

        // Verify the page number
        const pageNumber = await driver.findElement(By.id('page-number')).getText();
        assert.include(pageNumber, 'Page 1', 'Did not navigate to the previous page correctly');
    });

    /**
     * Pagination Controls Visibility Test: Applies a filter that should hide the pagination controls
     * and verifies that the controls are hidden when the filter is active.
     */
    it('should hide pagination controls for specific filters', async function() {
        // Apply a filter that should hide pagination
        const filterInput = await driver.findElement(By.id('query-input'));
        await filterInput.clear();
        await filterInput.sendKeys('* | stats count BY something');

        const runFilterButton = await driver.findElement(By.id('run-filter-btn'));
        await runFilterButton.click();

        // Wait for the results to load
        await driver.wait(until.elementLocated(By.css('.ag-row')), 10000);

        // Verify pagination controls are hidden
        const paginationControls = await driver.findElement(By.id('pagination-controls')).isDisplayed();
        assert.isFalse(paginationControls, 'Pagination controls should be hidden');
    });

    /**
     * Rows Per Page Dropdown Test: Selects different row options (25, 50, 100, 200) and verifies that the correct number of rows are displayed.
     */
    it('should display the correct number of rows for different options', async function() {
        const rowOptions = ['25', '50', '100', '200'];

        for (let option of rowOptions) {
            // Select rows per page
            const rowsOption = await driver.findElement(By.xpath(`//li[text()="${option}"]`));
            await rowsOption.click();

            // Wait for the results to load
            await driver.wait(until.elementLocated(By.css('.ag-row')), 10000);

            // Verify the number of rows displayed
            const rows = await driver.findElements(By.css('.ag-row'));
            assert.equal(rows.length, parseInt(option), `Number of rows per page is not ${option}`);
        }
    });
});