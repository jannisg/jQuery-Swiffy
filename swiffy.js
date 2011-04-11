;(function($) {

// private function for debugging
function log($obj) {
	if (window.console && window.console.log) {
		window.console.log($obj);
	}
}
var globalsounds = [], gs = globalsounds;
// $.swiffy({}) for setup and preloading of files
$.swiffy = function(options) {
	var opts = $.extend({}, $.swiffy.defaults, options), o = opts;
	
	// prepare the files
	$.each(o.files, function(i, val) {
		var filepath = o.sound.directory+val+'.'+o.sound.filetype; // create the filepaths based on the sound settings and filenames.
		globalsounds.push([val, filepath]);
	});
	
	log('Globalsounds array:');
	log(gs);
}
// $(element).swiffy(filename) to play the file.
$.fn.extend({
	swiffy : function(filename) {
		
		if ( !filename ) { 
			 // exit quietly and give a quiet error message
			log('You must provide a filename.');
			log('If you are trying to load files into swiffy please use $.swiffy and not $(element).swiffy() which is for playing files only.');
			return;
			
		} else {
			
			// lookup helper that returns the URL to the sound file specified.
			function lookup(name) {
				if ( !name ) return;  // if no name has been passed in assume this is an error and exit quietly.
				var success = false;  // Boolean to see if a file has been found or not and if needed display an error log.
				
				// cycly through the array of sounds and look for the filename given.
				$.each( gs , function(key, val) {
					var key  = val[0], // holds the filename.
						path = val[1]; // holds the compiled href to this file.
						
						if ( key == name ) { // if there is a match
							log('Success, we found your file: "'+key+'"\n' +
								'We\'re now exiting the lookup function and will be returning its stored path: '+path);
							success = true; // boolean to only show this once regardless of the array length.
							return path;
						}
						 
				});
				
				// just in case the specified filename could not be found display an error message.
				if ( !success ) 
				log('You seem to be looking for: "'+name+'" which doesn\'t exist in this array.\n' +
					'Please make sure there are no typos in the filename and that the file has been\n' +
					'loaded into swiffy using the $.swiffy({}) setup method.\n' +
					'If you\'re unsure of how to do so, please read the documentation or ask your friend.');
				
				
			}
			
			// retrieve the file and play it.
			return this.each(function() {
				// find the sound in globalsounds array and return its path.
				
				var soundSource = lookup(filename);
				console.log(soundSource);
				
			});
		}
	}
});
// default options
$.swiffy.defaults = {
	target : '#swiffyPlayer',
	sound : {
		directory : 'sounds/',
		filetype  : 'mp3'
	},
	files : [ 'filename1' , 'filename2' , 'filename3' ]
};

})(jQuery);
