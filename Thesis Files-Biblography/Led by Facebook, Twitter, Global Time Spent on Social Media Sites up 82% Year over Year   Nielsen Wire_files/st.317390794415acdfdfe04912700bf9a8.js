
var tstArray=[]; //test array from frag object;
var domReady=false;
var bufferArgs=[];
var bufferValue=[];
var bufferRunArgs=[];
var glo_jsonArray=[];
var glo_jsonStr="";

var loginPoller=null;
var importPoller=null;
var sharPoller=null;
var getUserInfoTimer = null;
var isSignedIn = false;
var _shareToEmail = false;
var _isEmailShareDone = false;
/*****************************FRAGMENT PUMP*********************/

//frag pump start	
fragmentPump=new function(){
	//Extends: Events,
	this.fragTimer="";
	this.oldQS="";
	this.callBuffer=[];
	this.initRun=false;
	this.initialize= function() {
		this.fragTimer=setInterval("fragmentPump.checkFragment()",5);
	};
	this.startint=function(){
		setInterval(this.checkFragment.bind(this), 250);
	};
	this.checkFragment=function() {
		var hash = document.location.hash.substring(1);
		if (hash.length > 0 && hash!==this.oldQS) {
			var args = hash.split("/");
			this.oldQS=hash;
			//console.log(args);
			//console.log(hash); 
			var cmd = args.shift();
			cmd="fragmentPump."+cmd;
			var temp="";
			/* TODO - reconsider this -
			if(true==/page=send/gi.test(hash) || true==/page-=-send/gi.test(hash)){
				shareWidget.showLoadingBox();
			}
			*/
			for(var i=0;i<args.length;i++){
				temp=temp+'"'+args[i]+'"';
				if(i<(args.length-1)){
					temp=temp+",";
				}					
			}
			var evStr=cmd+"("+temp+")";
			//console.log(evStr);
			//alert(evStr);
			if(cmd=="fragmentPump.init" || cmd=="fragmentPump.test" || cmd=="fragmentPump.data" || cmd=="fragmentPump.show" || cmd=="fragmentPump.popup" || cmd=="fragmentPump.widget" || cmd=="fragmentPump.light"){
				var tempFun=eval("window."+cmd);
				if(tempFun){
					var tempFunc = new Function(evStr);
					tempFunc();
				}else{
					//alert("does not exists");
				}
				
			}
							
		}
	};
	this.init=function(){
		if(this.initRun===false){
			this.initRun=true;
			for(var i=0;i<arguments.length;i++) {
				var num=i+1;
				if(arguments[i]!="" && arguments[i]!=" "){setupWidget.addToOptionsBuffer(arguments[i]);}
			}
			if(domReady===true){
				setupWidget.processBuffer();
			}
			this.initRun=true;
		}
	};
	this.test=function() {
		setupWidget.readyTest();
	};
	this.data=function() {
		//getMainCss();
		for (var i=0; i < arguments.length; i++) {
			setupWidget.addToOptions2(arguments[i]);
		}
	};
	this.basicPreInit = function(){
		//console.trace();
		//setupWidget.processBuffer();
		//TODO
		var config = shareWidget.getConfigOptions();
		if(config.initWidget==false){
			shareWidget.initWidget();
			//shareWidget.chicklet_loaded=true;
		}
	};
	this.show=function(){
		//getMainCss();
		this.basicPreInit();
		if(this.initRun==false){
			return false;
		}
		for(var i=0; i < arguments.length; i++) {
			setupWidget.addToOptions(arguments[i]);
		}
		return true;
	};
	this.popup=function(){
		shareWidget.setGlobals('popup', true);
		this.basicPreInit();
		clearInterval(this.fragTimer);
		glo_options_popup=true;  
		displayNum=24;
		for(var i=0;i<arguments.length;i++) {
			var num=i+1;
			//console.log(arguments[i]);
			setupWidget.addToOptionsBuffer(arguments[i]);
		}
		if(domReady===true){
			setupWidget.processBuffer();
		}
		this.initRun=true;
	};
	this.widget=function() {
		if (arguments.length) {
			var kvPairs = arguments[0].split('=');
			for (var i = 0; i < kvPairs.length; i += 2) {
				switch (kvPairs[i]) {
				case 'screen':
				//	//console.log(kvPairs[i + 1]);
					if(kvPairs[i + 1]=="home"){
						shareWidget.showHome();
					}else if(kvPairs[i + 1]=="send"){
						shareWidget.showHome();
					}else {
						clearInterval(loginPoller);
						loginPoller = setInterval(stUser.checkForLoginCookie, 1000);
						
						if(kvPairs[i + 1]=='fbhome' || kvPairs[i + 1]=='twhome' || kvPairs[i + 1]=='ybhome' || kvPairs[i + 1]=='gbhome'){
							shareWidget.showHome();
						}
					}
					break;
				}
			}
		}
	};
	this.light=function(){
		this.basicPreInit();
		if(this.initRun==false){
			return false;
		}
		
		var urlPassed = false;
		for(var i=0; i < arguments.length; i++) {
			setupWidget.addToOptionsLight(arguments[i]);
			if(arguments[i].indexOf('url')==0){
				urlPassed = true;
			}
		}
		/*
		var config = shareWidget.getConfigOptions();
		if(!urlPassed && config.customUrlPassed){
			shareWidget.initWidget();
		}
		*/
		return true;
	};

	if( (("onhashchange" in window)==true) && typeof(document.documentMode)=="undefined"){
		window.onhashchange=function(){
			fragmentPump.checkFragment();
		};
	}else {
		//alert("not supported");
		this.initialize(); //this is the old method if onhashchange is not around...
	}
};


var setupWidget = function(){
	return {
		addToOptionsBuffer : function(a)
		{
			var temp=[];
			temp=a.split("=");	
			temp[0]=decodeURIComponent(temp[0]);
			temp[1]=decodeURIComponent(temp[1]);
			try{
				temp[0]=decodeURIComponent(temp[0]);
				temp[1]=decodeURIComponent(temp[1]);
			}
			catch(err){
				//noop
			}
			tstArray.push(setupWidget.fragObj(temp[0],temp[1]));
			bufferArgs.push(temp[0]);
			bufferValue.push(temp[1]);			
		},

		checkBufferArg : function(testStr){
			var returnVal=false;
			for(var i=0;i<bufferRunArgs.length;i++){
				if(bufferRunArgs[i]==testStr){
					returnVal=true;
				}
			}
			return returnVal;
		},

		processBuffer : function(){
			bufferArgs.reverse();
			bufferValue.reverse();	
			for(var i=0;i<bufferArgs.length;i++){
				//console.log('now checking - ' + bufferArgs[i]);
				if( setupWidget.checkBufferArg(bufferArgs[i])===false ){
					bufferRunArgs.push(bufferArgs[i]);
					shareWidget.setGlobals(bufferArgs[i],bufferValue[i]);
				}
			}
			//createSwList();
		},

		//test frag object
		fragObj : function(inFrag,query){
			this.frag=inFrag;
			this.qs=query;
		},

		readyTest : function(){
			for(var i=0;i<tstArray.length;i++){
				var tmp=tstArray[i].frag+" = \n"+tstArray[i].qs;
				//alert(tmp);
			}		
		},

		addToOptions : function(a){
			var temp=[];
			temp=a.split("=");	
			temp[0]=decodeURIComponent(temp[0]);
			temp[1]=decodeURIComponent(temp[1]);
			try{
				temp[0]=decodeURIComponent(temp[0]);
				temp[1]=decodeURIComponent(temp[1]);
			}
			catch(err){
				//noop
			}
			tstArray.push(setupWidget.fragObj(temp[0],temp[1]));
			shareWidget.setGlobals(temp[0],temp[1]);
		},

		addToOptionsLight : function(a){
			var temp=[];
			temp=a.split("-=-");	
			temp[0]=decodeURIComponent(temp[0]);
			temp[1]=decodeURIComponent(temp[1]);
			try{
				temp[0]=decodeURIComponent(temp[0]);
				temp[1]=decodeURIComponent(temp[1]);
			}catch(err){}
			tstArray.push(setupWidget.fragObj(temp[0],temp[1]));
			
			if(temp[0]=='url'){
				var config = shareWidget.getConfigOptions();
				if((config.URL != temp[1]) && config.initWidget==true){
					shareWidget.initWidget();
				}
			}
			shareWidget.setGlobals(temp[0],temp[1]);
		},

		addToOptions2 : function(a){
			var temp=[];
			temp=a.split("=");	
			temp[0]=decodeURIComponent(temp[0]);
			try{
				temp[0]=decodeURIComponent(temp[0]);
				temp[1]=decodeURIComponent(temp[1]);
			}
			catch(err){
				//noop
			}
			if(temp[0]=="pageHost"){
				shareWidget.setGlobals("hostname",temp[1]);
			}
			else if(temp[0]=="pagePath"){
				shareWidget.setGlobals("location",temp[1]);
			}
			tstArray.push(setupWidget.fragObj(temp[0],temp[1]));
			if(temp[1]=="done"){
				if(fragmentPump.initRun===false){document.location.hash=glo_initFrag;}
				glo_jsonStr=glo_jsonArray.join('');
				glo_jsonArray=[];
				setupWidget.processFrag();
			}
			else if(temp[0]=="jsonData"){
				glo_jsonArray.push(temp[1]);
			}
		},

		processFrag : function(){
			try{glo_jsonStr=decodeURIComponent(glo_jsonStr);}catch(err){}
			var tmp=glo_jsonStr;
			var newResp=[];
			try{
				newResp=$JSON.decode(tmp);
				if(newResp==null){
					tmp=decodeURIComponent(tmp);
					newResp=$JSON.decode(tmp);
				}
			}catch(err){
					tmp=decodeURIComponent(tmp);
					newResp=$JSON.decode(tmp);
			}
			//console.log(newResp);
			if(newResp && newResp.length){
				for(var i=0;i<newResp.length;i++){
					shareWidget.setGlobals("title",newResp[i].title);
					shareWidget.setGlobals("type",newResp[i].type);
					shareWidget.setGlobals("summary",newResp[i].summary);
					shareWidget.setGlobals("content",newResp[i].content);
					shareWidget.setGlobals("url",newResp[i].url);
					shareWidget.setGlobals("icon",newResp[i].icon);
					shareWidget.setGlobals("category",newResp[i].category);
					shareWidget.setGlobals("updated",newResp[i].updated);
					shareWidget.setGlobals("published",newResp[i].published);
					shareWidget.setGlobals("author",newResp[i].author);
					shareWidget.setGlobals("thumb",newResp[i].icon);
					if(newResp[i].tags){shareWidget.setGlobals("glo_tags_array",newResp[i].tags);}
					if(newResp[i].description){shareWidget.setGlobals("glo_description_array",newResp[i].description);}
				}
			}
			//setValues();
		}
	};
}();


