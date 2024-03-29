export const getTabId = async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  return tab[0].id;
};
