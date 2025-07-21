import React, { useState, useEffect } from 'react';
import { Heart, Gift, Sparkles, Music, VolumeX, Play, ArrowLeft } from 'lucide-react';

function App() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    // Create audio element with correct GitHub raw URL
    const audioElement = new Audio();
    audioElement.src = 'https://raw.githubusercontent.com/phutharesuan/surprise/main/surprise.mp3';
    audioElement.loop = true;
    audioElement.volume = 0.5;
    audioElement.preload = 'auto';
    audioElement.crossOrigin = 'anonymous';
    
    // Add event listeners
    audioElement.addEventListener('canplaythrough', () => {
      setAudioReady(true);
      console.log('Audio ready to play');
      // Try to autoplay immediately when ready
      tryAutoplay(audioElement);
    });
    
    audioElement.addEventListener('error', (e) => {
      console.warn('Audio file could not be loaded. Music will be disabled.', e);
      setAudioReady(false);
    });
    
    audioElement.addEventListener('loadstart', () => {
      console.log('Audio loading started');
    });

    audioElement.addEventListener('loadeddata', () => {
      console.log('Audio data loaded');
    });

    // Additional event listener for when audio can start playing
    audioElement.addEventListener('canplay', () => {
      console.log('Audio can start playing');
      if (!isPlaying) {
        tryAutoplay(audioElement);
      }
    });
    
    setAudio(audioElement);

    // Attempt to load the audio immediately
    audioElement.load();

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);

  const tryAutoplay = async (audioElement: HTMLAudioElement) => {
    try {
      // Reset to beginning and play
      audioElement.currentTime = 0;
      await audioElement.play();
      setIsPlaying(true);
      console.log('Autoplay successful');
    } catch (error) {
      console.log('Autoplay blocked by browser - user interaction required', error);
      setIsPlaying(false);
    }
  };

  const handleGoBack = () => {
    setAnimateText(false);
    setTimeout(() => {
      setShowLetter(false);
      setTimeout(() => {
        setIsCardOpen(false);
      }, 300);
    }, 300);
  };

  const handleCardClick = () => {
    setIsCardOpen(true);
    
    // Always try to play music when user interacts (this bypasses autoplay restrictions)
    if (audio && audioReady) {
      forcePlayAudio();
    }
    
    setTimeout(() => {
      setShowLetter(true);
      setTimeout(() => {
        setAnimateText(true);
      }, 500);
    }, 800);
  };

  const forcePlayAudio = async () => {
    if (audio && audioReady) {
      try {
        audio.currentTime = 0;
        await audio.play();
        setIsPlaying(true);
        console.log('Force play successful');
      } catch (error) {
        console.error('Force play failed:', error);
        setIsPlaying(false);
      }
    }
  };

  const toggleMusic = () => {
    if (audio && audioReady) {
      if (isPlaying) {
        console.log('Pausing audio');
        audio.pause();
        setIsPlaying(false);
      } else {
        console.log('Attempting to play audio from toggle');
        forcePlayAudio();
      }
    } else {
      console.log('Audio not available');
    }
  };

  const toggleMute = () => {
    if (audio && audioReady) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // Add floating particles effect
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      const delay = Math.random() * 2;
      const duration = 3 + Math.random() * 2;
      (particle as HTMLElement).style.animationDelay = `${delay}s`;
      (particle as HTMLElement).style.animationDuration = `${duration}s`;
    });
  }, []);
  if (showLetter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
        {/* Background Music */}
        <audio
          id="background-music"
          src="https://raw.githubusercontent.com/phutharesuan/surprise/main/surprise.mp3"
          loop
          preload="auto"
          crossOrigin="anonymous"
          className="hidden"
        >
          Your browser does not support the audio element.
        </audio>

        {/* Music Controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={handleGoBack}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
            title="Go back to card"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={toggleMusic}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
            title={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-1.5 h-4 bg-gray-600 rounded-sm"></div>
                  <div className="w-1.5 h-4 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
            ) : (
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-gray-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5"></div>
              </div>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <div className="w-5 h-5 relative">
                <div className="absolute w-2 h-3 bg-gray-600 rounded-l"></div>
                <div className="absolute left-2 top-1 w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="absolute left-3 top-0.5 w-1 h-2 bg-gray-600 rounded-full"></div>
                <div className="absolute left-4 top-0 w-1 h-3 bg-gray-600 rounded-full"></div>
              </div>
            )}
          </button>
        </div>
        {/* Background Music */}
        <audio
          id="background-music"
          src="https://raw.githubusercontent.com/phutharesuan/surprise/main/surprise.mp3"
          loop
          preload="auto"
          crossOrigin="anonymous"
          className="hidden"
        >
          Your browser does not support the audio element.
        </audio>

        {/* Background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-2 h-2 bg-pink-300 rounded-full opacity-60 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-2xl w-full">
            {/* Letter envelope effect */}
            <div className="relative">
              <div 
                className={`bg-white rounded-lg shadow-2xl p-8 md:p-12 transform transition-all duration-1000 ${
                  animateText ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                style={{
                  backgroundImage: 'linear-gradient(135deg, #fff 0%, #fef7f7 100%)',
                  border: '2px solid #f0abfc',
                }}
              >
                {/* Letter header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="text-pink-500 w-6 h-6" />
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      Happy 21st Birthday, Gorkao!
                    </h1>
                    <Sparkles className="text-pink-500 w-6 h-6" />
                  </div>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className="w-4 h-4 text-red-400 fill-current animate-pulse" 
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Letter content */}
                <div 
                  className={`space-y-6 transform transition-all duration-1000 delay-500 ${
                    animateText ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    Happy Birthday! I hope you have a good day, a great month, and an amazing year ahead.
                  </p>
                  
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    I truly wish you get to do everything you dream of.
                  </p>
                  
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    I hope our relationship turns out more like Noah and Allie — not like Sebastian and Mia.
                  </p>
                  
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    But either way… let's just leave it to the future.
                  </p>
                  
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    And by the way —
                  </p>
                  
                  <p className="text-xl md:text-2xl font-bold text-pink-600 text-center italic">
                    "I'm always gonna love you, too."
                  </p>
                </div>

                {/* Letter footer */}
                <div className="mt-12 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Gift className="text-purple-500 w-5 h-5" />
                    <span className="text-gray-500 text-sm">With love on your special day</span>
                    <Gift className="text-purple-500 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">

        <div 
          className={`transform transition-all duration-700 cursor-pointer ${
            isCardOpen ? 'scale-110 rotate-3' : 'hover:scale-105 hover:-rotate-1'
          }`}
          onClick={handleCardClick}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            {/* Main card */}
            <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-2xl transform transition-all duration-300 group-hover:shadow-3xl">
              <div className="text-center space-y-6">
                {/* Birthday icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Gift className="w-16 h-16 md:w-20 md:h-20 text-pink-500 animate-bounce" />
                    <div className="absolute -top-2 -right-2">
                      <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Card title */}
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Hi, Please Open Me
                </h2>

                {/* Subtitle */}
                <p className="text-gray-600 text-lg md:text-xl">
                  Something special is waiting for you...
                </p>

                {/* Animated border */}
                <div className="flex justify-center">
                  <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>

                {/* Tap instruction */}
                <p className="text-sm text-gray-400 animate-fade-in-out">
                  Tap to open
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Music note - placeholder for background music */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleMusic}
          className={`bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            !audioReady ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={isPlaying ? 'Pause music' : 'Play music'}
          disabled={!audioReady}
        >
          {isPlaying ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-4 bg-white rounded-sm"></div>
                <div className="w-1.5 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;