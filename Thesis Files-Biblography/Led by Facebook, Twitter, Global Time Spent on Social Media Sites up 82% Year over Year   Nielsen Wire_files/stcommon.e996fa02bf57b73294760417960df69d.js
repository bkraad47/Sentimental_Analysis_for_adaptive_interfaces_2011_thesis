

/******************CONSOLE*********************/
if (!window.console || !console.firebug) {
	var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd",
				 "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	window.console = {};
	for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {};
}

/******************SUPPORTED*******************/

var _all_services = {
		seven_live_seven : {title : '7Live7'},
		a1_webmarks: {title: 'A1 Webmarks'},
		adfty: {title: 'Adfty'},
		allvoices: {title:'Allvoices'},
		amazon_wishlist: {title:'Amazon Wishlist'},
		arto: {title:'Arto'}, 
		baidu: {title: 'Baidu'},
		bebo : {title : 'Bebo'},
		blinklist : {title : 'Blinklist'},
		blip: {title: 'Blip'},
		blogmarks : {title : 'Blogmarks'},
		blogged:  {title: 'Blogged'},
		blogger : {title : 'Blogger',type : 'post'},
		brainify: {title:"Brainify"},
		buddymarks: {title: 'BuddyMarks'},
		bus_exchange : {title : 'Add to BX',aTitle : 'Business Exchange'},
		care2 : {title : 'Care2'},
		chiq : {title:'chiq'},
		citeulike : {title : 'CiteULike'},
		chiq : {title : 'chiq'},
		connotea: {title: 'Connotea'},
		corank: {title: 'coRank'},
		corkboard: {title: 'Corkboard'},
		current : {title : 'Current'},
		dealsplus : {title : 'Dealspl.us'},
		delicious : {title : 'Delicious'},
		digg : {title : 'Digg'},
		diigo : {title : 'Diigo'},
		dotnetshoutout: {title:'.net Shoutout'},
		dzone: {title: 'DZone'},
		edmodo : {title : 'Edmodo'},
		email : {title : 'Email'},
		evernote: {title:'Evernote'},
		facebook : {title : 'Facebook'},
		fark : {title : 'Fark'},
		fashiolista: {title:'Fashiolista'},
		faves : {title : 'Faves'},
		folkd:{title:'folkd.com'},
		formspring : {title : 'Formspring'},
		fresqui : {title : 'Fresqui'},
		friendfeed : {title : 'FriendFeed'},
		friendster: {title:'Friendster'},
		funp : {title : 'Funp'},
		fwisp: {title:'fwisp'},
		google: {title: 'Google'},
		google_bmarks : {title : 'Bookmarks'},
		google_reader: {title: 'Google Reader'},
		google_translate: {title: 'Google Translate'},
		hadash_hot: {title: "Hadash Hot"},
		hatena: {title:'Hatena'},
		hyves: {title:"Hyves"},
		identi: {title: 'identi.ca'},
		instapaper : {title : 'Instapaper'},
		jumptags: {title:'Jumptags'},
		kaboodle:{title:'Kaboodle'},
		kirtsy : {title : 'Kirtsy'},
		linkagogo:{title:'linkaGoGo'},
		linkedin : {title : 'LinkedIn'},
		livejournal : {title : 'LiveJournal',type : 'post'},
		meneame : {title : 'Meneame'},
		messenger : {title : 'Messenger'},
		mister_wong : {title : 'Mr Wong'},
		mixx : {title : 'Mixx'},
		myspace : {title : 'MySpace'},
		n4g : {title : 'N4G'},
		netlog: {title: 'Netlog'},
		netvibes: {title:'Netvibes'},
		netvouz:{title:'Netvouz'},
		newsvine : {title : 'Newsvine'},
		nujij:{title:'NUjij'},
		odnoklassniki : {title : 'Odnoklassniki'},
		oknotizie : {title : 'Oknotizie'},
		orkut : {title : 'Orkut'},
		plaxo:{title:'Plaxo'},
		reddit : {title : 'Reddit'},
		segnalo : {title : 'Segnalo'},
		sharethis : {title : 'ShareThis'},
		sina: {title:'Sina'},
		slashdot : {title : 'Slashdot'},
		sonico : {title : 'Sonico'},
		speedtile:{title:'Speedtile'},
		sphinn : {title : 'Sphinn'},
		squidoo:{title:'Squidoo'},
		startaid:{title:'Startaid'},
		startlap:{title:'Startlap'},
		stumbleupon : {title : 'StumbleUpon'},
		stumpedia:{title:'Stumpedia'},
		technorati : {title : 'Technorati',dontUseEncodedURL : 'Encoded URLs are not allowed'},
		twackle : {title : 'Twackle'},
		typepad : {title : 'TypePad',type : 'post'},
		tumblr : {title : 'Tumblr'},
		twitter : {title : 'Tweet'},
		viadeo:{title:'Viadeo'},
		virb:{title:'Virb'},
		vkontakte : {title : 'Vkontakte'},
		voxopolis:{title: 'VOXopolis'},
		wordpress : {title : 'WordPress',type : 'post'},
		xanga : {title : 'Xanga'},
		xerpi:{title:"Xerpi"},
		xing: {title:'Xing'},
		yahoo: {title: 'Yahoo'},
		yammer : {title : 'Yammer'},
		yigg : {title : 'Yigg'}
};


