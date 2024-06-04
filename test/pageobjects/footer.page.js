// import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class FooterPage extends Page {
    get twitterIcon() { return $('a[data-test="social-twitter"]'); }
    get facebookIcon() { return $('a[data-test="social-facebook"]'); }
    get linkedinIcon() { return $('a[data-test="social-linkedin"]'); }

    async clickIcon(icon) {
        await this[icon].click();
    }

    async verifySocialMediaLink(name, icon, urlPart) {
        const originalWindow = await browser.getWindowHandle();

        await this.clickIcon(icon);

        await browser.waitUntil(async () => {
            const windowHandles = await browser.getWindowHandles();
            return windowHandles.length === 2;
        }, {
            timeout: 5000,
            timeoutMsg: `Expected a new window to open after clicking ${name} icon`
        });

        const windowHandles = await browser.getWindowHandles();
        const newWindowHandle = windowHandles.find(handle => handle !== originalWindow);
        await browser.switchToWindow(newWindowHandle);

        await expect(browser).toHaveUrlContaining(urlPart);

        await browser.closeWindow();
        await browser.switchToWindow(originalWindow);
    }
}

export default new FooterPage();
