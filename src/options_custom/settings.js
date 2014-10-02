/**
 * Get url query var
 * http://stackoverflow.com/a/901144/1287812
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var currentSite = getParameterByName('site');
if( currentSite ) {
	document.write("<link rel='shortcut icon' href='http://cdn.sstatic.net/"+currentSite+"/img/favicon.ico'>");
	document.write("<link rel='stylesheet' href='http://cdn.sstatic.net/"+currentSite+"/all.css' type='text/css'>");
}
else {
	document.write("<link rel='shortcut icon' href='" + chrome.extension.getURL("icons/icon19.png") + "'>");
	document.write("<link rel='stylesheet' href='http://cdn.sstatic.net/wordpress/all.css' type='text/css'>");
}

/**
 * Instantiate comment shortcode
 */
var dynamic = (function(){
    var instantiated;
    function init (){
        // all singleton code goes here
        return {
            add: function(){
                instantiated.count = instantiated.count +1;
                instantiated.addShortcode();
            },
            remove: function(el){
                $(el).parent().remove();
                instantiated.count = instantiated.count +1;
            },
            addShortcode: function(tag,tval){
                tag = tag || '';
                tval = tval || '';
                var html = '<div class="shortcode"><label>Name&nbsp;&nbsp;&nbsp;<input type="text" name="sh[counter][tagname]" value="'+tag+'" placeholder="Don\'t add brackets here"></label><br /><label>Content<textarea name="sh[counter][tagvalue]" cols="68" rows="3" placeholder="It\' possible to add SE magic links here">'+tval+'</textarea></label><input type="submit" value="Remove shortcode" class="remove"></div>';
                $("#mainfrom").append(instantiated.replaceall('counter',instantiated.count,html));
            },
            replaceall: function(find, replace, str) {
                return str.replace(new RegExp(find, 'g'), replace);
            },
            save_options: function() {
                var save = new Array();
                var c = 0;
                $(".shortcode").each(function(){
                    var key = $(this).find('input[type="text"]').val();
                    var val = $(this).find('textarea').val();
                    save[c] = key+ ";" + val;
                    c++;
                });
                localStorage.wpa_settings = JSON.stringify(save);
                
                // Update status to let user know options were saved.
                $('#save').attr('value', "Options Saved" );
                setTimeout(function() {
                    $('#save').attr('value',"Save Settings");
                }, 750);
            },
            load_saved: function(){
                if(localStorage && localStorage.getItem('wpa_settings')){
                    var storedNames = JSON.parse(localStorage.getItem('wpa_settings'));
                    $.each(storedNames,function( key,value ) {
                        val = value.split(";");
                        var tag = val[0];
                        var tval = val[1];
                        instantiated.addShortcode(tag,tval);
                    });
                }
            },
            count: 0
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

$(function () {
    $('#hlogo a').text(getParameterByName('site'));
    dynamic.getInstance().load_saved();
    $("#btnAdd").click(function(){
        dynamic.getInstance().add()
    });
    $("#mainfrom").on('click',".remove",function(){
        dynamic.getInstance().remove($(this));
    });
    $("#save").on('click',function(){
        dynamic.getInstance().save_options();
    });
});
