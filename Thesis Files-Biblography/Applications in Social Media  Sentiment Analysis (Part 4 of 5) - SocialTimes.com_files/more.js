/**
 *
 * Custom js script file.
 *
 */
(function ($) {
	$( document ).ready( function () {
		initThickboxes(); //Needed for using multiple thickbox styles
		initOccupationDropdowns(); //For scoop jobs module
	});

	function initThickboxes() {
	    $("#tipsLink,#tipsLinkImage").click(function() {
			$('link[rel*=style]').each(function(i)
			{
				if (this.getAttribute('href') == 'http://www.mediabistro.com/common_v4/css/lightbox/socialtimes.css' 
					|| this.getAttribute('href') == 'http://www.mediabistro.com/common_v4/javascript/lightbox/thickbox.css') this.disabled = true;
			});
		})
		
	    $('#sjWizardLink').click(function() {
			$('link[rel*=style]').each(function(i)
			{
				if (this.getAttribute('href') == 'http://www.mediabistro.com/common_v4/css/lightbox/socialtimes.css' 
					|| this.getAttribute('href') == 'http://www.mediabistro.com/common_v4/javascript/lightbox/thickbox.css') this.disabled = false;
			});
		})

		var domain = 'http://www.mediabistro.com';  // where all the references live
		var markerClass = 'scoop-signup-activate';  // to which we attach lightbox trigger
		var signupLink = $('.' + markerClass);

		// parse class attributes on link to get our params (site and campaign code)
		var getParams = function( pClasses ) {
			var classes = pClasses ? pClasses.split(' ') : [];
			var len = classes.length;
			var params = {};
			var tmpArr = [];
			for ( var i = 0; i < len; ++i ) {
				if ( classes[i] != markerClass ) {
					tmpArr = classes[i].split('-');
					if (tmpArr.length > 1)
						params[tmpArr[0]] = tmpArr[1];
				}
			}
			return params;
		};
		var params = getParams( signupLink.attr('class') );
		var sitename = params.site || 'mediabistro';
		var campaignCode = params.campaign || '';
		
		// activating lightbox
		var triggerLightbox = function () {
			//Scoop Job Wizard Form vars
			var cid = $('#TargetCategory1').val();
			var oid = $('#TargetOccupation1').val();
			var min = $('#salaryMin').val();
			var max = $('#salaryMax').val();		
		
			// markup
			var html = {
				css: '<link rel="stylesheet" href="'+domain+'/common_v4/css/lightbox/'+sitename+'.css" type="text/css" />',

				thickboxAnchor: '<a href="#TB_inline?width=750&amp;height=640&amp;nomargin=1;inlineId=scoopMsg" id="scoopMsgTrigger" style="display:none" class="thickbox"></a><div id="scoopMsg" style="display:none;"></div>',

				iframe: '<ifr'+'ame src="'+domain+'/memberscenter/quickscoopregistrationV2.aspx?css='+sitename+'&c='+campaignCode+'&cid='+cid+'&oid='+oid+'&min='+min+'&max='+max+'" id="sjWizardFrame" width="750" height="635" style="border:none;" marginheight="0" marginwidth="0" frameborder="0"></ifr'+'ame>'
			};

			// include dependencies
			$( html.css + html.thickboxAnchor ).appendTo('body');		

			$('#scoopMsg').html( html.iframe );
			$('#scoopMsgTrigger').click();
			$("#TB_overlay").unbind('click'); // Clicking outside the box does not force close    
			$('#TB_closeAjaxWindow').html( '<a href="#" id="TB_closeWindowButton">&nbsp;X&nbsp;</a>' );
			$("#TB_closeWindowButton").click(tb_remove);
			$("#TB_window").width(750);
			return false;
		};
		$.getScript( '/wp-includes/js/thickbox/thickbox.js', function () {
			signupLink.click( triggerLightbox );
		});
	}
	
	function initOccupationDropdowns() {
		var occupationCategories = [
			{categoryID: 9, category: "Administrative/Clerical"},
			{categoryID: 1, category: "Business Management"},
			{categoryID: 3, category: "Creative/Design"},
			{categoryID: 2, category: "Editorial"},
			{categoryID: 4, category: "IT/Web Development"},
			{categoryID: 5, category: "Marketing/Advertising/Promotion"},
			{categoryID: 12, category: "Product/Project Management"},
			{categoryID: 7, category: "Public Relations"},
			{categoryID: 6, category: "Sales/Account Management"},
			{categoryID: 11, category: "Social Media"},
			{categoryID: 8, category: "TV/Video/Audio/Radio/Film"}
		];
		
		var occupations = {
			"9":
			[
				{occupationID: "160", occupation: "Administrative Assistant"},
				{occupationID: "161", occupation: "Executive Secretary/Assistant"},
				{occupationID: "162", occupation: "Office Manager"},
				{occupationID: "163", occupation: "Other"}
			],
			"1":
			[
				{occupationID: "174", occupation: "Business Analyst"},
				{occupationID: "1", occupation: "Business Development Director/Manager"},
				{occupationID: "2", occupation: "Business Manager"},
				{occupationID: "3", occupation: "Business Owner"},
				{occupationID: "4", occupation: "Circulation Director/Manager"},
				{occupationID: "5", occupation: "Executive Management"},
				{occupationID: "6", occupation: "Financial Management"},
				{occupationID: "7", occupation: "General Management"},
				{occupationID: "8", occupation: "Human Resource Management"},
				{occupationID: "9", occupation: "Operations Management"},
				{occupationID: "10", occupation: "Print Production Director/Manager"},
				{occupationID: "11", occupation: "Project Director/Manager"},
				{occupationID: "12", occupation: "Publisher"},
				{occupationID: "13", occupation: "Publisher, Associate"},
				{occupationID: "14", occupation: "Other"}
			],
			"3":
			[
				{occupationID: "169", occupation: "3D Graphics"},
				{occupationID: "54", occupation: "Animator"},
				{occupationID: "55", occupation: "Art Director/Manager"},
				{occupationID: "56", occupation: "Artist"},
				{occupationID: "57", occupation: "Assistant Producer"},
				{occupationID: "59", occupation: "Commercial and Industrial Designers"},
				{occupationID: "60", occupation: "Creative Director"},
				{occupationID: "61", occupation: "Design Director"},
				{occupationID: "63", occupation: "Director of Photography"},
				{occupationID: "64", occupation: "Graphic Designer"},
				{occupationID: "65", occupation: "Graphics Editor"},
				{occupationID: "66", occupation: "Illustrator"},
				{occupationID: "170", occupation: "Mobile"},
				{occupationID: "175", occupation: "Motion Graphics"},
				{occupationID: "67", occupation: "Multimedia Artist"},
				{occupationID: "68", occupation: "Photo Editor"},
				{occupationID: "69", occupation: "Photographer"},
				{occupationID: "70", occupation: "Producer"},
				{occupationID: "71", occupation: "Technical Illustrator"},
				{occupationID: "176", occupation: "Web Designer"},
				{occupationID: "72", occupation: "Other"}
			],
			"2":
			[
				{occupationID: "15",  occupation: "Anchor"},
				{occupationID: "16",  occupation: "Author/Writer"},
				{occupationID: "181", occupation: "Blogger"},
				{occupationID: "17",  occupation: "Bureau Chief"},
				{occupationID: "18",  occupation: "Copy Chief, Copy Editor"},
				{occupationID: "19",  occupation: "Copywriter"},
				{occupationID: "20",  occupation: "Editor, Acquisitions"},
				{occupationID: "21",  occupation: "Editor, Assignment/Associate Editor"},
				{occupationID: "22",  occupation: "Editor, Assistant Managing"},
				{occupationID: "23",  occupation: "Editor, Deputy"},
				{occupationID: "24",  occupation: "Editor, Executive"},
				{occupationID: "25",  occupation: "Editor, Features"},
				{occupationID: "26",  occupation: "Editor, Managing"},
				{occupationID: "27",  occupation: "Editor, Senior"},
				{occupationID: "30",  occupation: "Editor-in-Chief"},
				{occupationID: "28",  occupation: "Editorial Assistant"},
				{occupationID: "29",  occupation: "Editorial Director"},
				{occupationID: "177", occupation: "Grant Writer"},
				{occupationID: "32",  occupation: "Literary Agent"},
				{occupationID: "33",  occupation: "News Director"},
				{occupationID: "34",  occupation: "News Editor"},
				{occupationID: "35",  occupation: "News Producer"},
				{occupationID: "178", occupation: "Online Editor"},
				{occupationID: "36",  occupation: "Photo Editor"},
				{occupationID: "37",  occupation: "Producer, Assistant/Associate"},
				{occupationID: "38",  occupation: "Producer, Executive"},
				{occupationID: "39",  occupation: "Producer, Post-Production"},
				{occupationID: "40",  occupation: "Producer/Director"},
				{occupationID: "41",  occupation: "Production Coordinator"},
				{occupationID: "42",  occupation: "Production Director/Manager"},
				{occupationID: "43",  occupation: "Production Editor"},
				{occupationID: "44",  occupation: "Proofreader"},
				{occupationID: "179", occupation: "Publisher"},
				{occupationID: "45",  occupation: "Reporter/Correspondent"},
				{occupationID: "46",  occupation: "Research Analyst/Associate"},
				{occupationID: "47",  occupation: "Research Director/Manager"},
				{occupationID: "48",  occupation: "Researcher"},
				{occupationID: "49",  occupation: "Speech Writer"},
				{occupationID: "50",  occupation: "Staff Writer"},
				{occupationID: "51",  occupation: "Technical Writer"},
				{occupationID: "52",  occupation: "Traffic Manager"},
				{occupationID: "180", occupation: "Web Editor"},
				{occupationID: "53",  occupation: "Other"}
		],
			"4":
			[
				{occupationID: "196", occupation: "Engineer"},
				{occupationID: "73", occupation: "Information Architect"},
				{occupationID: "74", occupation: "Internet/Online Producer"},
				{occupationID: "193", occupation: "Network Administrator"},
				{occupationID: "167", occupation: "SEM/SEO Manager"},
				{occupationID: "194", occupation: "User Experience Designer"},
				{occupationID: "195", occupation: "User Experience Director"},
				{occupationID: "76", occupation: "Web Designer"},
				{occupationID: "168", occupation: "Web Developer"},
				{occupationID: "77", occupation: "Web Editor"},
				{occupationID: "79", occupation: "Web Programmer"},
				{occupationID: "80", occupation: "Web Publisher"},
				{occupationID: "81", occupation: "Webmaster"},
				{occupationID: "82", occupation: "Other"}
			],
			"5":
			[
				{occupationID: "83",  occupation: "Account Coordinator"},
				{occupationID: "84",  occupation: "Account Manager"},
				{occupationID: "85",  occupation: "Advertising Assistant"},
				{occupationID: "86",  occupation: "Advertising Clerk"},
				{occupationID: "87",  occupation: "Advertising Coordinator"},
				{occupationID: "88",  occupation: "Advertising Executive/Director"},
				{occupationID: "89",  occupation: "Advertising Manager"},
				{occupationID: "90",  occupation: "Agency Producer"},
				{occupationID: "197", occupation: "Audience Development Director/Manager"},
				{occupationID: "91",  occupation: "Brand Manager"},
				{occupationID: "198", occupation: "Circulation Director/Manager"},
				{occupationID: "92",  occupation: "Client Services Director/Manager"},
				{occupationID: "171", occupation: "Creative Director/Manager"},
				{occupationID: "199", occupation: "Digital Strategist"},
				{occupationID: "94",  occupation: "Events Planner"},
				{occupationID: "95",  occupation: "Market Research Analyst"},
				{occupationID: "96",  occupation: "Market Research Director/Manager"},
				{occupationID: "97",  occupation: "Marketing Assistant/Associate"},
				{occupationID: "98",  occupation: "Marketing Communications Director/Manager"},
				{occupationID: "99",  occupation: "Marketing Coordinator"},
				{occupationID: "100", occupation: "Marketing Director/Manager"},
				{occupationID: "101", occupation: "Marketing/Promotion Art Director"},
				{occupationID: "102", occupation: "Media Buyer"},
				{occupationID: "103", occupation: "Media Director"},
				{occupationID: "104", occupation: "Media Planner"},
				{occupationID: "93",  occupation: "Online Marketing Director/Manager"},
				{occupationID: "105", occupation: "Product/Brand Manager"},
				{occupationID: "172", occupation: "Project Manager"},
				{occupationID: "106", occupation: "Promotion Copywriter"},
				{occupationID: "107", occupation: "Promotions Manager"},
				{occupationID: "108", occupation: "Promotions Planner"},
				{occupationID: "109", occupation: "Promotions Producer"},
				{occupationID: "200", occupation: "SEM/SEO Manager"},
				{occupationID: "110", occupation: "Traffic Manager/Coordinator"},
				{occupationID: "201", occupation: "VP Marketing"},
				{occupationID: "111", occupation: "Other"}
			],
			"12":
			[
				{occupationID: "187", occupation: "Producer"},
				{occupationID: "188", occupation: "Producer, Associate"},
				{occupationID: "189", occupation: "Producer, Senior"},
				{occupationID: "190", occupation: "Product Manager"},
				{occupationID: "191", occupation: "Program Manager"},
				{occupationID: "192", occupation: "Project Manager"},
			],
			"7":
			[
				{occupationID: "124", occupation: "Account Director/Manager"},
				{occupationID: "125", occupation: "Account Executive"},
				{occupationID: "126", occupation: "Communications Editor"},
				{occupationID: "127", occupation: "Communications Manager"},
				{occupationID: "128", occupation: "Community Relations"},
				{occupationID: "129", occupation: "Community/Public Affairs Manager"},
				{occupationID: "130", occupation: "Media Relations Director/Manager"},
				{occupationID: "131", occupation: "Public Relations Director/Manager"},
				{occupationID: "132", occupation: "Public Relations/Communications writer"},
				{occupationID: "133", occupation: "Publicist"},
				{occupationID: "134", occupation: "Publicist, Associate"},
				{occupationID: "135", occupation: "Publicity Director/Manager"},
				{occupationID: "202", occupation: "VP Public Relations"},
				{occupationID: "136", occupation: "Other"}
			],
			"6":
			[
				{occupationID: "112", occupation: "Account Coordinator"},
				{occupationID: "113", occupation: "Account Executive"},
				{occupationID: "114", occupation: "Account Manager"},
				{occupationID: "115", occupation: "Account Supervisor"},
				{occupationID: "116", occupation: "Ad Services Coordinator"},
				{occupationID: "203", occupation: "Business Development Director/Manager"},
				{occupationID: "204", occupation: "Publisher"},
				{occupationID: "117", occupation: "Sales and Marketing Director"},
				{occupationID: "118", occupation: "Sales Assistant/Associate"},
				{occupationID: "119", occupation: "Sales Coordinator"},
				{occupationID: "120", occupation: "Sales Executive"},
				{occupationID: "121", occupation: "Sales Manager"},
				{occupationID: "122", occupation: "Sales Representative"},
				{occupationID: "205", occupation: "VP Sales"},
				{occupationID: "123", occupation: "Other"}
			],
			"11":
			[
				{occupationID: "182", occupation: "Community Coordinator"},
				{occupationID: "183", occupation: "Community Manager"},
				{occupationID: "184", occupation: "Manager, Blog Relations"},
				{occupationID: "185", occupation: "Social Media Coordinator"},
				{occupationID: "186", occupation: "Social Media Director/Manager"},
			],
			"8":
			[
				{occupationID: "137", occupation: "Anchor"},
				{occupationID: "138", occupation: "Announcer"},
				{occupationID: "139", occupation: "Audio Engineer"},
				{occupationID: "140", occupation: "Audio Production"},
				{occupationID: "141", occupation: "Audio/Video Production"},
				{occupationID: "142", occupation: "Camera Operator"},
				{occupationID: "143", occupation: "Creative Director"},
				{occupationID: "144", occupation: "DJ"},
				{occupationID: "145", occupation: "Film and Video Editor"},
				{occupationID: "147", occupation: "News Producer"},
				{occupationID: "148", occupation: "Producer, Assistant/Associate"},
				{occupationID: "149", occupation: "Producer, Executive"},
				{occupationID: "150", occupation: "Producer, Post-Production"},
				{occupationID: "151", occupation: "Producer/Director"},
				{occupationID: "152", occupation: "Production Coordinator"},
				{occupationID: "153", occupation: "Production Director/Manager"},
				{occupationID: "154", occupation: "Production Editor"},
				{occupationID: "155", occupation: "Reporter"},
				{occupationID: "156", occupation: "Sound Designer/Mixer"},
				{occupationID: "157", occupation: "Sound Producer"},
				{occupationID: "158", occupation: "Video Production"},
				{occupationID: "173", occupation: "Writer"},
				{occupationID: "159", occupation: "Other"}
			]
		};
		
		/* Populate occupation categories */
		for (var i = 0; i < occupationCategories.length; i++) {
			 $('#TargetCategory1').
				  append($("<option></option>").
				  attr("value",occupationCategories[i].categoryID).
				  text(occupationCategories[i].category)); 			
		}		
		
		/* Populate occupations */
		
		setOccupationDropdown(0); //initial
	
		$('#TargetCategory1').change(function() {
			setOccupationDropdown($(this).val());
		});
		
		
		function setOccupationDropdown(categoryID) {
			$('#TargetOccupation1').empty().append("<option>--Choose Occupation--</option>");
			
			if (categoryID > 0) {
				for (var i = 0; i < occupations[categoryID].length; i++) {
					occupations[categoryID][i].occupationID;
					$('#TargetOccupation1').
					  append($("<option></option>").
					  attr("value",occupations[categoryID][i].occupationID).
					  text(occupations[categoryID][i].occupation)); 
				}
			} else {
				for (var i = 0; i < occupationCategories.length; i++) {
					var thisCatID = occupationCategories[i].categoryID;
					$('#TargetOccupation1').
					  append($("<option></option>").
					  attr("disabled", "disabled").
					  attr("style", "color:#F60").
					  text("[--"+occupationCategories[i].category+"--]")); 
					
					for (var j = 0; j < occupations[thisCatID].length; j++) {
						$('#TargetOccupation1').
						  append($("<option></option>").
						  attr("value",occupations[thisCatID][j].occupationID).
						  text(occupations[thisCatID][j].occupation)); 
					}
				}
			}	
		}
	}

})(jQuery);