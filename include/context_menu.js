function contextMenuOnClick(info, t) {
    chrome.tabs.create({url: "main.html#" + info.selectionText});
}
//右键菜单
var id = chrome.contextMenus.create({"title": "商安卫士 · 商战雷达", "contexts":["selection"], "onclick": contextMenuOnClick});
