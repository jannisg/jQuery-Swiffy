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
   swiffy.load( 'newsound', '../sounds/KidsCheering.mp3' );
   swiffy.play( 'newsound' );
  });
  
  $('#stop').click(function() {
   swiffy.stop();
  });
  $('#loop').click(function() {
   swiffy.loop( 'boing' );
  });
  $('#play').click(function() {
   swiffy.play();
  });

	swiffy.ready(function(){
		swiffy.play();
	})
	
});