/***************JSON ENCODE/DECODE***************/

$JSON = new function(){
	this.encode = function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = $[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = $JSON.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', d(self.getMonth() + 1), '-', d(self.getDate()), 'T', d(self.getHours()), ':', d(self.getMinutes()), ':', d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(rs, s).replace(ru, u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = $JSON.encode(self[key])))
							result[i++] = '"'.concat(key.replace(rs, s).replace(ru, u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	};
	this.decode=function(input){
		var data=null;
		try{if ( /^[\],:{}\s]*$/.test(input.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
		 .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
		 .replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
		 	data=window.JSON && window.JSON.parse ? window.JSON.parse(input) : (new Function("return " + input))();
		 	return data;
		 }else{
		 	return null;
		 }}catch(err){}
	};
	
	var	c = {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
		d = function(n){return n<10?"0".concat(n):n},
		e = function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
		i = function(e,p,l){return 1*e.substr(p,l)},
		p = ["","000","00","0",""],
		rc = null,
		rd = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
		rs = /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
		rt = /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
		ru = /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
		s = function(i,d){return "\\".concat(c[d])},
		u = function(i,d){
			var	n=d.charCodeAt(0).toString(16);
			return "\\u".concat(p[n.length],n)
		},
		v = function(k,v){return $[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
		$ = {
			"boolean":function(){return Boolean},
			"function":function(){return Function},
			"number":function(){return Number},
			"object":function(o){return o instanceof o.constructor?o.constructor:null},
			"string":function(){return String},
			"undefined":function(){return null}
		},
		$$ = function(m){
			function $(c,t){t=c[m];delete c[m];try{e(c)}catch(z){c[m]=t;return 1}};
			return $(Array)&&$(Object)
		};
	try{rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
	catch(z){rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
};

/***************************onDemand********************/

var onDemand = new function() {
	
	return {

		js : function(fileSrc,callBack){
			this.head=document.getElementsByTagName('head')[0];
			this.scriptSrc=fileSrc;
			this.script=document.createElement('script');
			this.script.setAttribute('type', 'text/javascript');
			this.script.setAttribute('src', this.scriptSrc);
			this.script.async = true;
			this.script.onload=callBack;
			this.script.onreadystatechange=function(){
				if(this.readyState=='complete'){
					callBack();
				}
			};
			this.s = document.getElementsByTagName('script')[0]; 
			this.s.parentNode.insertBefore(this.script, this.s);
		},
		css : function(fileSrc,callBack) {
			var cssInterval;
			this.head=document.getElementsByTagName('head')[0];
			this.cssSrc=fileSrc;
			this.css=document.createElement('link');
			this.css.setAttribute('rel', 'stylesheet');
			this.css.setAttribute('type', 'text/css');
			this.css.setAttribute('href', fileSrc);
			this.css.setAttribute('id', fileSrc);
			setTimeout(function(){
				callBack();
				if(!document.getElementById(fileSrc)){
					cssInterval=setInterval(function(){
						if(document.getElementById(fileSrc)){
							clearInterval(cssInterval);
							callBack();
						}
					}, 100);
				}
			},100);
			this.head.appendChild(this.css);		
		}
	};		
}();

/***************************COOKIE********************/

var cookie = new function() {
	
	return {	
		setCookie : function(name, value, days) {
			var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
			var ie =(navigator.userAgent.indexOf("MSIE") !=-1);
			
			if (safari || ie) {
				  var expiration = (days) ? days*24*60*60 : 0;
					
				  var _div = document.createElement('div');
				  _div.setAttribute("id", name);
				  _div.setAttribute("type", "hidden");
				  document.body.appendChild(_div);
				  
				  var
				  div = document.getElementById(name),
				  form = document.createElement('form');

				  try {
					  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
						//try is ie
					} catch(err) {
						//catch is ff and safari
						iframe = document.createElement('iframe');
					}
					
				  iframe.name = name;
				  iframe.src = 'javascript:false';
				  iframe.style.display="none";
				  div.appendChild(iframe);

				  form.action = (("https:" == document.location.protocol) ? "https://sharethis.com/" : "http://sharethis.com/")+"account/setCookie.php";
				  form.method = 'POST';

				  var hiddenField = document.createElement("input");
				  hiddenField.setAttribute("type", "hidden");
				  hiddenField.setAttribute("name", "name");
				  hiddenField.setAttribute("value", name);
				  form.appendChild(hiddenField);

				  var hiddenField2 = document.createElement("input");
				  hiddenField2.setAttribute("type", "hidden");
				  hiddenField2.setAttribute("name", "value");
				  hiddenField2.setAttribute("value", value);
				  form.appendChild(hiddenField2);

				  var hiddenField3 = document.createElement("input");
				  hiddenField3.setAttribute("type", "hidden");
				  hiddenField3.setAttribute("name", "time");
				  hiddenField3.setAttribute("value", expiration);
				  form.appendChild(hiddenField3);

				  form.target = name;
				  div.appendChild(form);

				  form.submit();
			}
			else {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				} else {
					var expires = "";
				}
				var cookie_string = name + "=" + escape(value) + expires;
				cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
				document.cookie = cookie_string;
			}
		},
		getCookie : function(cookie_name) {
		  var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		  if (results) {
			  return (unescape(results[2]));
		  } else {
			  return false;
		  }
		},
		deleteCookie : function(name) {
			var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
			var ie =(navigator.userAgent.indexOf("MSIE") !=-1);
			
			if (safari || ie) {
				var _div = document.createElement('div');
				_div.setAttribute("id", name);
				_div.setAttribute("type", "hidden");
				document.body.appendChild(_div);

				var
				div = document.getElementById(name),
				form = document.createElement('form');

				try {
				  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
					//try is ie
				} catch(err) {
					//catch is ff and safari
					iframe = document.createElement('iframe');
				}
				
				iframe.name = name;
				iframe.src = 'javascript:false';
				iframe.style.display="none";
				div.appendChild(iframe);

				form.action = (("https:" == document.location.protocol) ? "https://sharethis.com/" : "http://sharethis.com/")+"account/deleteCookie.php";
				form.method = 'POST';

				var hiddenField = document.createElement("input");
				hiddenField.setAttribute("type", "hidden");
				hiddenField.setAttribute("name", "name");
				hiddenField.setAttribute("value", name);
				form.appendChild(hiddenField);

				form.target = name;
				div.appendChild(form);

				form.submit();
			}
			else {
				var path="/";
				var domain=".sharethis.com";
				document.cookie = jsUtilities.trimString(name) + "=" +( ( path ) ? ";path=" + path : "") 
					  + ( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
			}
		}
	};
}();

/***************************AJAX********************/


var ajax = function() {
	//request:null,
	var defaultResponse = {
		status:"FAILURE"
	}
	
	return {
		makeRequest : function(method,url,data,onSuccess,onFailure) {
			try {
			  var request = new XMLHttpRequest();
			} catch (trymicrosoft) {
			  try {
				  request = new ActiveXObject("Msxml2.XMLHTTP");
			  } catch (othermicrosoft) {
			    try {
			    	request = new ActiveXObject("Microsoft.XMLHTTP");
			    } catch (failed) {
			    	request = false;
			    }
			  }
			}
			try{
				request.open(method,url,true);
				//Send the proper header information along with the request
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
				request.setRequestHeader("Content-length", data.length);
				request.setRequestHeader("Connection", "close");
				request.onreadystatechange=function(){
					if(request.readyState==4){
						if(request.status!=200){
							onSuccess(ajax.defaultResponse);
							return true;
						}
						if(request.responseText.length==0){
							onSuccess(ajax.defaultResponse);
							return true;
						}
						var data=null;
						// Make sure the incoming data is actual JSON
						// Logic borrowed from http://json.org/json2.js
						if ( /^[\],:{}\s]*$/.test(request.responseText.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
								.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
								.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
							data= window.JSON && window.JSON.parse ? window.JSON.parse(request.responseText) : (new Function("return " + request.responseText))();
						}else{
							//console.log("Invalid JSON:"+request.responseText);
						}
						onSuccess(data);
					}
				};
				request.send(data);
			}catch(err){console.log(err);}
		}
	};
}();


/***************************JSONP********************/


var jsonp = function() {

	return {
		makeRequest : function(url){
			onDemand.js(url,function(){});
		}
	};
}();

var jsUtilities = function() {
	return {
		trimString : function(str){
			return str.replace(/^\s+|\s+$/g,"");
		},
		
		isObjectEmpty : function (obj) {
		   	for(var i in obj){ 
				if(obj.hasOwnProperty(i)){return false;}
			}
		  	return true;
		},
		removeElementFromArray : function(arr, elem){
			var elemLocation;
			if(typeof(arr.indexOf)!='undefined'){
				elemLocation = arr.indexOf(elem);
			} 
			else
			{
			    for(var i=0; i<arr.length;i++ )
			    { 
			        if(arr[i]==elem)
					{
						elemLocation = i;
					}
			    }				
			}
    		arr.splice(elemLocation,1);
		},
		clearTextArea : function(e)
		{
			e = e || window.event;
			var target = e.target || e.srcElement;
			if(target.value == target.getAttribute('placeholder'))
			{
				target.value = "";			
			}
		},
		fillTextArea : function(e)
		{
			e = e || window.event;
			var target = e.target || e.srcElement;
			if(target.value=='') 
			{
				if(target.getAttribute('placeholder')==null) {
					target.value = '';
				} else {
					target.value = target.getAttribute('placeholder');
				}
			}
		},
		stripHTML : function(oldString)
		{
			return oldString.replace(/<.*?>/g, '');
		}
	};
}();

var domUtilities = function() {
	
	function getElementFromParameters(elNode, elementId, elClassName)
	{
		if(elNode == 'null' || typeof(elNode)=='null' || typeof(elNode)=='undefined' || elNode==='') 
		{
			return document.getElementById(elementId);
		}
		else
		{
			return elNode;
		}
	}
	
	return {
		addListenerCompatible : function(nodeName, eventName, functionName)
		{
			if(!nodeName) {return false;}
			if (typeof(nodeName.addEventListener) != 'undefined') 
			{
			    nodeName.addEventListener(eventName, functionName, true);
				return true;
			}
			else if (typeof nodeName.attachEvent != 'undefined') 
			{
			    nodeName.attachEvent("on" + eventName, functionName);
				return true;
			}
			return false;
		},
		removeListenerCompatible : function(nodeName, eventName, functionName)
		{
			if (typeof(nodeName.removeEventListener) != 'undefined') 
			{
			    nodeName.removeEventListener(eventName, functionName, false);
				return true;
			}
			else if (typeof nodeName.detachEvent != 'undefined') 
			{
			    nodeName.detachEvent("on" + eventName, functionName);
				return true;
			}
			return false;
		},
		searchElementsByClass : function(className, tagName, node) 
		{
		    var classElements = []; 
			var node;
			if(typeof(node) == null || typeof(node) == 'undefined' || node === '') { node = document; }
			if ( typeof(tagName) == null || typeof(tagName) == 'undefined' || tagName === '') { tagName = '*'; } 
			
		    if (typeof(node.getElementsByClassName) != 'undefined') 
			{
		    	var tempCollection = node.getElementsByClassName(className);
				//console.log("hi!");
				//console.log(tempCollection);
		        for (i = 0; i < tempCollection.length ; i++) 
				{
		    		classElements.push(tempCollection[i])
		    	}
		    }
		    else 
			{
		    	var elems = node.getElementsByTagName(tagName);
		    	var elemsLen = elems.length;
		    	var pattern = new RegExp("(^|\\s)"+className+"(\\s|$)");
				//var pattern = new RegExp("\\b"+className+"\\b");
		    	for (i = 0; i < elemsLen; i++) 
				{
		    		if ( pattern.test(elems[i].className) ) 
					{
		    			classElements.push(elems[i]);
		    		}
		    	}
		    }
			//console.log(classElements);
			return classElements;
		},

		removeClass : function(elNode, elementId, elClassName)
		{
			var currentElement = getElementFromParameters(elNode, elementId, elClassName);
			currentElement.className=currentElement.className.replace(elClassName,"");
			currentElement.className = jsUtilities.trimString(currentElement.className);
		},

		addClass : function(elNode, elementId, elClassName)
		{
			var currentElement = getElementFromParameters(elNode, elementId, elClassName);
			if(currentElement.className==""){
				currentElement.className = elClassName;
			} else {
				currentElement.className+=" "+ elClassName;
			}
		},
		
		replaceClass : function(oldClass,newClass){
			var elements=document.getElementsByTagName('*');
			var reg=new RegExp(oldClass,'ig');
			for(var i=0;i<elements.length;i++){
				if(reg.test(elements[i].className)){
					elements[i].className=elements[i].className.replace(reg,newClass);
				}else if(reg.test(elements[i].className)){
					elements[i].className=elements[i].className.replace(reg,newClass);
				}else if(reg.test(elements[i].className)){
					elements[i].className=elements[i].className.replace(reg,newClass);
				}  
			}
		},
		
		hasClass : function(elem, searchTerm)
		{
			if(typeof(elem.className)!='undefined') {
				return elem.className.match(new RegExp('(\\s|^)'+searchTerm+'(\\s|$)'));
			} else {
				return false;
			}
			
		},
		
		/*The two functions below check for the class before adding or removing those classes 
		  There are essentially versions of addClass & removeClass but with additional checks.
		*/
		removeClassIfPresent : function(elNode, elementId, elClassName)
		{
			var currentElement = getElementFromParameters(elNode, elementId, elClassName);
			if(domUtilities.hasClass(currentElement, elClassName))
			{
				domUtilities.removeClass(currentElement, '', elClassName);
			}
		},
		
		
		addClassIfNotPresent : function(elNode, elementId, elClassName)
		{
			var currentElement = getElementFromParameters(elNode, elementId, elClassName);
			if(!domUtilities.hasClass(currentElement, elClassName))
			{
				domUtilities.addClass(currentElement, '', elClassName);
			}
		},
		
		cancelEvent : function(e)
		{
			if (!e) var e = window.event;
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
		}
	};
}();