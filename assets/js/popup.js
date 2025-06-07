document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("result");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    // Try to extract filter from the tab's URL or title (e.g., amazon.com "+92")
    // We'll look for a quoted string in the tab's title or URL
    let filter = "";
    const match = tab.title.match(/"([^"]+)"/) || tab.url.match(/"([^"]+)"/);
    if (match) {
      filter = match[1].toLowerCase();
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          // Scan for emails and phone numbers
          const text = document.body.innerText;
          const emails =
            text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
          const phones = text.match(/\+?\d[\d\s().-]{7,}\d/g) || [];
          return {
            emails: Array.from(new Set(emails)),
            phones: Array.from(new Set(phones)),
          };
        },
      },
      (injectionResults) => {
        if (!injectionResults || !injectionResults[0]) {
          resultDiv.textContent = "Could not scan this page.";
          return;
        }
        let { emails, phones } = injectionResults[0].result;
        // Combine and filter
        let results = emails.concat(phones);
        if (filter) {
          results = results.filter((item) =>
            item.toLowerCase().includes(filter)
          );
        }
        if (results.length > 0) {
          // Format results as an ordered list
          const list = document.createElement("ol");
          results.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
          });
          resultDiv.innerHTML = "";
          resultDiv.appendChild(list);
        } else {
          resultDiv.textContent = "No matches found.";
        }
      }
    );
  });
});
