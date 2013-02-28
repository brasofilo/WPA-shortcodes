chrome.extension.onMessage.addListener(
  	function(request, sender, sendResponse) {
  		if (request.action = "getdata"){
  			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			    chrome.tabs.sendMessage(
			    	tabs[0].id, 
			    	{action: "saved_data",data:localStorage.getItem('wpa_settings')}, 
			    	function(response) {}
			    );  
			});
  		}
  		sendResponse({});
  	}
);