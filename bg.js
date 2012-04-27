var tabnumber = 0;
var maxtabs = 20; //hardcoded default max tabs

var activated = true;
var fornow = localStorage["check"];

if(fornow != null) { 
	activated = fornow == 'true'; //check if the localstorage has an entry for the extension to be enabled
}

var mx = localStorage["max_tabs"]

if(mx!=null){
	maxtabs = parseInt(mx); //parse int from max tabs in localstorage
}

chrome.windows.getAll({"populate":true},function(windows) {
	var sum = 0;
	for(var i = 0; i < windows.length; i++) {
		sum+=windows[i].tabs.length;
	}	
	tabnumber=sum;
	chrome.browserAction.setBadgeText({"text":tabnumber + ""}); //lazy string conversion method
});

chrome.tabs.onCreated.addListener(function(tab) { 
	tabnumber++;
	chrome.browserAction.setBadgeText({"text":tabnumber +""});
 	if(tabnumber > maxtabs && activated) {
		chrome.tabs.remove(tab.id);
		var notification = webkitNotifications.createNotification(
		'icon.png',  // icon url - can be relative
		'Alert',  // notification title
		'Tab limit exceeded.'  // notification body text
		);
		notification.show();
	}
});
 
chrome.extension.onConnect.addListener(function(port) { //listen to main page for changes in max tab limit & whether the extension is enabled, a simpler alternative could be reading from localstorage again
	port.onMessage.addListener(function(msg) {
		if(msg.max != null) {
			maxtabs = parseInt(msg.max);
		}
		if(msg.check != null) {
			activated = msg.check;
		}		
	});
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	tabnumber--;
	chrome.browserAction.setBadgeText({"text":tabnumber +""});
});