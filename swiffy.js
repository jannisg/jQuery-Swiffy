// =================
// = jQuery swiffy =
// =================
// start jQuery code.
(function($){
	// ============
	// = Helpers. =
	// ============
	
	// a log function that won't break browsers if left in.
	if ( typeof log !== 'function' ) {
		window.log = function() {
			if ( window.console && window.console.log ) { 
				window.console.log.apply( console , arguments );
			} 
		}
	}
	// a function to successfully target the swf object we create (thank you Internet Explorer).
	function getSwiffy( objName ) { var isIE = $.browser.msie; return (isIE) ? window[objName] : document[objName]; }
	
	
	// ====================================
	// = BEGIN THE PUBLIC SWIFFY FUNCTION =
	// ====================================
	/*
	 * 	Available actions and their usage are:
	 * 	(message is just a helper to display helpful log messages.)
	 *  
	 *	@play		>> 	swiffy.play(); 			
	 *  				will play a random sound from those loaded.
	 *  @play		>> 	swiffy.play( 'alias' );
	 *  				will play the specific sound with the given alias, see @load for how to assign an alias
	 *  @play   >> 	swiffy.play( 'alias' , volume );
	 *  				will play a given sound at a percentage of its full volume (floating point value = 0-1, eg: 0.65 will play sound at 65% of tis original volume)
	 *  				
	 *  @stop   >> 	swiffy.stop();
	 *  				will stop all sounds currently playing.
	 *  @stop   >> 	$(obj).swiffy( 'stop' , 'alias' );
	 *  				will stop this specific sound only
	 *  				
	 *  @load   >> 	swiffy.load( 'alias' , 'filepath' );
	 *  				most basic way of adding a new sound on the fly, will add the soundfile at the given filepath and associate it with the given alias for calling it in swiffy's actions.
	 *  @load   >> 	swiffy.load( 'alias' , 'filepath' , excludeFromRandom , 'callback' );
	 *  				excludeFromRandom has to be either true or false, if true it will do what it says, so if you fire @play without an alias this file will not be played in the random selection
	 *  				callback is executed once the sound has been loaded, it can only accept a named function name as a string, eg: "myFunction" to execute myfunction();
	 *          	
	 *  @loop		>>	swiffy.loop( 'alias' , volume );
	 *  				volume is optional and accepts any floating point value (0 - 1)
	 *  				this will simply loop the specified sound indefinitely or until stopped using the @stop call.
	 *  			
	 *  @overlay	>>	swiffy.overlay( boolean );
	 *  				boolean must be supplied, can be either true or false (of course).
	 *  				if false only 1 sound can play at a time, if true multiple sounds will play simultaneously overlaying each other.
	 *  				Note: You can use this in conjunction with @stop to play multiples then stopping individual sounds at a specified point in time.
	 *  				
	 *  @volume	>>	swiffy.volume( volume );
	 *  				As usual volume is a floating point number between 0 and 1.
	 *  				This can be used to switch the global playback volume to a new value on the fly.
	 *
	 */

	// =========================================================
	// = A global set of functions to interact with swiffy.swf =
	// =========================================================
	window.swiffy = {
		// will hold the container during setup then after that the player swiffy.swf object
		player : null
		// hold the object the user is trying to initialize
	    ,ignite : {}
		,setup : function(){
			swiffy.player.swiffyInit( swiffy.ignite );
		}
		
		// called by the swiffy.swf once the clip has fully loaded and is ready to accept commands and function calls
		,ready		:	 function ready( fn ) {
			
		}
		// plays a specific or random song from the collection
		,play			:	 function play( filename , volume ) {
			var volume = (volume!==undefined ? volume : 1 );
			// play function method.
			if ( filename===undefined ) { 
				swiffy.player.playSound( null , volume );
			} else {
				swiffy.player.playSound( filename , volume );
			}
		}
		// stop a specific or all songs
		,stop			:	 function stop( filename ) {
			if ( filename!==undefined ) {
				swiffy.player.stopSound();
			} else {
				swiffy.player.stopSound( filename );
			}
		}
		// load a specific song into the collection, this clip can be excluded by the random play function and can fire a callback once loaded
		,load			:	 function load( filename , path , excludeFromRandom , callback ) {
			var excludeFromRandom = ( excludeFromRandom!==undefined ? false : true );
			var callback = ( callback!==undefined && typeof callback == "string" ? callback : null );

			if ( filename===undefined && path===undefined) {
				methods.message('not loaded', filename);
			} else {
				swiffy.player.addSound( filename , path , excludeFromRandom , callback );
			}
		}
		// loop a specific sound, can be a different volume than the global volume setting
		,loop			:	 function loop( filename , volume ) {
			if ( filename===undefined ) return;
			if ( volume===undefined ) { 
				swiffy.player.loopSound( filename );
			} else {
				swiffy.player.loopSound( filename , volume );
			}
		}
		// true or false. decides if sounds will play on top of eachother or triggering a second sound will stop the currently playing one first
		,overlay	:	 function overlay( boolean ) {
			var overlay = ( boolean !== false ? true : false );
			swiffy.player.overlay( overlay );
		}
		// to control the global sound volume after init (which sets it to 1 aka full volume)
		,volume		:	 function volume( volume ) {
			if (volume===undefined) return;
			swiffy.player.globalVolume( volume );
		}
	};

	// ==============
	// = Initilizer =
	// ==============
	$.swiffy = function( options , callback ){
		var options = $.extend({}, $.swiffy.defaults, options)
			 ,o = options
				// check that the passed in callback actually is a function then make it a string for the flash to work with.
			 ,callback = ( typeof o.callback == "function" ? o.callback.toString() : false ); 

		// assign user defined selector string to swiffy.
		swiffy.player = $('#'+o.target);

		// check for existence and otherwise create elements on the fly.
		if ( !swiffy.player.length ) {
			// if swiffy doesn't exist, create it and set the global object 'swiffy'.
			swiffy.player = $('<div />', { 'id' : o.target }).appendTo('body');
		}

		// Now that swiffy (the container) has been created let's create the flash object.
		var swf = { // swf options
			file : ( !o.swfFile || o.swfFile===undefined ? '/swiffy.swf' : o.swfFile )
		 ,params : { 
				'allowScriptAccess' : 'always',
				'wmode' : 'transparent'
			}
		 ,attributes : {
				'name' : o.target,
				'id'	 : o.target
			}
		}
		// create the object
		swfobject.embedSWF( swf.file , o.target , '1', '1', '10', '', {}, swf.params , swf.attributes );
		
		// capture the preloading of sounds that were part of the $.swiffy() function and add them so we can use them in the swiffy.init function.
		swiffy.ignite = o.sounds;
		
		// when the dom is loaded…
		$(window).load(function() {
			// reassign swiffy to reference the flash object (dom element, not jquery object) and NOT its container.
			swiffy.player = getSwiffy( 'swiffy' );
			// apply styles to swiffy effectively hiding it from view.
			$(swiffy.player).css({
				'position'	: 'absolute'
				 ,'top'			: '-20000px'
				 ,'left'		: '-20000px'
				 ,'overflow'	: 'hidden'
				 ,'visibility': 'hidden'
				 ,'height'	: '1px'
				 ,'width'		: '1px'
			});
		});
	};

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
	}

})(jQuery);