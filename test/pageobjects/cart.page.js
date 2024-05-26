import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CartPage extends Page {
    get cartItem() { 
        return $('#item_4_title_link').$('div.inventory_item_name'); 
    }

    get cardItemNames () {
        return $$('div[data-test="inventory-item"] [data-test="inventory-item-name"]');
    }

    get checkoutButton() { 
        return $('button#checkout'); 
    }

    get errorButton () {
        return $('h3[data-test="error"]');
    }

    get removeButton () {
        return $('#remove-sauce-labs-backpack');
    }

    async getCartItemName() {
        return await this.cartItem.getText();
    }

    async isCartEmpty() {
        const items = await this.cardItemNames;
        return items.length === 0;
    }

}

export default new CartPage();