var stUser = function(){
	var _userInfo = {};

	_userInfo.name=null;
	_userInfo.email=null;
	_userInfo.nickname=null;
	_userInfo.recents=null;
	_userInfo.chicklets=null;
	_userInfo.display=null;
	_userInfo.type=null;
	_userInfo.token=null;
	_userInfo.contacts=[];
	_userInfo.loggedIn=false;
	_userInfo.user_services=null;
	_userInfo.currentUserType=[];
	_userInfo.thirdPartyUsers=[];
	_userInfo.thirdPartyTypes=[];
	_userInfo.facebookFriends=null;

	return {
		
		fillInfoFromStorage : function(storage)
		{
			if (typeof (storage.email) != "undefined"){_userInfo.email = storage.email;}
			if (typeof (storage.name) != "undefined"){_userInfo.name = storage.name;}
			if (typeof (storage.nickname) != "undefined"){_userInfo.nickname = storage.nickname;}//storage[sut].display
			if (typeof (storage.display) != "undefined"){_userInfo.display = storage.display;}//storage[sut].display
			if (typeof (storage.currentUserType) != "undefined"){_userInfo.currentUserType = storage.currentUserType;}
			if (typeof (storage.thirdPartyUsers) != "undefined"){_userInfo.thirdPartyUsers = storage.thirdPartyUsers;}
			if (typeof (storage.thirdPartyTypes) != "undefined"){_userInfo.thirdPartyTypes = storage.thirdPartyTypes;}
			if (typeof (storage.recents) != "undefined"){_userInfo.recents = storage.recents;}
			if (typeof (storage.contacts) != "undefined"){_userInfo.contacts = storage.contacts;}
			if (typeof (storage.facebookFriends) != "undefined"){_userInfo.facebookFriends = storage.facebookFriends;}
			shareWidget.postLoginWidget();
		},
		
		setUserContacts : function(contacts)
		{
			_userInfo.contacts = contacts;
		},
		
		setFacebookFriends : function(friends)
		{
			_userInfo.facebookFriends = friends;
		},
		
		getUserDetails : function()
		{
			return _userInfo;
		},
		
		signOut : function()
		{
			if (typeof (window.localStorage) !== "undefined") 
			{
				window.localStorage.clear();
			}
			logger.gaLog("SignOut - 5x","Click");
			cookie.deleteCookie("ShareUT");
			cookie.deleteCookie('ShareAL');
			cookie.deleteCookie('recents');
			cookie.deleteCookie('stOAuth');
			_userInfo.contacts=[];
			stUser.forgetUser();
			isSignedIn = false;
			
		},
		forgetUser : function() 
		{
			_userInfo.name=null;
			_userInfo.email=null;
			_userInfo.nickname=null;
			_userInfo.recents=null;
			_userInfo.chicklets=null;
			_userInfo.display=null;
			_userInfo.type=null;
			_userInfo.token=null;
			_userInfo.contacts=[];
			_userInfo.facebookFriends=null;
			_userInfo.loggedIn=false;
			_userInfo.services=null;
			_userInfo.currentUserType=null;
			_userInfo.thirdPartyUsers=null;
			_userInfo.thirdPartyTypes=null;
			/*if(stUser.email==null && typeof(email)!=="undefined"){
				document.getElementById('from_userInfo.div').style.display="block";
			}*/
		},
		checkLogin : function()
		{
			clearInterval(getUserInfoTimer);
			shareWidget.hideError();
			//console.log('check login ', document.getElementById('shareMessage').style.height);
			if (cookie.getCookie('ShareUT') !== false) {
				//console.log('found shareUT');
				var data=["return=json","cb=stUser.loginOnSuccess","service=getUserInfo", "from_memcache=false"];
				data=data.join('&');
				jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?"+data);
			}
		},
		loginOnSuccess : function(response)
		{
			isSignedIn = true;
			//console.log('in loginonsuccess');
			logger.gaLog("SignIn - 5x","Complete");
			if(response && response.status=="SUCCESS"){
				_userInfo.email=response.data.email;
				_userInfo.name=response.data.name;
				_userInfo.nickname=response.data.nickname;
				_userInfo.recents=response.data.recipients;
				if(_userInfo.recents!==null){
					cookie.setCookie('recents',$JSON.encode(_userInfo.recents));
				}
				//	chicklets=response.data.socialShares;
				_userInfo.display=_userInfo.email;
				_userInfo.currentUserType=response.data.CurrentUserType;
				_userInfo.thirdPartyUsers=response.data.ThirdPartyUsers;
				_userInfo.thirdPartyTypes=response.data.ThirdPartyTypes;
				if (_userInfo.thirdPartyUsers!=null && _userInfo.thirdPartyUsers["facebook"]!=null) {
					_userInfo.thirdPartyUsers["facebook"]=_userInfo.email;
					if(_userInfo.name!=null)
						_userInfo.thirdPartyUsers["facebook"]=_userInfo.name;
				}
				if (_userInfo.thirdPartyUsers!=null && _userInfo.thirdPartyUsers["linkedin"]!=null) {
					_userInfo.thirdPartyUsers["linkedin"]=_userInfo.email;
					if(_userInfo.name!=null)
						_userInfo.thirdPartyUsers["linkedin"]=_userInfo.name;
				}
				cookie.setCookie('stOAuth',$JSON.encode(_userInfo.thirdPartyUsers), 365);

				//Update HTML5 localstorage
				if (typeof(window.localStorage) !== "undefined") {
					var sut = cookie.getCookie('ShareUT');
					var storage = window.localStorage;
					if (_userInfo.email!=null){storage.email=_userInfo.email;}
					if (_userInfo.name!=null){storage.name=_userInfo.name;}
					if (_userInfo.nickname!=null){storage.nickname=_userInfo.nickname;}
					if (_userInfo.currentUserType!=null){storage.currentUserType=_userInfo.currentUserType;}
					if (_userInfo.thirdPartyUsers!=null){
						if (_userInfo.thirdPartyUsers["facebook"]!=null) {
							_userInfo.thirdPartyUsers["facebook"]=_userInfo.email;
							if(_userInfo.name!=null)
								_userInfo.thirdPartyUsers["facebook"]=_userInfo.name;
						}
						if (_userInfo.thirdPartyUsers["linkedin"]!=null) {
							_userInfo.thirdPartyUsers["linkedin"]=_userInfo.email;
							if(_userInfo.name!=null)
								_userInfo.thirdPartyUsers["linkedin"]=_userInfo.name;
						}
						storage.thirdPartyUsers=_userInfo.thirdPartyUsers;
					}
					if (_userInfo.thirdPartyTypes!=null){storage.thirdPartyTypes=_userInfo.thirdPartyTypes;}
					if (_userInfo.recents!=null){storage.recents=_userInfo.recents;}
					if (_userInfo.contacts!=null){storage.contacts=_userInfo.contacts;}
					if (_userInfo.facebookFriends!=null){storage.facebookFriends=_userInfo.facebookFriends;}
				}
		
				if(typeof(email)!=="undefined"){
					email.gotContacts = false;
					email.getContacts(); //this gets contacts if you are sign in and are on email page.
					
					email.showRecents();
				}
				shareWidget.postLoginWidget();
			}
			else
			{
				shareWidget.showError(lang.strings['msg_failed_login']);
				getUserInfoTimer = setTimeout(stUser.checkLogin, 10000);
			}
		},
		checkForLoginCookie : function()
		{
			if(cookie.getCookie('ShareUT') !== false && !isSignedIn) {
//				console.log('found shareUT: '+cookie.getCookie('ShareUT'));
				logger.gaLog("Login Successful - 5x", 'Thru SignIn Page Or Linking');
				clearInterval(loginPoller);
				stUser.checkLogin();
				clearInterval(loginPoller);
			}
			
			var authCookie = cookie.getCookie("ShareAL");
			if (authCookie) {
//				console.log('found shareUT: '+cookie.getCookie('ShareUT'));
//				console.log('found ShareAL: '+authCookie);
				logger.gaLog("Linking Successful - 5x", authCookie);
				cookie.deleteCookie('ShareAL');
				
				clearInterval(loginPoller);
				stUser.checkLogin();
				clearInterval(loginPoller);
			} else {
//				console.log('polled...');
			}
		},
		checkForImportCookie : function()
		{
			var importCookie = cookie.getCookie("StImported");
			var authCookie = cookie.getCookie("ShareUT");
			if (authCookie && importCookie) {
				logger.gaLog("Import Successful - 5x", "email");
				cookie.deleteCookie('StImported');
				clearInterval(importPoller);
				//shareWidget.stUser.acquireAuth(authCookie);//??
				stUser.checkLogin();
				if(typeof(email)!='undefined'){
					email.getContacts();
				}
				clearInterval(importPoller);
			}
		}
	};
}();

/*********************WIDGET OBJECT**************************/

