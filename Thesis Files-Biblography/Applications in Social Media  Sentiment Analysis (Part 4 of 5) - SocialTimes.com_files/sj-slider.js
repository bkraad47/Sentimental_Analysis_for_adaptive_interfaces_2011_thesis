function SalaryRangeIsTooWide(min, max) {
	return (max >= 60 && Math.floor(max / min * 100) > 127) ||
		   (max < 60 && Math.floor(max / min * 100) > 150);
}

function salaryCheck(min, max) {
	if ((min > max) || SalaryRangeIsTooWide(min, max)) {
		jQuery(".ui-widget-header").addClass("ui-widget-header-caution"); //Turn slider bar different color
		jQuery('#wideSalary').show();
		jQuery('#recommendedSalary').hide();
	} else {
		jQuery(".ui-widget-header").removeClass("ui-widget-header-caution");
		jQuery('#wideSalary').hide();
		jQuery('#recommendedSalary').show();
	}
}

function updateSlider(min, max) {
	jQuery("#slider-range").slider("option", "values", [min,max]);
}

function updateTextBoxes(min, max) {
	jQuery("#salaryMin").val( min );
	jQuery("#salaryMax").val( max );
}

// other code using jQuery as an alias to the other library
/* Initialize slider object based on textbox values */
jQuery(function() {
	var sliderMin = 25;
	var sliderMax = 250;
	var salaryMin = 0;
	var salaryMax = 33; //start the sliderMax at 33 so that two slider handles show by default
	
	//if elements are set, set slider values accordingly
	if (jQuery("#salaryMin").val() > 0 && jQuery("#salaryMax").val() > 0) {
		salaryMin = jQuery("#salaryMin").val();
		salaryMax = jQuery("#salaryMax").val();
	}
	
	jQuery("#slider-range").slider({
		range: true,
		min: sliderMin,
		max: sliderMax,
		values: [ salaryMin, salaryMax ],
		animate:true,
		slide: function( event, ui ) {
			var min = ui.values[ 0 ];
			var max = ui.values[ 1 ];
			updateTextBoxes(min,max);
			salaryCheck(min,max);
		}
	});
	
	jQuery("#salaryMin,#salaryMax").blur(function(){
		var inputMin = parseInt(jQuery("#salaryMin").val());
		var inputMax = parseInt(jQuery("#salaryMax").val());
		if (inputMin < 25) {inputMin = 25;jQuery("#salaryMin").val(25)}
		if (inputMax < 25) {inputMax = 25;jQuery("#salaryMax").val(25)}
		var min = inputMin;
		var max = inputMax;

		//Check boundary conditions
		if (min < sliderMin) {min = sliderMin;}
		if (max > sliderMax) {max = sliderMax;}
		if (min > sliderMax) {min = sliderMax;max=sliderMax;}
		if (max < sliderMin) {min = sliderMin;max=sliderMin}	
		
		if (min <= max ) {
			var minPos = Math.round(min*1000/sliderMax)/10;
			var maxPos = Math.round(max*1000/sliderMax)/10;
			var barWidth = Math.round((max - min)*1000/sliderMax)/10;
			jQuery("#slider-range div").css({left:minPos+"%", width:barWidth+"%"});
			jQuery("#slider-range a:nth-child(2)").css("left", minPos+"%");
			jQuery("#slider-range a:nth-child(3)").css("left", maxPos+"%");
			updateSlider(min,max);
			salaryCheck(inputMin,inputMax); //Do a salary check based on the textbox inputs, not slider values
		}
	});
	
	if (jQuery("#salaryMin").val() > 0 && jQuery("#salaryMax").val() > 0) {
		salaryCheck(salaryMin,salaryMax);
	}
});