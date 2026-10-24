import React, { useEffect, useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { NAV_LINKS, getPage, getNavPage } from '../../utils/pages';
import { useTheme } from '../../context/ThemeContext';
import { usePath } from '../../utils/router';
import GooeyNav from '../GooeyNav/GooeyNav';

const ITEMS = NAV_LINKS.map(({ label, href }) => ({ label, href }));
const PILL_COLORS = { light: '#4f46e5', dark: '#809bff' };

const indexFor = (path) => {
  const page = getNavPage(getPage(path));
  return Math.max(0, NAV_LINKS.findIndex((link) => link.page === page));
};

export const Navigation = () => {
  const { isDark } = useTheme();
  const path = usePath();
  const [current, setCurrent] = useState(() => indexFor(path));

  useEffect(() => {
    setCurrent(indexFor(path));
  }, [path]);

  return (
    <div className="swt4a33 w1nm8v5u" aria-label="Main Navigation">
      <GooeyNav
        items={ITEMS}
        activeIndex={current}
        onChange={(index) => {
          soundFx.playPop();
          setCurrent(index);
        }}
        theme={isDark ? 'dark' : 'light'}
        color={PILL_COLORS[isDark ? 'dark' : 'light']}
        size="md"
        frame={false}
        particleCount={15}
        spread={26}
        animationTime={550}
        timeVariance={200}
        gooeyness={0.55}
        wobble={0.45}
        style={{
          '--gn-ink': 'var(--color-text)',
          '--gn-muted': 'var(--color-text)',
          '--gn-x': '18px',
          '--gn-y': '10px',
          '--gn-gap': '2px',
          fontSize: '15px',
          fontWeight: 600,
        }}
      />
    </div>
  );
};