var shareWidget = function() {

	var _themeNames = [];
	_themeNames[1] = 'themeOne';
	_themeNames[2] = 'themeTwo';
	_themeNames[3] = 'themeThree';
	_themeNames[4] = 'themeFour';
	_themeNames[5] = 'themeFive';
	_themeNames[6] = 'themeSix';
	_themeNames[7] = 'themeSeven';
	_themeNames[8] = 'themeEight';
	_themeNames[9] = 'themeNine';

	var  _config = {};
	_config.oldURL=null;
	_config.URL=null;
	_config.title=null;
	_config.sessionID=null;
	_config.fpc=null;
	_config.publisher=null;
	_config.browser=null;
	_config.services=[];
	_config.publisher=null;
	_config.icon;
	_config.content;
	_config.i18n=false;
	_config.lang=null;
	_config.guid;
	_config.guid_index;
	_config.published;
	_config.author;
	_config.updated;
	_config.summary='';
	_config.thumb='';
	_config.tags;
	_config.hostname;
	_config.location;
	_config.headerTitle;
	_config.headerfg;
	_config.purl;
	_config.all_services= {
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
		google_bmarks : {title : 'Google Bookmarks'},
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
		yammer : {title : 'Yammer'},
		yigg : {title : 'Yigg'}
	};
	_config.top_config = {}, _config.exclusive_config={}, _config.guid_config = {}, _config.email_config = {}, _config.sms_config = {}, _config.merge_config = {}, _config.chicklet_config = {};
	
	_config.top_config.services = 'email,facebook,twitter,linkedin,yahoo';
	_config.exclusive_config.services=null;
	//_config.services="blogger,myspace,digg,aim,stumbleupon,messenger"; //this is from publisher and for default ordering
	_config.displayServices=[];
	_config.topDisplayServices=[];
	_config.chickletNumber=6;
	_config.guid_config.index=0;
	_config.page="home";
	_config.toolbar=false;
	_config.metaInfo=null;
	_config.mainCssLoaded=false;
	_config.pageTracker=null;
	_config.pubTracker=null;
	_config.tracking=false;
	_config.lastURL=null; //indicates last url shortned, prevents re-calling of creatShar ajax call
	_config.sharURL=null; 
	_config.poster=null; //indicates which poster service is in use
	_config.linkfg=null;
	_config.email_config.service=true;
	_config.sms_config.service=true;
	_config.merge_config.list=true; ///merge all services into list by default
	_config.chicklet_loaded=false;
	_config.initWidget=false;
	_config.ga=null;
	_config.popup=false;
	_config.cssInterval=null;
	_config.stLight=false;
	_config.optout=false;
	_config.doneScreen=true;
	_config.urlhash=null;
	_config.theme=1;
	_config.headerText = '';
	_config.customColors={
		serviceBarColor: '',
		shareButtonColor: '',
		footerColor: '',
		headerTextColor: '',
		helpTextColor: '',
		mainWidgetColor: '',
		textBoxFontColor: ''
	};
	_config.excludeServices=null;
	_config.minorServices=true;
	_config.iconsLoaded=false;
	_config.facebookFriends=null;
	_config.customUrlPassed=false;
	_config.shorten=true;
	_config.publisherGA=null;
	
	var _container = document.getElementById('outerContainer');
	var _postServicesQueue = new Array();
	
	var _popupWidths = {};
	_popupWidths['facebook'] = '450';
	_popupWidths['twitter'] = '684';
	_popupWidths['yahoo'] = '500';
	_popupWidths['google'] = '873';
	_popupWidths['linkedin'] = '600';
	
	var _popupHeights = {};
	_popupHeights['facebook'] = '300';
	_popupHeights['twitter'] = '718';
	_popupHeights['yahoo'] = '460';
	_popupHeights['google'] = '519';
	_popupHeights['linkedin'] = '433';
	
	var _shownDone = false;
	var _shareToWordpress = false;
	var _noServicesError = false;
	var _currentURL = '';
	var _shareToTwitter = false;
	var _shareToFacebook = false;
	var _sharFetched = false;
	var _urlInfoFetched = false;
	var _sharClearedOnce = false;
	var _twitterMessagePopulated = false;
	


	function createServiceLink(service)
	{
		/*if( (_sms_service==false && service=="sms") )
		{
			var a = document.createElement('a');
			return a;
		}*/
		
		var otherClass=" rpChicklet";
		if(_config.chicklet_loaded==true)
		{
			otherClass=" ckimg";
		}
	
		if(service=="wordpress"){
			var a = document.createElement('a');
			a.className = service;
			a.className+=otherClass;
			a.setAttribute('title', _config.all_services[service].title);
			a.setAttribute('id', "post_"+service+"_link");
			if(a.attachEvent){
				a.attachEvent('onclick',function(){shareWidget.createWordpressScreen();});
			}else{
				a.setAttribute('onclick', 'shareWidget.createWordpressScreen()');
			}
			a.setAttribute('href', 'javascript:void(0);');
			a.appendChild(document.createTextNode(_config.all_services[service].title));
			if(_config.linkfg!=null){a.style.color=_config.linkfg;}
			return a;
		}/*else if(service=="sms"){
			var a = document.createElement('a');
			a.className = service;
			a.className+=otherClass;
			a.setAttribute('title', _all_services[service].title);
			a.setAttribute('id', "post_"+service+"_link");
			//a.setAttribute('onclick', 'getEmailService("sms")');
			if(a.attachEvent){
				a.attachEvent('onclick',function(){getEmailService("sms");});
			}else{
				a.setAttribute('onclick', 'getEmailService("sms")');
			}
			a.setAttribute('href', 'javascript:void(0);');
			a.appendChild(document.createTextNode(_all_services[service].title));
			if(_linkfg!=null){a.style.color=_linkfg;}
			return a;
		}*/
		else{
			var source="chicklet5x";
			var url=(("https:" == document.location.protocol) ? "https://ws." : "http://wd.")+"sharethis.com/api/sharer.php?destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source="+source+"&service={service}&type={type}&image={image}";
			url=url.replace("{destination}",service);
			url=url.replace("{url}",encodeURIComponent(_config.URL));
			url=url.replace("{title}",encodeURIComponent(_config.title));
			url=url.replace("{publisher}",_config.publisher);
			url=url.replace("{fpc}",_config.fpc);
			url=url.replace("{sessionID}",_config.sessionID);
			url=url.replace("{service}",_config.service);
			url=url.replace("{type}",_config.type);
			url= (typeof(_config.thumb)!='undefined') ? url.replace("{image}",_config.thumb) : url.replace("{image}",""); 
			var a = document.createElement('a');
			a.className = service;
			a.className+=otherClass;
			a.setAttribute('href', url);
			a.setAttribute('title', _config.all_services[service].title);
			a.setAttribute('id', "post_"+service+"_link");
			a.setAttribute('target', '_blank');
			a.setAttribute('stservice', service);
			//a.setAttribute('onclick','serviceClicked(this);');
			if(a.attachEvent){
				a.attachEvent('onclick',function(){shareWidget.serviceClicked(a);});
			}else{
				a.setAttribute('onclick', 'shareWidget.serviceClicked(this);');
			}
			a.appendChild(document.createTextNode(_config.all_services[service].title));
			if(_config.linkfg!=null){a.style.color=_config.linkfg;}
			return a;
		}
	}

	/*
	function emailServiceCallback(){
		domUtilities.removeClass('null', 'emailShareDetails', 'sts-dn');
		//hide spinner
		//hideLoadingBox();
		document.getElementById('txtYourAddr').focus();
	}

	function hideLoadingBox(){
		document.getElementById('loading_box').style.display="none";
	}
	*/

	function customizeServiceList()
	{
		if(!_config.minorServices){
			domUtilities.addClassIfNotPresent('null', 'moreLink', 'sts-dn');
		}
		
		if(typeof(_config.excludeServices)!='null' && _config.excludeServices!=null){
			
			var tempArr=_config.excludeServices.split(',');
			var excludeList=[];
			for(var i=0;i<tempArr.length;i++)
			{
				excludeList.push(jsUtilities.trimString(tempArr[i]));
				if (jsUtilities.trimString(tempArr[i]) == "google") { 
					excludeList.push("buzz");
				}
			}
			
			var elementList = domUtilities.searchElementsByClass("serviceDisplay", "a", '');
			for(j in elementList)
			{
				for(i=0; i<excludeList.length; i++)
				{
					if(elementList[j].getAttribute('data-value')==excludeList[i])
					{ 
						domUtilities.addClassIfNotPresent(elementList[j], '', 'sts-dn'); 
					} 
				}
			}
			
			elementList = domUtilities.searchElementsByClass("serviceLabel", "span", '');
			for(j in elementList)
			{
				for(i=0; i<excludeList.length; i++)
				{
					if(elementList[j].getAttribute('data-value')==excludeList[i])
					{
						domUtilities.addClassIfNotPresent(elementList[j], '', 'sts-dn');
					}
				}
			} 
		}
		//console.log("customizeServiceList- finished");	
	}

	function displaySmallChicklets()
	{
		var newNode;
		var element=document.getElementById('chicklets');

		for(var i in _config.all_services){
			newNode = createServiceLink(i);
			if(newNode != null) {
				element.appendChild(newNode);
			}
		}
		domUtilities.replaceClass('rpChicklet','ckimg');
		_config.chicklet_loaded = true;
	}

	function getMainCss(){
		
		if(_config.mainCssLoaded==false){
			var fileSrc = ("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure5x/css/share.a9980151bd91ac4ef89cb0d37facb59d.css" : "http://w.sharethis.com/share5x/css/share.a9980151bd91ac4ef89cb0d37facb59d.css";
			onDemand.css(fileSrc,function(){
				document.getElementsByTagName('body')[0].style.display="block";
			});
			
			_config.mainCssLoaded=true;
		}else{
			return false;
		}
	}

	function extractDomainFromURL(url, keepWWW) {
	  try{var domain = url.replace(/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/, '$2');
		  if (!keepWWW && domain.toLowerCase().indexOf('www.') == 0) {
			  domain = domain.substring(4);
		  }
		  domain=domain.replace(/#.*?$/,''); //replace #onwards
		  return domain;
	  }catch(err){
		  return null;
	  }
	}

	/**************DONE SCREEN ************************/

	function getRelatedShares(url){
	
		//url = "http://www.boston.com/bigpicture/2010/11/great_migrations.html";
		if(_config.doneScreen==false || url==null){
			document.getElementById('doneScreen').style.display="none";//msg_share_success
			return false;
		}
		var str="";
		
		
		if(typeof(_config.relatedDomain)!='undefined' && _config.relateDomain!='')
		{
			str = _config.relatedDomain;
		}
		else
		{
			try{
				if(/(.*:\/\/)(.*?)(\/.*$)/.test(url)==true){
					var reg=new RegExp(/(.*:\/\/)(.*?)(\/.*$)/);
					str=url.replace(reg,"$2");
					str=encodeURIComponent(str);
				}else{
					var reg=new RegExp(/(.*:\/\/)(.*?)/);
					str=url.replace(reg,"$2");
					str=encodeURIComponent(str);
				}

			}catch(err){}
		
		}
		//str = 'mashable.com';
		var data=["domain="+str,"return=json","url_limit=3","cb=shareWidget.getRelatedShares_onSuccess","service=getLiveStream"];
		data=data.join('&');
		jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?"+data);
	}

	
	function getCount()
	{
		var sMsg, remainingSpace; 
		var mBox=document.getElementById('shareMessage');
		if(mBox.getAttribute('placeholder')==mBox.value){
			sMsg = '';
		} else{
			sMsg = mBox.value;	
		} 
		/*var sharString = ' - ' + _config.title + ' - ';
		if(sharString.length > 40) {
			remainingSpace = 140 - text.length - 40 - 25;
		} else {
			remainingSpace = 140 - text.length - sharString.length - 25;
		}
		return remainingSpace;*/
		return sMsg.length;
	}
	
	function updateCharCount()
	{
		var charCount = getCount();
		if(charCount>140){
			document.getElementById('charCounter').style.color='#ff2222';
		}else{
			document.getElementById('charCounter').style.color='#aaa';
		}
		document.getElementById('charCounter').innerHTML = 140 - charCount;
	}
	
	function bigServiceIconClicked(e)
	{
		if(_noServicesError)
		{
			shareWidget.hideError();
		}
		
		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='A') {
			target = target.parentNode;
		}
		
		var serviceType = target.getAttribute('data-value');
		var serviceFound = false;
		
		if(domUtilities.hasClass(target, 'unchecked'))
		{		
			//remove cookie
			var cookieName = 'st_' + serviceType + '_uncheck';

			if(cookie.getCookie(cookieName)!==false){
				//delete it
				cookie.deleteCookie(cookieName);
			}
			if(serviceType=='email')
			{
				shareWidget.getEmailService();
				logger.gaLog("Intention to use - 5x", serviceType);
			}
			else 
			{
				if(isSignedIn)
				{
					var userDetails = stUser.getUserDetails();
					for(var i in userDetails.thirdPartyTypes)
					{
						tempService = userDetails.thirdPartyTypes[i];
						if(serviceType == tempService)
						{
							serviceFound = true;
							break;
						}
					}
				}
				if(serviceFound)
				{
					logger.gaLog("Intention to use - 5x", serviceType);
					addServiceToShareQueue(serviceType);
					return;
				}
				shareWidget.beginOAuth(serviceType);
			}
		}
		else if(domUtilities.hasClass(target, 'checked'))
		{
			//jenny add cookie
			var cookieName = 'st_' + serviceType + '_uncheck';
			if(cookie.getCookie(cookieName)===false){
				//add it
				cookie.setCookie(cookieName, 1);
			}
			
			domUtilities.addClass(target, '', 'unchecked');
			domUtilities.removeClass(target, '', 'checked');
			logger.gaLog("Unchecking.. - 5x", serviceType);
			if(serviceType=='email')
			{
				domUtilities.addClass('null', 'emailShareDetails', 'sts-dn');
				domUtilities.addClass('null', 'recents', 'sts-dn');
				document.getElementById('shareMessage').style.height='100px';
				document.getElementById('articleDetails').style.height='105px';
				document.getElementById('shareDetails').style.marginTop='2px';
				document.getElementById('shareDetails').style.marginBottom='10px';
				document.getElementById('articleDetails').style.marginTop='10px';
				document.getElementById('articleDetails').style.marginBottom='10px';
				shareWidget.hideError();
			}
			else if(serviceType=='twitter')
			{
				_shareToTwitter = false;
				domUtilities.addClass('null', 'charCounter', 'sts-dn');
				document.getElementById('shareMessage').setAttribute('maxlength', 2000);
				domUtilities.removeListenerCompatible(document.getElementById('shareMessage'), 'keypress', updateCharCount);
			}
			else if(serviceType=='facebook')
			{
				_shareToFacebook = false;
				hideFacebookFriendsLink();
			}
			jsUtilities.removeElementFromArray(_postServicesQueue, serviceType);
		}
		//console.log(_postServicesQueue);
	}

	function prepareMultiShare()
	{
		
		if (_postServicesQueue.length == 1 && _postServicesQueue[0].search('facebookfriend')!='-1')
		{
			if(jsUtilities.trimString(document.getElementById('txtFriendsName').value)=='')
			{
				_postServicesQueue=[];
			}
		}
		
		if(_shareToWordpress)
		{
			poster.postToWordpress();
		}
		else if(_postServicesQueue.length == 0)
		{
			//console.log('no services selected error..');
			shareWidget.showError(lang.strings['msg_no_services_selected']);
			_noServicesError = true;
		}
		else if(_shareToTwitter)
		{
			shareWidget.beginMultiShare();
		}
		else{
			poster.createShar(_config.URL);
			clearInterval(sharPoller);
			sharPoller = setInterval( function(){
				if(poster.getSharURL() != ''){
					clearInterval(sharPoller);
					shareWidget.beginMultiShare();
					clearInterval(sharPoller);
				}
			}, 1000);
		}
	}
	
	function addServiceToShareQueue(serviceName)
	{
		var cookieName = 'st_' + serviceName + '_uncheck';
		if(cookie.getCookie(cookieName)!==false){
			//user does not want this one checked
			return;
		}

		var serviceIcon = domUtilities.searchElementsByClass(serviceName, "span", document.getElementById('services'))[0];
		if(typeof(serviceIcon)!='undefined')
		{
			domUtilities.removeClass(serviceIcon.parentNode, '', 'unchecked');
			domUtilities.addClass(serviceIcon.parentNode, '', 'checked');
			if(serviceName=='twitter')
			{
				_shareToTwitter = true;
				var shar;
				var msgBox = document.getElementById('shareMessage');
				domUtilities.removeClass('null', 'charCounter', 'sts-dn');
				//updateCharCount();
				domUtilities.addListenerCompatible(msgBox, 'keypress', updateCharCount);
				domUtilities.addListenerCompatible(msgBox, 'click', updateCharCount);
				msgBox.setAttribute('maxlength', 140);
				//document.getElementById('charCounter').innerHTML = '140 characters left';
				if(!_sharClearedOnce) {
					poster.clearSharURL();
					_sharClearedOnce = true;
				}
				poster.createShar(_config.URL);
				clearInterval(sharPoller);
				sharPoller = setInterval( function(){
					shar = poster.getSharURL();
					if(shar!=''){
						clearInterval(sharPoller);
						_sharFetched = true;
						populateTwitterBox();
						clearInterval(sharPoller);
					}
				}, 1000);
			}
			else if(serviceName=='facebook')
			{
				_shareToFacebook = true;
				domUtilities.removeClass('null', 'friendsWall', 'sts-dn');
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) )
				{
					document.getElementById('extraInfo').style.position = 'relative';
					document.getElementById('extraInfo').style.top = '5px';
					
					document.getElementById('helpText').style.position = 'relative';
					document.getElementById('helpText').style.top = '10px';
				}
			}
			_postServicesQueue.push(serviceName);
			logger.gaLog('Added Service To Share Queue - 5x', serviceName);
		}
	}
	
	function populateTwitterBox()
	{
		//console.trace();
		//console.log('in populateTwitterBox ', _twitterMessagePopulated, _sharFetched, _urlInfoFetched);
		if(!_twitterMessagePopulated)
		{	
			if(_sharFetched && _urlInfoFetched )
			{	
				clearInterval(sharPoller);
				if(document.getElementById('headline').innerHTML=='')
				{
					var appendString = poster.getSharURL();
				}
				else
				{
					var appendString =  document.getElementById('headline').innerHTML + ' ' + poster.getSharURL();
				}
				var mBox=document.getElementById('shareMessage');
				if(mBox.getAttribute('placeholder')==mBox.value){
					mBox.value = appendString;
				} else {
					mBox.value += appendString;
				}
				updateCharCount();
				_twitterMessagePopulated = true;
			}
			else if(_sharFetched)
			{
				clearInterval(sharPoller);
			}
		}
	}
	
	function signInToWidget()
	{
		window.open( "http://sharethis.com/account/signin-widget", "LoginWindow","status=1, height=450, width=970, resizable=0" );
		clearInterval(loginPoller);
		loginPoller = setInterval(stUser.checkForLoginCookie, 1000);
		logger.gaLog("SignIn - 5x","Click");
	}
	
	function signOutFromWidget()
	{
		_postServicesQueue = new Array();
		domUtilities.addClassIfNotPresent('null', 'signOut', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'signIn', 'sts-dn');

		document.getElementById('welcomeMsg').innerHTML = lang.strings['msg_share'];
		stUser.signOut();
		if(typeof(email)!=="undefined")
		{
			domUtilities.addClassIfNotPresent('null', 'recents', 'sts-dn');
			//document.getElementById("recents").style.display="none"; //hide recents
		}

		var isEmailSelected=false, emailElement;
		emailElement = shareWidget.getEmailElement();

		if(domUtilities.hasClass(emailElement, 'checked')){
			isEmailSelected = true;
			_postServicesQueue.push('email');
		} else {
			isEmailSelected = false;
		}
		
		domUtilities.replaceClass('checked', 'unchecked');
		domUtilities.replaceClass('ununchecked', 'unchecked');
		
		if(isEmailSelected){
			domUtilities.removeClass(emailElement, '', 'unchecked');
			domUtilities.addClass(emailElement, '', 'checked');
			resetScreenForEmail();
		}
		if (_shareToTwitter){
			_shareToTwitter=false;
		}
		domUtilities.removeClassIfPresent('null', 'fromField', 'sts-dn');
				
		hideFacebookFriendsLink();
		document.getElementById('shareMessage').value = document.getElementById('shareMessage').getAttribute('placeholder');
	}
	
	function getURLInfo()
	{
		//console.log('url = ' + _config.URL);
		//console.log('purl = ' + _config.pUrl);
		//_config.URL = "http://www.boston.com/bigpicture/2010/11/great_migrations.html";
		var data=['return=json',"url="+encodeURIComponent(_config.URL),"cb=shareWidget.fillURLInfo","service=getLiveUrlInfo"];
		data=data.join('&');
		jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?"+data);
	}
	
	function afterFillingArticleDetails(wasSuccess)
	{
		if(wasSuccess)
		{
			if( document.all && navigator.appVersion.indexOf('MSIE 7.')!=-1 ){
				document.getElementById('services').style.height='auto';
			}
			domUtilities.removeClass('null', 'articleDetails', 'sts-dn');
			if( document.all && navigator.appVersion.indexOf('MSIE 6.')!=-1)
			{
				document.getElementById('services').style.height='auto';
				document.getElementById('creditLine').style.position='relative';
				document.getElementById('thumbnail').style.position='relative';
				document.getElementById('headline').style.position='relative';
				document.getElementById('snippet').style.position='relative';
				document.getElementById('url').style.position='relative';
			}	
		}
		_urlInfoFetched = true;
		
		//console.log('in afterFillingArticleDetails ', _shareToTwitter, _sharFetched);
		if(_shareToTwitter)
		{
			var shar;
			if(!_sharFetched){
				poster.createShar(_config.URL);
				clearInterval(sharPoller);
				sharPoller = setInterval( function(){
					shar = poster.getSharURL();
					if(shar!=''){
						clearInterval(sharPoller);
						_sharFetched = true;
						populateTwitterBox();
						clearInterval(sharPoller);
					}
				}, 1000);
			}
			else
			{
				populateTwitterBox();
			}
		}
		
	}
	
	function initFacebookFriends()
	{
		domUtilities.addClassIfNotPresent('null', 'postFriendsLink', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'friendsInputWrapper', 'sts-dn');
		if(typeof(facebook)=="undefined")
		{
			onDemand.js((("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure5x/js/facebook.js" : "http://w.sharethis.com/share5x/js/facebook.js"),function(){});
		}
		else
		{
			facebook.getFacebookFriends(true);
		}
		logger.gaLog("Facebook Friends Wall - 5x","Click");
	}
	
	function cancelFacebookFriends()
	{
		shareWidget.hideError();
		domUtilities.addClassIfNotPresent('null', 'friendsInputWrapper', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'postFriendsLink', 'sts-dn');
		document.getElementById('txtFriendsName').value = '';
		domUtilities.removeClassIfPresent('null', 'txtFriendsName', 'friendSelected');
		logger.gaLog("Facebook Friends Wall - 5x","Cancel");
	}
	
	function hideFacebookFriendsLink()
	{
		domUtilities.addClass('null', 'friendsWall', 'sts-dn');
		if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) )
		{
			document.getElementById('extraInfo').style.position = 'static';
			document.getElementById('extraInfo').style.top = 'auto';
			
			document.getElementById('helpText').style.position = 'static';
			document.getElementById('helpText').style.top = 'auto';
		}
		document.getElementById('txtFriendsName').value = '';
		domUtilities.removeClassIfPresent('null', 'txtFriendsName', 'friendSelected');
	}
	
	function setTheme()
	{
		if(typeof(_config.theme)!='undefined' && _config.theme != 1 && _config.theme!='')
		{
			logger.gaLog("Themes - 5x", _config.theme);
			
			addThemeClassToElement(document.getElementById('serviceCTAs'));
			addThemeClassToElement(document.getElementById('chicklets'));
			addThemeClassToElement(document.getElementById('footer'));
			addThemeClassToElement(document.getElementById('helpText'));
			addThemeClassToElement(document.getElementById('shareButton'));
			addThemeClassToElement(document.getElementById('welcomeMsg'));
			addThemeClassToElement(document.getElementById('doneMsg'));
			addThemeClassToElement(document.getElementById('outerContainer'));
			
			var textBoxes = document.getElementsByTagName('textarea');
			for(i=0; i<textBoxes.length; i++)
			{
				addThemeClassToElement(textBoxes[i]);
			}
			
			textBoxes = document.getElementsByTagName('input');
			for(i=0; i<textBoxes.length; i++)
			{
				addThemeClassToElement(textBoxes[i]);
			}	
		}
	}
	
	function addThemeClassToElement(themeElement)
	{
		if(_config.theme != 1 && _config.theme!='')
		{
			domUtilities.addClassIfNotPresent(themeElement, '', _themeNames[_config.theme]);
		}
	}
	
	function customizeWidgetColors()
	{
		if(_config.customColors.serviceBarColor!=''){
			document.getElementById('serviceCTAs').style.background = _config.customColors.serviceBarColor;	
		}
		
		if(_config.customColors.footerColor!=''){
			document.getElementById('footer').style.background = _config.customColors.footerColor;	
		}
		
		if(_config.customColors.helpTextColor!=''){
			document.getElementById('helpText').style.background = _config.customColors.helpTextColor;	
		}
		
		if(_config.customColors.shareButtonColor!=''){
			document.getElementById('shareButton').style.background = _config.customColors.shareButtonColor;	
		}
		
		if(_config.customColors.headerTextColor!=''){
			document.getElementById('welcomeMsg').style.background = _config.customColors.headerTextColor;
			document.getElementById('doneMsg').style.background = _config.customColors.headerTextColor;	
		}
		
		if(_config.customColors.textBoxFontColor!='')
		{
			var textBoxes = document.getElementsByTagName('textarea');
			for(i=0; i<textBoxes.length; i++)
			{
				textBoxes[i].style.background = _config.customColors.textBoxFontColor;
			}
		
			textBoxes = document.getElementsByTagName('input');
			for(i=0; i<textBoxes.length; i++)
			{
				textBoxes[i].style.background = _config.customColors.textBoxFontColor;
			}
		}
	}
	
	function refreshServiceDisplays(fromDoneScreen)
	{
		if (typeof (fromDoneScreen) == "undefined"){ fromDoneScreen = true; }
		_postServicesQueue = new Array();
		var isEmailSelected=false, emailElement;
		emailElement = shareWidget.getEmailElement();

		if(!fromDoneScreen) {
			if(domUtilities.hasClass(emailElement, 'checked')){
				isEmailSelected = true;
				_postServicesQueue.push('email');
			} else {
				isEmailSelected = false;
			}
		}
		
		domUtilities.replaceClass('checked', 'unchecked');
		domUtilities.replaceClass('ununchecked', 'unchecked');
		
		var userDetails = stUser.getUserDetails();
		
		if(isEmailSelected){
			domUtilities.removeClass(emailElement, '', 'unchecked');
			domUtilities.addClass(emailElement, '', 'checked');
			resetScreenForEmail();
		}
		
//		if (fromDoneScreen || !isEmailSelected){
		if (!fromDoneScreen){
			for(var i in userDetails.thirdPartyTypes)
			{
				addServiceToShareQueue(userDetails.thirdPartyTypes[i]);
			} 
		}
	}
	
	function resetScreenForEmail()
	{
		//console.trace();
		var userDetails = stUser.getUserDetails();
		//console.log(userDetails.email, userDetails.recents, cookie.getCookie('recents'), _shareToTwitter);
		if(userDetails.email!=null && userDetails.email!='')				//To check whether to display from email box
		{
			if( ( (userDetails.recents!=null && userDetails.recents!='') || cookie.getCookie('recents')!==false) && _shareToTwitter)
			{
				document.getElementById('shareMessage').style.height='69px';
			}
			else if(((userDetails.recents!=null && userDetails.recents!='') || cookie.getCookie('recents')!==false) && !_shareToTwitter)
			{
				document.getElementById('shareMessage').style.height='72px';
			}
			else if(_shareToTwitter)
			{
				document.getElementById('shareMessage').style.height='79px';
			}
			else
			{
				document.getElementById('shareMessage').style.height='83px';	
			}
			domUtilities.addClassIfNotPresent('null', 'fromField', 'sts-dn');
			
			if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
				document.getElementById('importBox').style.position='absolute';
			}
			//console.log('resetScreenForEmail ', document.getElementById('shareMessage').style.height);
		}
		else
		{
			if(((userDetails.recents!=null && userDetails.recents!='') || cookie.getCookie('recents')!==false) && _shareToTwitter)
			{
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
					document.getElementById('shareMessage').style.height='28px';
				} else {
					document.getElementById('shareMessage').style.height='38px';	
				}
			}
			else if(((userDetails.recents!=null && userDetails.recents!='') || cookie.getCookie('recents')!==false) && !_shareToTwitter)			
			{
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
					document.getElementById('shareMessage').style.height='32px';
				} else {
					document.getElementById('shareMessage').style.height='42px';	
				}
			}
			else if(_shareToTwitter)
			{
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
					document.getElementById('shareMessage').style.height='39px';
				} else {
					document.getElementById('shareMessage').style.height='50px';	
				}
			}
			else
			{
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
					document.getElementById('shareMessage').style.height='40px';
				} else {
					document.getElementById('shareMessage').style.height='52px';	
				}
			}
			domUtilities.removeClassIfPresent('null', 'fromField', 'sts-dn');				
		}
	}

	function addEventListenersToWidget()
	{
		var elementList, retVal, singleElement, i;
		
		/*Adding event handler to Message TextArea */
		elementList = _container.getElementsByTagName('textarea');
		for (i in elementList)
		{
			//console.log("addEventListenersToWidget - " + elementList[i] + ": " + i);
			retVal = domUtilities.addListenerCompatible(elementList[i], 'focus', jsUtilities.clearTextArea);
			retVal = domUtilities.addListenerCompatible(elementList[i], 'blur', jsUtilities.fillTextArea);
		} 
		//console.log("addEventListenerToWidget - more and less links :" + document.getElementById('moreLink'));
		domUtilities.addListenerCompatible(document.getElementById('moreLink'), 'click', shareWidget.showAll);
		domUtilities.addListenerCompatible(document.getElementById('lessLink'), 'click', shareWidget.hideAll);
		
		elementList = domUtilities.searchElementsByClass("serviceDisplay", "a", '');
		for(i in elementList)
		{
			retVal = domUtilities.addListenerCompatible(elementList[i], 'click', bigServiceIconClicked);
		}
		
		domUtilities.addListenerCompatible(document.getElementById('shareButton'), 'click', prepareMultiShare);
		domUtilities.addListenerCompatible(document.getElementById('captchaButton'), 'click', shareWidget.submitCaptchaResponse);
		
		domUtilities.addListenerCompatible(document.getElementById('cancelLink'), 'click', shareWidget.showHome);
		domUtilities.addListenerCompatible(document.getElementById('againLink'), 'click', shareWidget.showHome);
		domUtilities.addListenerCompatible(document.getElementById('signOut'), 'click', signOutFromWidget);
		domUtilities.addListenerCompatible(document.getElementById('signIn'), 'click', signInToWidget);
		domUtilities.addListenerCompatible(document.getElementById('postFriendsLink'), 'click', initFacebookFriends);
		domUtilities.addListenerCompatible(document.getElementById('cancelFriendsWall'), 'click', cancelFacebookFriends);
	}

	return {
		
		getConfigOptions : function()
		{
			return _config;
		},
		
		setGlobals : function(key,value){
			//console.log('in setGlobals', key, value);
			//console.trace();
			try{value=decodeURIComponent(value);}catch(err){}
			try{value=decodeURIComponent(value);}catch(err){}
			if(value=="true"){
				value=true;
			}else if(value=="false"){
				value=false;
			}
			switch(key){
				case 'url':
					//alert(value);
					if(_config.URL==null){
						_config.oldURL = value;
					} else if(_config.URL!=value){
						_config.oldURL = _config.URL;
					}
					_config.customUrlPassed = true;
					_config.URL=value; 
					if(_config.popup==true){
						shareWidget.initWidget();
					}
					var hostDomain = extractDomainFromURL(value);
					if(hostDomain==null)
					{
						hostDomain=_config.URL;	
					}
					else
					{
						if(_config.hostname==null){
							_config.hostname=hostDomain;
						}
					}
					//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
					_config.sharURL=value;
				break;
				case 'popup':
					_config.popup = value;
				break;
				case 'title':
					_config.title=value;
				break;
				case 'pUrl':
					if(_config.popup!=true || _config.URL==null){
						if(_config.URL==null){
							_config.oldURL = value;
						} else if(_config.URL!=value){
							_config.oldURL = _config.URL;
						}
						
						_config.customUrlPassed = true;
						_config.URL=value;
						var hostDomain = extractDomainFromURL(value);
						if(hostDomain==null)
						{
							hostDomain=value;	
						}else{
							if(_config.hostname==null){
								_config.hostname=hostDomain;
							}
						}
						//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
					}
				break;
				case 'fpc':
					_config.fpc=value;
				break;
				case 'shorten':
					_config.shorten=value;
				break;	
				case 'sessionID':
					_config.sessionID=value;
				break;
				case 'i18n':
					_config.i18n=value;
					if(_config.i18n){
						if(cookie.getCookie('sti18n')!==false){
							var sti18n=$JSON.decode(cookie.getCookie('sti18n'));
							if(_config.lang==null){
								_config.lang={};
								_config.lang.strings=new Object;
							}
							for(var o in sti18n){
								_config.lang.strings[o]=sti18n[o];
							}
						}
//						onDemand.js("http://wd.sharethis.com/i18n/message.js",function(){});
					}
				break;
				case 'publisher':
					_config.publisher=value;
				break;
				case 'type':
					_config.type=value;
				break;
				case 'service':
					_config.service=value;
					//clicked in from outside, delete unchecked cookie
					var cookieNameService = value;
					var cookieName = 'st_' + cookieNameService + '_uncheck';
					if(cookie.getCookie(cookieName)!==false){
						//delete it
						cookie.deleteCookie(cookieName);
					}
					break;
				case 'summary':
					_config.summary=value;
				break;
				case 'content':
					_config.content=value;
				break;
				case 'icon':
					_config.icon=value;
				break;
				case 'image':
					_config.thumb=value;
				break;
				case 'category':
					_config.category=value;
				break;
				case 'updated':
					_config.updated=value;
				break;
				case 'author':
					_config.author=value;
				break;
				case 'published':
					_config.published=value;
				break;
				case 'thumb':
					_config.thumb=value;
				break;
				case 'hostname':
					_config.hostname=value;
				break;
				case 'location':
					_config.location=value;
				break;
				case 'guid_index':
					_config.guid_index=value;
				break;
				case 'page':
					_config.page=value;
					//console.log(value);
					if(value && value=="send"){
						shareWidget.getEmailService();
					}else if(value && value=="home"){
						//console.log('i am supposed to show the home screen');
						shareWidget.showHome();
					}else if(value && value=="wphome"){
						shareWidget.createWordpressScreen();
                    }else {
						clearInterval(loginPoller);
						loginPoller = setInterval(stUser.checkForLoginCookie, 1000);
						
						if(value && value=='fbhome'){
							shareWidget.showHome();
						}else if(value && value=='twhome'){
							shareWidget.showHome();
						}else if(value && value=='ybhome'){
							shareWidget.showHome();
						}else if(value && value=='gbhome'){
							shareWidget.showHome();
						}else if(value && value=='lihome'){
							shareWidget.showHome();
						}
					}
				break;
				case 'toolbar':
					_config.toolbar=value;
				break;
				case 'services':
					_config.services=value;
				break;
				case 'headerTitle':
					_config.headerText = value;
					//if(value.length>0){
					//	var element=document.getElementById('header_div');
					//	var element2=document.getElementById('header_title').innerHTML=value;
					//	element.style.display="block";
					//}
				break;
				case 'headerfg':
					var element=document.getElementById('header_div');
					element.style.color=value;			
				break;
				case 'headerbg':
					var element=document.getElementById('header_div');
					element.style.backgroundColor=value;
				break;
				case "tracking":
					_config.tracking=true;
				break;
				case "linkfg":
					_config.linkfg=value;
					break;
				case 'tabs':
					var a=new RegExp(/email|send/);
					if(a.test(value)==false){_config.email_service=false;}
					if(a.test(value)==false){_config.sms_service=false;}
					break;
				case 'send_services':
					var a=new RegExp(/email/);
					if(a.test(value)==false){_config.email_service=false;}
					/*a=new RegExp(/sms/);
					if(a.test(value)==false){_config.sms_service=false;}*/
					break;
				case "exclusive_services":
					_config.merge_list=false;
					break;
				case "post_services":
					//shareWidget.merge_list=false;
					if(_config.services==null){
						_config.services=value;
					}else{
						_config.service+=value;
					}
					break;
				case "stLight":
					_config.stLight=true;
					break;
				case 'doneScreen':
					_config.doneScreen=value;
					break;
				case 'theme':
					_config.theme = value;
					break;
				case 'headerText':
					_config.headerText = value;
					break;
				case 'serviceBarColor':
					_config.customColors.serviceBarColor = value;
					break;
				case 'shareButtonColor':
					_config.customColors.shareButtonColor = value;
					break;
				case 'footerColor':
					_config.customColors.footerColor = value;
					break;
				case 'headerTextColor':
					_config.customColors.headerTextColor = value;
					break;
				case 'helpTextColor':
					_config.customColors.helpTextColor = value;
					break;
				case 'mainWidgetColor':
					_config.customColors.mainWidgetColor = value;
					break;
				case 'textBoxFontColor':
					_config.customColors.textBoxFontColor = value;
					break;
				case 'excludeServices':
					_config.excludeServices = value;
					break;
				case 'minorServices':
					_config.minorServices = value;
					break;
				case 'publisherGA':
					_config.publisherGA = value;
					if(domReady==true){
						logger.initGA();
					}
					break;
				case 'relatedDomain':
					_config.relatedDomain = value;
					break;
				case "embeds":
				case "button":
				case "type":
				case "inactivefg":
				case "inactivebf":
				case "headerbg":
				case "style":
				case "charset":
				case "hash_flag":
				case "onmouseover":
				case "inactivebg":
				case "send_services":
				case "buttonText":
				case "offsetLeft":
				case "offsetTop":
				case "buttonText":
					//legacy stuff some of them
				break;

				default:
				//	//console.log("******Not Found Key:"+key+" Value:"+value);
					//alert("******Not Found Key:"+key+" Value:"+value);
				break;
			}
		},		
		
		initWidget : function(){
			//console.log('in initWidget');
			//console.trace();
			_shownDone = false;
			stUser.checkLogin();
			if(_config.URL != _config.oldURL){
				_sharFetched=false;
				_sharClearedOnce=false;
				_twitterMessagePopulated=false;
				_config.thumb='';
				_config.summary='';
				_config.title=null;
				//console.log('in initWidget ', _shareToTwitter);
				document.getElementById('shareMessage').value = document.getElementById('shareMessage').getAttribute('placeholder');
			}
			
			if(_config.URL==null){
				return true;
			}else{
				//console.log('share widget url is not null');
				domUtilities.replaceClass('tempBigIcon','bigIcon');
				domUtilities.replaceClass('tempCloseX','closeX');
				domUtilities.replaceClass('tempCheckIcon','checkIcon');
				domUtilities.replaceClass('tempWidgetIcons','widgetIcons');
				document.getElementById('loadingUrlInfo').src='/images/spinner.gif';
				document.getElementById('loadingRelated').src='/images/spinner.gif';

				domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
					document.getElementById('services').style.height='auto';
				}
				domUtilities.addClassIfNotPresent('null', 'articleDetails', 'sts-dn');
				shareWidget.hideError();
				_config.chicklet_loaded = false;
				customizeServiceList();
				if(!_sharClearedOnce) {
					poster.clearSharURL();
					_sharClearedOnce = true;
				}
				setTheme();
				customizeWidgetColors();
				if(typeof(_config.headerText)!='undefined' && _config.headerText!='')
				{
					lang.strings['msg_share'] = _config.headerText;
					document.getElementById('welcomeMsg').innerHTML=lang.strings['msg_share'];
				}
				
				var data=['return=json',"url="+encodeURIComponent(_config.URL),"fpc="+_config.fpc,"cb=shareWidget.initWidgetOnSuccess","service=initWidget"];
				data=data.join('&');
				jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?"+data);
				return true;
			}
		},
		
		initWidgetOnSuccess : function(response)
		{
			if(response && response.status=='SUCCESS') {
				_config.metaInfo=response.data;
			}
			domUtilities.replaceClass('rpChicklet','ckimg');
			_config.initWidget = true;
			/* TODO - Replace other sprite images here */
			if(response && response.data && response.data.ga && response.data.ga==true){
				logger.initGA();
			}
			
			if( typeof(_config.URL)!='undefined' && _config.URL!='' && typeof(_config.title)!='undefined' && _config.title!='' && typeof(_config.summary)!='undefined' && _config.summary!='' && typeof(_config.thumb)!='undefined' && _config.thumb!='' )
			{
				domUtilities.addClass('null', 'loadingUrlInfo', 'sts-dn');
				document.getElementById('thumbnail').setAttribute('src', _config.thumb);
				document.getElementById('headline').innerHTML = _config.title;
				document.getElementById('snippet').innerHTML = _config.summary;					
				document.getElementById('url').innerHTML = _config.URL;
				document.getElementById('url').setAttribute('href', _config.URL);
				afterFillingArticleDetails(true);
			}
			else
			{
				getURLInfo();
				//console.log('calling getURL Info');
				afterFillingArticleDetails(false);
			}
		},
		
		initialize : function()
		{
			//console.log("initialize");
			fragmentPump.checkFragment();
			var isBot=false;
			var nv=navigator.userAgent;
			var nvPat=/bot|gomez|keynote/gi;
			if(nv && nv!==null && nv.length>4){
				var tempMatch=nv.match(nvPat);
				if(tempMatch && tempMatch!==null && tempMatch.length>0){
					isBot=true;
				}
			}else{
				isBot=true;
			}
			//console.log(fragmentPump.initRun);
			if(fragmentPump.initRun==true){
				setupWidget.processBuffer();
			}

			getMainCss();
			domReady=true;

			if (typeof(lang)!='undefined'&&typeof(lang.strings)!='undefined'&&_config.lang!=null&&typeof(_config.lang.strings)!='undefined'){
				for(var o in _config.lang.strings){
					lang.strings[o]=_config.lang.strings[o];
				}
			}
			
			setTimeout(function(){
				//console.log("initialize - add msg_view_all");
				document.getElementById('moreLink').innerHTML=lang.strings['msg_view_all'];
				document.getElementById('lessLink').innerHTML=lang.strings['msg_hide_all'];
				document.getElementById('successMsg').getElementsByTagName('span')[0].innerHTML=lang.strings['msg_share_success'];
				document.getElementById('successMsg').getElementsByTagName('a')[0].innerHTML=lang.strings['msg_share_again'];
				document.getElementById('relatedShares').getElementsByTagName('h2')[0].innerHTML=lang.strings['msg_related_shares'];
				document.getElementById('toField').getElementsByTagName('label')[0].innerHTML=lang.strings['msg_email_to'];
				document.getElementById('fromField').getElementsByTagName('label')[0].innerHTML=lang.strings['msg_email_from'];
				document.getElementById('helpText').innerHTML=lang.strings['msg_share_to_destinations'];
				document.getElementById('welcomeMsg').innerHTML=lang.strings['msg_share'];
				
				document.getElementById('signOut').innerHTML=lang.strings['msg_signout'];//signOut
			},100);
			
			//delete cookies if opt out
			
			if(cookie.getCookie('st_optout')!==false){
				_config.optout=true;
				_config.fpc="optout";
			} 
			//processExclusiveServices();
			
			addEventListenersToWidget();
			
			//get value from HTML5 localStorage for userinfo
			if (cookie.getCookie('ShareUT') !== false) {
				if (typeof(window.localStorage) !== "undefined") {
					var sut = cookie.getCookie('ShareUT');
					//stUser.fillInfoFromStorage(window.localStorage);		
				}
			}
			//getURLInfo(); // TODO - comment out here finally
		},
		
		getEmailService : function(type)
		{
			/*if(type=="sms"){
				shareWidget.poster="sms";
				updateServiceCount("sms");
				gaLog("Chicklet","Sms");
				shareLog('Sms');
			}else{*/
				logger.gaLog("Chicklet - 5x","Email");
				document.getElementById('importBox').getElementsByTagName('span')[0].innerHTML = lang.strings['msg_import_contacts'];
				
			//}
			
			_shareToEmail = false;
			_isEmailShareDone = false;
			
			if(typeof(email)=="undefined"){
				onDemand.js((("https:" == document.location.protocol) ? "https://ws.sharethis.com/secure5x/js/email.9fe4548f63df744b995c74e8c1dd7800.js" : "http://w.sharethis.com/share5x/js/email.9fe4548f63df744b995c74e8c1dd7800.js"),function(){});
				domUtilities.removeClass('null', 'emailShareDetails', 'sts-dn');
				//shareWidget.showLoadingBox();
			}else{
				domUtilities.removeClass('null', 'emailShareDetails', 'sts-dn');
				//hideLoadingBox();
				email.reClicked();
				email.showRecents();
			}
			
			domUtilities.removeClass('null', 'emailShareDetails', 'sts-dn');
			if( document.all && navigator.appVersion.indexOf('MSIE 6.')!=-1)
			{
				document.getElementById('services').style.height='auto';
				document.getElementById('creditLine').style.position='relative';
			}
			addServiceToShareQueue('email');
			
			resetScreenForEmail();

			document.getElementById('articleDetails').style.height='101px';
			document.getElementById('shareDetails').style.marginTop='0px';
			document.getElementById('shareDetails').style.marginBottom='0px';
			document.getElementById('articleDetails').style.marginTop='0px';
			document.getElementById('articleDetails').style.marginBottom='5px';
			document.getElementById('extraInfo').style.marginTop='0px';
			if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
				document.getElementById('extraInfo').style.marginTop='-6px';
			}
			if(navigator.userAgent.toLowerCase().indexOf('chrome')!=-1 || navigator.userAgent.toLowerCase().indexOf('webkit')!=-1){
				document.getElementById('extraInfo').style.marginTop='-4px';	
			} 
		},
		
		serviceClicked : function(elem){
			/* TODO - add big chiclets to this too*/
			var service=elem.getAttribute('stservice');
			var serviceTitle = elem.getAttribute('title');
			shareWidget.updateServiceCount(service, serviceTitle);
			logger.gaLog("Share - 5x",service);
			shareWidget.showDoneScreen(true);
			logger.shareLog(service);
			//document.getElementById("msg_share_success").style.visibility="hidden";
		},
		
		showAll : function(){
			if(!_config.chicklet_loaded){
				if(_config.URL!=_config.oldURL) {
					var chicklets = document.getElementById('chicklets');
					while (chicklets.childNodes.length >= 1 )
				    {
				        chicklets.removeChild(chicklets.firstChild);
					}
				}
				displaySmallChicklets();
			}
			if(document.all && navigator.appVersion.indexOf('MSIE 6.')!=-1){
				document.getElementById('footer').style.position='relative';
			}
			document.getElementById('footer').style.bottom='15px';
			//console.log("showAll - addClassIfNotePresent");
			domUtilities.removeClassIfPresent('null', 'chicklets', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'moreLink', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'moreTitle', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'welcomeMsg', 'sts-dn');
			//domUtilities.removeClassIfPresent('null', 'lessLink', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'mainBody', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'serviceCTAs', 'sts-dn');
			logger.gaLog('Widget - 5x','show_all');
		},

		hideAll : function(){
			if(document.all && navigator.appVersion.indexOf('MSIE 6.')!=-1){
				document.getElementById('footer').style.height='auto';
			}
			//console.log("hideAll - addClassIfNotePresent");
			domUtilities.addClassIfNotPresent('null', 'chicklets', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'moreLink', 'sts-dn');
			//domUtilities.addClassIfNotPresent('null', 'lessLink', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'welcomeMsg', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'mainBody', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'serviceCTAs', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'moreTitle', 'sts-dn');
			logger.gaLog('Widget - 5x','hide_all');
		},
		
		
		fillURLInfo : function(response)
		{
			//console.log(response);
			var fromUrlInfo = false;
			var haveSomeInfo = false;
			var imgSrc='';
			domUtilities.addClass('null', 'loadingUrlInfo', 'sts-dn');
			//console.log(response);
			if(response && response.status=="SUCCESS")
			{	
				fromUrlInfo = true;
			
				if( (typeof(response.urls[0].img)!='undefined' && response.urls[0].img != "null" && response.urls[0].img != "" &&  response.urls[0].img.indexOf('http://sharethis.com/share/thumb')==-1 ) || (response.urls[0].imagehash && response.urls[0].imagehash != ""))
				{
			
					if (response.urls[0].imagehash && response.urls[0].imagehash != "")
					{
						imgSrc = "http://img.sharethis.com/" + response.urls[0].imagehash + "/100_100.jpg";
					} 
					else
					{
						imgSrc = response.urls[0].img;
					}
				}
				else
				{
					imgSrc = 'images/no-image.png';
				}
			}
			
			if( typeof(_config.thumb)!='undefined' && _config.thumb!='' )
			{
				haveSomeInfo = true;
				document.getElementById('thumbnail').setAttribute('src', _config.thumb);
			}
			else if(fromUrlInfo)
			{
				document.getElementById('thumbnail').setAttribute('src', imgSrc);
				_config.thumb = imgSrc;	
			}
			else
			{
			 	_config.thumb = 'images/no-image.png';
				document.getElementById('thumbnail').setAttribute('src', _config.thumb);
			}
			
			if( typeof(_config.title)!='undefined' && _config.title!='' )
			{
				haveSomeInfo = true;
				document.getElementById('headline').innerHTML = _config.title;
			} 
			else if(fromUrlInfo && typeof(response.urls[0].title)!='undefined')
			{
				document.getElementById('headline').innerHTML = response.urls[0].title;
				_config.title = response.urls[0].title;
			} 
			else
			{
				_config.title='';
				domUtilities.addClassIfNotPresent('null', 'headline', 'sts-dn');
			}
			
			if( typeof(_config.summary)!='undefined' && jsUtilities.trimString(_config.summary)!='' )
			{
				haveSomeInfo = true;
				document.getElementById('snippet').innerHTML = _config.summary;
			} 
			else if(fromUrlInfo && typeof(response.urls[0].snippet)!='undefined')
			{
				document.getElementById('snippet').innerHTML = response.urls[0].snippet;					
				_config.summary = response.urls[0].snippet;
	
				if(jsUtilities.trimString(response.urls[0].snippet)=='')
				{
					domUtilities.addClassIfNotPresent('null', 'snippet', 'sts-dn');
				}
				else
				{
					domUtilities.removeClassIfPresent('null', 'snippet', 'sts-dn');
				}
			}
			else
			{
				_config.summary = '';
				domUtilities.addClassIfNotPresent('null', 'snippet', 'sts-dn');
			}
	
			document.getElementById('url').innerHTML = _config.URL;
			document.getElementById('url').setAttribute('href', _config.URL);
			if(fromUrlInfo)
			{
				_config.urlhash = response.urls[0].urlhash;
				afterFillingArticleDetails(true);
			}
			else if(haveSomeInfo)
			{
				domUtilities.removeClassIfPresent('null', 'articleDetails', 'sts-dn');
			}
			else
			{
				afterFillingArticleDetails(false);
				document.getElementById('shareMessage').style.height='300px';
			}
		},
		
		addFriendsWallToQueue : function(friendId)
		{
			var previousEntry = false;
			for(var i=0; i<_postServicesQueue.length; i++)
			{
				if(_postServicesQueue[i].search('facebookfriend')!='-1'){
					_postServicesQueue[i] = 'facebookfriend-' + friendId;
					previousEntry = true;
				}
			}
			if(!previousEntry){
				_postServicesQueue.push('facebookfriend-' + friendId);
			}
		},
		
		beginOAuth : function(serviceType)
		{
			logger.gaLog("Attempting OAuth - 5x", serviceType);
			var oAuthURL;
			oAuthURL = "http://sharethis.com/account/linking?provider=" + serviceType;
			window.open( oAuthURL, "AccountLinkingWindow","status=1, height=" + _popupHeights[serviceType] + ", width=" + _popupWidths[serviceType] + ", resizable=1" );
			clearInterval(loginPoller);
			loginPoller = setInterval(stUser.checkForLoginCookie, 1000);
		},
		
		postLoginWidget : function()
		{
			domUtilities.removeClassIfPresent('null', 'signOut', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'signIn', 'sts-dn');
			var userDetails = stUser.getUserDetails();
			var name = (userDetails.name) ? userDetails.name : userDetails.nickname;
			if(name.length > 14){
				var trimmedName = name.slice(0, 14) + '..';
			} else {
				var trimmedName = name + '!';
			}
			document.getElementById('welcomeMsg').innerHTML = 'Hi <a id="welcomeName" title="' + name + '" href="http://sharethis.com/mystream" target="_blank">' + trimmedName + '</a> ' + lang.strings['msg_share'] + ' <a id="signOutTop">Not you?</a>';
			domUtilities.addListenerCompatible(document.getElementById('signOutTop'), 'click', function(){
				signOutFromWidget();
				signInToWidget();
			});
			refreshServiceDisplays(false);
		
			domUtilities.removeClassIfPresent('null', 'postFriendsLink', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'friendsInputWrapper', 'sts-dn');
		},
		
		beginMultiShare : function()
		{
			clearInterval(sharPoller);
			var articleObj = {};
			articleObj.aurl = _config.URL;
			articleObj.url = poster.getSharURL();
			if(articleObj.url==''){
				articleObj.url = _config.URL;
			}
			articleObj.title = escape(_config.title);
			articleObj.urlhash = _config.urlhash;
			_shareToEmail = false;
			var onlyToEmail = true;
			
			for(var i in _postServicesQueue)
			{
				if (_postServicesQueue[i].search('facebookfriend')!='-1'){
					logger.shareLog('facebookfriend');
				} else {
					logger.shareLog(_postServicesQueue[i]);					
				}
				
				if(_postServicesQueue[i]=='email')
				{
					_shareToEmail = true;
					document.getElementById('loadingUrlInfo').src='/images/spinner.gif';
					domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
					email.createMessage();
					shareWidget.updateServiceCount(_postServicesQueue[i], 'Email');
				}
				else
				{
					onlyToEmail = false;
					if(_postServicesQueue[i]=='twitter'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Tweet');
					} else if (_postServicesQueue[i]=='facebook'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Share');
					} else if (_postServicesQueue[i]=='yahoo'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Y! Pulse');
					} else if (_postServicesQueue[i]=='linkedin'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'LinkedIn');
					}else if (	_postServicesQueue[i].search('facebookfriend')!='-1'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Share');
						if(jsUtilities.trimString(document.getElementById('txtFriendsName').value)=='')
						{
							_postServicesQueue.splice(i, 1);
						}
					}
				}
			}
		
			if(_shareToEmail && email.hasError)
			{
				return;
			}
			
			if(_shareToFacebook && typeof(facebook)!="undefined" && (facebook.checkFriendName()==false))
			{
				return;
			}
			
			if(_postServicesQueue.length > 0 && !onlyToEmail)
			{
				poster.multiPost(stUser.getUserDetails(), articleObj, _postServicesQueue, jsUtilities.stripHTML(document.getElementById('shareMessage').value));
				document.getElementById('loadingUrlInfo').src='/images/spinner.gif';
				domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
			}
		},

		showCaptchaScreen : function()
		{
			if( document.all &&  navigator.appVersion.indexOf('MSIE 7.')!=-1 ){
				document.getElementById('recents').style.position = 'relative';
			}

			domUtilities.removeClassIfPresent('null', 'captcha', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'toField', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'fromField', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'shareMessage', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'greyScreen', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'captchaImg', 'sts-dn');
			document.getElementById('captchaImg').src = 'images/bots-two.jpg';
			domUtilities.removeClassIfPresent('null', 'captchaButton', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'errorMsg', 'captchaError');
			shareWidget.hideAll();	
			
			if(typeof(document.getElementById('recaptcha_response_field'))!='undefined' && document.getElementById('recaptcha_response_field')!=null){
				domUtilities.addListenerCompatible(document.getElementById('recaptcha_response_field'), 'keypress', function(e){
					// look for window.event in case event isn't passed in
					e = e || window.event;
			        if (e.keyCode == 13)
			        {
			        	shareWidget.submitCaptchaResponse();
			        }
					//console.log(e);
				});
			}
			
		},
		
		undoCaptchaScreen : function()
		{
			domUtilities.removeClassIfPresent('null', 'toField', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'fromField', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'shareMessage', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'captcha', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'greyScreen', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'captchaImg', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'captchaButton', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'errorMsg', 'captchaError');
			shareWidget.hideError();
			resetScreenForEmail();
		},

		submitCaptchaResponse : function()
		{
			//console.log(_shareToEmail, _isEmailShareDone);
			email.captchaShown=true;
			if(!_shareToEmail && !_isEmailShareDone){
				shareWidget.undoCaptchaScreen();
			} else{
				email.createMessage();
			}	
		},

		getRelatedShares_onSuccess : function(response)
		{
			//console.log(response);
			var storyList=document.getElementById('articleList');
			
			while (storyList.childNodes.length >= 1 )
		    {
		        storyList.removeChild(storyList.firstChild);
		    }
			
			var liClassName = 'relatedShare';
			
			domUtilities.addClass('null', 'loadingRelated', 'sts-dn');
			domUtilities.removeClass('null', 'relatedShares', 'sts-dn');

			if (response && response.urls && response.url_count > 0) 
			{
				document.getElementsByTagName('h2')[3].innerHTML = lang.strings['msg_related_shares'];
				for(var i=0;i<response.urls.length && i<3;i++)
				{
					if(i==2)
					{
						liClassName += ' lastVisible';
					}
					var relatedShare=document.createElement('li');
					if (response.urls[i].img != "")
					{
						relatedShare.className = liClassName + " hasImage";
				        var imgSrc = '';
				
						if(typeof(response.urls[i].imagehash)!=="undefined" && response.urls[i].imagehash && response.urls[i].imagehash != ""){
							imgSrc = "http://img.sharethis.com/" + response.urls[i].imagehash + "/100_100.jpg";			
						} else if(typeof(response.urls[i].img)!='undefined' && response.urls[i].img != "null" && response.urls[i].img != "" &&  response.urls[0].img.indexOf('http://sharethis.com/share/thumb')==-1 ) {
						     imgSrc = response.urls[i].img;
						} else {
							imgSrc = 'images/no-image.png';
						}
						
				        var imageDiv=document.createElement('a');
				        	imageDiv.className="relatedImg";
							imageDiv.setAttribute('stLink',response.urls[i].url);
				        var image=document.createElement('img');
				        	//image.onclick=function(){window.open(response.urls[i].url,'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1'); return false;};
				        	if(image.attachEvent){
				        		image.onclick=function(){logger.gaLog('DoneScreen - 5x','ImgLinkClick');window.open(imageDiv.getAttribute('stLink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
							}else{
								image.setAttribute('onclick',"logger.gaLog('DoneScreen - 5x','ImgLinkClick');window.open('"+response.urls[i].url+"','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
							}
				        	image.setAttribute('src',imgSrc);
				        imageDiv.appendChild(image);	
				        relatedShare.appendChild(imageDiv);
				    }
					/* var relatedDetails=document.createElement('div');
						relatedDetails.className="relatedDetails"; */
					var relatedTitle=document.createElement('h4');
						relatedTitle.className="relatedTitle link";
						relatedTitle.setAttribute('stLink',response.urls[i].url);
						if(relatedTitle.attachEvent){
							relatedTitle.onclick=function(){logger.gaLog('DoneScreen - 5x','TitleLinkClick');window.open(this.getAttribute('stLink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
						}else{		
							relatedTitle.setAttribute('onclick',"logger.gaLog('DoneScreen - 5x','TitleLinkClick');window.open('"+response.urls[i].url+"','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
						}
						//relatedTitle.onclick=function(){window.open(response.urls[i].url,'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1'); return false;};
						relatedTitle.setAttribute('title',response.urls[i].title);
						//relatedTitle.appendChild(document.createTextNode(response.urls[i].title));
						relatedTitle.innerHTML=response.urls[i].title;
						relatedShare.appendChild(relatedTitle);
												
					storyList.appendChild(relatedShare);
				}
				var moreStories = document.createElement('a');
					moreStories.className = 'sts-cb sts-fr';
					moreStories.setAttribute('id', 'moreStories');
					moreStories.setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(_config.hostname));
					//console.log(moreStories);
				storyList.appendChild(moreStories);
				
			}else{//ShareThis items
				document.getElementsByTagName('h2')[3].innerHTML = 'Share from anywhere';
				
				var toolbarModule=document.createElement('div');
				 	toolbarModule.id="toolbarUpsell";
				var relatedDetails=document.createElement('p');
					relatedDetails.className="relatedDetails";
					relatedDetails.innerHTML = lang.strings['msg_put_sharethis'];
				var relatedTitle=document.createElement('a');
					relatedTitle.className="relatedTitle link";
					relatedTitle.setAttribute('stlink',"http://sharethis.com/features/download");
					//relatedTitle.setAttribute('target', "_blank")
					if(relatedTitle.attachEvent){
						relatedTitle.onclick=function(){logger.gaLog('DoneScreen - 5x','TitleLinkClick');window.open(relatedTitle.getAttribute('stlink'),'external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');};
					}else{
						relatedTitle.setAttribute('onclick',"logger.gaLog('DoneScreen - 5x','TitleLinkClick');window.open('http://sharethis.com/features/download','external','resizable=1,location=1,status=1,scrollbars=1,toolbar=1');");
					}
					//relatedTitle.appendChild(document.createTextNode(lang.strings['msg_get_button']));
					relatedTitle.innerHTML=lang.strings['msg_get_toolbar'];

				if (!toolbarModule.hasChildNodes()) {	
					toolbarModule.appendChild(relatedDetails);
					toolbarModule.appendChild(relatedTitle);
				}
				document.getElementById('relatedShares').appendChild(toolbarModule);
			}
		},

		updateServiceCount : function(service, serviceTitle)
		{
			var usrSvc=$JSON.decode(cookie.getCookie('ServiceHistory'));
			if(usrSvc==false || usrSvc==null || usrSvc.length<1){
				usrSvc={};
				usrSvc[service]={};
				usrSvc[service].service=service;
				usrSvc[service].title = serviceTitle;
				usrSvc[service].count=1;
				cookie.setCookie('ServiceHistory',$JSON.encode(usrSvc));
				return true;
			}
			var obj={};
			var svc=null;
			var flag=false;
			var sortable=[];
			for(o in usrSvc){
				if(usrSvc[o].service==service){
					usrSvc[o].count++;
					usrSvc[o].title = serviceTitle;
					flag=true;
				}
				sortable.push(usrSvc[o]);
			}
			if(flag==false){
				usrSvc[service]={};
				usrSvc[service].service=service;
				usrSvc[service].title = serviceTitle;
				usrSvc[service].count=1;
			}
			else
			{
				sortable.sort(function(a,b){
					return b.count - a.count;
				});
				usrSvc={};
				for(var i=0;i<sortable.length;i++){
					usrSvc[sortable[i].service]= sortable[i];
				}
			}
			cookie.setCookie('ServiceHistory',$JSON.encode(usrSvc));
			return true;
		},
		
		createWordpressScreen : function()
		{
			shareWidget.updateServiceCount('wordpress', 'Wordpress');	
			if(_config.title==null){_config.title=_config.URL;}
			//console.log("createPoster");
			_config.poster="wordpress";
			logger.gaLog("Wordpress - 5x","poster_clicked");
			domUtilities.addClassIfNotPresent('null', 'moreTitle', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'welcomeMsg', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'mainBody', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'preShareScreen', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'emailShareDetails', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'charCounter', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'errorMsg', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'serviceCTAs', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'cancelLink', 'sts-dn');
			document.getElementById('serviceCTAs').style.height='95px';
			document.getElementById('shareButton').style.top='20px';
			document.getElementById('shareButton').style.bottom='auto';
			domUtilities.addClass('null', 'services', 'sts-dn');
			domUtilities.addClass('null', 'serviceNames', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'chicklets', 'sts-dn');
			domUtilities.addClass('null', 'extraInfo', 'sts-dn');
			var msgBox = document.getElementById('shareMessage');
			msgBox.value = 'YourBlogNameHere.wordpress.com';
			msgBox.setAttribute('placeholder', 'YourBlogNameHere.wordpress.com');
			msgBox.setAttribute('maxlength', 128);
			msgBox.style.height = '32px';
			_shareToWordpress = true;
		},

		showDoneScreen : function(noError)
		{
			//console.log(_shownDone, noError);
			domUtilities.removeClassIfPresent('null', 'errorMsg', 'captchaError');
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
			if(_shownDone==false && noError)
			{
				_shownDone = true;
				getRelatedShares(_config.URL);
				domUtilities.removeClass('null', 'doneMsg', 'sts-dn');
				domUtilities.addClass('null', 'preShareScreen', 'sts-dn');
				domUtilities.removeClassIfPresent('null', 'doneScreen', 'sts-dn');
				//domUtilities.addClass('null', 'shareDetails', 'sts-dn');
				//domUtilities.addClass('null', 'articleDetails', 'sts-dn');
				
				shareWidget.hideError();
				domUtilities.addClassIfNotPresent('null', 'serviceCTAs', 'sts-dn');
				domUtilities.addClassIfNotPresent('null', 'chicklets', 'sts-dn');
				domUtilities.addClassIfNotPresent('null', 'moreTitle', 'sts-dn');
				domUtilities.addClassIfNotPresent('null', 'welcomeMsg', 'sts-dn');
				domUtilities.addClassIfNotPresent('null', 'greyScreen', 'sts-dn');
				
//document.getElementById('btnShareAgain').onclick=function(){createPreferenceServices();hideDoneScreen();gaLog("DoneScreen","ShareAgain")};
			} else if(!noError){
				shareWidget.showError(lang.strings['msg_failed_share']);
			}
			domUtilities.removeClassIfPresent('null', 'mainBody', 'sts-dn');
		},

		showLoadingBox : function(msg)
		{
			if(msg)
			{
				document.getElementById('loading').innerHTML=msg;
			}
			document.getElementById('loading_img').innerHTML='<img src="/images/spinner.gif" alt="' + lang.strings['msg_loading'] +'">';
			document.getElementById('loading_box').style.display="block";
		},

		getEmailElement : function()
		{
			var element = document.getElementById('services').firstChild;
			while(element.nodeType != 1) {
				element = element.nextSibling;
			}
			return element;
		},
		
		showHome : function()
		{
			/* Re-initialize everything and set variables to default state.
				Back to the initial screen state
			*/
			var i = 0;
			//console.log("showHome");
			var hideElementListIDs = ['doneScreen', 'greyScreen', 'captcha', 'captchaImg', 'captchaButton', 'emailShareDetails', 'chicklets', 'doneMsg', 'moreTitle', 'cancelLink'];
			var showElementListIDs = ['mainBody', 'preShareScreen', 'shareMessage', 'serviceCTAs', 'services', 'extraInfo', 'moreLink', 'welcomeMsg', 'serviceNames'];
			
			for (i=0; i<hideElementListIDs.length; i++ )
			{
				domUtilities.addClassIfNotPresent('null', hideElementListIDs[i], 'sts-dn');
			}
			//console.log('done hiding elements');
			
			for (i=0; i<showElementListIDs.length; i++ )
			{
				domUtilities.removeClassIfPresent('null', showElementListIDs[i], 'sts-dn');
			}
		
			var toolbarUpsell = document.getElementById('toolbarUpsell');
			if(toolbarUpsell!='undefined' && toolbarUpsell!=null && typeof(toolbarUpsell)!='undefined'){
				toolbarUpsell.parentNode.removeChild(toolbarUpsell);
			}

			var emailElement = shareWidget.getEmailElement(); 
			if(domUtilities.hasClass(emailElement, 'checked')) {
				domUtilities.removeClass(emailElement, '', 'checked');
				domUtilities.addClass(emailElement, '', 'unchecked');
			}
			
			refreshServiceDisplays(false);

			document.getElementById('shareMessage').style.height = '100px';
			if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) ){
				document.getElementById('shareMessage').style.height = '90px';
				document.getElementById('articleDetails').style.marginTop = '-10px';
			}

			_twitterMessagePopulated = false;
			document.getElementById('shareMessage').setAttribute('placeholder', 'Write your comment here...');
			if(_shareToTwitter){
				document.getElementById('shareMessage').value = '';
				populateTwitterBox();
			} else{
				document.getElementById('shareMessage').value = 'Write your comment here...';	
			}
			
			document.getElementById('txtFriendsName').value = '';
			domUtilities.removeClassIfPresent('null', 'txtFriendsName', 'friendSelected');
			
			_shownDone = false;
			_shareToWordpress = false;
			
			updateCharCount();
			shareWidget.hideError();
			document.getElementById('serviceCTAs').style.height='100px';
			document.getElementById('shareButton').style.top='auto';
			document.getElementById('shareButton').style.bottom='34px';
			document.getElementById('shareDetails').style.marginTop='2px';
			document.getElementById('shareDetails').style.marginBottom='10px';
			document.getElementById('articleDetails').style.marginTop='10px';
			document.getElementById('articleDetails').style.marginBottom='10px';
			
			if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) )
			{
					document.getElementById('shareButton').style.top='auto';
					document.getElementById('shareButton').style.bottom='26px';
			}
			//alert(document.getElementById('shareMessage').style.height);
		},
		
		showError : function(errorMessage)
		{
			if(domUtilities.hasClass(document.getElementById('errorMsg'), 'sts-dn') && typeof(document.getElementById('shareMessage'))!='undefined')
			{
//				var oldHeight = parseInt(document.getElementById('shareMessage').clientHeight);
//				if( document.all && navigator.appVersion.indexOf('MSIE')!=-1 ){
//					document.getElementById('shareMessage').style.height = (oldHeight - 20) + 'px'; 
//				} else {
//					document.getElementById('shareMessage').style.height = (oldHeight - 10) + 'px'; 
//				}
			}
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'errorMsg', 'sts-dn');
			document.getElementById('errorMsg').innerHTML = errorMessage;
		},
		
		hideError : function()
		{
			//console.trace();
			if(!domUtilities.hasClass(document.getElementById('errorMsg'), 'sts-dn') && typeof(document.getElementById('shareMessage'))!='undefined')
			{
//				var oldHeight = parseInt(document.getElementById('shareMessage').clientHeight);
//				if( document.all && navigator.appVersion.indexOf('MSIE')!=-1 ){
//					document.getElementById('shareMessage').style.height = (oldHeight + 20) + 'px'; 
//				} else {
//					document.getElementById('shareMessage').style.height = (oldHeight + 10) + 'px'; 
//				}
			}
			domUtilities.addClassIfNotPresent('null', 'errorMsg', 'sts-dn');
			//console.log('hideError', document.getElementById('shareMessage').style.height);
		}
	};
}();

