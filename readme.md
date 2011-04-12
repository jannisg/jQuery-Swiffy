# jQuery Swiffy
## A tiny little object of fun and sounds.

To use please read the description below which should explain most of swiffy's functions.

Any feature requests are welcome and we'd appreciate it if you took the time to create an 'issue' for any problems you may encounter.

* * *

### Functions

   	Available actions and their usage are:
   	(message is just a helper to display helpful log messages.)
    
  	@play		>> 	$(obj).swiffy( 'play' ); 			
    				will play a random sound from those loaded.
    @play		>> 	$(obj).swiffy( 'play' , 'alias' );
    				will play the specific sound with the given alias, see @load for how to assign an alias
    @play   	>> 	$(obj).swiffy( 'play' , 'alias' , volume );
    				will play a given sound at a percentage of its full volume (floating point value = 0-1, eg: 0.65 will play sound at 65% of tis original volume)
    				
    @stop   	>> 	$(obj).swiffy( 'stop' );
    				will stop all sounds currently playing.
    @stop   	>> 	$(obj).swiffy( 'stop' , 'alias' );
    				will stop this specific sound only
    				
    @load   	>> 	$(obj).swiffy( 'load' , 'alias' , 'filepath' );
    				most basic way of adding a new sound on the fly, will add the soundfile at the given filepath and associate it with the given alias for calling it in swiffy's actions.
    @load   	>> 	$(obj).swiffy( 'load' , 'alias' , 'filepath' , excludeFromRandom , 'callback' );
    				excludeFromRandom has to be either true or false, if true it will do what it says, so if you fire @play without an alias this file will not be played in the random selection
    				callback is executed once the sound has been loaded, it can only accept a named function name as a string, eg: "myFunction" to execute myfunction();
            	
    @loop		>>	$(obj).swiffy( 'loop' , 'alias' , volume );
    				volume is optional and accepts any floating point value (0 - 1)
    				this will simply loop the specified sound indefinitely or until stopped using the @stop call.
    			
    @overlay	>>	$(obj).swiffy( 'overlay' , boolean );
    				boolean must be supplied, can be either true or false (of course).
    				if false only 1 sound can play at a time, if true multiple sounds will play simultaneously overlaying each other.
    				Note: You can use this in conjunction with @stop to play multiples then stopping individual sounds at a specified point in time.
    				
    @volume		>>	$(obj).swiffy( 'volume' , volume );
    				As usual volume is a floating point number between 0 and 1.
    				This can be used to switch the global playback volume to a new value on the fly.

* * *

#### Credits

*This little bundle of joy was created by Mark Stewart (@markstewie) and myself, Jannis Gundermann (@jannisg).*

* * *

##### Todo's

* create a more logical way of setting up actions `$(object).swiffy('method', params);` should just really just be `$.swiffy('method', params);`
* create a proper init method and call it in `swiffyReady()`

* * *

##### Fixes

* @stop doesn't currently stop multiple overlaying sounds loops.
* init is currently not working properly!

* * *

**As a final little note: Please be aware that as long as this line of text exists this project is not production ready!**