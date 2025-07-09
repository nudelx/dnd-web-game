import { useState, useRef } from "react";

export const useMusic = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState("ambient");
  const audioRef = useRef(null);

  const playMusic = (type = "ambient") => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const musicUrls = {
      ambient: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual ambient music
      combat: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with combat music
      victory: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with victory music
    };

    const audio = new Audio(musicUrls[type]);
    audio.loop = type === "ambient";
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.play();
    setIsMusicPlaying(true);
    setCurrentMusic(type);
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsMusicPlaying(false);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      playMusic(currentMusic);
    }
  };

  return {
    isMusicPlaying,
    currentMusic,
    playMusic,
    stopMusic,
    toggleMusic,
  };
};
