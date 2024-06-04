// import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    // dropdown list
    get title () {
        return $('[data-test="title"]');
    }

    get inventoryContainer () {
        return $('#inventory_container');
    }

    get burgerMenuBtn () {
        return $('button#react-burger-menu-btn');
    }

    get dropdownOptions () {
        return $$('nav a.bm-item.menu-item');
    }

    get navMenu () {
        return $('nav.bm-item-list');
    }

    get allItems () {
        return $('#inventory_sidebar_link');
    }
    
    get about () {
        return $('#about_sidebar_link');
    }
    
    get logout () {
        return $('#logout_sidebar_link');
    }
    
    get reset () {
        return $('#reset_sidebar_link');
    }
    ////////////////////////////////////////
    // get addToCart () {
    //     return $('#add-to-cart-sauce-labs-backpack');
    // }
    
    get cartIconNumber () {
        return $('[data-test="shopping-cart-badge"]');
    }
    
    get filterIcon () {
        return $('select[data-test="product-sort-container"]');
    }
    
    get filterAZ () {
        return $('select[data-test="product-sort-container"] [value="az"]');
    }
    
    get filterZA () {
        return $('select[data-test="product-sort-container"] [value="za"]');
    }
    
    get filterPriceLH () {
        return $('select[data-test="product-sort-container"] [value="lohi"]');
    }

    get filterPriceHL () {
        return $('select[data-test="product-sort-container"] [value="hilo"]');
    }

    //Products info
    get inventoryItems () {
        return $$('div[data-test="inventory-item"]');
    }
    
    get inventoryItemNames () {
        return $$('div[data-test="inventory-item"] [data-test="inventory-item-name"]');
    }

    get inventoryItemName () {
        return $('[data-test="inventory-item-name"]');
    }
    
    get listPrices () {
        return $$('div[data-test="inventory-item-price"]');
    }
    
    get inventoryItemImages () {
        return $$('div.inventory_item_img img');
    }

    get inventoryItemImage () {
        return $('div.inventory_item_img img');
    }
    // Cart

    get addToCartButton() { 
        // return $('#item_4_img_link').parentElement().parentElement().parentElement().$('button.btn_inventory'); 
        return $('button#add-to-cart-sauce-labs-backpack'); 
        // return $('button#add-to-cart-sauce-labs-bike-light'); 
    }
    
    get cartButton() { 
        return $('a[data-test="shopping-cart-link"]'); 
    }
    
    get inventoryItemPrice() { 
        return $('div[data-test="inventory-item-price"]'); 
    }

    // Method to verify products are displayed and contain name, price, and image
    async verifyProductsDisplayed() {
        const products = await this.inventoryItems;
        if (products.length === 0) {
            throw new Error('No products are displayed on the page');
        }

        for (const product of products) {
            const name = await product.$(await this.inventoryItemName).getText();
            const price = await product.$(await this.inventoryItemPrice).getText();
            await product.$(await this.inventoryItemImage).waitForDisplayed();
            const image = await product.$(await this.inventoryItemImage).isDisplayed();

            if (name === '') {
                throw new Error('Product name is missing');
            }
            if (price === '') {
                throw new Error('Product price is missing');
            }
            if (!image) {
                throw new Error('Product image is not displayed');
            }
        }
    }

    async getInventoryItemPrice() {
        const text = await this.inventoryItemPrice.getText();
        return parseFloat(text.replace('$', ''));
    }

    async addProductToCart() {
        await this.addToCartButton.click();
    }

    async goToCart() {
        await this.cartButton.click();
    }

    async getDropdownOptionsLength() {
        const options = await this.dropdownOptions;
        return options.length;
    }
    
    async clickBurgerMenuBtn() {
        await this.burgerMenuBtn.click();
    }
    
    async clickLogout() {
        await this.logout.click();
    }
    
    async clickAddToCartButton() {
        await this.addToCartButton.click();
    }
    
    async clickFilterIcon() {
        await this.filterIcon.click();
    }

    async clickFilter(filter) {
        await filter.click();
    }

   

}

export default new SecurePage();
