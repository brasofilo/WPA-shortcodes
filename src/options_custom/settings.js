// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

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
                var html = '<div class="shortcode"><label>Tag Name<input type="text" name="sh[counter][tagname]" value="'+tag+'"></label><br /><label>Tag Value<textarea name="sh[counter][tagvalue]" cols="68" rows="3">'+tval+'</textarea></label><input type="submit" value="Remove shortcode" class="remove"></div>';
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
                var status = document.getElementById("status");
                status.innerHTML = "Options Saved.";
                setTimeout(function() {
                    status.innerHTML = "";
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