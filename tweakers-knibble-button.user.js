// ==UserScript==
// @name         Tweakers Pricewatch to Knibble
// @author       Anonymoussaurus/AnonymousWP
// @namespace    https://github.com/AnonymousWP/Tweakers-Deshitify/
// @homepageURL  https://github.com/AnonymousWP/Tweakers-Deshitify
// @updateURL    https://raw.githubusercontent.com/AnonymousWP/Tweakers-Deshitify/master/tweakers-knibble-button.user.js
// @downloadURL  https://raw.githubusercontent.com/AnonymousWP/Tweakers-Deshitify/master/tweakers-knibble-button.user.js
// @supportURL   https://github.com/AnonymousWP/Tweakers-Deshitify/issues
// @version      2.0.1
// @description  Adds a Knibble button next to the Tweakers Pricewatch button.
// @match        https://*.tweakers.net/*
// @run-at       document-start
// @icon         https://tweakers.net/favicon.ico
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const KNIBBLE_URL = 'https://knibble.nl';
    // Exact hrefs of the main Pricewatch nav link (not sub-pages like /deals/)
    const PRICEWATCH_SELECTORS = [
        'a[href="https://tweakers.net/pricewatch/"]',
        'a[href="https://www.tweakers.net/pricewatch/"]',
    ];

    /**
     * Queries for Pricewatch links inside a given root (document or shadowRoot)
     */
    function findPricewatchLinks(root) {
        return PRICEWATCH_SELECTORS.flatMap(sel => Array.from(root.querySelectorAll(sel)));
    }

    /**
     * Runs addKnibbleButton against both the light DOM and every twk-site-menu shadow root
     */
    function addKnibbleButton() {
        findPricewatchLinks(document).forEach(insertKnibbleButton);

        // The nav may also live inside a <twk-site-menu> shadow root
        document.querySelectorAll('twk-site-menu').forEach(el => {
            if (el.shadowRoot) {
                findPricewatchLinks(el.shadowRoot).forEach(insertKnibbleButton);
            }
        });
    }

    /**
     * Attaches a MutationObserver to a shadow root so we catch re-renders inside it
     */
    function watchShadowRoot(el) {
        if (!el.shadowRoot || el.dataset.knibbleWatched) return;
        el.dataset.knibbleWatched = 'true';
        new MutationObserver(() => {
            findPricewatchLinks(el.shadowRoot).forEach(insertKnibbleButton);
        }).observe(el.shadowRoot, { childList: true, subtree: true });
    }

    /**
     * Clones the <li> containing the Pricewatch anchor and inserts a Knibble <li> after it.
     * The nav only renders the first <a> inside each <li>, so we must insert at <li> level.
     */
    function insertKnibbleButton(anchor) {
        if (!anchor || !anchor.parentNode) return;

        // Walk up to the enclosing <li> (the nav item container)
        const li = anchor.closest('li');
        if (!li || !li.parentNode) return;

        // Deduplication: skip if the next sibling <li> is already our Knibble item
        const nextLi = li.nextElementSibling;
        if (nextLi && nextLi.dataset.knibble === 'true') return;

        // Clone the whole <li> so it inherits all nav classes and attributes
        const knibbleLi = li.cloneNode(true);
        knibbleLi.dataset.knibble = 'true';
        knibbleLi.dataset.linkName = 'Knibble';
        delete knibbleLi.dataset.position;

        // Strip active/current-page state from the cloned <li> and its children
        const activeClasses = ['active', 'current', 'is-active', 'selected', 'isActive'];
        [knibbleLi, ...knibbleLi.querySelectorAll('*')].forEach(el => {
            activeClasses.forEach(cls => el.classList.remove(cls));
            el.removeAttribute('aria-current');
        });

        // Update the inner <a> to point to Knibble
        const knibbleAnchor = knibbleLi.querySelector('a');
        if (knibbleAnchor) {
            knibbleAnchor.href = KNIBBLE_URL;
            knibbleAnchor.target = '_blank';
            knibbleAnchor.rel = 'noopener noreferrer';
            knibbleAnchor.textContent = 'Knibble';
        }

        li.parentNode.insertBefore(knibbleLi, li.nextSibling);
    }

    /**
     * Initialize the script
     */
    function init() {
        addKnibbleButton();

        // Watch the light DOM for structural changes
        new MutationObserver(() => {
            addKnibbleButton();
            document.querySelectorAll('twk-site-menu').forEach(watchShadowRoot);
        }).observe(document.body, { childList: true, subtree: true });

        // Wait for the twk-site-menu custom element to be defined and upgraded,
        // then retry several times to catch its shadow root after it connects
        customElements.whenDefined('twk-site-menu').then(() => {
            [0, 100, 300, 800].forEach(delay => setTimeout(() => {
                addKnibbleButton();
                document.querySelectorAll('twk-site-menu').forEach(watchShadowRoot);
            }, delay));
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
