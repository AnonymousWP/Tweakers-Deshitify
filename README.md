# Tweakers-Deshitify

A collection of userscripts that improve the [Tweakers.net](https://tweakers.net/) Pricewatch experience. Background and context: <https://gathering.tweakers.net/forum/list_messages/2325310>. A lot of Tweakers users, including me, are not satisfied with how criticism of the new Pricewatch UX has largely been ignored. The slide-in is hard to work with and doesn't make sense from a UX perspective, even after the minor changes that were made. Future plans are also not sufficient for me. Reason for me to look for something else. I then found Knibble. Just as detailed as Pricewatch, but offers many more product categories as well. These scripts are my way of taking matters into my own hands.

## Scripts

### 1. Tweakers Pricewatch to Knibble (`tweakers-knibble-button.user.js`)

Adds a [Knibble](https://knibble.nl/) button next to the existing Pricewatch button, giving quick access to Knibble's price comparison directly from Tweakers.net. Knibble is just as detailed as Pricewatch, but covers many more product categories.

#### Features

- Adds a Knibble button next to the existing Pricewatch nav button
- Opens Knibble in a new tab (preserves the current page)
- Works on all Tweakers.net pages
- Handles dynamically loaded content and shadow DOM

**Install:** [tweakers-knibble-button.user.js](https://raw.githubusercontent.com/AnonymousWP/Tweakers-Deshitify/main/tweakers-knibble-button.user.js)

---

### 2. Tweakers PW Inline Specs (`tweakers-inline-specs.user.js`)

Shows all product specifications inline on the Pricewatch product page, without the slide-in panel. The slide-in is suppressed before the first paint and its content is moved into the page body so everything is immediately visible and scrollable.

#### Features

- Displays product specifications inline, eliminating the slide-in entirely
- Specs are visible immediately without any interaction
- Reuses Tweakers' own CSS for a native look and feel
- Works on all Pricewatch product pages

**Install:** [tweakers-inline-specs.user.js](https://raw.githubusercontent.com/AnonymousWP/Tweakers-Deshitify/main/tweakers-inline-specs.user.js)

---

## Installation

### Prerequisites

- A userscript manager browser extension:
  - [ScriptCat](https://scriptcat.org/) (Recommended)
  - [Violentmonkey](https://violentmonkey.github.io/)
  - [Tampermonkey](https://www.tampermonkey.net/)

### Steps

1. **Install a userscript manager** (if not already installed)
2. **Click the install link** for the script(s) you want (see above)
3. **Confirm the install** in your userscript manager

Install one or both scripts — they are fully independent of each other.

## Credits / Inspiration

This project was inspired by the following scripts and community discussions:

- **[tnet-pricewatch-slidein-alternatief](https://github.com/creesch/tnet-pricewatch-slidein-alternatief)** by [creesch](https://github.com/creesch) — a userscript that makes the Tweakers Pricewatch slide-in behave more like regular tabs
- **Tweakers community post** — [gathering.tweakers.net/forum/list_message/84561038](https://gathering.tweakers.net/forum/list_message/84561038#84561038)
- **Tweakers community post** — [gathering.tweakers.net/forum/list_message/84480194](https://gathering.tweakers.net/forum/list_message/84480194#84480194)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
