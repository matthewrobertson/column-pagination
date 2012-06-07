var COLUMN_WIDTH_PROP;
var COLUMN_GAP_PROP;


// a quick hacked up way to do what Modernizr would do for us
// DO NOT DO THIS IN REAL LIFE! USER MODERNIZR
if( $.browser.webkit ) {
	COLUMN_WIDTH_PROP = '-webkitColumnWidth';
	COLUMN_GAP_PROP = '-webkitColumnGap';
}
else if( $.browser.mozilla ) {
	COLUMN_WIDTH_PROP = '-mozColumnWidth';
	COLUMN_GAP_PROP = '-mozColumnGap';
}
else if( $.browser.opera ) {
	COLUMN_WIDTH_PROP = '-oColumnWidth';
	COLUMN_GAP_PROP = '-oColumnGap';
}
else if( $.browser.msie && parseInt($.browser.version, 10) >= 10 ) {
	COLUMN_WIDTH_PROP = '-ieColumnWidth';
	COLUMN_GAP_PROP = '-ieColumnGap';
}
else {
	COLUMN_WIDTH_PROP = 'columnWidth';
	COLUMN_GAP_PROP = 'columnGap';
	alert("this browser probably does not support css columns...")
}

// calculate how many columns the content has been divided into
var calc_num_pages = function() {
	var length;
	var width = parseInt($('#content').css(COLUMN_WIDTH_PROP), 10);
	var gap = parseInt($('#content').css(COLUMN_GAP_PROP), 10);

	if( $.browser.mozilla ) {
		var $cont = $('#container');
		$cont.css("overflow", "scroll");
		length = $cont[0].scrollWidth;
		length += parseInt($('#content').css("right"), 10);
		$cont.css("overflow", "hidden");
		if(two_up) {
			length = length - width - gap;
		}
	}
	else {
		length = $('#content')[0].scrollWidth;
	}
	
	

	return Math.floor( (length + gap) / (width + gap) );
};

// calculate the shift required to center a page in the viewbox
var calc_page_shift = function(page_num) {
	var shift;
	var width = parseInt($('#content').css(COLUMN_WIDTH_PROP), 10);
	var gap = parseInt($('#content').css(COLUMN_GAP_PROP), 10);
	
	if(two_up) {
		shift = (page_num - 1) * (width + gap * 1.5);	
	}
	else {
		shift = (page_num - 1) * (width + 2 * gap);	
	}
		
	return shift.toString() + "px";
};

// show the current page
var show_content = function() {
	$("#content").css("right", calc_page_shift(cp));
	$("#content").css("opacity", "1");
};

// toggle disabled state of the buttons based on current page
var update_button_state = function() {
	$("#next").attr("disabled", null);
	$("#prev").attr("disabled", null);

	if(cp === 1) {
		$("#prev").attr("disabled", "true");
	}

	if(cp === calc_num_pages() || 
		(two_up && cp === (calc_num_pages() - 1) ) ) {
		$("#next").attr("disabled", "true");	
	}
};


var cp = 1; 		// the current page
var two_up = false; // are we in two up mode

$(function() {

	update_button_state(); // set the button state

	// go to the next page:
	$('#next').click(function(e) {
		// calculate what the new page will be:
		var np;
		if(two_up) {
			// if we are in two up mode go ahead two pages
			np = cp + 2;	
		}
		else {
			// if we are in one up mode go ahead one page
			np = cp + 1;	
		}

		// if we are trying to move to a non-existent page
		// break out early
		if(np > calc_num_pages()) return; 

		// perform pretty fade animation
		$("#content").css("opacity", "0");

		// set the current page to the new page
		cp = np;
		
		// update the state of the buttons
		update_button_state();

		// when the pretty fade out animation is done, show the new page
		setTimeout(show_content, 150);
	});

	// go to the prev page:
	$('#prev').click(function(e) {
		// the same as the click handler for #next, just backwards
		var np;
		if(two_up) {
			np = cp - 2;	
		}
		else {
			np = cp - 1;	
		}

		if(np < 0) return;

		$("#content").css("opacity", "0");
		cp = np;
		update_button_state();
		setTimeout(show_content, 150);
	});

	// toggle two up mode (ie facing pages)
	$('#two-up').click(function() {
		
		two_up = !two_up; // keep track of application state out of the dom
		
		// to display two pages, just cut the width of the page columns in half
		$("#container").toggleClass('two-up', two_up);

		// the page number has changed so we need to make sure that
		// we are still on a current page that is < the total number of pages
		if(cp > calc_num_pages()) {
			cp = calc_num_pages();
		}

		// when in two up mode, always stay on odd page numbers (the left hand page)
		if(two_up && cp % 2 === 0) {
			cp -= 1;
		}

		show_content(); // just in case we changed the cp
		update_button_state(); // b/c the page number / cp may have changed...
	});
});