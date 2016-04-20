function vote(id,vote){
	jQuery.ajax({
		url:'/vote/'+id+'/',
		type: "POST",
		data:'dir='+vote,
		success:function(data){
			jQuery("#facebook-status-"+id+' div.voting a').hide();
			jQuery("#facebook-status-"+id+' div.voting span.points').html('['+data+']')
			}

		
		});
	
	
	
	}
function togglecats(){
	if(jQuery("#catbutton").hasClass('unrolled')){
		jQuery("#catbutton").removeClass('unrolled');
		
		jQuery("#categories").hide();
		}else{
			jQuery("#catbutton").addClass('unrolled');
			jQuery("#categories").show();
	}
	jQuery("#catbutton").blur();
	
	}