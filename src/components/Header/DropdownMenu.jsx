import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout,
  FiCode,
  FiActivity,
  FiTerminal,
  FiCompass,
  FiAward,
  FiBookOpen,
  FiZap,
  FiSliders,
  FiBox,
  FiLayers,
  FiExternalLink
} from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';

export const dropdownData = {
  categories: {
    title: 'Explore by Topic',
    subtitle: 'Deep-dive articles and comprehensive guides',
    items: [
      {
        icon: FiLayout,
        title: 'CSS',
        desc: 'Flexbox, Grid, modern layouts & custom resets',
        badge: 'Popular',
        color: '#38bdf8'
      },
      {
        icon: FiCode,
        title: 'React',
        desc: 'Mental models, re-renders & Server Components',
        badge: 'Core',
        color: '#60a5fa'
      },
      {
        icon: FiActivity,
        title: 'Animation',
        desc: 'Physics-based spring motion, SVG & UI delight',
        badge: 'Playful',
        color: '#f43f5e'
      },
      {
        icon: FiTerminal,
        title: 'JavaScript',
        desc: 'Async flow, closures & foundational quirks',
        badge: 'Deep Dive',
        color: '#f59e0b'
      },
      {
        icon: FiCompass,
        title: 'Career & Mindset',
        desc: 'Navigating frontend engineering journeys',
        badge: 'Advice',
        color: '#10b981'
      }
    ]
  },
  courses: {
    title: 'Interactive Courses',
    subtitle: 'Step-by-step masterclasses with hands-on practice',
    items: [
      {
        icon: FiAward,
        title: 'CSS for JavaScript Developers',
        desc: 'Master CSS once and for all with visual mental models.',
        badge: 'Flagship',
        color: '#8b5cf6'
      },
      {
        icon: FiBookOpen,
        title: 'The Joy of React',
        desc: 'An interactive course on building modern, robust React apps.',
        badge: 'Bestseller',
        color: '#06b6d4'
      },
      {
        icon: FiZap,
        title: 'Whimsical Web & Motion',
        desc: 'Crafting delightful micro-animations and physics.',
        badge: 'New',
        color: '#ec4899'
      }
    ]
  },
  goodies: {
    title: 'Free Interactive Tools',
    subtitle: 'Little web utilities to sharpen your developer toolkit',
    items: [
      {
        icon: FiLayers,
        title: 'Shadow Palette Generator',
        desc: 'Create smooth, layered, hyper-realistic CSS shadows.',
        badge: 'Tool',
        color: '#6366f1'
      },
      {
        icon: FiSliders,
        title: 'Fluid Typography Calculator',
        desc: 'Calculate CSS clamp() values effortlessly.',
        badge: 'Utility',
        color: '#14b8a6'
      },
      {
        icon: FiBox,
        title: 'Gradient Interpolator',
        desc: 'Generate rich color palettes without gray dead-zones.',
        badge: 'Generator',
        color: '#f97316'
      }
    ]
  }
};

export const DropdownMenu = ({ activeMenu, onClose }) => {
  if (!activeMenu || !dropdownData[activeMenu]) return null;

  const data = dropdownData[activeMenu];

  return (
    <AnimatePresence>
      <motion.div
        className="nav-dropdown-overlay"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onMouseLeave={onClose}
      >
        <div className="nav-dropdown-container">
          <div className="nav-dropdown-header">
            <div>
              <h4 className="nav-dropdown-title">{data.title}</h4>
              <p className="nav-dropdown-subtitle">{data.subtitle}</p>
            </div>
          </div>

          <div className={`nav-dropdown-grid ${activeMenu === 'categories' ? 'grid-dense' : ''}`}>
            {data.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="nav-dropdown-card"
                  onClick={() => {
                    soundFx.playPop();
                    onClose();
                  }}
                  onMouseEnter={() => soundFx.playPop()}
                >
                  <div
                    className="nav-card-icon-wrap"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="nav-card-content">
                    <div className="nav-card-header">
                      <span className="nav-card-title">{item.title}</span>
                      {item.badge && <span className="nav-card-badge">{item.badge}</span>}
                    </div>
                    <p className="nav-card-desc">{item.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
