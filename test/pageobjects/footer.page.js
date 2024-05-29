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
}

export default new FooterPage();
// export default new CardPage();
