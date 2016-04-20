function unescapeHTML(s)
  {
    return s.replace(
      /&(amp|[lg]t|quot);/g,
      function(m, p1)
      {
        var map = {
          amp:  "&",
          lt:   "<",
          gt:   ">",
          quot: '"'
        };

        return map[p1];
      });
  } 	
function userPopup(text){
		
		var friends=new Array();
		var token=FB.getSession().access_token;
		$('body').append($("<div id='overlay'><div id='popup'><div id='sendstatusintro'>Select up to five friends</div><div id='sentmessage'>Sent!</div> <div id='sendstatus'></div><div id='friendlist'></div></div></div>"));
		$('#sendstatus').mousedown(function(){
			$(this).addClass('pressed');
		});
		$('#sendstatus').mouseup(function(){
			$(this).removeClass('pressed');
		});
		$('#overlay').click(function(event){
		if($(event.target).is('#overlay'))
			$('#overlay').remove();
		});
		$('#closestatus').click(function(event){
			$('#overlay').remove();
		});
		$('#sendstatus').click(function(){
		var ids=new Array();
		$('div.friend.selected').each(function(){
			ids.push($(this).data('fid'));
			});
		for( j in ids){
		FB.api('/'+ids[j]+'/feed','post',{
		message:text,
		picture:'http://facebook-statuses.com/fb/postme.jpg',
		link:'http://facebook-statuses.com',
		name:'Facebook Statuses',
		caption:'http://facebook-statuses.com',
		description:'The largest facebook status collection'
		});
		
		}
		$('#sentmessage').queue();
		$('#sentmessage').fadeIn('slow').delay(10).queue(function(){
		$('#overlay').remove();
		});
		
		
		
		});
		FB.api('/me/friends', function(response) {
			for (i in response.data){
				friend=$('<div class="friend"><img src="https://graph.facebook.com/' + response.data[i]['id'] + '/picture/&type=square"/> <div class="name">'+response.data[i]['name']+'</div></div>');
				friend.data('fid',response.data[i]['id']);
				
				friend.click(function(){
					f=$(this);
					if(!f.hasClass('selected') && $('div.friend.selected').length<5 ) {
						f.addClass('selected');
					}else{
					if(f.hasClass('selected')) f.removeClass('selected');
					}
					
						
				});
				$('#friendlist').append(friend);
			}
		});

		}
		
		jQuery(document).ready(function(){
		jQuery('body').append($('<div id="fb-root"></div>'));
		FB.init({appId  : '183357651705684',channelUrl  : 'http://facebook-statuses.com/fb/channel.html',xfbml:true,cookie:true	});
		jQuery('.fb-send-link').click(function(){
		
		
		var text=unescapeHTML(jQuery.trim($(this).parents('.statusbox').find('.status').html()));
		
		FB.getLoginStatus(function(response) {
			if (response.session) {
			userPopup(text);
		} else {
				FB.login(function(response) {
					if (response.session) {
						userPopup(text);
					} else {
					
					}
				},{perms:'friends_about_me,publish_stream,friends_photos'});

		}
		});

		});
			
		});
