# Tweakers Pricewatch to Knibble

A user-script that replaces the Tweakers Pricewatch button with a link to Knibble.

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
