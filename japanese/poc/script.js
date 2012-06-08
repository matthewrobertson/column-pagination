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
	COLUMN_WIDTH_PROP = 'columnWidth';
	COLUMN_GAP_PROP = 'columnGap';
}
else {
	COLUMN_WIDTH_PROP = 'columnWidth';
	COLUMN_GAP_PROP = 'columnGap';
	alert("this browser probably does not support css columns...")
}

var getBody = function() {
	return $('iframe').contents()[0].body;
};

// calculate how many columns the content has been divided into
var calc_num_pages = function() {
	var length = getBody().scrollWidth;
	length = parseInt(length, 10);
	length += parseInt(getBody().style.left, 10);
	var width = parseInt($(getBody()).css(COLUMN_WIDTH_PROP), 10);
	var gap = parseInt($(getBody()).css(COLUMN_GAP_PROP), 10);
	
	

	return Math.floor( (length + gap) / (width + gap) );
};

// calculate the shift required to center a page in the viewbox
var calc_page_shift = function(page_num) {
	var shift;
	var width = parseInt($(getBody()).css(COLUMN_WIDTH_PROP), 10);
	var gap = parseInt($(getBody()).css(COLUMN_GAP_PROP), 10);
	
	if(two_up) {
		shift = (page_num - 1) * (width + gap * 1.5);	
	}
	else {
		shift = (page_num - 1) * (width + gap);	
	}
		
	return shift.toString() + "px";
};

// show the current page
var show_content = function() {
	$(getBody()).css("left", calc_page_shift(cp));
	$(getBody()).css("opacity", "1");
};

// toggle disabled state of the buttons based on current page
var update_button_state = function() {
	$("#next").attr("disabled", null);
	$("#prev").attr("disabled", null);

	if(cp === 1) {
		$("#next").attr("disabled", "true");
	}

	if(cp === calc_num_pages() || 
		(two_up && cp === (calc_num_pages() - 1) ) ) {
		$("#prev").attr("disabled", "true");	
	}
};

var hide_content = function() {
	$(getBody()).css("opacity", "0");
};


var cp = 1; 		// the current page
var two_up = false; // are we in two up mode

$(function() {

	var frame = '<iframe src="../OPS/xhtml/sample.xhtml" scrolling="yes" frameborder="0" id="content-frame" width="500px" height="500px"></iframe>'
	$('#frame-wrap').html(frame);
	$('#content-frame').load(function() {
		$($(this).contents()[0].body).css({
			"-webkit-column-axis": "horizontal",
			"-webkit-column-gap": "30px",
			"padding": "0px",
			"margin": "0px",
			"position": "absolute",
			"left": "0px",
			"-webkit-column-width": "500px",
			"width": "100%",
			"height": "100%",
			"-webkit-transition-property": "opacity",
		    "-webkit-transition-duration": "0.1s",
	    	"-webkit-transition-timing-function": "ease"
		});

		$('#prev').click(function() {
			hide_content();
			cp += 1;
			update_button_state();
			setTimeout(function() {
				show_content();
			}, 150)
		});

		$('#next').click(function() {
			hide_content();
			cp -= 1;
			update_button_state();
			setTimeout(function() {
				show_content();
			}, 150)
		});

		update_button_state();
	});
});