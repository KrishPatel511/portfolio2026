/* Article text. Each post is a list of blocks:
     ['h2', 'Heading']                      a section heading (with a link icon on hover)
     ['h3', 'Sub-heading']                  a smaller heading
     ['p', 'Paragraph']                     text; **bold**, `code` and [link](/path or https://...) work inside
     ['ul', ['one', 'two']]                 a bullet list
     ['ol', ['one', 'two']]                 a numbered list
     ['code', 'js', 'text', 'file.js']      a code block (syntax coloured, with a copy button; file name optional)
     ['aside', 'info', 'Title', 'Text']     a side note; kinds: info, success, warning, error
     ['stack', [['Name', 'v1.0', 'react']]] a wide grid of tool cards (icon keys are in BlogPostPage.jsx)
     ['figure', '/image.jpg', 'Alt', 'Caption', [w, h]]   a picture with a caption (size is optional)
     ['gallery', [['/a.webp', 'Alt', 'Caption', [w, h]], ...]]   pictures side by side (stacked on phones)
     ['video', '/clip.mp4', '/poster.webp', 'Caption', [w, h]]   a short muted clip; loads only when played
     ['compare', 'Title', [['Light', '/a.jpg', 'Alt'], ['Dark', '/b.jpg', 'Alt']]]   a before/after frame with Toggle and Expand
     ['codeframe', 'Title', 'code', ['Light', 'Dark']]   one snippet shown in two colour themes
     ['playground']                         an editable HTML, CSS and JS playground
     ['rainbow']                            the interactive rainbow with its settings panel
     ['demo', 'sound']                      a live demo box (kinds are in BlogPostPage.jsx)
   Keep it in the first person and only write what really happened. */

