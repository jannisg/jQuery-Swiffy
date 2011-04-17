// ===========================
// = GLOBAL HELPER FUNCTIONS =
// ===========================

// a log function that won't break browsers if left in.
function log( whatever ) { if (window.console && window.console.log) { window.console.log($obj); } }
// a global function to successfully target the swf object we create (thank you Internet Explorer).
function getSwiffy( objName ) { var isIE = $.browser.msie; return (isIE) ? window[objName] : document[objName]; }
// a global callback function that initiates the plugin once the swf is fully loaded.
var swiffy;
function swiffyReady() {
	swiffy.swiffyInit({
		'blip'  : '../sounds/Blip.mp3',
		'boing' : '../sounds/Boing.mp3',
		'wap'   : '../sounds/Wap.mp3'
	});
}
// =====================
// = START PLUGIN CODE =
// =====================
;(function($) {
// $.swiffy({}) for setup and preloading of files
$.swiffy = function( options , callback ) {
	var options = $.extend({}, $.swiffy.defaults, options), o = options;
	
	// check that the passed in callback actually is a function then make it a string for the flash to work with.
	var callback = ( typeof o.callback == "function" ? o.callback.toString() : false ); 
	
	// assign user defined selector string to swiffy.
	swiffy = $('#'+o.target);

	// check for existence and otherwise create elements on the fly.
	if ( !swiffy.length ) {
		// if swiffy doesn't exist, create it and set the global object 'swiffy'.
		swiffy = $('<div />', {
					'id' : o.target
				}).appendTo('body');
	}
	
	// Now that swiffy (the container) has been created let's create the flash object.
	var swf = { // swf options
		file : ( !o.swfFile || o.swfFile===undefined ? '/swiffy.swf' : o.swfFile ),
		params : { 
			'allowScriptAccess' : 'always',
			'wmode' : 'transparent'
		},
		attributes : {
			'name' : o.target,
			'id'   : o.target
		}
	}
	// create the object
	swfobject.embedSWF( swf.file , o.target , '1', '1', '10', '', {}, swf.params , swf.attributes );
	
	// when the dom is loaded…
	$(window).load(function() {
		// reassign swiffy to reference the flash object (dom element, not jquery object) and NOT its container.
		swiffy = getSwiffy( 'swiffy' );
		// apply styles to swiffy effectively hiding it from view.
		$(swiffy).css({
			'position'	: 'absolute'
		   ,'top' 		: '-20000px'
		   ,'left'		: '-20000px'
		   ,'overflow'  : 'hidden'
		   ,'visibility': 'hidden'
		   ,'height'	: '1px'
		   ,'width' 	: '1px'
		});
		
	});

	
}; // <-- this ends the $.swiffy function.

// ====================================
// = BEGIN THE PUBLIC SWIFFY FUNCTION =
// ====================================
/*
 * 	Available actions and their usage are:
 * 	(message is just a helper to display helpful log messages.)
 *  
 *	@play		>> 	$(obj).swiffy( 'play' ); 			
 *  				will play a random sound from those loaded.
 *  @play		>> 	$(obj).swiffy( 'play' , 'alias' );
 *  				will play the specific sound with the given alias, see @load for how to assign an alias
 *  @play   	>> 	$(obj).swiffy( 'play' , 'alias' , volume );
 *  				will play a given sound at a percentage of its full volume (floating point value = 0-1, eg: 0.65 will play sound at 65% of tis original volume)
 *  				
 *  @stop   	>> 	$(obj).swiffy( 'stop' );
 *  				will stop all sounds currently playing.
 *  @stop   	>> 	$(obj).swiffy( 'stop' , 'alias' );
 *  				will stop this specific sound only
 *  				
 *  @load   	>> 	$(obj).swiffy( 'load' , 'alias' , 'filepath' );
 *  				most basic way of adding a new sound on the fly, will add the soundfile at the given filepath and associate it with the given alias for calling it in swiffy's actions.
 *  @load   	>> 	$(obj).swiffy( 'load' , 'alias' , 'filepath' , excludeFromRandom , 'callback' );
 *  				excludeFromRandom has to be either true or false, if true it will do what it says, so if you fire @play without an alias this file will not be played in the random selection
 *  				callback is executed once the sound has been loaded, it can only accept a named function name as a string, eg: "myFunction" to execute myfunction();
 *          	
 *  @loop		>>	$(obj).swiffy( 'loop' , 'alias' , volume );
 *  				volume is optional and accepts any floating point value (0 - 1)
 *  				this will simply loop the specified sound indefinitely or until stopped using the @stop call.
 *  			
 *  @overlay	>>	$(obj).swiffy( 'overlay' , boolean );
 *  				boolean must be supplied, can be either true or false (of course).
 *  				if false only 1 sound can play at a time, if true multiple sounds will play simultaneously overlaying each other.
 *  				Note: You can use this in conjunction with @stop to play multiples then stopping individual sounds at a specified point in time.
 *  				
 *  @volume		>>	$(obj).swiffy( 'volume' , volume );
 *  				As usual volume is a floating point number between 0 and 1.
 *  				This can be used to switch the global playback volume to a new value on the fly.
 *
 */


var methods = {
	// messages are only used internally. (currently not at all though I'm bringing them back as soon as I have time.)
	message : function( message , param ) {
		var m = message;
		if (m===undefined) return;
		if ( m == "filename missing" ) 
		{ 
			log('You must provide a filename.');
			log('If you are trying to load files into swiffy please use $.swiffy and not $(element).swiffy() which is for playing files only.');
		}
		else if ( m == "success" )
		{ 
			if (!param) param = '';
 			log('Success, we found your file: "'+param+'"\n' +
				'We\'re now exiting the lookup function and will be returning its stored path: '+param);
			
		}
		else if ( m == "not loaded" )
		{ 
			log('You seem to be looking for: "'+param+'" which doesn\'t exist in this array.\n' +
				'Please make sure there are no typos in the filename and that the file has been\n' +
				'loaded into swiffy using the $.swiffy({}) setup method.\n' +
				'If you\'re unsure of how to do so, please read the documentation or ask your friend.');
		}
	},
	// play a random or specific sound
	play : function( filename , volume ) {
		var volume = (volume!==undefined ? volume : 1 );
		// play function method.
		if ( filename===undefined ) { 
			 // exit quietly and give a quiet error message
			swiffy.playSound( null , volume );
		} else {
			swiffy.playSound( filename , volume );
		};
		
	},
	// stop all or a specific sound
	stop : function( filename ) {
		if ( filename!==undefined ) {
			swiffy.stopSound();
		} else {
			swiffy.stopSound( filename );
		}
	},
	// load a new sound clip into swiffy for later access
	load : function( filename , path , excludeFromRandom , callback ) {

		var excludeFromRandom = ( excludeFromRandom!==undefined ? false : true );
		var callback = ( callback!==undefined && typeof callback == "string" ? callback : null );
		
		if ( filename===undefined && path===undefined) {
			methods.message('not loaded', filename);
		} else {
			swiffy.addSound( filename , path , excludeFromRandom , callback );
		};
	},
	// loop the given soundfile (must already be loaded into swiffy before calling this)
	loop : function( filename , volume ) {
		if ( filename===undefined ) return;
		if ( volume===undefined ) { 
			swiffy.loopSound( filename );
		} else {
			swiffy.loopSound( filename , volume );
		}
	},
	// set whether multiple clips should play simultaneously (overlaying eachother) or not.
	overlay : function( boolean ) {
		var overlay = ( boolean !== false ? true : false );
		swiffy.overlay( overlay );
	},
	// set the global volume to a new setting for ALL playable clips.
	volume : function( volume ) {
		if (volume===undefined) return;
		swiffy.globalVolume( volume );
	}
};
// ============================================
// = Setting up the $.swiffy function handler =
// ============================================
$.fn.swiffy = function( method ) {
	if ( methods[method] ) {
		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
    } else {
		$.error( 'Method ' +  method + ' does not exist on $.swiffy' );
    }
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
};

})(jQuery);