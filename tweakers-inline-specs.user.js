// ==UserScript==
// @name         Tweakers PW Inline Specs
// @author       AnonymousWP
// @namespace    https://github.com/AnonymousWP/Tweakers-Deshitify/
// @homepageURL  https://github.com/AnonymousWP/Tweakers-Deshitify
// @updateURL    https://raw.githubusercontent.com/AnonymousWP/Tweakers-Deshitify/main/tweakers-inline-specs.user.js
// @downloadURL  https://raw.githubusercontent.com/AnonymousWP/Tweakers-Deshitify/main/tweakers-inline-specs.user.js
// @supportURL   https://github.com/AnonymousWP/Tweakers-Deshitify/issues
// @version      1.0.1
// @description  Shows all product specifications inline on the Pricewatch page, without a slide-in.
// @match        https://tweakers.net/pricewatch/*/*.html
// @run-at       document-start
// @icon         https://tweakers.net/favicon.ico
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /* ─────────────────────────────────────────────────────────────────
       Phase 1 – Suppress slide-in before any paint (document-start).
       Uses visibility/opacity instead of display:none so Tweakers'
       JS still renders the spec content into the hidden element.
    ───────────────────────────────────────────────────────────────── */
    const earlyStyle = document.createElement('style');
    earlyStyle.id = 'twk-inline-specs-hide';
    earlyStyle.textContent = `
        twk-product-detail-page-slide-in {
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            animation: none !important;
            transition: none !important;
        }
    `;
    document.documentElement.appendChild(earlyStyle);

    /* ─────────────────────────────────────────────────────────────────
       CSS for the inline spec wrapper.
       Minimal — the spec group/item styles come from Tweakers' own CSS.
    ───────────────────────────────────────────────────────────────── */
    function injectStyles() {
        if (document.getElementById('twk-inline-specs-style')) return;
        const style = document.createElement('style');
        style.id = 'twk-inline-specs-style';
        style.textContent = `
            .twk-inline-specs-wrapper {
                margin-top: 1rem;
            }

            #section-specifications .toggle-accordions {
                float: right;
            }

            /* ── Spec group (accordion block) ── */
            .twk-inline-specs-wrapper details.spec-group {
                border: 0;
                margin-bottom: .75rem;
            }

            .twk-inline-specs-wrapper summary.spec-group-title {
                display: flex;
                align-items: center;
                list-style: none;
                background: var(--surface-bar-color, #f2f2f2);
                padding: .65rem 1rem;
                font-size: var(--font-size-medium-bold, .875rem);
                font-weight: var(--font-weight-bold, 700);
                color: var(--base-paragraph-text-color, #333);
                cursor: pointer;
                user-select: none;
            }

            /* Suppress browser disclosure triangle */
            .twk-inline-specs-wrapper summary.spec-group-title::marker,
            .twk-inline-specs-wrapper summary.spec-group-title::-webkit-details-marker {
                display: none;
            }

            /* ── Spec list ── */
            .twk-inline-specs-wrapper .spec-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }

            /* ── Spec row — three-column table layout ── */
            .twk-inline-specs-wrapper .spec-item {
                display: grid;
                grid-template-columns: minmax(180px, 1fr) 22px minmax(140px, 1fr);
                align-items: center;
                gap: 1rem;
                padding: .7rem 1rem;
                font-size: var(--font-size-medium, .875rem);
                border-bottom: 1px solid var(--border-base-color, #e0e0e0);
                background: var(--surface-base-color, #fff);
            }

            .twk-inline-specs-wrapper .spec-item:hover {
                background: var(--surface-bar-color, #f2f2f2);
            }

            .twk-inline-specs-wrapper .spec-label {
                font-weight: var(--font-weight-bold, 700);
                color: var(--base-paragraph-text-color, #444);
            }

            .twk-inline-specs-wrapper .spec-info-container {
                display: flex;
                justify-content: center;
                color: var(--icon-secondary-color, #888);
            }

            .twk-inline-specs-wrapper .spec {
                font-weight: normal;
                color: var(--base-paragraph-text-color, #333);
            }

            /* ── Icon colours ── */
            .twk-inline-specs-wrapper twk-icon[name="fa-check"] {
                --icon-color: var(--icon-positive-color, #2e7d32);
            }

            .twk-inline-specs-wrapper twk-icon[name="fa-xmark"] {
                --icon-color: var(--icon-negative-color, #c62828);
            }

            /* ── Narrow screens: stack label above value ── */
            @media (max-width: 640px) {
                .twk-inline-specs-wrapper .spec-item {
                    grid-template-columns: 1fr;
                    gap: .2rem;
                }

                .twk-inline-specs-wrapper .spec-info-container {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /* ─────────────────────────────────────────────────────────────────
       Poll for querySelectorAll matches within `root`.
       Resolves with the NodeList as soon as one or more match,
       rejects after `timeout` milliseconds.
    ───────────────────────────────────────────────────────────────── */
    function waitForElements(selector, root, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            (function poll() {
                const els = root.querySelectorAll(selector);
                if (els.length) return resolve(els);
                if (Date.now() - start > timeout) {
                    return reject(new Error(`Timeout waiting for "${selector}"`));
                }
                requestAnimationFrame(poll);
            })();
        });
    }

    /* ─────────────────────────────────────────────────────────────────
       Wait for the first `selector` match to appear in the document.
       Uses a MutationObserver so it does not busy-poll the whole DOM.
    ───────────────────────────────────────────────────────────────── */
    function waitForElement(selector, timeout = 8000) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            const obs = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { obs.disconnect(); resolve(el); }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => {
                obs.disconnect();
                reject(new Error(`Timeout: "${selector}" not found`));
            }, timeout);
        });
    }

    /* ─────────────────────────────────────────────────────────────────
       Release the scroll-lock and inert state the slide-in imposes
       on the rest of the page when it is active.
    ───────────────────────────────────────────────────────────────── */
    function releaseModalLock(slideIn) {
        if (slideIn) slideIn.removeAttribute('active');
        document.querySelectorAll('[inert]').forEach(el => el.removeAttribute('inert'));
        document.documentElement.classList.remove('modal-open');
    }

    /* ─────────────────────────────────────────────────────────────────
       Main
    ───────────────────────────────────────────────────────────────── */
    async function init() {
        // Find the button that triggers the specs slide-in.
        const triggerBtn =
            document.querySelector('[data-target-section="specifications"]') ||
            document.querySelector('.slide-in-buttons-container button');

        if (!triggerBtn) {
            console.warn('[Inline Specs] Geen "Bekijk alle specificaties"-knop gevonden.');
            return;
        }

        // Find the on-page container for the specifications section.
        const container = document.querySelector(
            '#section-specifications .popular-specs-container'
        );
        if (!container) {
            console.warn('[Inline Specs] Geen .popular-specs-container gevonden.');
            return;
        }

        // Silently open the slide-in (invisible due to early CSS).
        triggerBtn.click();

        // Release any scroll/inert lock on the next tick so the page
        // remains scrollable while the spec content is being loaded.
        setTimeout(() => releaseModalLock(null), 0);

        try {
            // Wait for the slide-in custom element to appear in the DOM.
            const slideIn = await waitForElement('twk-product-detail-page-slide-in');

            // Wait until Tweakers has rendered the spec groups inside the slide-in.
            const specGroups = await waitForElements('details.spec-group', slideIn);

            injectStyles();

            // Build the inline wrapper with deep-cloned spec groups,
            // all collapsed by default (toggle button starts as "Alles openen").
            const wrapper = document.createElement('div');
            wrapper.className = 'twk-inline-specs-wrapper';

            specGroups.forEach(group => {
                const clone = group.cloneNode(true);
                clone.removeAttribute('open');
                wrapper.appendChild(clone);
            });

            // Remove the "Bekijk alle specificaties" button — no longer needed.
            container.querySelector('.slide-in-buttons-container')?.remove();

            // Inject the full spec list.
            container.appendChild(wrapper);

            // Fully close and clean up the slide-in.
            releaseModalLock(slideIn);

            // Hide "Belangrijkste specificaties" — redundant now that the full
            // list is shown inline.
            container.querySelector('.popular-specs-heading')
                ?.style.setProperty('display', 'none', 'important');
            container.querySelector('.popular-specs-list')
                ?.style.setProperty('display', 'none', 'important');

            // ── Toggle button ("Alles openen" / "Alles sluiten") ───────────
            // Repurpose the existing button if Tweakers rendered one,
            // otherwise create a new one and insert it above the spec list.
            let toggleBtn = document.querySelector(
                '#section-specifications .toggle-accordions'
            );
            if (toggleBtn) {
                // Clone to strip any existing Tweakers event listeners.
                const fresh = toggleBtn.cloneNode(true);
                toggleBtn.replaceWith(fresh);
                toggleBtn = fresh;
            } else {
                toggleBtn = document.createElement('button');
                toggleBtn.className = 'toggle-accordions';
                container.insertBefore(toggleBtn, wrapper);
            }

            toggleBtn.textContent = 'Alles openen';
            toggleBtn.addEventListener('click', function () {
                const shouldOpen = this.textContent.trim() === 'Alles openen';
                wrapper.querySelectorAll('details.spec-group').forEach(d => {
                    d.open = shouldOpen;
                });
                this.textContent = shouldOpen ? 'Alles sluiten' : 'Alles openen';
            });

        } catch (err) {
            console.warn('[Inline Specs] Ophalen mislukt:', err.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
