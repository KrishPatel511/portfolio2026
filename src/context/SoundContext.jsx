import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundFx } from '../utils/soundEffects';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sound-fx-enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  useEffect(() => {
    soundFx.setEnabled(soundEnabled);
    localStorage.setItem('sound-fx-enabled', soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      soundFx.setEnabled(true);
      soundFx.playPop();
    }
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
