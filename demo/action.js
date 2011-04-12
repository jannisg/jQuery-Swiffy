jQuery(document).ready(function($) {
	
	// Fire function, run setups, do stuff…
	$.swiffy();
	
	$('#play').click(function() {
		swiffy('add', 'newsound','../sounds/KidsCheering.mp3');
		$(this).swiffy('play','newsound');
	});
	$('#nogo').click(function() {
		$(this).swiffy();
	});
	
});
