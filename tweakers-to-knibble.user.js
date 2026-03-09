// ==UserScript==
// @name         Tweakers Pricewatch to Knibble
// @namespace    https://github.com/AnonymousWP/tweakers-to-knibble
// @version      1.0.0
// @description  Replaces the Tweakers Pricewatch button with a link to Knibble
// @author       Anonymoussaurus/AnonymousWP
// @match        *://tweakers.net/*
// @match        *://www.tweakers.net/*
// @license      GPL-3.0
// ==/UserScript==

(function() {
    'use strict';

    const KNIBBLE_URL = 'https://knibble.nl';

    /**
     * Modifies the Pricewatch button to redirect to Knibble
     */
    function modifyPricewatchButton() {
        // Most specific selector first - the exact link in the main menu
        const exactButton = document.querySelector('a[href="https://tweakers.net/pricewatch/"]');
        if (exactButton) {
            replaceButtonBehavior(exactButton);
            return true;
        }

        // Fallback to other selectors if needed
        const selectors = [
            'a[href*="/pricewatch/"]',
            'button[data-action="pricewatch"]',
            'a[data-action="pricewatch"]',
            'button.pricewatch',
            'a.pricewatch'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                replaceButtonBehavior(element);
                return true;
            }
        }

        return false;
    }

    /**
     * Replaces the button's behavior to open Knibble in a new tab
     * @param {Element} button - The button element to modify
     */
    function replaceButtonBehavior(button) {
        // Safety check - ensure button is still in the DOM
        if (!button || !button.parentNode) {
            return;
        }

        // Modify the element to redirect to Knibble
        button.href = KNIBBLE_URL;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.textContent = 'Knibble';
        button.onclick = null;

        // Add click handler to open Knibble in new tab
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.open(KNIBBLE_URL, '_blank', 'noopener,noreferrer');
        });
    }

    /**
     * Initialize the script
     */
    function init() {
        // Modify existing buttons on page load
        modifyPricewatchButton();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run after a short delay as fallback for pages that modify DOM quickly
    setTimeout(init, 1000);
})();
