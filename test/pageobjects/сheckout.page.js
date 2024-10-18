import Page from './page.js';
import { faker } from '@faker-js/faker';

class CheckoutPage extends Page {
    get lastName() { 
        return $('#last-name'); 
    }
    
    get firstName() { 
        return $('#first-name'); 
    }

    get postalCode() { 
        return $('#postal-code'); 
    }

    get continueButton() { 
        return $('input#continue'); 
    }

    get subtotalLabel() { 
        return $('div[data-test="subtotal-label"]'); 
    }

    get finishButton() { 
        return $('#finish'); 
    }

    get checkoutCompleteMessage() { 
        return $('h2[data-test="complete-header"]'); 
    }

    get backHomeButton() { 
        return $('button#back-to-products'); 
    }

    async getSubtotalPrice() {
        const text = await this.subtotalLabel.getText();
        return parseFloat(text.replace('Item total: $', ''));
    }

    async CheckoutInformation (firstname, lastname, zipcode) {
        await this.firstName.setValue(firstname);
        await this.lastName.setValue(lastname);
        await this.postalCode.setValue(zipcode);

        await this.continueButton.click();
    }
    
    async isFieldFilled(field) {
        const value = await field.getValue();
        return value !== '';
    }

    async clickFinishButton() {
        await this.finishButton.click();
    }

    async clickBackHomeButton() {
        await this.backHomeButton.click();
    }
}

export default new CheckoutPage();
