package
{
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.utils.Dictionary;
	import flash.utils.Timer;

	public class Swiffy extends MovieClip
	{
		private var _overlay:Boolean = true;
		private var _volume:Number = 1;
		private var _loadCallback:String;
		private var _soundDictionary:Dictionary = new Dictionary(true);
		private var _randomSounds:Array = [];
		private var _t:Timer;
		
		public function Swiffy()
		{
			Security.allowDomain('*');
			_t = new Timer(50);
			
			if(ExternalInterface.available)
			{
				setCallbacks();
				_t.removeEventListener(TimerEvent.TIMER,onTimer);
				_t = null;
			}else{
				_t.addEventListener(TimerEvent.TIMER ,onTimer);
				_t.start();
			}
		}
		
		private function onTimer(ev:TimerEvent):void
		{
			if(ExternalInterface.available)
			{
				setCallbacks();
				_t.removeEventListener(TimerEvent.TIMER,onTimer);
				_t = null;
			}
		}
		
		private function setCallbacks():void
		{
			ExternalInterface.addCallback('swiffyInit',swiffyInit);
			ExternalInterface.addCallback('addSound',addSound);
			ExternalInterface.addCallback('removeSound',removeSound);
			ExternalInterface.addCallback('playSound',playSound);
			ExternalInterface.addCallback('loopSound',loopSound);
			ExternalInterface.addCallback('stopSound',stopSound);
			ExternalInterface.addCallback('overlay',overlay);
			ExternalInterface.addCallback('volume',volume);
			
			ExternalInterface.call('swiffyReady');
		}
		
		
		
		// public methods
		/**
		 * swiffyInit
		 * Inits everything
		 * 
		 * @param	sounds				An object containing {key,file} pairs
		 * @param	volume				the global volume
		 * @param	callback			The function name to call once all these sounds have loaded
		 */ 
		public function swiffyInit( sounds:Object , volume:Number =1, callback:String = null ):void
		{	
			_volume = volume;
			for(var key in sounds)
			{
				this.addSound( key, sounds[key] );
			}
			_loadCallback = callback;
			
		}
		
		/**
		 * AddSound
		 * Adds the sound to swiffty with the option of playing on load complete
		 * 
		 * @param	key					The alias for the sound to use to reference it.
		 * @param	filename 			Full or relative path to the sound file.
		 * @param 	excludeFromRandom	Set to true to not have this sound chosen randomly when playSound() is called.
		 */ 
		public function addSound( key:String , filename:String , excludeFromRandom:Boolean = false , callback:String = null):Boolean
		{
			_loadCallback = callback;
			for each (var sound in _soundDictionary)
			{
				if (sound.key == key) return false;
			}
			
			var sndObj:Object = new Object();
			var snd:Sound = new Sound(new URLRequest(filename));
			snd.addEventListener(Event.COMPLETE ,onSndComplete);
			sndObj.key = key;
			sndObj.sound = snd;
			sndObj.channel = new SoundChannel();
			sndObj.position = 0;
			sndObj.volume = 1;
			sndObj.loaded = false;
			_soundDictionary[key] = sndObj;
			
			if(!excludeFromRandom) _randomSounds.push(key);
			
			return true;
		}
		
		/**
		 * RemoveSound
		 * Removes sound from the swiffy library.
		 * 
		 * @param	key					The alias for the sound to use to reference it.
		 */ 
		public function removeSound( key:String ):void
		{
			var snd:Object = _soundDictionary[key];
			stopSound(key);
			if(snd){
				_soundDictionary[key] = null;
				if(_randomSounds.indexOf(key) != -1) _randomSounds.splice( _randomSounds.indexOf(key),1);
			}
		}
		
		/**
		 * Play Sound 
		 * Pass this the sound key to play the sound or pass nothing to play a random sound.
		 * The sound will only play if loading is complete
		 * 
		 * @param	key					The sound alias you want to play.
		 * @param	volume				The volume the clip will play at (defaults to 1)
		 */ 
		public function playSound( key:String = null , volume:Number = 1):void
		{
			
			if(!_overlay) stopSound();
			var snd:Object;
			if(!key)
			{
				key = _randomSounds[ Math.floor( Math.random()*_randomSounds.length) ];
			}
			
			snd = _soundDictionary[key];
			if(snd)
			{
				snd.channel = snd.sound.play(0 , 1, new SoundTransform(volume*_volume));
			}
		}
		
		
		/**
		 * Loop Sound 
		 * Pass this the sound key to play the sound or pass nothing to play a random sound, this will loop for as long as possible
		 * The sound will only play if loading is complete
		 * 
		 * @param	key					The sound alias you want to play.
		 * @param	volume				The volume the clip will play at (defaults to 1)
		 */ 
		public function loopSound( key:String = null , volume:Number = 1):void
		{
			if(!_overlay) stopSound();
			var snd:Object;
			if(!key)
			{
				key = _randomSounds[ Math.floor( Math.random()*_randomSounds.length) ];
			}
			
			snd = _soundDictionary[key];
			if(snd)
			{
				snd.channel = snd.sound.play(0 , 1000, new SoundTransform(volume*_volume));
			}
		}
		
		
		/**
		 * Stop Sound 
		 * Pass this the sound key to stop the sound or pass nothing stop all sounds
		 * 
		 * @param	key					The sound alias you want to stop.
		 */ 
		public function stopSound( key:String = null ):void
		{
			var snd:Object;
			if(key)
			{
				snd = _soundDictionary[key];
				if(snd)
				{
					snd.channel.stop();	
				}
			}
			else{
				for each(var sound in _soundDictionary)
				{
					
					sound.channel.stop();
				}
			}
		}
		
		
		/**
		 * Overlay (setter)
		 * Set to false if you don't want two sounds to play at once. (defaults to true).
		 * 
		 * @param	overlay				True or false if you want sounds to overlap.
		 */ 
		public function overlay(overlay:Boolean):void
		{
			_overlay = overlay;
		}
		
		/**
		 * Global Volume (setter)
		 * Sets the global volume
		 * 
		 * @param	volume				The volume between 0 and 1.
		 */ 
		public function volume(volume:Number):void
		{
			_volume = volume;
		}
		
		
		// private methods
		private function onSndComplete(ev:Event):void
		{
			var snd:Sound = ev.target as Sound;
			var allLoaded:Boolean = true;
			for each (var sound in _soundDictionary)
			{
				if (sound.sound == snd){
					sound.loaded = true;
					snd.removeEventListener(Event.COMPLETE , onSndComplete);
				}
				
				if(!sound.loaded) allLoaded = false;
			}
			if(allLoaded && _loadCallback)
			{
				ExternalInterface.call( _loadCallback );
				_loadCallback = null;
			}
		}
	}
}