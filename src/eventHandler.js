// 监听扩展图标的点击事件
chrome.action.onClicked.addListener(() => {
  const fixedUrl = "index.html";
  chrome.tabs.create({ url: chrome.runtime.getURL(fixedUrl) });
});
