function log($obj) {
	if (window.console && window.console.log) {
		window.console.log($obj);
	}
}
function getSwiffy( objName ) {
	var isIE = navigator.appName.indexOf("Microsoft") != -1;
  	return (isIE) ? window[objName] : document[objName];
}
;(function($) {
// private function for debugging
var swiffy;
// $.swiffy({}) for setup and preloading of files
$.swiffy = function( options , callback ) {
	var opts = $.extend({}, $.swiffy.defaults, options), o = opts;
	
	// check that the passed in callback actually is a function then make it a string for the flash to work with.
	var callback = ( typeof o.callback == "function" ? o.callback.toString() : false ); 
	
	// assign user defined selector string to swiffy.
	swiffy = $('#'+o.target);

	// check for existence and otherwise create elements on the fly.
	if ( !swiffy.length ) {
		log('It seems that no container with an id of "#'+o.target+'" exists yet.')
		// if swiffy doesn't exist, create it and set the global object 'swiffy'.
		swiffy = $('<div />', {
					'id' : o.target
				}).appendTo('body');
				
		log('"#'+o.target+'" has been created in the dom and appended to the body.');
	} else {
		log('We found "#'+o.target+'" in the DOM. Yay!');
	}
	
	// Now that swiffy (the container) has been created let's create the flash object.
	var swf = {
		file : ( !o.swfFile ? '/swiffy.swf' : o.swfFile ),
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
		// reassign swiffy to reference the flash object and NOT its container.
		swiffy = getSwiffy( 'swiffy' );
		log(swiffy)
		// apply styles to swiffy effectively hiding it.
		$(swiffy).css({
			'position':'absolute',
			'top' :'-20000px',
			'left':'-20000px',
			'overflow'  :'hidden',
			'visibility':'hidden',
			'height':'1px',
			'width' :'1px'
		});
		log('loading swiffyInit.')
		
		
	});

	
};
// $(element).swiffy('play', 'filename') to play the file.
var methods = {
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
			log('You seem to be looking for: "'+name+'" which doesn\'t exist in this array.\n' +
				'Please make sure there are no typos in the filename and that the file has been\n' +
				'loaded into swiffy using the $.swiffy({}) setup method.\n' +
				'If you\'re unsure of how to do so, please read the documentation or ask your friend.');
		}
	},
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
	stop : function( filename ) {
		if ( filename!==undefined ) {
			swiffy.stopSound();
		} else {
			swiffy.stopSound( filename );
		}
	},
	add : function( filename , path , excludeFromRandom , callback ) {

		var excludeFromRandom = ( excludeFromRandom!==undefined ? false : true );
		var callback = ( callback!==undefined && typeof callback == "string" ? callback : null );
		
		if ( filename===undefined && path===undefined) {
			methods.message('not loaded', filename);
		} else {
			swiffy.addSound( filename , path , excludeFromRandom , callback );
		};
	},
	loop : function( filename , volume ) {
		if ( filename===undefined ) return;
		if ( volume===undefined ) { 
			swiffy.loopSound( filename );
		} else {
			swiffy.loopSound( filename , volume );
		}
	},
	overlay : function( boolean ) {
		var overlay = ( boolean !== false ? true : false );
		swiffy.overlay( overlay );
	},
	volume : function( volume ) {
		if (volume===undefined) return;
		swiffy.globalVolume( volume );
	}
};

// the function
$.fn.swiffy = function( method ) {
	if ( methods[method] ) {
		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
    } else {
		$.error( 'Method ' +  method + ' does not exist on $.swiffy' );
    }
};

// default options
$.swiffy.defaults = {
	target : 'swiffy',
	swfFile: '../swiffy.swf',
	volume : 1,
	sounds : {
		'blip'  : '../sounds/Blip.mp3',
		'boing' : '../sounds/Boing.mp3',
		'wap'   : '../sounds/Wap.mp3'
	},
	callback : function() {}
};

})(jQuery);
function swiffyReady() {

	getSwiffy('swiffy').swiffyInit( {
		'blip'  : '../sounds/Blip.mp3',
		'boing' : '../sounds/Boing.mp3',
		'wap'   : '../sounds/Wap.mp3'
	} , 1, null );

}