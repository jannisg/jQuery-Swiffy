jQuery(document).ready(function($) {
	
	// Fire function, run setups, do stuff…
	$.swiffy();
	
	$('#play').click(function() {
		$(this).swiffy('play', 'blip');
	});
	$('#nogo').click(function() {
		$(this).swiffy();
	});
	
});
