jQuery(document).ready(function($) {
	
	// Fire function, run setups, do stuff…
	$.swiffy();
	
	$('#play').click(function() {
		$(this).swiffy('add', 'newsound','../sounds/KidsCheering.mp3');
		$(this).swiffy('loop','newsound');
	});
	$('#nogo').click(function() {
		$(this).swiffy('stop');
	});
	
});
