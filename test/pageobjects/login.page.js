import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername () {
        return $('#user-name');
    }

    get inputPassword () {
        return $('#password');
    }

    get btnSubmit () {
        return $('#login-button');
    }

    get errorButton () {
        return $('h3[data-test="error"]');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);

        const isUsernameFilled = await this.isFieldFilled(this.inputUsername);
        const isPasswordFilled = await this.isFieldFilled(this.inputPassword);
        const isPasswordTypeCorrect = await this.isPasswordFieldObscured(this.inputPassword);


        if (!isUsernameFilled) {
            throw new Error("Username field is not filled.");
        } else if (!isPasswordFilled) {
            throw new Error("Password field is not filled.");
        } else if (!isPasswordTypeCorrect) {
            throw new Error("Password field is not obscured (not of type 'password').");
        }

        // await this.inputPassword.saveScreenshot('./test/specs/screenshots/filledPasswordField.png');
        // await expect(this.inputPassword).toMatchElementSnapshot('filledPasswordField');

        // const passwordField = await this.inputPassword;
        // const result = await browser.checkElement(passwordField, 'filledPasswordField');
        // assert.strictEqual(result.misMatchPercentage, 0, 'Password field does not match the baseline snapshot');

        await this.btnSubmit.click();
    }
    
    async isFieldFilled(field) {
        const value = await field.getValue();
        return value !== '';
    }

    async isPasswordFieldObscured(field) {
        const type = await field.getAttribute('type');
        return type === 'password';
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('');
    }
}

export default new LoginPage();
