# Email & Phone No Scraper Chrome Extension

I made this simple Chrome extension that extracts and displays all email addresses and phone numbers from the currently open website. You can filter results by searching a website and adding a filter string in quotes (e.g., `yourwebsite.com "+(country-code)"` or `yourwebsite.com "@gmail.com"`). The extension automatically scans the page and shows the filtered results in a clean, ordered list.

---

## Features

- Extracts all email addresses and phone numbers from any webpage.
- Automatically filters results based on a quoted string in your search (e.g., `"+(country-code)"` or `"@gmail.com"`).
- Clean, user-friendly and ordered results.
- No buttons or inputs just open the popup to see results.

---

## Screenshots
**Version 0.0.1**  
## ![Screenshot](assets/Screenshot%20v0.0.1.png) 
**Version 0.1.1** 
## ![Screenshot](assets/Screenshot%20v0.1.1.png)

## How to Use

1. **Install the Extension**

   - Download or clone this repository.
   - Go to `chrome://extensions/` in your Chrome browser.
   - Enable "Developer mode" (top right).
   - Click "Load unpacked" and select the extension folder.

2. **Extract Data**
   - In Chrome, search for a website and add your filter in quotes.  
     **Example:**
     - `yourwebsite.com "+(country-code)"` (to find phone numbers starting with +(country-code))
     - `yourwebsite.com "@gmail.com"` (to find Gmail addresses)
   - Open the extension popup by clicking its icon.
   - The popup will display all matching emails and phone numbers in an ordered list.

---

## Example

```
1. user1@gmail.com
2. user2@gmail.com
3. +(country-code) 300 1234567
4. +(country-code) 301 1234567
```

---

## How It Works

- The extension scans the visible text of the current tab for email addresses and phone numbers.
- It looks for a quoted filter string in the tab's title or URL.
- Only results containing the filter string are shown in the popup.
- Results are displayed as a styled, ordered list for easy reading.

---

## Disclaimer

This extension is intended for educational and personal use only.  
**Do not use it for spamming, scraping private data, or any illegal activities.**  
Always respect websites terms of service and privacy policies.

---

## Credits

Developed and maintained by [**lovelak**](http://lovelak.rf.gd).

---