/********************LOGGING***********************/
var widgetLogger = {};
var logger = function(){
	var _configOptions = null;
	return {
		logEvent : function(destination1,eventType) {
			if(_configOptions == null)
			{
				_configOptions = shareWidget.getConfigOptions();
			}

			var source = "";
			if (_configOptions.toolbar==true) {
				source = "toolbar5x";
			}else if (_configOptions.page != "home" && _configOptions.page != "") {
				source = "chicklet5x";
			} else {
				source = "button5x";
			}
			var url33 = ( ("https:" == document.location.protocol)?"https://":"http://");
			url33+= "l.sharethis.com/log?event="+eventType;
			url33+= "&source=" + source;
			url33+= "&publisher="+ encodeURIComponent(_configOptions.publisher);
			url33+= "&hostname="+ encodeURIComponent(_configOptions.hostname);
			url33+= "&location="+ encodeURIComponent(_configOptions.location);
			url33+= "&destinations="+destination1;
			url33+= "&ts=" + (new Date()).getTime();
			url33+= "&title=" + encodeURIComponent(_configOptions.title);
			url33+= "&url=" + encodeURIComponent(_configOptions.URL);
			url33+= "&sessionID=" + _configOptions.sessionID;
			url33+= "&fpc=" + _configOptions.fpc;
			url33+= "&type=" + _configOptions.service + "_" + _configOptions.type;

			var logger33 = new Image(1,1);
			logger33.src = url33;
			logger33.onload = function(){return;};
		},
		
		shareLog: function(service){
			 if (widgetLogger.pubTracker != null){
				 widgetLogger.pubTracker._trackEvent("ShareThis", service);
			}
			 if(typeof(window.postMessage)!=="undefined" && document.referrer!==""){
					parent.postMessage("ShareThis|click|"+service+"|"+_configOptions.URL,document.referrer);
				}
		},
		
		//this will initialize the Widget GA and log a page view..
		initGA : function(){
			if(_configOptions == null)
			{
				_configOptions = shareWidget.getConfigOptions();
			}
			if(typeof(_gat)=="undefined"){
				var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
				var headID = document.getElementsByTagName("head")[0];         
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = gaJsHost + "google-analytics.com/ga.js";
				onDemand.js(newScript.src,function(){
					 try{
						widgetLogger.ga = _gat._getTracker("UA-1645146-17");widgetLogger.ga._trackPageview();
						if (_configOptions.tracking && _configOptions.publisherGA !== null){ 
							widgetLogger.pubTracker=_gat._getTracker(_configOptions.publisherGA);
							widgetLogger.ga._trackEvent("PublisherGA-"+_configOptions.tracking,_configOptions.publisherGA,_configOptions.publisher);

						}else if(_configOptions.publisherGA!==null){
							widgetLogger.pubTracker=_gat._getTracker(_configOptions.publisherGA);
							widgetLogger.ga._trackEvent("PublisherGA-"+_configOptions.tracking,_configOptions.publisherGA,_configOptions.publisher);
						}
					 
					 }catch(err) {}
				});
			}else{
				if (_configOptions.tracking && _configOptions.publisherGA != null){ 
					widgetLogger.pubTracker=_gat._getTracker(_configOptions.publisherGA);
					widgetLogger.ga._trackEvent("PublisherGA-"+_configOptions.tracking,_configOptions.publisherGA,_configOptions.publisher);
				};
			}
		},
		
		gaLog : function(category, action, label, value) {
			 if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null ) {
				 widgetLogger.ga._trackEvent(category, action, label, value);
			 }
		}
	};
}();

