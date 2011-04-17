// =================
// = jQuery swiffy =
// =================
(function($){
  // A global set of functions to interact with swiffy.swf
	window.swiffy = {
	   init     :  function( options ) {
       // called when page is being loaded to initialize the plugin itself.
    }
		,ready    :  function( event ) {
      // called by the swiffy.swf once the clip has fully loaded and is ready to accept commands and function calls
		}
		,play     :  function( filename , volume ) {
      // plays a specific or random song from the collection
		}
		,stop     :  function( filename ) {
      // stop a specific or all songs
		}
		,load     :  function( filename , path , excludeFromRandom , callback ) {
      // load a specific song into the collection, this clip can be excluded by the random play function and can fire a callback once loaded
		}
		,loop     :  function( filename , volume ) {
      // loop a specific sound, can be a different volume than the global volume setting
		}
		,overlay  :  function( boolean ) {
      // true or false. decides if sounds will play on top of eachother or triggering a second sound will stop the currently playing one first
		}
		,volume   :  function( volume ) {
      // to control the global sound volume after init (which sets it to 1 aka full volume)
		}
	};
  
  // initializer.
  $.swiffy = function( options , callback ){
    var options  = $.extend({}, $.swiffy.defaults, options), o = options,
        callback = ( typeof o.callback == "function" ? o.callback.toString() : false );
        
    swiffy.obj = function(message) { console.log(message) };
  };
  
  $.swiffy();
  // =============================
  // = Swiffy's default settings =
  // =============================
  $.swiffy.defaults = {
  	// the id of the container and later the flash clip itself. Unless you have another object called swiffy this doesn't need to change.
  	target : 'swiffy',
  	// REQUIRED: path to the swiffy.swf file. defaults to root folder.
  	swfFile: '/swiffy.swf',
  	// volume setting for the global stage, defaults to 1, can accept floating point value from 0 to 1.
  	volume : 1,
  	// global overlay setting
  	overlay: false,
  	// REQUIRED: Unless manually adding your sound files use this to (pre)load your sound clips after DOM.load event is fired.
  	// key == alias : value == path/to/soundfile.mp3
  	sounds : {},
  	// optional callback function that fires once swiffy has fully loaded.
  	callback : function() {}
  };

})(jQuery);