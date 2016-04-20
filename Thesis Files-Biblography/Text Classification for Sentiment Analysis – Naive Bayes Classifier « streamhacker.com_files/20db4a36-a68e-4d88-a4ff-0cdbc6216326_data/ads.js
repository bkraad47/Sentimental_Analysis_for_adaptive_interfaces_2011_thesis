function load_adverts(id) {
    var req = new Xhr('/ads/' + id + '.json', {
        async: false,
        method: 'get',
    }).send();

    return req.json;
}


// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

function change_advert(i, ad) {
    var block = $('advert-' + i);

    if(block) {
        var out = tmpl("ad_tmpl", {advert: ad});
        block.update(out);
        block.show();
        return true;
    } else {
        return false;
    }
}


function rotate_adverts(ads) {
    var height = window.innerHeight;
    var powered_by = $('powered_by').size().y + 10;

    for(i = 1; i < ads.length; i++) {
        if(height > powered_by) { 
            var ad_i = Math.floor(Math.random()*ads.length);

            change_advert(i, ads[ad_i]);

            var block = $('advert-' + i);
            height -= block.size().y;
        } else {
            block.hide();
        }
    }
}

function start_periodic(ads) {
    var rotator = function() { rotate_adverts(ads); };
    rotator();
    rotator.periodical(120000);
}
