// =================
// = jQuery swiffy =
// =================
// start jQuery code.
(function($){
  // Helpers.
  var regex = {
    fnName : /^function\s+\(\s([\w]*)/i
  }
  // a log function that won't break browsers if left in.
  window.log = function( whatever ) { 
    if (window.console && window.console.log) { window.console.log( whatever ); } }
  // a global function to successfully target the swf object we create (thank you Internet Explorer).
  window.getObject = function( objName ) { var isIE = $.browser.msie; return (isIE) ? window[objName] : document[objName]; }

  // a function to check on a given element to be undefined or not.
  function paramCheck( obj ) {

    var callee = arguments.callee.name;
    var caller = arguments.callee.caller.name;
    var passed = true;

    if ( typeof obj === 'object' ) { 
      // in case we're looping over multiple tests on arguments.
      $.each(obj, function(key, val) {
        
        var arg = key,
            type = typeof val.is,
            expected = val.expected,
            required = ( val.required ? val.required : false);

        if ( type === "undefined" && required ) {
          log('"'+arg+'" cannot be left empty.');
          passed = false;
        } else if ( type !== "undefined" && type !== expected ) { 
          log( '"'+caller+'()" triggered an exception: "'+arg+'" is expecting a "'+expected+'" but has been assigned a "'+type+'".');
          passed = false;
        }

      });
      
      return passed;

    } else {
      // when we're just checking a singular argument.
      log(callee+'() needs to be passed an object!');
    }
    
  }
    
  // A global set of functions to interact with swiffy.swf
	window.swiffy = {
	   init     :  function init( filename , count ) {
       // called when page is being loaded to initialize the plugin itself.
       if ( !paramCheck({ // let's make sure the arguments supplied satisfy our needs.
         
         filename : {
           required : true,
           is : filename,
           expected : 'string'
         },
         
         count : {
           required : true,
           is : count,
           expected : 'number'
         }
         
       }) ) {
         // in case they didn't, run this and stop the init.
         log('init() failed, please see your log for details.');
         return false;
       }

    }
		,ready    :  function ready( fn ) {
      // called by the swiffy.swf once the clip has fully loaded and is ready to accept commands and function calls
		}
		,play     :  function play( filename , volume ) {
      // plays a specific or random song from the collection
		}
		,stop     :  function stop( filename ) {
      // stop a specific or all songs
		}
		,load     :  function load( filename , path , excludeFromRandom , callback ) {
      // load a specific song into the collection, this clip can be excluded by the random play function and can fire a callback once loaded
		}
		,loop     :  function loop( filename , volume ) {
      // loop a specific sound, can be a different volume than the global volume setting
		}
		,overlay  :  function overlay( boolean ) {
      // true or false. decides if sounds will play on top of eachother or triggering a second sound will stop the currently playing one first
		}
		,volume   :  function volume( volume ) {
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