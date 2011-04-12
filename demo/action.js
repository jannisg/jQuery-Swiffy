jQuery(document).ready(function($) {
	
	// Fire function, run setups, do stuff…
	$.swiffy({
		swfFile : '../swiffy.swf',
		sounds : {
			'blip'  : '../sounds/Blip.mp3',
			'boing' : '../sounds/Boing.mp3',
			'wap'   : '../sounds/Wap.mp3'
		}
	});
	
	// demo event listeners.
	$('#play-specific').click(function() {
		$(this).swiffy('load', 'newsound', '../sounds/KidsCheering.mp3');
		$(this).swiffy('play', 'newsound');
	});
	$('#stop').click(function() {
		$(this).swiffy('stop');
	});
	$('#loop').click(function() {
		$(this).swiffy('loop','boing');
	});
	$('#play').click(function() {
		$(this).swiffy('play');
	});
	
});
