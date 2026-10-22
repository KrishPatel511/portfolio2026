import React, { useEffect, useState } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { NAV_LINKS, getPage, getNavPage } from '../../utils/pages';

export const Navigation = () => {
  const [current, setCurrent] = useState(() => getNavPage(getPage(window.location.hash)));

  useEffect(() => {
    const onHash = () => setCurrent(getNavPage(getPage(window.location.hash)));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <nav className="swt4a33 w1nm8v5u" aria-label="Main Navigation">
      <ul className="nqxiycd">
        {NAV_LINKS.map(({ page, label, href }, i) => (
          <li
            key={page}
            className={`lbj2n6v ${i === NAV_LINKS.length - 1 ? 'o17p2a19' : ''}`}
            data-is-final-nav-item={i === NAV_LINKS.length - 1 ? 'true' : undefined}
          >
            <a
              className={`nvlm710 ${current === page ? 'active' : ''}`}
              href={href}
              aria-current={current === page ? 'page' : undefined}
              onClick={() => soundFx.playPop()}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
