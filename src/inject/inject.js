function main() {
	window.QJ=jQuery.noConflict(true);
  	// Note, QJ replaces $ to avoid conflicts.
  	//alert("There are " + jQ('a').length + " links on this page.");
  	
	var Singleton =(function(){
		var instantiated;
		var that = this;
		var str = '';
		var saved;
		var el;
		function init (){
			// all singleton code goes here
			return {
				add_autolink:function(){
					QJ(".comment-help-link").each(function(){
					    if (QJ(this).next().attr('class') != 'shortcode')
					      	QJ(this).after('| <a class="shortcode" href="#">ShortCodes</a><img class="workingIMG" src="'+chrome.extension.getURL("src/loading.gif")+'" style="display:none"> | <a class="shortcodeoptions" href="#">settings</a>');
					});
				   	QJ(".shortcode").on('click',function(event){
					    event.preventDefault();
					    QJ(this).next().show();
					    instantiated.translate_shortcodes(QJ(this));
					    return false;
					});
					QJ(".shortcodeoptions").on('click',function(event){
					    event.preventDefault();
					    window.open(chrome.extension.getURL("src/options_custom/index.html"));
					    return false;
					});
				},
				translate_shortcodes:function(ele){
					var comel = null;
					QJ(ele).parent().prev().children().each(function(){
						if (QJ(this).attr('name') == "comment")
					  		comel = QJ(this);
					});
					if (comel != null){
						instantiated.el = comel;
						instantiated.str = QJ(comel).val();
						instantiated.load_saved();
					}
				},
				shortcode_handler:function(){
					var storedNames = JSON.parse(instantiated.saved);
					var tmp = instantiated.str;
                    QJ.each(storedNames,function( key,value ) {
                        val = value.split(";");
                        var tag = val[0];
                        var tval = val[1];
                        tmp = instantiated.replaceall(tag,tval,tmp);
                    });
					QJ(instantiated.el).val(tmp);
					QJ(".workingIMG").hide();
	  			},
	  			replaceall: function(find, replace, str) {
	  				var reg = new RegExp(find, 'g');
	  				find = '[' + find + ']';
                	return str.replace(find, replace);
            	},
            	load_saved: function(){
            		if (!instantiated.saved){
            			chrome.extension.sendMessage({action: 'getdata'}, function(response) {});
            		}else{
            			instantiated.shortcode_handler();
            		}
            	},
            	set_saved: function(val){
            		instantiated.saved = val;
            	},
            	log: function(m){
            		console.log(m);
            	}
			}
		}
	 
		return {
			getInstance :function(){
				if (!instantiated){
					instantiated = init();
				}
				return instantiated; 
			}
		}
	})();

  	QJ(".comments-link").on('click',function(){
    	setTimeout(function(){Singleton.getInstance().add_autolink();},500);
  	});
  	chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	  	if (msg.action == 'saved_data') {
	    	Singleton.getInstance().set_saved(msg.data);
	    	Singleton.getInstance().shortcode_handler();
	  	}
	});
}



chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			// ----------------------------------------------------------
			main();
		}
	}, 10);
});
