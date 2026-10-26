import SplashCursor from './LazySplashCursor';
import { useTheme } from '../../context/ThemeContext';
import './HeaderSplash.css';

/* Splash cursor confined to a page's title area, fading out at its edges so the
   rest of the page (cards, timelines) stays clean and light on the GPU. */
export const HeaderSplash = () => {
  const { isDark } = useTheme();
  return (
    <SplashCursor
      contained
      rainbow
      size={1}
      force={1}
      swirl={3}
      trail={1}
      clickSplash
      quality="medium"
      zIndex={0}
      className="header-splash"
      theme={isDark ? 'dark' : 'light'}
    />
  );
};
