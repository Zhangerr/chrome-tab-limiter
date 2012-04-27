var tabnumber = 0;
var maxtabs = 20;

var activated = true;
var fornow = localStorage["check"];
if(fornow != null) {
	activated = fornow == 'true';
}
var mx = localStorage["max_tabs"]
if(mx!=null){
	maxtabs = parseInt(mx);
}
console.log(maxtabs);
 chrome.windows.getAll({"populate":true},function(windows) {
 var sum = 0;
 for(var i = 0; i < windows.length; i++) {
	sum+=windows[i].tabs.length;
	}
	
tabnumber=sum;
 chrome.browserAction.setBadgeText({"text":tabnumber +""});
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

  /*chrome.tabs.create({
          'url':'https://chrome.google.com/webstore',
          'selected':true
        });*/
 });
chrome.extension.onConnect.addListener(function(port) {

  port.onMessage.addListener(function(msg) {
    if(msg.max != null) {
		maxtabs = parseInt(msg.max);
		//console.log(typeof maxtabs);
	}
	if(msg.check != null) {
		activated = msg.check;
	//	console.log(activated);
	}
	
	
  });
});
 chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
 tabnumber--;
  chrome.browserAction.setBadgeText({"text":tabnumber +""});
 });