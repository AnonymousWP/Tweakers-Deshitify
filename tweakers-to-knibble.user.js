// ==UserScript==
// @author       Anonymoussaurus/AnonymousWP
// @name         Tweakers Pricewatch to Knibble
// @namespace    https://github.com/AnonymousWP/Tweakers-Pricewatch-to-Knibble/
// @updateURL    https://raw.githubusercontent.com/AnonymousWP/tweakers-to-knibble/main/tweakers-to-knibble.user.js
// @downloadURL  https://raw.githubusercontent.com/AnonymousWP/tweakers-to-knibble/main/tweakers-to-knibble.user.js
// @supportURL   https://github.com/AnonymousWP/Tweakers-Pricewatch-to-Knibble/issues
// @version      1.0.4
// @description  Replaces the Tweakers Pricewatch button with a link to Knibble. This script modifies the existing Pricewatch button to redirect users to Knibble instead, without adding new buttons or elements to the page. It ensures that the original button's functionality is overridden.
// @match        https://*.tweakers.net/*
// @license      GPL-3.0
// ==/UserScript==

(function() {
    'use strict';

    const KNIBBLE_URL = 'https://knibble.nl';

    /**
     * Modifies all Pricewatch buttons to redirect to Knibble
     */
    function modifyPricewatchButton() {
        let found = false;

        // Most specific selector - the exact link in the main menu
        const exactButtons = document.querySelectorAll('a[href="https://tweakers.net/pricewatch/"]');
        if (exactButtons.length > 0) {
            exactButtons.forEach(button => {
                replaceButtonBehavior(button);
                found = true;
            });
            return found;
        }

        // Also check for www variant
        const wwwButtons = document.querySelectorAll('a[href="https://www.tweakers.net/pricewatch/"]');
        if (wwwButtons.length > 0) {
            wwwButtons.forEach(button => {
                replaceButtonBehavior(button);
                found = true;
            });
            return found;
        }

        return found;
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