/********************Posters**********/

var poster= function(){
	var sharCreated = false, sharURL = "";
	var doneQueue = {};

	return {
		clearSharURL : function(){
			sharURL = "";
			sharCreated = false;
		},

		/***************SHAR URL******************/

		createShar : function(url)
		{
			var tmpOptions=shareWidget.getConfigOptions();
			
			if(url!=="" && url!==" " && url!==null && !sharCreated)
			{	
				if(tmpOptions.shorten!=true){
					sharURL=url;
					sharCreated = true;
					return true;
				}else{
					var data=["return=json","cb=poster.createShar_onSuccess","service=createSharURL","url="+encodeURIComponent(url)];
					data=data.join('&');
					jsonp.makeRequest((("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?"+data);
				}
			}
		},

		createShar_onSuccess : function(response)
		{	
			if(response.status=="SUCCESS")
			{
				sharURL=response.data.sharURL;
				sharCreated = true;
			}	
		},

		getSharURL : function()
		{
			return sharURL;
		},

		postToWordpress : function(service)
		{
			var configOptions = shareWidget.getConfigOptions();
			/* Valid blog URL Message */
	
			var wpurl=document.getElementById('shareMessage').value;
			
			if(jsUtilities.trimString(wpurl)=='' || wpurl==document.getElementById('shareMessage').getAttribute('placeholder') || wpurl.indexOf('wordpress.com') == -1)
			{
				shareWidget.showError(lang.strings['msg_empty_wp']);
			} else {
				var url=(("https:" == document.location.protocol) ? "https://ws." : "http://wd.")+"sharethis.com/api/sharer.php?destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&wpurl={wpurl}&source=button5x&service={service}&type={type}";
				url=url.replace("{destination}","wordpress");
				url=url.replace("{url}",encodeURIComponent(configOptions.URL));
				url=url.replace("{title}",encodeURIComponent(configOptions.title));
				url=url.replace("{wpurl}",encodeURIComponent(wpurl));
				url=url.replace("{publisher}",configOptions.publisher);
				url=url.replace("{fpc}",configOptions.fpc);
				url=url.replace("{sessionID}",configOptions.sessionID);
				url=url.replace("{service}",configOptions.service);
				url=url.replace("{type}",configOptions.type);
			
				//console.log('in post to wordpress - ' +  url);
				window.open(url,"post_wordpress" ,"status=1, height=700, width=970, resizable=1" );
				//shareWidget.poster=null;
				shareWidget.showDoneScreen(true);
			}
			return true;
		},
		
		post_onSuccess : function(response)
		{
			//console.log(response);
			if( (_shareToEmail && _isEmailShareDone) || !_shareToEmail){
				if(response && typeof(response.status)!='undefined' && response.status=="SUCCESS"){
					shareWidget.showDoneScreen(true);
				} else{
					shareWidget.showDoneScreen(false);
				}				
			}
		},
		
		multiPost : function(user, articleObj, services, comment) 
		{
			
			var configOptions = shareWidget.getConfigOptions();
			
			var data, source = "";
			doneQueue={};
			if (configOptions.toolbar==true) {
				source = "toolbar5x";
			} else if (configOptions.page != "home" && configOptions.page != "") {
				source = "chicklet5x";
			} else {
				source = "button5x";
			}
			
			var apiUrl = (("https:" == document.location.protocol) ? "https://ws." : "http://wd.") + "sharethis.com/api/getApi.php?";
			var twitterComment = comment;
			var hasUrlInComment = comment.indexOf('http://shar.es');
			if(hasUrlInComment == -1){
				hasUrlInComment = comment.indexOf('http://qa.shar.es');
				if(hasUrlInComment == -1){
					hasUrlInComment = comment.indexOf('http://qa2.shar.es');
				}
			}
			
			if( hasUrlInComment != -1){
				comment = comment.slice(0, hasUrlInComment);
			}
			
			logger.gaLog('Multi-Post - 5x', services.toString());
			
			if(configOptions.thumb=='images/no-image.png'){
				configOptions.thumb = '';
			}
			
			for(var i in services)
			{
				logger.gaLog("Posting to.. - 5x", services[i]);
				data = ["source=" + source, "publisher="+ encodeURIComponent(configOptions.publisher), "hostname="+ encodeURIComponent(configOptions.hostname), "location="+ encodeURIComponent(configOptions.location), "sessionID="+configOptions.sessionID, "fpc="+configOptions.fpc, "return=json","cb=poster.post_onSuccess", "urlhash=" + (articleObj.urlhash), "url=" + encodeURIComponent(articleObj.url), 			"type=" + configOptions.service + "_" + configOptions.type, "title="+articleObj.title, "refer=" + document.referrer, "agent=" + navigator.userAgent,"aurl=" + encodeURIComponent(articleObj.aurl), "img="+ encodeURIComponent(configOptions.thumb), "description="+ encodeURIComponent(configOptions.summary)];
				
				if(comment=='Write your comment here...'){comment='';}
				if(twitterComment=='Write your comment here...'){twitterComment='';}
				
				if(services[i] == 'twitter')
				{
					if(twitterComment.length > 140)
					{
						var tUrl = twitterComment.slice(twitterComment.indexOf('http'), twitterComment.indexOf('http') + 24);
						twitterComment = twitterComment.slice(0, 115) + ' ' + tUrl;
					}
					
					doneQueue['twitter'] = false;
					data.push("service=postTwitter", "status=" + encodeURIComponent(twitterComment), "destination=twitter");
					data=data.join('&');
					jsonp.makeRequest(apiUrl+data);
				}
				else if (services[i] == 'facebook')
				{
					doneQueue['facebook'] = false;
				 	data.push("service=postFacebook", "comment=" + encodeURIComponent(comment), "destination=facebook");
					data=data.join('&');
					jsonp.makeRequest(apiUrl+data);
				}
				else if (services[i] == 'yahoo')
				{
					doneQueue['yahoo'] = false;
					data.push("service=postYahooPulse", "comment=" + encodeURIComponent(comment), "destination=ypulse");
					data=data.join('&');
					jsonp.makeRequest(apiUrl+data);
				}
				else if (services[i] == 'linkedin')
				{
					doneQueue['linkedin'] = false;
				 	data.push("service=postLinkedIn", "comment=" + encodeURIComponent(comment), "destination=linkedin");
					data=data.join('&');
					jsonp.makeRequest(apiUrl+data);
				}
				else if (services[i].search('facebookfriend')!='-1')
				{
					doneQueue['facebook-friend'] = false;
					var friendId = services[i].slice(services[i].indexOf('-') + 1);
					data.push("service=postFacebookUserWall", "comment=" + encodeURIComponent(comment), "destination=facebook", "friend_id=" + friendId);
					data=data.join('&');
					jsonp.makeRequest(apiUrl+data);
					logger.gaLog("Facebook Friends Wall - 5x","Completed");
				}
				
			}

			//poster.post_onSuccess();
		}
	};
}();

//Adds initialize to be called when dom ready
if (typeof(window.addEventListener) != 'undefined') {
    window.addEventListener("load", shareWidget.initialize, false);
} else if (typeof(document.addEventListener) != 'undefined') {
	document.addEventListener("load", shareWidget.initialize, false);
} else if (typeof window.attachEvent != 'undefined') {
	window.attachEvent("onload", shareWidget.initialize );
}


/***************I18N******************/
if(typeof(lang)=="undefined"){
	var lang={};
	lang.strings=new Object;
	
	/* -- */
	
	lang.strings['msg_no_services_selected'] = 'Oops, an error : please select a service below to share to.';
	lang.strings['msg_no_email_recipients'] = 'Please enter a valid recipient email address.';
	lang.strings['msg_valid_email_add_from'] = 'Please enter a valid email address in the "From" field.';
	lang.strings['msg_valid_recipients'] = 'Please enter a valid recipient';
	lang.strings['msg_captcha'] = 'Please enter the Captcha response.';
	lang.strings['msg_share']="Share this with your friends";
	lang.strings['msg_view_all']="More";
	lang.strings['msg_hide_all']="Back to default view";
	lang.strings['msg_share_success']="Your message was successfully shared!";
	lang.strings['msg_share_again']="Share again";
	lang.strings['msg_related_shares']="Most Popular Articles";
	lang.strings['msg_get_button'] = 'Get the button!';
	lang.strings['msg_get_toolbar'] = 'Get the browser add-on!';
	lang.strings['msg_put_sharethis'] = 'Install ShareThis toolbar on your browser and then share easily from any website!';
	lang.strings['msg_email_privacy'] = 'Privacy Policy';
	lang.strings['msg_import_contacts'] = 'Import contacts';
	lang.strings['msg_signout']="Sign out";
	lang.strings['msg_failed_login']='An error occured during login. Retrying..';
	lang.strings['msg_empty_wp']='Please enter a valid wordpress blog address below to share.';
	lang.strings['msg_email_to'] = 'To:';
	lang.strings['msg_email_from'] = 'From:';
	lang.strings['msg_email_captcha_info'] = 'Help us prevent spam by entering the words below.';
	lang.strings['msg_email_captcha_incorrect'] = 'Incorrect captcha response, please try again.';
	lang.strings['msg_share_to_destinations'] = 'Pick one or more destinations:';
	lang.strings['msg_failed_share'] = 'There was an error while sharing. Please try again.';
	lang.strings['msg_facebook_friend'] = 'Please enter a valid Facebook friend name.';
}

//console.log("EOF");