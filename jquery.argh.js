(function($){
  
  // a log function that won't break browsers if left in.
  if ( typeof log !== 'function' ) {
    window.log = function() {
      if ( window.console && window.console.log ) { 
        window.console.log.apply( console , arguments );
      } 
    }
  }
  
  // =============================================
  // = ARGH! The awesome little argument checker =
  // =============================================
  window.argh = function( obj ) {
    var callee = arguments.callee.name
       ,caller = arguments.callee.caller.name
       ,passed = true
       ;

    function getArguments() {
      var arguments = arguments.callee.caller.caller.arguments; // get the original callers arguments
      var output = [];
      for (var i=0; i < arguments.length; i++) {
        output.push(arguments[i]);
      };
      return output;
    }
    

    if ( typeof obj === 'object' ) { 
      // in case we're looping over multiple tests on arguments.
      $.each(obj, function(key, object) {
          
          var o = object
             ,argument = key
             ,type = typeof o.argument
             ,expected = o.expected
             ,required = ( o.required ? o.required : false)
             ,message = ( o.message !== undefined ? true : false )
             ;
              
          if ( type === "undefined" && required ) {
            
            if ( o.message ) { 
              log( 'Argh! ::' , caller + '(' , o.argument , ') ==>' ,  o.message );// user defined
            } else {
              log( 'Argh! ::' , caller + '() ==> One or more required arguments were left empty.');// generic
            }
            passed = false;
            
          } else if ( type !== "undefined" && type !== expected ) {
            
            if ( o.message ) { 
              log( 'Argh! ::' , caller + '(' , o.argument , ') ==>' , o.message );// user defined
            } else {
              log( 'Argh! ::' , caller + '(' , o.argument , ') ==>' , ' triggered an exception: This is a "' , type , '" but should be a "' , expected , '"!');// generic
            }
            passed = false;

          }
        
      });
      if ( !passed ) {
        log(  '\nArgh! :: ' + caller + '() failed to meet all criteria.\n\n' + 
              '1. Please check that your function arguments', getArguments() ,'are in the correct order.\n'+
              '2. Please also check your console log for more specific error messages.\n ');
      }
      
      return passed;
    
    } else {
      // hey, we need an object!
      log( 'Argh! :: ' + caller + '( ' + getArguments() + ' ) ==> We need an array of objects and not this!');
    }
    
  }

})(jQuery);