export const BODIES = {
  'how-i-built-my-portfolio': [
    ['p', 'This portfolio started as a simple page and slowly became a small application: eleven pages, a WebGL cursor, a generative rainbow, a real map, sounds made from nothing but math, a pre-rendering build step and a serverless contact form. It is about 16,000 lines of code, and I wrote every component and every line of CSS by hand.'],
    ['p', 'Here is the home page, in light and dark mode. Use the buttons to switch between them, or expand the frame to see both side by side:'],
    ['compare', 'Home page', [
      ['Light', '/blog/home-light.jpg', 'The portfolio home page in light mode, with a blue sky and a 3D character'],
      ['Dark', '/blog/home-dark.jpg', 'The portfolio home page in dark mode, with a night sky and a 3D character'],
    ]],
    ['p', 'In this post I want to share how the whole thing fits together, what I would do the same way again, and the mistakes I made along the way. If you are planning your own portfolio, or you are curious how a site like this works under the hood, I hope it helps.'],
    
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
    ['codeframe', 'Code Snippets', "// A comment, a string, a number and a few keywords\nconst greeting = 'Hello, world';\nconst year = 2026;\n\nfunction welcome(name) {\n  if (year > 2025) {\n    return greeting + ', ' + name;\n  }\n}\n\n.card {\n  padding: 1.5rem;\n  color: #818cf8;\n}", ['Light', 'Dark']],
    ['p', 'The frame above shows the same snippet in both themes. Toggle between them, or expand it to compare.'],

    ['h2', 'Code playgrounds'],
    ['p', 'Besides snippets, I wanted little Codepen-style editors, where you can change the code and watch the result run. Here is a real example: a waving Indian flag, made with plain HTML, CSS and a few lines of JavaScript, with no libraries and no image files.'],
    ['p', 'The trick is simple. The flag is drawn once, as one small picture. The script then cuts it into thirty thin columns, and each column shows just its own slice of that picture. The CSS moves every column up and down, and each one starts a little later than the one before it, so the movement travels across the flag like a wave. The column next to the pole barely moves, and the free end moves the most.'],
    ['p', 'This editor is a textarea laid over a highlighted copy of the same text, and the result runs in a sandboxed `iframe`, so nothing you type can touch this page. Go ahead and break it: try `COLUMNS = 60`, `BILLOW = 16`, or `DELAY = 20`.'],
    ['playground'],
    ['aside', 'info', 'Why slices?', 'A flag is one flat picture, and CSS cannot bend a picture on its own. Cutting it into columns and moving each one separately is a cheap way to fake the bend, and the chakra in the middle stretches and ripples with the cloth for free.'],

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
    ['p', 'On the home page, a rainbow is drawn on a canvas, one dash at a time. Each dash bends toward your cursor like iron filings near a magnet. It is my version of an effect I loved, built from scratch so I could learn how it works. Move your mouse over this one:'],
    ['rainbow'],
    ['p', 'There is a little easter egg too: if you hover over the rainbow for a moment, an "Edit" button appears. It opens a small settings panel where you can change the number of rows, the density, the bend and the thickness. Your changes only affect your own screen, since I do not run a server that could share them between visitors.'],

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
  'how-i-built-a-government-dispatch-system': [
    ['p', 'In March I stood in a small cabin at a lignite mine in Bhavnagar and watched a truck driver hand over a paper token. A clerk looked at it, found the right line in a thick register, and wrote the truck number, the time and the weight by hand. Then the truck drove on to the next checkpoint, where the same thing happened again.'],
    ['p', 'That was one of nine checkpoints. The job I had been given was to replace all of that paper with one automated dispatch system, for a government corporation, with real trucks waiting in a real queue. This is the story of how it was built, what was hard about it, and what it taught me.'],

    ['h2', 'The brief'],
    ['p', 'The client is **GMDC**, the Gujarat Mineral Development Corporation, a government enterprise. The project is its **lignite mine at Bhavnagar**, where trucks arrive every day to be checked, weighed and loaded. My company, **AMNEX Infotechnologies**, was building the dispatch system for it, and I was selected from the AMNEX side to build the software.'],
    ['p', 'In one sentence, the ask was this: every truck passes through **9 checkpoints**, every checkpoint was recorded by hand in a register, and GMDC wanted a fully automated system instead.'],
    ['aside', 'info', 'The project at a glance', 'Client: GMDC (government). Site: Bhavnagar lignite project. My role: the only software developer, working next to a hardware team. Scale today: 9 checkpoints and 100+ transactions a day.'],

    ['h2', 'Visiting the mine before writing any code'],
    ['p', 'Before opening an editor I went to the **Bhavnagar mining site** for a live inspection. I wanted to see the real flow with my own eyes, not a description of it in a meeting room. I also met the Mining Manager and the on-site team, because the people who run a checkpoint every day know things that no requirements document will ever contain.'],
    ['p', 'This is what the paper world looked like. The first photo is the **truck in-out register**, kept per gate and per shift. Each row has a serial number, a token number, the truck number, the in and out time, the delivery challan details, the weight, the driver and the licence number. The second photo is a close-up of a **token slip** lying on top of it:'],
    ['gallery', [
      ['/blog/gmdc_03.webp', 'The GMDC Lignite Project Bhavnagar truck in-out register, filled in by hand, with a printed token slip on top', 'The in-out register at a gate, filled in by hand, with a token slip placed on it.', [1100, 825]],
      ['/blog/gmdc_02.webp', 'Close-up of a GMDC token slip for lignite loading lying on the handwritten register', 'A close-up of the token slip: reporting date, quota date, token, grade, truck, tare weight and traffic point.', [1000, 750]],
    ]],
    ['p', 'The token slip is a small printout with the reporting date, the quota date, the token number, the grade of lignite, the truck number, the tare weight and the traffic point. It is printed on perforated paper, stamped by hand, and then checked against the register.'],
    ['aside', 'warning', 'A note on the photos', 'These pictures come from a real government site, so I blurred the parts that show names, licence details, token and truck numbers, addresses and internal system addresses. The layout is real, the personal and commercial details are not.'],

    ['h2', 'Understanding the current flow'],
    ['p', 'Watching the gate for a while made the shape of the problem clear. Nine checkpoints, nine registers, and a lot of careful handwriting:'],
    ['ul', [
      '**Every checkpoint kept its own register.** There was no single place where anyone could ask where a given truck was right now.',
      '**Everything depended on people reading handwriting** and copying numbers correctly, under pressure, with a queue of trucks outside.',
      '**Checks were done by eye.** A person looked at a licence card or a slip and decided whether it was fine.',
      '**The paperwork and the physical truck had to agree.** Each load travels with a tax invoice and a royalty pass-cum-delivery challan, and the weights, grade and truck have to match them.',
    ]],
    ['p', 'That last point is why the project is more than a data-entry screen. The documents that travel with each load are formal government paperwork, with a QR code, tax details and a delivery challan, and whatever the new system recorded had to line up with them.'],
    ['p', 'I also found something useful on the token counter itself. A laptop there was already running a web screen called **GMDC Dispatch**, with Master, Transaction and Reports menus, and a token entry form with fields such as quota type, truck number, driver licence, platform, tare weight and net weight, plus a printer for the slips. It showed me the vocabulary the staff already used, which I wanted to keep:'],
    ['gallery', [
      ['/blog/gmdc_01.webp', 'A GMDC tax invoice and royalty pass-cum-delivery challan with a QR code, with personal and commercial details blurred', 'The paperwork that travels with every load: a tax invoice and a royalty pass-cum-delivery challan.', [900, 1200]],
      ['/blog/gmdc_05.webp', 'A laptop at the token counter showing the GMDC Dispatch token entry screen, next to a window overlooking waiting trucks', 'The token counter: the GMDC Dispatch screen on a laptop, with the truck queue visible through the window.', [800, 1067]],
    ]],

    ['h2', 'Turning the flow into a plan'],
    ['p', 'Back at the office, our team sat down and mapped the flow checkpoint by checkpoint. The team had a **hardware side** as well as software, and that shaped everything. The plan was to remove the register entirely and let the system do the work that people did by eye and by hand:'],
    ['ul', [
      '**Identify the truck automatically** with RFID, instead of reading a number off paper.',
      '**Control the boom barrier** from the system, so a truck moves only when it has been cleared.',
      '**Capture the weight** from the weighbridge directly, instead of copying it down.',
      '**Log the vehicle with cameras**, so every pass has a picture attached to it.',
      '**Book slots and generate slips** in software, instead of stamping paper by hand.',
      '**Verify the vehicle and the driver** against national government systems.',
    ]],
    ['p', 'Instead of nine registers, there would be one shared system, so any checkpoint, and the people running the mine, could see the same truth at the same time.'],

    ['h2', 'Software and hardware, together'],
    ['p', 'Most of the projects I had worked on before lived entirely in a browser. This one did not. RFID readers, boom barriers, weighbridges and cameras each had their own owner on the hardware team and their own way of talking to a computer, and my job was to make all of that behave like one system on a screen.'],
    ['p', 'It changed how I worked. I could not finish the software first and attach the hardware later, because the two decide each other\'s limits. A few short clips from the cabin show the kind of setting this software had to live in: desks full of registers, slips and stamps, with a computer in the middle of it. Press play to watch, nothing downloads until you do:'],
    ['video', '/blog/gmdc_vid_01.mp4', '/blog/gmdc_vid_01.webp', 'A short clip from the cabin: registers, slips and a stamp pad on the desk where the work was done by hand.', [360, 640]],
    ['video', '/blog/gmdc_vid_02.mp4', '/blog/gmdc_vid_02.webp', 'A checkpoint screen waiting for a delivery number, with the paperwork still on the desk beside it.', [640, 360]],

    ['h2', 'The Mac problem'],
    ['p', 'Then came the challenge I had not planned for. At the mining checkpoints, the operators were going to work on **MacBooks**. The machines had been chosen, and it was not something I could change.'],
    ['p', 'The trouble is that a lot of third-party integrations are not built with macOS in mind. In my case, some of the **third-party API integrations simply were not supported on the Mac**. I develop on a Windows machine, so everything looked fine on my side, and the gap only showed up when I thought about the machines that would really run the software.'],
    ['aside', 'warning', 'Why this one hurt', 'It is not a bug you can fix with a patch. It is a limit that comes from the hardware, the vendor and the operating system, and it only appears when you check the integration against the real target machine, not your own laptop.'],
    ['p', 'There was no single fix. Each integration that did not work on the Mac needed its own decision, usually together with the hardware team, because the answer often meant changing how a device was connected, not only how my code called it. I faced many such challenges at that stage, and it was the part of the project that taught me the most.'],

    ['h2', 'Checking vehicles and drivers with Parivahan and Sarathi'],
    ['p', 'The part that makes a dispatch system feel serious is the verification. For this I integrated two national government systems:'],
    ['ul', [
      '**Parivahan** for the vehicle: the truck number from the gate is checked against the national vehicle records.',
      '**Sarathi** for the driver: the licence number is checked against the national driving licence records.',
    ]],
    ['p', 'The idea is simple. A truck should not be loaded just because someone handed over a slip. Instead, the system checks that the vehicle and the driver are genuine before the flow continues. The same service layer also talks to FASTag, GST e-Invoice and e-Way Bill, which makes **five national systems** behind one set of Node.js REST services, giving real-time vehicle and compliance verification with sub-second response times.'],
    ['p', 'Here is a clip of an entry screen at a weighbridge, where the truck, token, grade, weights and driver details all come together on a single page:'],
    ['video', '/blog/gmdc_vid_03.mp4', '/blog/gmdc_vid_03.webp', 'The entry screen at a weighbridge: truck, token, grade, weights and driver licence fields on one page.', [640, 360]],

    ['h2', 'The stack'],
    ['p', 'The software side is deliberately plain, because the interesting part of this project is the world around the code:'],
    ['stack', [
      ['React.js', 'Operator screens', 'react'],
      ['Node.js', 'REST services', 'node'],
      ['REST APIs', 'Government systems', 'icons'],
      ['RFID', 'Vehicle identification', 'icons'],
      ['Weighbridge', 'Weight capture', 'icons'],
      ['Cameras', 'Vehicle logging', 'icons'],
    ]],

    ['h2', 'On-site testing and go-live'],
    ['p', 'I stayed involved right to the end. I gathered requirements directly with the government clients, ran the **on-site testing** myself, and handled the **deployment**. Testing in the cabin, with the real hardware and the real trucks outside, found things that no amount of testing at my desk would have.'],
    ['p', 'I also had the chance to present the project to **Shri Roopwant Singh, IAS**, the Managing Director. Explaining a system to the person responsible for the whole operation, without hiding behind technical words, was a lesson of its own.'],

    ['h2', 'The result'],
    ['p', 'The system is **live**. It runs across **9 checkpoints** and processes **100+ transactions every day**, and I was the only software developer on it from the first visit to go-live. It is one of the biggest projects of my career so far.'],

    ['h2', 'What I learned'],
    ['ul', [
      '**Go and see the real flow.** The register, the slip and the cabin taught me more than any document could.',
      '**Hardware limits are software limits.** The operating system on the target machine is a requirement, and I should ask about it on day one.',
      '**Test on the real machine early.** What works on my laptop proves very little about the checkpoint.',
      '**Keep the staff\'s own words.** Using the vocabulary people already know makes a new system far easier to accept.',
      '**Talk to the people at the gate.** They know where the real problems are.',
    ]],
    ['aside', 'success', 'Want the short version?', 'The project page has the summary and the facts in one place: [read the GMDC case study](/projects/gmdc). And if you are building something similar, I would be glad to talk. You can reach me on the [contact page](/contact).'],
  ],
};
