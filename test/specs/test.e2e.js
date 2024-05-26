import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import SecurePage from '../pageobjects/secure.page.js'
import CartPage from '../pageobjects/cart.page.js';
import FooterPage from '../pageobjects/footer.page.js';
import CheckoutPage from '../pageobjects/сheckout.page.js';

describe('My application', () => {
    beforeEach(async () => {
        await LoginPage.open()
    }); 

    // after(async () => {
    //     // await browser.deleteAllCookies();
    //     await browser.sauceL
    // });

    it('001 should login with valid credentials', async () => {
        await LoginPage.login('standard_user', 'secret_sauce')

        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        await SecurePage.verifyProductsDisplayed();
        await expect(SecurePage.cartButton).toBeDisplayed();


    })

    it('002 should not login with invalid password', async () => {
        await LoginPage.login('standard_user', 'qwerty')

        const element = await $('.input_error.error');
        const color = await element.getCSSProperty('border-bottom-color');
        await expect(color.parsed.hex).toEqual('#e2231a');

        const isIconNameDisplayed = await $('#user-name + svg.error_icon').isDisplayed();
        expect(isIconNameDisplayed).toBe(true);

        const isIconPassDisplayed = await $('#password + svg.error_icon').isDisplayed();
        expect(isIconPassDisplayed).toBe(true);

        // await expect(LoginPage.errorButton).toHaveTextContaining(
        //         'Epic sadface: Username and password do not match any user in this service')

        const errorButtonText = await LoginPage.errorButton.getText();
        expect(errorButtonText).toEqual(expect.stringContaining(
            'Epic sadface: Username and password do not match any user in this service'))

    })

    it('003 should not login with invalid login', async () => {
        await LoginPage.login('stan', 'secret_sauce')

        const element = await $('.input_error.error');
        const color = await element.getCSSProperty('border-bottom-color');
        await expect(color.parsed.hex).toEqual('#e2231a');

        const isIconNameDisplayed = await $('#user-name + svg.error_icon').isDisplayed();
        expect(isIconNameDisplayed).toBe(true);

        const isIconPassDisplayed = await $('#password + svg.error_icon').isDisplayed();
        expect(isIconPassDisplayed).toBe(true);

        // await expect(LoginPage.errorButton).toHaveTextContaining(
        //         'Epic sadface: Username and password do not match any user in this service')

        const errorButtonText = await LoginPage.errorButton.getText();
        expect(errorButtonText).toEqual(expect
            .stringContaining('Epic sadface: Username and password do not match any user in this service'))
    })

    it('004 should logout after clicking on the "Logout" button', async () => {
        await LoginPage.login('standard_user', 'secret_sauce')
        // await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        await expect(browser).toHaveUrlContaining('inventory');
        await SecurePage.burgerMenuBtn.click();

        const elementsToCheck = [
            SecurePage.navMenu,
            SecurePage.allItems,
            SecurePage.about,
            SecurePage.logout,
            SecurePage.reset,
        ];

        for (const element of elementsToCheck) {
            await expect(element).toBeDisplayed();
        }

        const actualOptionsLength = await SecurePage.getDropdownOptionsLength();
        await expect(actualOptionsLength).toBe(4);

        await SecurePage.logout.click();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        if (LoginPage.isUsernameFilled) {
            throw new Error("Username field is filled.");
        } else if (LoginPage.isPasswordFilled) {
            throw new Error("Password field is filled.");
        }
        
    })

    it('005 should save the card after logging out', async () => {
        await LoginPage.login('standard_user', 'secret_sauce')
        await expect(browser).toHaveUrlContaining('inventory');

        //Verify the number near the cart at the top right increase by 1
        let initialNumber = 0;
        if (await SecurePage.cartIconNumber.isDisplayed()) {
            const initialNumberText = await SecurePage.cartIconNumber.getText();
            initialNumber = parseInt(initialNumberText, 10);
        }

        await SecurePage.addToCartButton.click();
        await browser.pause(1000);

        const newNumberText = await SecurePage.cartIconNumber.getText();
        const newNumber = parseInt(newNumberText, 10);
        expect(newNumber).toEqual(initialNumber + 1);

        await SecurePage.goToCart();

        // Verify the product is present in the cart
        const cartItemName = await CartPage.getCartItemName();
        expect(cartItemName).toBe('Sauce Labs Backpack');
        ///
        await SecurePage.burgerMenuBtn.click();
        const elementsToCheck = [
            SecurePage.navMenu,
            SecurePage.allItems,
            SecurePage.about,
            SecurePage.logout,
            SecurePage.reset,
        ];

        for (const element of elementsToCheck) {
            await expect(element).toBeDisplayed();
        }

        const actualOptionsLength = await SecurePage.getDropdownOptionsLength();
        await expect(actualOptionsLength).toBe(4);

        await SecurePage.logout.click();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        if (LoginPage.isUsernameFilled) {
            throw new Error("Username field is not empty.");
        } else if (LoginPage.isPasswordFilled) {
            throw new Error("Password field is not empty.");
        }

        // Verify the product is present in the cart
        await LoginPage.login('standard_user', 'secret_sauce')
        await SecurePage.goToCart();

        expect(cartItemName).toBe('Sauce Labs Backpack');

        await CartPage.removeButton.click()
    })

    it('006 should sorting', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');
        await expect(browser).toHaveUrlContaining('inventory');
        await SecurePage.filterIcon.click();
    
        const sortingOptions = [
            { filter: SecurePage.filterAZ, type: 'name', order: 'asc' },
            { filter: SecurePage.filterZA, type: 'name', order: 'desc' },
            { filter: SecurePage.filterPriceLH, type: 'price', order: 'asc' },
            { filter: SecurePage.filterPriceHL, type: 'price', order: 'desc' }
        ];
    
        for (const { filter, type, order } of sortingOptions) {
            await SecurePage.filterIcon.click();
            await filter.click();
    
            if (type === 'name') {
                const items = await SecurePage.inventoryItemNames;
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
    
            } else if (type === 'price') {
                const prices = await SecurePage.listPrices;
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
        await LoginPage.login('standard_user', 'secret_sauce') 

        for (const { name, icon, urlPart } of socialMediaLinks) {

            const originalWindow = await browser.getWindowHandle();

            await FooterPage.clickIcon(icon)

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
            
        });


    it('008 should Valid Checkout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce')
        await expect(browser).toHaveUrlContaining('inventory');
        await expect($('[data-test="title"]')).toHaveTextContaining('Products');
        await (await $('#inventory_container')).waitForDisplayed()
        // await browser.pause(1000);

        //Verify the number near the cart at the top right increase by 1
        let initialNumber = 0;
        if (await SecurePage.cartIconNumber.isDisplayed()) {
            const initialNumberText = await SecurePage.cartIconNumber.getText();
            initialNumber = parseInt(initialNumberText, 10);
        }
        
        // await SecurePage.addToCartButton.waitForDisplayed();
        await SecurePage.addToCartButton.click();
        await browser.pause(1000);

        await expect(SecurePage.cartIconNumber).toBeDisplayed();

        const newNumberText = await SecurePage.cartIconNumber.getText();
        const newNumber = parseInt(newNumberText, 10);
        expect(newNumber).toEqual(initialNumber + 1);
        await browser.pause(1000);

        // Verify the product is present in the cart
        await SecurePage.goToCart();
        await expect(SecurePage.title).toHaveTextContaining('Your Cart');
        const cartItemName = await CartPage.getCartItemName();
        expect(cartItemName).toBe('Sauce Labs Backpack');

        await CartPage.checkoutButton.click();
        await CheckoutPage.CheckoutInformation('first-name', 'last-name', '00153')
        await expect(browser).toHaveUrlContaining('checkout-step-two.html');
        await expect(SecurePage.title).toHaveTextContaining('Checkout: Overview');
        
        // Compare the prices
        const subtotalPrice = await CheckoutPage.getSubtotalPrice();
        const inventoryPrice = await SecurePage.getInventoryItemPrice();

        expect(subtotalPrice).toBe(inventoryPrice);
        await CheckoutPage.finishButton.click();

        await expect(browser).toHaveUrlContaining('checkout-complete.html');
        await expect(CheckoutPage.checkoutCompleteMessage)
                .toHaveTextContaining('Thank you for your order!')

        await CheckoutPage.backHomeButton.click();

        await expect(browser).toHaveUrlContaining('inventory');
        await expect(SecurePage.title).toHaveTextContaining('Products');
        await SecurePage.verifyProductsDisplayed();

        await SecurePage.goToCart();
        await expect(browser).toHaveUrlContaining('cart.html');

        const isEmpty = await CartPage.isCartEmpty();
        expect(isEmpty).toBe(true);
    })

    it('009 should not Checkout without products in Card', async () => {
        await LoginPage.login('standard_user', 'secret_sauce')
        await expect(browser).toHaveUrlContaining('inventory');

        await SecurePage.goToCart();
        await expect(browser).toHaveUrlContaining('cart.html');

        const isEmpty = await CartPage.isCartEmpty();
        expect(isEmpty).toBe(true, 'Cart is not empty');

        await CartPage.checkoutButton.click();
        await expect(browser).toHaveUrlContaining('cart.html');
        
        await expect(CartPage.errorButton).toHaveTextContaining('Cart is empty')
    })
})

