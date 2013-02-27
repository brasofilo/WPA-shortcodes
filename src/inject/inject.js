// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.QJ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


// the guts of this userscript
function main() {
  	// Note, QJ replaces $ to avoid conflicts.
  	//alert("There are " + jQ('a').length + " links on this page.");
  
	var Singleton =(function(){
		var instantiated;
		var that = this;
		function init (){
			// all singleton code goes here
			return {
				add_autolink:function(){
					QJ(".comment-help-link").each(function(){
					    if (QJ(this).next().attr('class') != 'shortcode')
					      	QJ(this).after('| <a class="shortcode" href="#">ShortCodes</a>');
					});
				   	QJ(".shortcode").on('click',function(event){
					    event.preventDefault();
					    instantiated.translate_shortcodes(QJ(this));
					    return false;
					});
				},
				translate_shortcodes:function(el){
					var comel = null;
					QJ(el).parent().prev().children().each(function(){
						if (QJ(this).attr('name') == "comment")
					  		comel = QJ(this);
					});
					if (comel != null){
						var com = QJ(comel).val();
						com = instantiated.shortcode_handler(com);
						QJ(comel).val(com);
					}
				},
				shortcode_handler:function(str){
					if(localStorage && localStorage.getItem('wpa_settings')){
	                    var storedNames = JSON.parse(localStorage.getItem('wpa_settings'));
	                    $.each(storedNames,function( key,value ) {
	                        val = value.split(";");
	                        var tag = val[0];
	                        var tval = val[1];
	                        str = instantiated.replaceall(tag,tval,str);
	                    });
	                }
	  				return str;
	  			},
	  			replaceall: function(find, replace, str) {
                	return str.replace(new RegExp(find, 'g'), replace);
            	},
				publicProperty:2
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
    	//add_autolink();
    	Singleton.getInstance().add_autolink();
  	}); 
}



chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// ----------------------------------------------------------
		addJQuery(main);
		// load jQuery and execute the main function
		
	}
	}, 10);
});