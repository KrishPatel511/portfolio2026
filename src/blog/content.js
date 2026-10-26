/* Article text. Each post is a list of blocks:
     ['h2', 'Heading']         a section heading (also builds the "On this page" list)
     ['p', 'Paragraph']        text; **bold**, `code` and [link](/path) work inside
     ['ul', ['one', 'two']]    a bullet list
     ['code', 'js', 'text']    a code block
     ['callout', 'Text']       a highlighted takeaway
   Keep it in the first person and only write what really happened. */

export const BODIES = {
  'ai-agent-github-safe-write-access': [
    ['p', 'RepoSentry is an AI agent that signs in with GitHub, reads your repositories, reviews code and fixes bugs on its own. The exciting part is also the dangerous part: the moment a language model can **write** to a repository, one bad answer can damage real work.'],
    ['p', 'I built it end to end on my own with React, TypeScript, Node.js, PostgreSQL and the Gemini API. These are the four rules that kept it safe and fast.'],

    ['h2', 'The problem with AI that answers from memory'],
    ['p', 'Most assistants answer code questions from memory, which is risky when the answer is about **your** files. I wanted an agent that works on the real repository. So instead of guessing, it has eight GitHub tools wired to Gemini function calling: list repositories, list files, fetch the full tree, read a file, search code, create a branch, update a file and open a pull request.'],
    ['p', 'The model decides which tool to call. The server runs it against the GitHub API and hands the real result back. Every answer is grounded in actual files.'],

    ['h2', 'Rule 1: enforce safety in code, not in the prompt'],
    ['p', 'A prompt that says "never push to main" is a request, not a rule. A cleverly worded message can talk a model out of a request.'],
    ['p', 'So the rules live on the server, where the model cannot argue with them:'],
    ['ul', [
      'The server **refuses any write to the default branch**, even if a prompt asks for it.',
      'There is **one shared fix branch per repository**. Left alone, the model invented a new branch name for every bug. Now the name is fixed on the server and the model\'s choice is ignored.',
      'Pull requests are reused. If one is already open from the fix branch, new commits simply join it. Fixing five bugs gives five commits on one pull request, not five branches.',
    ]],
    ['code', 'js', '// Simplified idea, not the exact production code\nif (branch === repo.defaultBranch) {\n  throw new Error("Writes to the default branch are not allowed");\n}'],
    ['callout', 'If a rule matters, put it where the model cannot talk its way around it.'],

    ['h2', 'Rule 2: keep deterministic work out of the model'],
    ['p', 'Models are good at reasoning and bad at boring, exact jobs. Two examples from this project:'],
    ['ul', [
      '**Folder trees.** Models retype indentation badly and burn output tokens doing it. The server now builds the ASCII tree itself, and a plain "show me the structure" request skips the model completely, saving two model calls.',
      '**Big files.** One huge file can turn a question into minutes of model input. Files are capped at 30,000 characters, chat history is trimmed to recent messages, and the last file or tree is carried forward so it is never fetched twice.',
    ]],

    ['h2', 'Rule 3: bound every loop'],
    ['p', 'An agent runs in a loop: think, call a tool, read the result, think again. Without limits, that loop can run away. I capped the number of tool rounds and force a final answer when the limit is reached.'],
    ['p', 'Failures never crash a request either. If a path is wrong, the error goes back to the model as a tool result so it can recover and try again. For overloads, a fast model handles normal chat and a deeper model handles Think mode, each acting as the other\'s fallback, with retries.'],

    ['h2', 'Rule 4: track usage from day one'],
    ['p', 'There is no endpoint that tells you how many free-tier requests are left. So every call is logged with its token counts and the model used, and compared with a configurable daily cap. Users see honest, self-tracked usage in a Settings panel.'],

    ['h2', 'What I would do next'],
    ['ul', ['Syntax highlighting for file results', 'Rate limiting and abuse protection on the public endpoints']],
    ['callout', 'The agent reads, reasons and writes, but a human always makes the final call by reviewing the pull request. That is the design I would repeat on any AI project.'],
  ],

  'making-a-react-portfolio-load-fast': [
    ['p', 'This portfolio has a WebGL fluid cursor, a generative rainbow, a real map and synthesized sound. It looked great, and it loaded slowly. Here is exactly what I measured, what helped, and what I got wrong along the way.'],
    ['p', 'All numbers below come from Lighthouse in mobile mode with throttling, run on a production build. For comparisons I took the median of three runs, because a single run can swing a lot.'],

    ['h2', 'Measure first'],
    ['p', 'Before changing anything, Lighthouse gave the Home and Projects pages a Performance score of about 50. The network panel told a clearer story than the score did: the biggest download on the Projects page was not JavaScript at all.'],

    ['h2', 'The biggest win was one image'],
    ['p', 'The GMDC project card used a **2.27 MB PNG**. It was the largest element on the page, so it decided how late the page felt ready. I converted it to a progressive JPEG at **239 KB**. A decorative PNG with transparency became a **34 KB** WebP, down from 214 KB. I also made the first project image load eagerly, since it is the first thing a visitor sees, and left the rest lazy.'],
    ['callout', 'Check your largest files before you touch your bundler. It was the cheapest fix on the whole list.'],

    ['h2', 'Splitting the code by page'],
    ['p', 'The whole site shipped as one JavaScript file of **723 KB** (246 KB gzipped). Every visitor downloaded the map and all the case studies even if they only opened the home page.'],
    ['p', 'I split each page into its own file with dynamic `import()` and `React.lazy`. The main file dropped to **438 KB** (140 KB gzipped), and each page now downloads only when it is opened. After the first page is up, the browser quietly fetches the other pages when it is idle, so later clicks feel instant.'],

    ['h2', 'Two bugs that lazy loading caused'],
    ['p', 'This is the part most tutorials skip. Splitting the code created two visible problems.'],
    ['ul', [
      '**Unstyled flash.** This site pre-renders every page to static HTML for search engines. After the split, each page\'s CSS lived in its own file, which the pre-rendered HTML did not link, so the page looked unstyled until JavaScript ran. The fix was to read Vite\'s build manifest in my pre-render script and add each page\'s own CSS and `modulepreload` links to its HTML.',
      '**Footer blink.** On first load the footer jumped to the top of the screen for about a third of a second. React was suspending for one frame while it waited for the page component, so the page disappeared and the footer slid up. I fixed it by remembering finished pages and rendering them synchronously, and by giving the loading state the height of a screen. I proved it by recording the footer position on every frame under CPU and network throttling.',
    ]],

    ['h2', 'A fix I had to revert'],
    ['p', 'Google Fonts blocks the first paint, so I made the font stylesheet load without blocking. The first paint improved from about 4.3 s to 2.7 s, but the layout shift (CLS) went from **0 to 0.9**, because text swapped fonts and everything moved. A faster number that makes the page jump is not a win, so I reverted it. The proper fix is to self-host the fonts with preloading, which is next on my list.'],

    ['h2', 'Results'],
    ['ul', [
      'Projects page Largest Contentful Paint: **18.8 s to 8.8 s**',
      'Projects page download size: **3.9 MB to 1.7 MB**',
      'Projects page score: **50 to 59**; Home page: **50 to 55**',
      'Layout shift stayed at **0**, and Accessibility, Best Practices and SEO ended at or near 100',
    ]],
    ['p', 'The score is still not where I want it, and real phones will differ from a throttled lab test. But every number above is measured, not guessed.'],
    ['callout', 'Measure, fix the biggest thing, measure again, and test the bugs your fix can create.'],
  ],

  'building-a-truck-checkpoint-system-for-a-government-mine': [
    ['p', 'The biggest project of my career so far is a live truck dispatch platform for GMDC Mining, a Government of Gujarat enterprise. It moves trucks through **9 checkpoints** and handles **100+ transactions every day**. I was the only developer, from the first requirements call to go-live.'],
    ['p', 'It was a different kind of project from a normal web app. These are the lessons I would pass on.'],

    ['h2', 'What the system does'],
    ['ul', [
      'RFID-based vehicle validation at every checkpoint',
      'Boom barrier control, weighbridge capture and camera-based vehicle logging',
      'Slot booking and slip generation',
      'Node.js REST services connected to national systems: Parivahan, Saarthi, FASTag, GST e-Invoice and e-Way Bill',
    ]],

    ['h2', 'Lesson 1: go and see the real workflow'],
    ['p', 'I visited the mine in Bhavnagar and spent time with the Mining Manager and the on-site team. A requirements document cannot tell you what that visit did: how trucks actually queue, where people stand, and which steps they care about most. I gathered requirements directly with the government clients instead of through a long chain of messages.'],
    ['callout', 'The fastest way to build the right thing is to watch the real process before you design anything.'],

    ['h2', 'Lesson 2: hardware is part of the product'],
    ['p', 'When a gate, a barrier or a weighbridge is involved, the software is not finished when the screen looks right. It has to work with real devices in real conditions. That changes how you think about every feature, because a mistake does not just show an error message, it can hold up a truck.'],

    ['h2', 'Lesson 3: test on site'],
    ['p', 'I handled on-site testing and deployment myself. Testing in the place where the system runs is different from testing on a laptop, and it is where the useful problems show up.'],

    ['h2', 'Lesson 4: government integrations reward patience'],
    ['p', 'Connecting to five national systems meant working with services I did not control. Building them as clean Node.js REST services with sub-second responses kept the rest of the application simple and easy to reason about.'],

    ['h2', 'Where it stands'],
    ['p', 'The system is live and processes 100+ transactions every day. If you are building something similar, I would love to talk about it.'],
    ['callout', 'Being the only developer meant owning everything: requirements, code, hardware integration, testing and deployment. It taught me more than any tutorial could.'],
  ],
};
