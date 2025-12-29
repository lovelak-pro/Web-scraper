document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("result");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      resultDiv.innerHTML = '<div class="empty-state">Error: ' + chrome.runtime.lastError.message + '</div>';
      return;
    }
    if (!tabs || tabs.length === 0) {
      resultDiv.innerHTML = '<div class="empty-state">No active tab found.</div>';
      return;
    }
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
        if (chrome.runtime.lastError) {
          resultDiv.innerHTML = '<div class="empty-state">Could not scan this page. ' + chrome.runtime.lastError.message + '</div>';
          return;
        }
        if (!injectionResults || !injectionResults[0] || !injectionResults[0].result) {
          resultDiv.innerHTML = '<div class="empty-state">Could not scan this page.</div>';
          return;
        }
        const result = injectionResults[0].result;
        const emails = result.emails || [];
        const phones = result.phones || [];
        // Combine and filter
        let results = emails.concat(phones);
        if (filter) {
          results = results.filter((item) =>
            item.toLowerCase().includes(filter)
          );
        }
        if (results.length > 0) {
          // Create copy all button
          const copyAllBtn = document.createElement("button");
          copyAllBtn.className = "copy-all-btn";
          copyAllBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1V14a1 1 0 0 1-1V3.5a1 1 0 0 1-1V2H4z"/>
              <path d="M2 1.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1v1H2z"/>
            </svg>
            Copy All
          `;
          copyAllBtn.title = "Copy all items to clipboard (line by line)";
          
          // Add click event to copy all items
          copyAllBtn.addEventListener("click", async () => {
            const allText = results.join("\n");
            try {
              await navigator.clipboard.writeText(allText);
              // Visual feedback
              const originalHTML = copyAllBtn.innerHTML;
              copyAllBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Copied!
              `;
              copyAllBtn.style.color = "#48bb78";
              
              setTimeout(() => {
                copyAllBtn.innerHTML = originalHTML;
                copyAllBtn.style.color = "";
              }, 2000);
            } catch (err) {
              // Fallback for older browsers
              const textArea = document.createElement("textarea");
              textArea.value = allText;
              textArea.style.position = "fixed";
              textArea.style.opacity = "0";
              document.body.appendChild(textArea);
              textArea.select();
              try {
                document.execCommand("copy");
                const originalHTML = copyAllBtn.innerHTML;
                copyAllBtn.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  Copied!
                `;
                copyAllBtn.style.color = "#48bb78";
                
                setTimeout(() => {
                  copyAllBtn.innerHTML = originalHTML;
                  copyAllBtn.style.color = "";
                }, 2000);
              } catch (fallbackErr) {
                console.error("Failed to copy:", fallbackErr);
              }
              document.body.removeChild(textArea);
            }
          });
          
          // Format results as an ordered list
          const list = document.createElement("ol");
          results.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.title = "Click to copy";
            
            // Store original text for restoration
            const originalText = item;
            const checkmarkSVG = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            `;
            
            // Add click event to copy to clipboard
            li.addEventListener("click", async () => {
              try {
                await navigator.clipboard.writeText(item);
                // Visual feedback
                li.innerHTML = checkmarkSVG + "Copied!";
                li.style.color = "#48bb78";
                li.style.fontWeight = "600";
                
                setTimeout(() => {
                  li.textContent = originalText;
                  li.style.color = "";
                  li.style.fontWeight = "";
                }, 1500);
              } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = item;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.select();
                try {
                  document.execCommand("copy");
                  li.innerHTML = checkmarkSVG + "Copied!";
                  li.style.color = "#48bb78";
                  li.style.fontWeight = "600";
                  
                  setTimeout(() => {
                    li.textContent = originalText;
                    li.style.color = "";
                    li.style.fontWeight = "";
                  }, 1500);
                } catch (fallbackErr) {
                  console.error("Failed to copy:", fallbackErr);
                }
                document.body.removeChild(textArea);
              }
            });
            
            list.appendChild(li);
          });
          resultDiv.innerHTML = "";
          resultDiv.appendChild(copyAllBtn);
          resultDiv.appendChild(list);
        } else {
          resultDiv.innerHTML = '<div class="empty-state">No matches found.</div>';
        }
      }
    );
  });
});
