import MaskedHeading from './MaskedHeading';

const TEXTURES = {
  water: '/images/mask-water.jpg',
  amber: '/images/mask-amber.jpg',
  emerald: '/images/mask-emerald.jpg',
  violet: '/images/mask-violet.jpg',
};

/* The masked, spotlit h1 used at the top of every page. Each page picks its own texture. */
export const PageTitle = ({ text, texture = 'water' }) => (
  <div className="page-title-wrap">
    <MaskedHeading
      tag="h1"
      text={text}
      mediaType="image"
      src={TEXTURES[texture] ?? TEXTURES.water}
      fillScale={1.3}
      parallax={34}
      reveal="rise"
      trigger="view"
      spotlight
      spotlightRadius={200}
      drift={10}
      hoverZoom={0.06}
      saturation={1.15}
      weight={800}
      tracking={-0.01}
      lineHeight={1.1}
      textScale={0.085}
      align="left"
      style={{ fontFamily: 'var(--font-display)', margin: '0.6rem 0 1rem' }}
    />
  </div>
);
