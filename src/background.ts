// Background script for Chrome extension

async function sendMessageToTab(tabId: number, message: any) {
  try {
    console.log('Background: Sending message to tab', tabId, message);
    const response = await chrome.tabs.sendMessage(tabId, message);
    console.log('Background: Got response from content script', response);
    return response;
  } catch (error) {
    // Content script might not be loaded yet
    console.warn('Background: Content script not ready:', error);
    console.warn('Background: Make sure you\'re on a Notion page and the extension is properly loaded');
  }
}

chrome.commands.onCommand.addListener(async (command: string) => {
  if (command !== 'toggle-presentation') return;
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  if (!tab?.id) return;
  await sendMessageToTab(tab.id, { type: 'TOGGLE_PRESENTATION' });
});

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  console.log('Background: Extension icon clicked, tab:', tab);
  if (!tab?.id) {
    console.error('Background: No tab ID available');
    return;
  }
  
  // Check if we're on a Notion page
  if (!tab.url || (!tab.url.includes('notion.so') && !tab.url.includes('notion.site'))) {
    console.warn('Background: Not on a Notion page:', tab.url);
    return;
  }
  
  console.log('Background: Sending toggle message to tab', tab.id);
  await sendMessageToTab(tab.id, { type: 'TOGGLE_PRESENTATION' });
});