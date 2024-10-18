import Page from './page.js';
import { faker } from '@faker-js/faker';


class LoginPage extends Page {
    
    get inputUsername () {
        return $('#user-name');
    }

    get inputPassword () {
        return $('#password');
    }

    get btnSubmit () {
        return $('#login-button');
    }


    get nameErrorIcon () {
        return $('#user-name + svg.error_icon');
    }

    get passErrorIcon () {
        return $('#password + svg.error_icon');
    }


    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (username, password) {
        await this.inputUsername.waitForDisplayed();
        
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

    get errorInputField() { 
        return $('.input_error.error'); 
    }

    async getErrorInputBorderColor() {
        const element = await this.errorInputField;
        const color = await element.getCSSProperty('border-bottom-color');
        return color.parsed.hex;
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('');
    }
}

export default new LoginPage();
