# Tweakers Pricewatch to Knibble

A user-script that replaces the Tweakers Pricewatch button with a link to Knibble. This allows users to quickly access Knibble's price comparison features directly from Tweakers.net. Reason/context is here: <https://gathering.tweakers.net/forum/list_messages/2325310>. A lot of Tweakers, including me, are not satisfied with how critics have been ignored for the most part. The slide-in is hard to work with and doesn't make much sense from a UX-perspective, even after the small changes. Future plans are also not sufficient for me. Reason for me to look for something else. I then found Knibble. Just as detailed, but offers many more product categories as well.

## Installation

### Prerequisites

- A userscript manager browser extension:
  - [ScriptCat](https://scriptcat.org/) (Recommended)
  - [Violentmonkey](https://violentmonkey.github.io/)
  - [Tampermonkey](https://www.tampermonkey.net/)

### Steps

1. **Install a userscript manager** (if not already installed)

2. **Install the script**
   - Open the raw script file: [tweakers-to-knibble.user.js](tweakers-to-knibble.user.js)
   - Import it into your userscript manager

3. **Verify installation**
   - Visit [https://tweakers.net/](https://tweakers.net/)
   - The Pricewatch button should now redirect to [https://knibble.nl/](https://knibble.nl/) when clicked
   - Clicking the button will open Knibble in a new tab

## Features

- Modifies the existing Pricewatch button to redirect to Knibble
- Opens Knibble in a new tab (preserves current page)
- Works on all Tweakers.net pages
- Handles dynamically loaded content

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
