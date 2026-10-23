import React from 'react';
import { FiArrowLeft, FiCheck, FiExternalLink, FiGithub } from 'react-icons/fi';
import { soundFx } from '../../utils/soundEffects';
import { HeaderSplash } from '../SplashCursor/HeaderSplash';
import { PageTitle } from '../MaskedHeading/PageTitle';
import { StarButton } from '../StarBorder/StarButton';
import './Pages.css';

export const CASE_STUDIES = {
  reposentry: {
    title: 'RepoSentry',
    texture: 'violet',
    sub: 'A full-stack AI coding agent for GitHub. Sign in, ask about your code in plain English, and let the agent read, search, review and fix it, then open a pull request for you to approve.',
    facts: [
      ['Role', 'Solo full-stack developer'],
      ['Type', 'Product, built end to end'],
      ['Focus', 'Agentic AI · Developer tooling'],
      ['Stack', 'React · TypeScript · Node.js · PostgreSQL · Gemini API'],
    ],
    stats: [
      ['8', 'Agent tools'],
      ['4', 'Database models'],
      ['1', 'Branch and PR per repo'],
      ['0', 'Direct writes to main'],
    ],
    image: '/projects/reposentry.svg',
    imageAlt: 'RepoSentry chat interface showing an agent fixing a bug and opening a pull request',
    overview: 'RepoSentry turns a GitHub account into a conversation. After signing in with GitHub OAuth, a developer can ask questions like "show me the full structure of my repo", "review auth.ts for bugs" or "fix this and open a PR". Behind the chat, a Gemini-powered agent decides which GitHub tools to call, reads real code instead of guessing, and reports back. When asked to fix something, it commits the change to a dedicated branch and opens a pull request so a human always reviews before merging.',
    challenge: 'AI assistants usually answer from memory, which is risky for code. The goal was an agent that works on the real repository and can be trusted with write access. The hard problems were grounding answers in actual files, keeping the agent from damaging a repo, and keeping responses fast on large codebases while running on free-tier model quotas.',
    pipeline: [
      ['Sign in', "GitHub OAuth, then a signed JWT session. The agent uses that user's own GitHub token."],
      ['Ask', 'The user types a request in plain English, optionally with Think mode or voice input.'],
      ['Plan', 'Gemini picks the right tool through function calling instead of guessing.'],
      ['Act', 'The server runs the tool against the GitHub API and returns real data to the model.'],
      ['Answer', 'The reply is rendered as markdown with code blocks, trees and tables.'],
      ['Ship', 'For fixes: branch, commit, pull request. The user reviews and merges.'],
    ],
    toolsTitle: "The agent's toolbox",
    tools: [
      ['list_repos', 'Lists every repository the signed-in user can access.'],
      ['list_repo_files', 'Lists one folder level of a repository.'],
      ['get_full_repo_tree', 'Fetches the complete nested structure through the Git Trees API.'],
      ['read_file', "Reads a file's real content, with a size cap for speed."],
      ['search_code', 'Searches a repository with GitHub code search instead of opening files one by one.'],
      ['create_branch', 'Creates the single shared fix branch for a repository.'],
      ['update_file', 'Commits the corrected file to the fix branch with a clear message.'],
      ['create_pull_request', 'Opens the pull request, or reuses the open one, so the user can review.'],
    ],
    built: [
      'GitHub OAuth login with JWT sessions and multi-user support, so every user works with their own repositories and token',
      'A Gemini agent loop with function calling, bounded to a maximum number of tool rounds plus a forced final answer so it can never run away',
      'Persistent chat history in PostgreSQL through Prisma: multiple chats per user with new, pin, rename and delete',
      'Per-user usage tracking: requests, prompt tokens, completion tokens and the model used, shown against a daily cap in a Settings panel',
      'A custom dark React and TypeScript interface with markdown rendering, a repository sidebar, voice input, a Think toggle and a mobile layout where the sidebar collapses',
      'A layered Express backend split into routes, controllers, services and middleware, deployed with the frontend on Vercel and the API on Render',
    ],
    guardrailsTitle: 'Safety by design',
    guardrails: [
      'Never writes to the default branch. The check lives on the server, so even a prompt that asks the model to push to main is refused.',
      'One shared fix branch per repository, enforced in code. Fixing five bugs produces five commits on one pull request, not five branches.',
      'Pull requests are reused. If one is already open from the fix branch, new commits simply join it.',
      'Tool failures never crash a request. Errors such as a wrong path are returned to the model so it can recover and try again.',
      'The system prompt requires the model to analyze real code, cite lines, and say so honestly when the code looks fine.',
    ],
    challenges: [
      ['Runaway branches and pull requests', 'Left alone, the model invented a new branch name for every bug.', "The branch name is fixed on the server and the model's choice is ignored, with pull request reuse on top."],
      ['Slow answers on big repositories', 'A huge file or tree can turn one question into minutes of model input.', 'Files are capped at 30,000 characters, history is trimmed to recent messages, and the last file or tree is carried forward so it is not fetched twice.'],
      ['Mangled folder trees', 'Models retype indentation badly and burn output tokens doing it.', 'The server builds the ASCII tree itself. Plain tree requests skip the model and return it directly, saving two model calls.'],
      ['Free-tier quotas and overloads', 'Models return 503s and run out of daily requests.', "A fast model handles normal chat and a deeper model handles Think mode, each acting as the other's fallback, with retries on overload."],
      ['No quota API from Google', 'There is no endpoint that reports remaining requests.', 'Every call is logged with its token counts and compared with a configurable daily cap, so users see honest, self-tracked usage.'],
    ],
    architectureTitle: 'Architecture',
    architecture: [
      ['Frontend', 'React · TypeScript · Vite. Components for sidebar, chat window, input panel, login and settings.'],
      ['API', 'Node.js · Express · TypeScript with routes, controllers, services and JWT middleware.'],
      ['AI layer', 'Google Gemini with function calling, a tool executor and context carry-over.'],
      ['Data', 'PostgreSQL through Prisma: users, chats, messages and usage logs with cascading deletes.'],
      ['Integrations', 'GitHub OAuth, REST API, Git Trees API and code search API.'],
      ['Hosting', 'Vercel for the client and Render for the server, configured through render.yaml.'],
    ],
    endpoints: [
      ['GET', '/auth/github · /auth/github/callback · /auth/me'],
      ['POST', '/api/chat'],
      ['GET POST PATCH DELETE', '/api/chats'],
      ['GET', '/api/github/repos · files · file · tree'],
      ['GET', '/api/usage'],
    ],
    outcome: 'RepoSentry is live and open source. It shows how to give an AI model real access to a codebase without giving up control: the agent reads, reasons and writes, but a human always makes the final call. Building it end to end covered OAuth, a typed REST API, a relational schema, agent design, prompt engineering and deployment.',
    learnings: [
      'Enforce safety rules in code, never only in the prompt',
      'Do deterministic work in code and keep the model for reasoning',
      'Bound every loop, size and retry in an agent',
      'Track usage from the first version, not after the bill arrives',
    ],
    next: ['Syntax highlighting for file results', 'Rate limiting and abuse protection on public endpoints'],
    live: 'https://reposentry-ai.vercel.app/',
    github: 'https://github.com/KrishPatel511/codepilot.ai',
  },
  waldor: {
    title: 'Auralyx',
    texture: 'amber',
    sub: 'A luxury skin, hair and longevity clinic website: 20 pages, a headless WordPress blog, secure enquiry forms and a polished, animation-rich experience on Next.js 16.',
    facts: [
      ['Role', 'Full-stack developer'],
      ['Type', 'Client website'],
      ['Scale', '20 pages · 4 API routes · 7 concern pages'],
      ['Stack', 'Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL · Headless WordPress'],
    ],
    stats: [
      ['20', 'Page routes'],
      ['7', 'Skin concern pages'],
      ['16', 'Legacy URL redirects'],
      ['6', 'Security headers'],
    ],
    image: '/projects/auralyx.jpg',
    imageAlt: 'Auralyx website homepage preview',
    overview: 'Auralyx is the website for Waldor Clinic, a premium aesthetic clinic offering facials, injectables, body contouring and hair restoration. The website is the clinic\'s front door: it presents treatments and skin concerns in a calm, high-end style, publishes expert articles, introduces the doctors, shows before-and-after results and turns visitors into consultation enquiries. I built it end to end, from the page architecture and animations to the database, email delivery and security.',
    challenge: 'A luxury brand cannot look or feel generic, yet the site also has to be fast, easy for the clinic team to keep fresh, found on Google and safe to put forms on. The clinic already had an older website, so the new one also had to keep every old link working. The goal was one codebase that is beautiful, content-managed and production-hardened.',
    pipeline: [
      ['Discover', 'Visitors land on a home page that introduces the clinic, its signature treatments, doctors and success stories.'],
      ['Explore', 'They browse treatments or pick a skin concern and see a tailored page with approach, benefits, safety and FAQs.'],
      ['Trust', 'Before-and-after sliders, patient stories, doctor profiles and a blog build confidence.'],
      ['Enquire', 'A validated contact form captures the treatments they want and their message.'],
      ['Deliver', 'The enquiry is saved to PostgreSQL first, then emailed to the clinic team.'],
      ['Follow up', 'Every submission has a status, so a failed email is never a lost lead.'],
    ],
    toolsTitle: 'Site map',
    tools: [
      ['Home', 'Hero, about, signature treatments, how it works, doctors, transformations, stories, blog.'],
      ['Treatments (5)', 'HydraGlass, Waldor Signature, Body Treatment, Injectables and Hair Growth.'],
      ['Concerns (7)', 'Acne, scarring, dull skin, loose skin, premature aging, uneven tone and wrinkles.'],
      ['Blog', 'WordPress-powered listing with category filters and article pages.'],
      ['Doctors and About', 'Clinic story, values, team and credentials.'],
      ['Products', 'A shop showcase with a product grid and brand logo slider.'],
      ['FAQs', 'Filterable by treatments, concerns and clinic.'],
      ['Contact and Careers', 'Validated forms with email delivery and a Google Map.'],
    ],
    built: [
      'A component-driven architecture of 430+ typed TSX files, grouped by page and section, each with its own data and types files',
      'Seven skin-concern pages built from a shared section system: service hero, signature treatments, step-by-step approach timeline, benefits, patient safety, doctor, before-and-after slider, success stories and FAQ',
      'Smooth, premium motion with GSAP, Framer Motion and Lenis smooth scrolling, with reveal-on-scroll cards through a custom hook',
      'Interactive before-and-after comparison sliders and Swiper carousels for results and stories',
      'A headless WordPress blog through the WPAPI client, with category routes, related posts and sanitized HTML',
      'Contact and careers forms using React Hook Form and Zod, with toast feedback through Sonner',
      'Optimized typography with Fraunces and Hanken Grotesk through next/font, plus shared constants for colors and theme',
    ],
    guardrailsTitle: 'Security and reliability',
    guardrails: [
      'A strict Content Security Policy that only allows the origins the site really uses: Google Maps, analytics and video embeds.',
      'Six security headers on every response, including HSTS, nosniff, frame protection, a referrer policy and a locked-down permissions policy.',
      'Form spam guard: origin and referer check, a hidden honeypot field that gets a fake success, and a limit of 5 requests per 10 minutes per IP.',
      'Validation with Zod on the server for every submission, and HTML escaping on everything placed in the notification email.',
      'Blog HTML from WordPress is sanitized before rendering, and images are only optimized from the clinic\'s own WordPress and Gravatar hosts.',
      'Submissions are saved to PostgreSQL before the email is sent. If the email fails, the record is marked email_failed instead of being lost.',
      'A startup check logs any missing environment variable at once, so a bad deploy is spotted immediately.',
      'Staging and preview hosts automatically send a noindex header, so only the real domain is indexed.',
    ],
    challenges: [
      ['Keeping every old link alive', 'The clinic already had a website, and moving URLs would break bookmarks and Google rankings.', '16 permanent redirects map the old pages (menu, appointments, home variants) to the new treatment and contact pages.'],
      ['Clean blog URLs from WordPress', 'WordPress categories needed to appear as friendly paths on the site.', 'Rewrites map each category prefix to the blog listing and each post to the article page, while the URL stays as typed.'],
      ['A slow or unreachable CMS', 'A blog that depends on an external API must not break the page.', 'Requests are retried and cached for a minute with Next.js revalidation, so most page loads never hit WordPress.'],
      ['Lost leads', 'Email servers fail, and a failed email means a lost enquiry.', 'The database save comes first and each record carries a status, so the team can always find and follow up.'],
      ['Beautiful but fast', 'Heavy video, images and animation can ruin performance.', 'Assets are cached for 30 days, optimized images for 30 days, and an optional CDN origin is supported for large media.'],
      ['Bots on public forms', 'Open forms attract spam and abuse.', 'Layered defenses: origin check, honeypot and rate limiting, with a note that Cloudflare can sit in front for more.'],
    ],
    architectureTitle: 'Architecture',
    architecture: [
      ['Framework', 'Next.js 16 App Router with React 19 and TypeScript, using route groups for the website.'],
      ['Styling', 'Tailwind CSS 4 with class-variance-authority, clsx and tailwind-merge for variants.'],
      ['Animation', 'GSAP, Framer Motion and Lenis, plus Swiper and a compare-slider for results.'],
      ['Content', 'Headless WordPress through WPAPI for the blog, with sanitize-html on the output.'],
      ['Data', 'PostgreSQL with a Prisma schema for contact and careers submissions, indexed by email and date.'],
      ['Email', 'Nodemailer over SMTP with pooled connections and escaped HTML templates.'],
      ['SEO', 'Dynamic sitemap, robots, canonical URLs, metadata, and an llms.txt file for AI search tools.'],
      ['Quality', 'ESLint, strict TypeScript, Zod schemas shared by client and server.'],
    ],
    endpoints: [
      ['GET', '/api/blog · /api/blog/[slug]'],
      ['POST', '/api/contact'],
      ['POST', '/api/careers'],
    ],
    outcome: 'The site is live at waldor.vercel.app. It gives the clinic a refined, fast and secure online presence where treatments are easy to explore, content can be updated without a developer, and every enquiry is stored and delivered. The project let me own a production client site from design implementation through database, email, SEO and security.',
    learnings: [
      'Design systems of small, typed sections scale across many similar pages',
      'Saving data before side effects such as email prevents lost leads',
      'Redirects and metadata are part of the product, not an afterthought',
      'Security headers, validation and rate limiting belong in the first release',
    ],
    next: ['Move rate limiting to a shared store such as Redis or Cloudflare', 'Add online booking and a patient portal'],
    live: 'https://waldor.vercel.app/',
    github: 'https://github.com/KrishPatel511/Auralyx',
  },
  portfolio: {
    title: 'Krish Patel Portfolio',
    texture: 'emerald',
    sub: 'The site you are on right now: a hand-built, interactive developer portfolio with a living sky, a WebGL cursor, synthesized sound, a real map and a smooth light and dark theme.',
    facts: [
      ['Role', 'Designer and developer'],
      ['Type', 'Personal product, built from scratch'],
      ['Focus', 'Front-end craft · Interaction design'],
      ['Stack', 'React 19 · Vite 8 · GSAP · Framer Motion · WebGL · MapLibre'],
    ],
    stats: [
      ['5', 'Main pages plus case studies'],
      ['8', 'Synthesized sounds'],
      ['2', 'Themes with animated switch'],
      ['7', 'Runtime dependencies'],
    ],
    image: '/projects/portfolio.jpg',
    imageAlt: 'Krish Patel portfolio home page with a sky, clouds and rainbow',
    overview: 'A portfolio should show how someone builds, not just say it. This site is my own product: every page, animation, sound and interaction is built by hand with React, with no UI kit and no CSS framework. It holds my story, projects, experience, skills and contact details, and the way it looks, moves and sounds is itself a demonstration of the work I do. It is the main project on this page because you are using it right now.',
    challenge: 'Most developer portfolios look alike. I wanted one that is memorable and personal, yet still fast, accessible and easy to navigate. That meant combining heavy ideas such as WebGL fluid, canvas art, 3D cards, real maps and audio without hurting performance, losing keyboard access or breaking on mobile.',
    pipeline: [
      ['Arrive', 'A layered SVG sky with drifting clouds, a generative rainbow and a clickable mascot welcomes the visitor.'],
      ['Navigate', 'A gooey navigation pill, a Ctrl or Cmd + K search and a mobile menu reach every page quickly.'],
      ['Explore', 'The About page is a grid of interactive cards: a map, a drum pad, a flag, a chai counter and more.'],
      ['Learn', 'Projects open into in-depth case studies; skills flip like cards to reveal how I use each tool.'],
      ['Trust', 'Experience, education and certifications sit on a timeline with real logos.'],
      ['Connect', 'The contact page offers email, links, a downloadable resume and a pre-filled message form.'],
    ],
    toolsTitle: 'Signature features',
    tools: [
      ['Splash cursor', 'A WebGL2 fluid simulation with bloom and low, medium and high quality tiers follows the pointer.'],
      ['Generative rainbow', 'A canvas of dashes on concentric arcs, steered by the mouse, with a configurator panel.'],
      ['Gooey navigation', 'A liquid-style pill with themed palettes for dark and light mode.'],
      ['Masked headings', 'Page titles use a GSAP-driven spotlight mask over textured fills.'],
      ['Tilted cards', 'Skill cards tilt in 3D with glare and shadow, then flip to reveal a note on the back.'],
      ['Real map', 'A MapLibre map on CARTO tiles draws a line from Ahmedabad to the visitor\'s location.'],
      ['Synthesized sound', 'Pops, chimes, whooshes and four drum sounds generated live with the Web Audio API.'],
      ['Themed everything', 'A light and dark theme that animates smoothly across every color at once.'],
    ],
    built: [
      'A hash-based router written from scratch in a small map of pages, with the right nav item highlighted even on case-study pages',
      'A design-token system in CSS custom properties, so colors, spacing and type stay consistent across 23 stylesheets',
      'A bento-style About page of interactive cards, including a playable drum pad on the Q, W, E and R keys, a rippling India flag, a visitor map and a chai counter',
      'Layered SVG cloudscape, mascot with confetti on click, and a generative canvas rainbow ported from an interaction I admire',
      'Projects page with showcase cards, plus in-depth case studies with stats, flow diagrams, architecture cards and problem-and-solution blocks',
      'Skills page with category tabs and 3D flip cards, plus a command-style search modal for jumping anywhere',
      'Experience page with a timeline, education logos and certification cards, and a contact page with a resume download',
    ],
    guardrailsTitle: 'Performance and accessibility',
    guardrails: [
      'Sounds are generated with oscillators, so there are no audio files to download, and sound can be switched off and the choice is remembered.',
      'The audio context is created only after a user action, which follows browser autoplay rules.',
      'The WebGL cursor is built with low, medium and high quality tiers, so the cost of the simulation can be tuned.',
      'Motion-heavy components check for the reduced-motion preference, and 130+ aria and role attributes support screen readers.',
      'The map library loads as its own chunk and the visitor lookup uses an abort controller, so a slow network never blocks the page.',
      'Theme and sound choices persist in local storage, and the first theme follows the visitor\'s system preference.',
      'The layout adapts from large screens down to phones, with a dedicated mobile menu.',
    ],
    challenges: [
      ['Switching theme without a flash', 'Swapping CSS variables normally snaps colors instantly and breaks gradients.', 'Every color token is registered with @property so the browser can tween them, animating gradients, fills and borders together.'],
      ['Audio without audio files', 'Sound effects add weight and licensing questions.', 'The Web Audio API synthesizes each sound from oscillators and gain envelopes, with a global on and off switch.'],
      ['A real map with no API key', 'Map services often need paid keys and tokens.', 'MapLibre GL with free CARTO basemaps, a theme-aware style and a simple distance calculation, with a "you are right here" case for nearby visitors.'],
      ['Heavy visuals on weak devices', 'Fluid simulation and canvas art can drop frames.', 'Quality tiers for the simulation, passive scroll listeners and cleanup of every listener on unmount keep it smooth.'],
      ['Routing without a library', 'A tiny site does not need a full router.', 'A hash map resolves pages, falls back to About, scrolls to the top and keeps the nav highlight correct.'],
      ['A contact form with no backend', 'Running a server only for one form is overkill.', 'The form builds a pre-filled mailto message, and the resume is a direct PDF download.'],
    ],
    architectureTitle: 'Architecture',
    architecture: [
      ['Framework', 'React 19 with Vite 8 and the React plugin, using functional components and hooks.'],
      ['Styling', 'Hand-written CSS with design tokens, no framework, and a dedicated theme-transition layer.'],
      ['Animation', 'GSAP, Framer Motion, CSS keyframes and canvas for different jobs.'],
      ['Graphics', 'WebGL2 shaders, 2D canvas, inline SVG and canvas-confetti.'],
      ['Audio', 'A small SoundController class over the Web Audio API, wrapped in a React context.'],
      ['Maps', 'MapLibre GL with CARTO tiles and an IP-based visitor lookup.'],
      ['State', 'Theme and sound contexts with local storage persistence.'],
      ['Tooling', 'Oxlint for linting, Vite for fast builds, and Git for version control.'],
    ],
    endpoints: [
      ['#about', 'Story, interactive cards, map and drum pad'],
      ['#projects', 'Showcase cards and in-depth case studies'],
      ['#experience', 'Timeline, education and certifications'],
      ['#skills', 'Flip cards grouped by category'],
      ['#contact', 'Email, links, resume and message form'],
    ],
    endpointsHead: ['Route', 'Page'],
    outcome: 'The portfolio is a complete, working product that I designed, built and maintain alone. It shows the full range of my front-end work: architecture, design systems, animation, graphics, audio, accessibility and performance, all in one codebase of 14,000+ lines. Most importantly it is the proof behind everything else on this site.',
    learnings: [
      'Delight and performance can coexist when every effect has a budget',
      'Design tokens make a big visual change a small code change',
      'Accessibility and reduced motion are part of the design, not a patch',
      'Studying great interactions, then rebuilding them, is the fastest way to learn',
    ],
    credit: 'Several interactions, such as the sound design, the rainbow configurator and the smooth theme switch, are rebuilds inspired by joshwcomeau.com, written in my own code as a way to learn the techniques.',
    next: ['Add a live demo link and analytics', 'Move case-study content into data files and add a blog', 'Add automated accessibility and performance checks'],
    github: 'https://github.com/KrishPatel511/portfolio2026',
  },
};

