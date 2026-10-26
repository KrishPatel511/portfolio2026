/* Article text. Each post is a list of blocks:
     ['h2', 'Heading']                      a section heading (with a link icon on hover)
     ['h3', 'Sub-heading']                  a smaller heading
     ['p', 'Paragraph']                     text; **bold**, `code` and [link](/path or https://...) work inside
     ['ul', ['one', 'two']]                 a bullet list
     ['ol', ['one', 'two']]                 a numbered list
     ['code', 'js', 'text', 'file.js']      a code block (syntax coloured, with a copy button; file name optional)
     ['aside', 'info', 'Title', 'Text']     a side note; kinds: info, success, warning, error
     ['stack', [['Name', 'v1.0', 'react']]] a wide grid of tool cards (icon keys are in BlogPostPage.jsx)
     ['figure', '/image.jpg', 'Alt', 'Caption']   a picture with a caption
     ['demo', 'sound']                      a live demo box (kinds are in BlogPostPage.jsx)
   Keep it in the first person and only write what really happened. */

export const BODIES = {
  'how-i-built-my-portfolio': [
    ['p', 'This portfolio started as a simple page and slowly became a small application: eleven pages, a WebGL cursor, a generative rainbow, a real map, sounds made from nothing but math, a pre-rendering build step and a serverless contact form. It is about 16,000 lines of code, and I wrote every component and every line of CSS by hand.'],
    ['p', 'Here is the home page, in light mode:'],
    ['figure', '/projects/portfolio.jpg', 'The portfolio home page with a blue sky, clouds and a rainbow', 'The home page: a hand-drawn sky, clouds and a rainbow that bends toward your cursor.'],
    ['p', 'In this post I want to share how the whole thing fits together, what I would do the same way again, and the mistakes I made along the way. If you are planning your own portfolio, or you are curious how a site like this works under the hood, I hope it helps.'],
    ['aside', 'info', 'A note on inspiration', 'The look and feel of this portfolio, and of this blog, are inspired by [joshwcomeau.com](https://www.joshwcomeau.com/). Several interactions started as rebuilds of things I admired there, written in my own code as a way to learn. The text, the code and the numbers in this post are mine.'],

    ['h2', 'The core stack'],
    ['p', 'Here is the short list of the main tools I used:'],
    ['stack', [
      ['React', 'v19', 'react'],
      ['Vite', 'v8', 'vite'],
      ['GSAP', 'v3', 'gsap'],
      ['Framer Motion', 'v14', 'framer'],
      ['MapLibre GL', 'v6', 'maplibre'],
      ['Supabase', 'v2', 'supabase'],
      ['Resend', 'Email API', 'resend'],
      ['Vercel', 'Hosting', 'vercel'],
      ['Lighthouse', 'v13', 'lighthouse'],
      ['oxlint', 'Linting', 'oxc'],
      ['canvas-confetti', 'v1', 'confetti'],
      ['react-icons', 'v5', 'icons'],
    ]],
    ['p', 'You might be wondering why there is no Next.js and no Tailwind in that list. The honest answer is that a portfolio should show how someone builds, not only say it. I wanted to understand every layer of my own site, so I wrote the router, the styles and the build step myself. That is more work than using a framework, and I will talk about the trade-offs later.'],

    ['h2', 'Content lives in code'],
    ['p', 'There is no CMS here. Projects, skills, experience and blog posts are plain JavaScript data, and the pages are components that read it. A new project is an object in an array, and a new blog post is an entry in a small list plus a list of text blocks.'],
    ['p', 'The nice part is that the same data feeds everything else. The page titles, descriptions, social cards, structured data and the sitemap are all generated from the same list of routes, so they can never drift apart from the content.'],
    ['aside', 'warning', 'The trade-off', 'Changing a typo means a new deploy, because the content is part of the code. For a personal site that updates a few times a month, I am happy with that. For a team with editors, I would reach for a CMS.'],

    ['h2', 'Routing without a library'],
    ['p', 'A site with nine pages does not need a full router. The whole thing is a small file built on the browser\'s History API. A map turns a path into a page name, and an unknown path becomes a real 404 page:'],
    ['code', 'js', "export const PATH_TO_PAGE = {\n  '/': 'about',\n  '/projects': 'projects',\n  '/projects/gmdc': 'gmdc',\n  '/skills': 'skills',\n  '/experience': 'experience',\n  '/contact': 'contact',\n  '/blog': 'blog',\n};\n\nexport const getPage = (path) => PATH_TO_PAGE[path] ?? 'notfound';", 'src/utils/pages.js'],
    ['p', 'A click handler turns clicks on internal links into client-side navigation, and the back button works through the `popstate` event. Old links that used `#hash` addresses are redirected to the new real URLs, so nothing that was ever shared stops working.'],

    ['h2', 'Styling and CSS'],
    ['p', 'Everything is hand-written CSS with design tokens. Colors, fonts and spacing are CSS variables, and dark mode is just a second set of values under a `data-color-mode` attribute. There is no framework and no runtime styling library.'],
    ['p', 'The part I am proudest of is the theme switch. Normally, changing a CSS variable snaps instantly and breaks gradients. By registering each color token with `@property`, the browser can animate between the two values:'],
    ['code', 'css', '@property --color-text {\n  syntax: "<color>";\n  inherits: true;\n  initial-value: hsl(222deg 22% 15%);\n}', 'src/styles/theme-transition.css'],
    ['p', 'With the tokens registered, a theme change becomes a smooth cross-fade of gradients, fills and borders instead of a flash.'],

    ['h2', 'Code snippets'],
    ['p', 'The code blocks on this page are coloured by a few dozen lines of my own code. A single regular expression finds comments, strings, keywords and numbers, and each match is wrapped in a colored `span`. It is nowhere near as capable as a real syntax highlighter, but it adds almost nothing to the page, and it covers everything I need for short snippets.'],
    ['p', 'Hover over any block to find the copy button. The colors come from the same tokens as the rest of the site, so the snippets change with the theme too:'],
    ['code', 'js', "// A comment, a string, a number and a few keywords\nconst greeting = 'Hello, world';\nconst year = 2026;\n\nif (year > 2025) {\n  console.log(greeting);\n}", 'example.js'],

    ['h2', 'The magic of pre-rendering'],
    ['p', 'A client-side React app starts as an empty page, which is not great for search engines or for people on slow phones. So, at build time, a script renders every route to real HTML. It runs a server build, calls `renderToString` once per page, and writes each result to its own folder.'],
    ['p', 'The same script writes the title, description, canonical link, social card tags and structured data into each page, builds the sitemap, and even adds each page\'s own CSS and JavaScript links so the page is styled before any script runs.'],
    ['p', 'To make pages load only the code they need, each page is its own file in the browser. The server build needs the opposite, so a single alias in the Vite config swaps one file for another:'],
    ['code', 'js', "export default defineConfig(({ isSsrBuild }) => ({\n  plugins: [react()],\n  build: { manifest: true },\n  resolve: {\n    alias: {\n      '#pages': pagesFile(isSsrBuild ? 'pages.static.jsx' : 'pages.lazy.jsx'),\n    },\n  },\n}));", 'vite.config.js'],
    ['aside', 'error', 'Two bugs I shipped', 'Splitting the code caused two visible problems. First, pre-rendered pages looked unstyled until JavaScript ran, because their CSS lived in a separate file. Second, on first load the footer flashed at the top of the screen for a third of a second, because React paused for one frame while it waited for the page. I fixed the first by linking each page\'s CSS in its HTML, and the second by rendering already-downloaded pages immediately and holding the page\'s height while a new one loads.'],

    ['h2', 'Interactive widgets'],
    ['p', 'Most of the personality on this site comes from small interactions. Headings are cut out of a photo and lit by a spotlight that follows the mouse. Skill cards flip in 3D. A fluid simulation, drawn with WebGL, swirls behind some pages and follows your cursor.'],
    ['p', 'That fluid effect is decoration, so its code is only downloaded after the page has painted and the browser is idle. The content never waits for it.'],
    ['p', 'Sounds are another favorite. There are no audio files at all: each sound is built from oscillators and volume envelopes in the Web Audio API. Try them here (they respect the speaker switch in the header):'],
    ['demo', 'sound'],
    ['p', 'The mascot on the home page also fires confetti when you click it. It is a small thing, but small things are what make a site feel like it was made by a person.'],

    ['h2', 'Database stuff'],
    ['p', 'The contact form is the only part of the site with a backend. It is a single serverless function on Vercel. When someone sends a message, the function does a handful of things in order:'],
    ['ol', [
      'It ignores the request if a hidden "honeypot" field is filled in, which only bots do.',
      'It validates the name, email and message, with length limits.',
      'It checks a rate limit: at most **5 messages per 10 minutes** from the same visitor, using a hashed IP address so no raw address is stored.',
      'It saves the message in a Supabase table.',
      'It emails me through Resend, with the visitor as the reply-to address so that "Reply" just works.',
    ]],
    ['code', 'js', 'const RATE_LIMIT = 5; // submissions per IP...\nconst RATE_WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes\nconst EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;', 'api/contact.js'],
    ['p', 'You might notice that this blog has a heart button on the side, but no counter. That is on purpose. A counter needs a database and some way to stop abuse, and a number that I could not back up would be a fake. So the heart only remembers, in your own browser, that you liked the post.'],

    ['h2', '“The Details”'],
    ['h3', 'Element cohesion'],
    ['p', 'I spent a surprising amount of time making small components feel like they belong together. For example, the side notes in this post come in four kinds, and each one has its own colors for light and for dark mode:'],
    ['aside', 'info', 'Info', 'A neutral note, for background that is useful but not essential.'],
    ['aside', 'success', 'Success', 'Something that worked, or advice I would give again.'],
    ['aside', 'warning', 'Warning', 'A trade-off or a thing to be careful about.'],
    ['aside', 'error', 'Error', 'A mistake I made, so you do not have to.'],
    ['p', 'Switch the theme with the sun icon in the header and watch all four change together.'],

    ['h3', 'The rainbow'],
    ['p', 'On the home page, a rainbow is drawn on a canvas, one dash at a time. Each dash bends toward your cursor like iron filings near a magnet. It is my version of an effect I loved, built from scratch so I could learn how it works.'],

    ['h3', 'A real map'],
    ['p', 'The map on the home page uses MapLibre GL with free map tiles, so there is no API key to protect. It shows where I am and, when it can tell, where you are, and it is imported lazily, so the map\'s code only loads if that part of the page is used.'],

    ['h3', 'Search'],
    ['p', 'The search box in the header is a small modal that filters a list built from the site\'s own data, and highlights the part of each result that matches what you typed. With such a short list of pages and posts, a search service would be overkill.'],

    ['h2', 'Accessibility'],
    ['p', 'Accessibility is part of the design, not a patch added at the end. A few of the things I check:'],
    ['ul', [
      'Every media query uses `rem`, not pixels: **39** `rem` queries and **0** pixel ones. If someone raises their browser\'s default font size, the layout adapts instead of breaking.',
      'Motion respects the "reduce motion" setting. There are **19** places that switch an animation off.',
      'Buttons, links and form fields have accessible names, which Lighthouse checks on every page I test.',
      'Each page has one `h1`, a `main` landmark and a sensible heading order.',
    ]],
    ['p', 'The result: Lighthouse reports an accessibility score of **100** on the pages I tested. Of course, I am always still learning, so if you find something that is hard to use, please [tell me](/contact).'],

    ['h2', 'Performance'],
    ['p', 'A site full of WebGL and canvas effects can easily become slow, so I measured it, with Lighthouse in mobile mode and CPU and network throttling, taking the median of three runs. Here is what actually moved the numbers:'],
    ['ul', [
      '**One image.** A project card used a **2.27 MB** PNG. As a progressive JPEG it is **239 KB**. This was the cheapest fix of all.',
      '**Splitting the code by page.** The main JavaScript file went from **723 KB to 438 KB** (246 KB to 140 KB gzipped). Each page now downloads on demand, and the rest are fetched quietly when the browser is idle.',
      '**Largest Contentful Paint** on the Projects page went from **18.8 s to 8.8 s** in my lab test, and its download size from 3.9 MB to 1.7 MB.',
    ]],
    ['aside', 'warning', 'A fix I reverted', 'I tried loading the Google Fonts stylesheet without blocking the first paint. The first paint improved from about 4.3 s to 2.7 s, but the layout shift jumped from 0 to 0.9 because text swapped fonts and everything moved. A faster number that makes the page jump is not a win, so I reverted it.'],
    ['p', 'To be honest, the performance score is still only around 59 in a throttled lab test, and real phones will differ. Self-hosting the fonts with preloading is next on my list.'],

    ['h2', 'A foundation to build on'],
    ['p', 'The best part of building everything by hand is that I understand every piece of it. Adding a page means adding a path, a component and a line of SEO data. Adding a blog post means adding some text. There is nothing mysterious left to fight.'],
    ['p', 'There is still a lot I want to do: self-hosted fonts, real testimonials once I have permission to quote people, a few more posts like this one, and some basic analytics so I can see what is actually used.'],
    ['aside', 'success', 'Still have questions?', 'If you are curious how any part works, you can read the source on [GitHub](https://github.com/KrishPatel511/portfolio2026), or [send me a message](/contact). I would love to hear from you.'],
  ],
};
