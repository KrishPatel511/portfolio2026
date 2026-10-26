import React from 'react';
import { FiShield, FiZap, FiTruck, FiEdit3 } from 'react-icons/fi';

const ICONS = { shield: FiShield, zap: FiZap, truck: FiTruck };

/* The picture for a post: no image files, just the post's accent colour, a dotted sky texture
   and a big icon, so every post gets its own look and nothing extra has to download. */
export const BlogCover = ({ post, size = 'card' }) => {
  const Icon = ICONS[post.icon] || FiEdit3;
  return (
    <div className={`bl-cover bl-cover--${size}`} style={{ '--accent': post.color }} aria-hidden="true">
      <span className="bl-cover-orb bl-cover-orb--a" />
      <span className="bl-cover-orb bl-cover-orb--b" />
      <Icon className="bl-cover-icon" />
      <span className="bl-cover-tag">{post.category}</span>
    </div>
  );
};
