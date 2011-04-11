jQuery(document).ready(function($) {
	
	// Fire function, run setups, do stuff…
	$.swiffy();
	$('#play').click(function() {
		$(this).swiffy('filename2');
	});
	$('#nogo').click(function() {
		$(this).swiffy();
	});
	
});