const Checks = ({ items }) => (
  <ul className="pg-checks">
    {items.map((t) => <li key={t}><FiCheck size={16} /><span>{t}</span></li>)}
  </ul>
);

export const ProjectCaseStudy = ({ data }) => (
  <div className="pg-wrapper">
    <div className="pg-container pg-container--narrow">
      <a className="pg-back" href="#projects" onClick={() => soundFx.playPop()}>
        <FiArrowLeft size={15} /> All projects
      </a>

      <header className="pg-header">
        <HeaderSplash />
        <span className="pg-kicker">Case Study</span>
        <PageTitle text={data.title} texture={data.texture} />
        <p className="pg-sub">{data.sub}</p>
      </header>

      <dl className="pg-facts">
        {data.facts.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      {data.stats && (
        <div className="pg-stats">
          {data.stats.map(([n, l]) => (
            <div key={l}><strong>{n}</strong><span>{l}</span></div>
          ))}
        </div>
      )}

      <div className="pg-media pg-media--single">
        <img src={data.image} alt={data.imageAlt} loading="lazy" />
      </div>

      {data.overview && <section className="pg-block"><h2>Overview</h2><p>{data.overview}</p></section>}

      <section className="pg-block"><h2>The challenge</h2><p>{data.challenge}</p></section>

      {data.pipeline && (
        <section className="pg-block">
          <h2>How it works</h2>
          <ol className="pg-steps">
            {data.pipeline.map(([t, d], i) => (
              <li key={t}><span className="pg-step-n">{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>
            ))}
          </ol>
        </section>
      )}

      {data.tools && (
        <section className="pg-block">
          <h2>{data.toolsTitle}</h2>
          <div className="pg-grid">
            {data.tools.map(([n, d]) => (
              <div key={n} className="pg-card"><code>{n}</code><p>{d}</p></div>
            ))}
          </div>
        </section>
      )}

      <section className="pg-block"><h2>What I built</h2><Checks items={data.built} /></section>

      {data.guardrails && (
        <section className="pg-block"><h2>{data.guardrailsTitle}</h2><Checks items={data.guardrails} /></section>
      )}

      {data.challenges && (
        <section className="pg-block">
          <h2>Problems I solved</h2>
          <div className="pg-problems">
            {data.challenges.map(([t, p, s]) => (
              <article key={t} className="pg-problem">
                <h3>{t}</h3>
                <p><b>Problem.</b> {p}</p>
                <p><b>Solution.</b> {s}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {data.architecture && (
        <section className="pg-block">
          <h2>{data.architectureTitle}</h2>
          <div className="pg-grid">
            {data.architecture.map(([n, d]) => (
              <div key={n} className="pg-card"><h3>{n}</h3><p>{d}</p></div>
            ))}
          </div>
          {data.endpoints && (
            <table className="pg-table">
              <thead><tr>{(data.endpointsHead || ['Method', 'Endpoints']).map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{data.endpoints.map(([m, e]) => <tr key={e}><td>{m}</td><td><code>{e}</code></td></tr>)}</tbody>
            </table>
          )}
        </section>
      )}

      {data.process && <section className="pg-block"><h2>How I worked</h2><Checks items={data.process} /></section>}

      <section className="pg-block"><h2>Outcome</h2><p>{data.outcome}</p></section>

      {data.learnings && (
        <section className="pg-block"><h2>What I learned</h2><Checks items={data.learnings} /></section>
      )}

      {data.credit && <p className="pg-credit">{data.credit}</p>}

      {data.next && (
        <section className="pg-block"><h2>What is next</h2><Checks items={data.next} /></section>
      )}

      <div className="pg-actions">
        {data.live && (
          <StarButton as="a" primary href={data.live} target="_blank" rel="noreferrer" onClick={() => soundFx.playPop()}>
            <FiExternalLink size={14} /><span>Live Demo</span>
          </StarButton>
        )}
        <StarButton as="a" primary={!data.live} href={data.github} target="_blank" rel="noreferrer" onClick={() => soundFx.playPop()}>
          <FiGithub size={14} /><span>Source Code</span>
        </StarButton>
        <StarButton as="a" href="#projects" onClick={() => soundFx.playPop()}>See other projects</StarButton>
      </div>
    </div>
  </div>
);
