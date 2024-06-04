import { expect } from '@wdio/globals'
import loginPage from '../pageobjects/login.page.js'
import securePage from '../pageobjects/secure.page.js'
import cartPage from '../pageobjects/cart.page.js';
import footerPage from '../pageobjects/footer.page.js';
import checkoutPage from '../pageobjects/сheckout.page.js';

describe('My application', () => {
    beforeEach(async () => {
        await loginPage.open()
    }); 

    it('001 should login with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce')

        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        await securePage.verifyProductsDisplayed();
        await expect(securePage.cartButton).toBeDisplayed();
    })

    it('002 should not login with invalid password', async () => {
        await loginPage.login('standard_user', 'qwerty')

        const borderColor = await loginPage.getErrorInputBorderColor();
        expect(borderColor).toEqual('#e2231a');

        const isIconNameDisplayed = await loginPage.nameErrorIcon.isDisplayed();
        expect(isIconNameDisplayed).toBe(true);

        const isIconPassDisplayed = await loginPage.passErrorIcon.isDisplayed();
        expect(isIconPassDisplayed).toBe(true);

        // await expect(loginPage.errorButton).toHaveTextContaining(
        //         'Epic sadface: Username and password do not match any user in this service')

        const errorButtonText = await loginPage.errorButton.getText();
        expect(errorButtonText).toEqual(expect.stringContaining(
            'Epic sadface: Username and password do not match any user in this service'))

    })

    it('003 should not login with invalid login', async () => {
        await loginPage.login('stan', 'secret_sauce')

        const borderColor = await loginPage.getErrorInputBorderColor();
        expect(borderColor).toEqual('#e2231a');

        const isIconNameDisplayed = await loginPage.nameErrorIcon.isDisplayed();
        expect(isIconNameDisplayed).toBe(true);

        const isIconPassDisplayed = await loginPage.passErrorIcon.isDisplayed();
        expect(isIconPassDisplayed).toBe(true);

        const errorButtonText = await loginPage.errorButton.getText();
        expect(errorButtonText).toEqual(expect
            .stringContaining('Epic sadface: Username and password do not match any user in this service'))
    })

    it('004 should logout after clicking on the "Logout" button', async () => {
        await loginPage.login('standard_user', 'secret_sauce')
        // await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        await expect(browser).toHaveUrlContaining('inventory');
        await securePage.clickBurgerMenuBtn();

        const elementsToCheck = [
            securePage.navMenu,
            securePage.allItems,
            securePage.about,
            securePage.logout,
            securePage.reset,
        ];

        for (const element of elementsToCheck) {
            await expect(element).toBeDisplayed();
        }

        const actualOptionsLength = await securePage.getDropdownOptionsLength();
        await expect(actualOptionsLength).toBe(4);

        await securePage.clickLogout();        
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        if (loginPage.isUsernameFilled) {
            throw new Error("Username field is filled.");
        } else if (loginPage.isPasswordFilled) {
            throw new Error("Password field is filled.");
        }
        
    })

    it('005 should save the card after logging out', async () => {
        await loginPage.login('standard_user', 'secret_sauce')
        await expect(browser).toHaveUrlContaining('inventory');

        //Verify the number near the cart at the top right increase by 1
        let initialNumber = 0;
        if (await securePage.cartIconNumber.isDisplayed()) {
            const initialNumberText = await securePage.cartIconNumber.getText();
            initialNumber = parseInt(initialNumberText, 10);
        }

        await securePage.clickAddToCartButton();
        await securePage.waitForSeconds(1000);

        const newNumberText = await securePage.cartIconNumber.getText();
        const newNumber = parseInt(newNumberText, 10);
        expect(newNumber).toEqual(initialNumber + 1);

        await securePage.goToCart();

        // Verify the product is present in the cart
        const cartItemName = await cartPage.getCartItemName();
        expect(cartItemName).toBe('Sauce Labs Backpack');
        ///
        await securePage.clickBurgerMenuBtn();
        
        const elementsToCheck = [
            securePage.navMenu,
            securePage.allItems,
            securePage.about,
            securePage.logout,
            securePage.reset,
        ];

        for (const element of elementsToCheck) {
            await expect(element).toBeDisplayed();
        }

        const actualOptionsLength = await securePage.getDropdownOptionsLength();
        await expect(actualOptionsLength).toBe(4);

        await securePage.clickLogout();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        if (loginPage.isUsernameFilled) {
            throw new Error("Username field is not empty.");
        } else if (loginPage.isPasswordFilled) {
            throw new Error("Password field is not empty.");
        }

        // Verify the product is present in the cart
        await loginPage.login('standard_user', 'secret_sauce')
        await securePage.goToCart();

        expect(cartItemName).toBe('Sauce Labs Backpack');

        await cartPage.clickRemoveButton();
        await securePage.waitForSeconds(1000);

    })

    it('006 should sorting', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(browser).toHaveUrlContaining('inventory');
        await securePage.clickFilterIcon();
    
        const sortingOptions = [
            { filter: securePage.filterAZ, type: 'name', order: 'asc' },
            { filter: securePage.filterZA, type: 'name', order: 'desc' },
            { filter: securePage.filterPriceLH, type: 'price', order: 'asc' },
            { filter: securePage.filterPriceHL, type: 'price', order: 'desc' }
        ];
    
        for (const { filter, type, order } of sortingOptions) {
            await securePage.clickFilterIcon();
            await securePage.clickFilter(filter);
    
            if (type === 'name') {
                const items = await securePage.inventoryItemNames;
                const itemNames = [];
                for (let item of items) {
                    itemNames.push(await item.getText());
                }
                
                const sortedItems = [...itemNames].sort((a, b) => {
                    if (order === 'asc') {
                        return a.localeCompare(b);
                    } else {
                        return b.localeCompare(a);
                    }
                });
                
                expect(itemNames).toEqual(sortedItems, `Sorting by name in ${order} order failed`);
    
            } 
            
            if (type === 'price') {
                const prices = await securePage.listPrices;
                const priceValues = [];
                for (let price of prices) {
                    const priceText = await price.getText();
                    const priceNumber = parseFloat(priceText.replace('$', ''));
                    priceValues.push(priceNumber);
                }
    
                const sortedPrices = [...priceValues].sort((a, b) => {
                    if (order === 'asc') {
                        return a - b;
                    } else {
                        return b - a;
                    }
                });
    
                expect(priceValues).toEqual(sortedPrices, `Sorting by price in ${order} order failed`);
            }
        }
    });
    

    it('007 should open Footer Links ', async () => {
        const socialMediaLinks = [
            { name: 'Twitter', icon: 'twitterIcon', urlPart: 'x.com/saucelabs' },
            { name: 'Facebook', icon: 'facebookIcon', urlPart: 'facebook.com/saucelabs' },
            { name: 'LinkedIn', icon: 'linkedinIcon', urlPart: 'linkedin.com/company/sauce-labs/' }
        ];

        await loginPage.login('standard_user', 'secret_sauce') 
        
        for (const { name, icon, urlPart } of socialMediaLinks) {
            await footerPage.verifySocialMediaLink(name, icon, urlPart);
        }

    });


    it('008 should Valid Checkout', async () => {
        await loginPage.login('standard_user', 'secret_sauce')
        await expect(browser).toHaveUrlContaining('inventory');
        await expect(securePage.title).toHaveTextContaining('Products');
        await (await securePage.inventoryContainer).waitForDisplayed()
        

        //Verify the number near the cart at the top right increase by 1
        let initialNumber = 0;
        if (await securePage.cartIconNumber.isDisplayed()) {
            const initialNumberText = await securePage.cartIconNumber.getText();
            initialNumber = parseInt(initialNumberText, 10);
        }
        
        // await securePage.addToCartButton.waitForDisplayed();
        await securePage.clickAddToCartButton();
        await securePage.waitForSeconds(1000);

        await expect(securePage.cartIconNumber).toBeDisplayed();

        const newNumberText = await securePage.cartIconNumber.getText();
        const newNumber = parseInt(newNumberText, 10);
        expect(newNumber).toEqual(initialNumber + 1);

        // Verify the product is present in the cart
        await securePage.goToCart();
        await expect(securePage.title).toHaveTextContaining('Your Cart');
        const cartItemName = await cartPage.getCartItemName();
        expect(cartItemName).toBe('Sauce Labs Backpack');

        await cartPage.clickCheckoutButton();
        await checkoutPage.CheckoutInformation('first-name', 'last-name', '00153')
        await expect(browser).toHaveUrlContaining('checkout-step-two.html');
        await expect(securePage.title).toHaveTextContaining('Checkout: Overview');
        
        // Compare the prices
        const subtotalPrice = await checkoutPage.getSubtotalPrice();
        const inventoryPrice = await securePage.getInventoryItemPrice();

        expect(subtotalPrice).toBe(inventoryPrice);
        await checkoutPage.clickFinishButton() ;

        await expect(browser).toHaveUrlContaining('checkout-complete.html');
        await expect(checkoutPage.checkoutCompleteMessage)
                .toHaveTextContaining('Thank you for your order!')

        await checkoutPage.clickBackHomeButton();

        await expect(browser).toHaveUrlContaining('inventory');
        await expect(securePage.title).toHaveTextContaining('Products');
        await securePage.verifyProductsDisplayed();

        await securePage.goToCart();
        await expect(browser).toHaveUrlContaining('cart.html');

        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBe(true);
    })

    it('009 should not Checkout without products in Card', async () => {
        await loginPage.login('standard_user', 'secret_sauce')
        await expect(browser).toHaveUrlContaining('inventory');

        await securePage.goToCart();
        await expect(browser).toHaveUrlContaining('cart.html');

        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBe(true, 'Cart is not empty');

        await cartPage.clickCheckoutButton();
        await expect(browser).toHaveUrlContaining('cart.html');
        
        await expect(cartPage.errorButton).toHaveTextContaining('Cart is empty')
    })
})

