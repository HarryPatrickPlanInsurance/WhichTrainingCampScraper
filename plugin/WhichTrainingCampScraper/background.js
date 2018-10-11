chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
	  console.log(tab.url);
	  if(tab.url){
		  console.log(tab.url);
		if(tab.url=='http://whichtrainingcamp.com/'||tab.url=='http://www.whichtrainingcamp.com/')
		{
			console.log('inject');
			chrome.tabs.executeScript(tab.ib, {
			file: 'inject.js'
			});
		}  
	}
  }
});
console.log('hi');