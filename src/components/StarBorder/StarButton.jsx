import StarBorder from './StarBorder';
import { useTheme } from '../../context/ThemeContext';
import './StarButton.css';

/* The site's button: StarBorder with the usage-example settings, themed to light/dark.
   Pass `primary` for the main call to action (adds the twinkling sparkle). */
export const StarButton = ({ primary = false, className = '', children, ...rest }) => {
  const { isDark } = useTheme();
  return (
    <StarBorder
      theme={isDark ? 'dark' : 'light'}
      duration={4}
      direction="clockwise"
      stars={1}
      trailLength={0.3}
      thickness={1}
      radius={12}
      glow={0.6}
      hover="lap"
      sparkle={primary}
      clickPulse
      className={`star-btn ${className}`.trim()}
      {...rest}
    >
      {children}
    </StarBorder>
  );
};
