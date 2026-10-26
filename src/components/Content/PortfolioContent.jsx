import React, { useState } from 'react';
import {
  FiExternalLink,
  FiGithub,
  FiArrowRight,
  FiCode,
  FiAward,
  FiBook,
  FiZap,
} from 'react-icons/fi';
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiExpress,
  SiHtml5,
  SiCss,
  SiGit,
  SiPostman,
  SiRedux,
  SiMysql,
  SiFirebase,
  SiVercel,
  SiPostgresql,
  SiPrisma,
  SiNestjs,
  SiGithub,
  SiGooglegemini,
  SiFramer,
  SiGreensock,
  SiWordpress,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { soundFx } from '../../utils/soundEffects';
import { StarButton } from '../StarBorder/StarButton';
import { HeaderSplash } from '../SplashCursor/HeaderSplash';
import { PageTitle } from '../MaskedHeading/PageTitle';
import TiltedCard, { TiltedCardLayer } from '../TiltedCard/TiltedCard';
import './PortfolioContent.css';

/* ─── DATA ───────────────────────────────────────────────────────────────── */

const PROJECTS = [
  {
    id: 'gmdc-mining',
    title: 'Government Vehicle Checkpoint Automation: GMDC Mining',
    subtitle: 'React.js · Node.js · REST APIs · RFID & Hardware Integration',
    desc: 'Sole developer of a 9-checkpoint government truck dispatch system processing 100+ daily transactions. Automated RFID-based vehicle validation with boom barrier control, weighbridge capture and camera-based vehicle logging, plus slot booking and slip generation. Worked directly with government clients for requirement gathering, on-site testing and deployment, including a site visit to the mine in Bhavnagar.',
    tech: ['React.js', 'Node.js', 'REST APIs', 'RFID', 'Weighbridge', 'Camera Hardware'],
    github: null,
    live: null,
    caseStudy: '/projects/gmdc',
    image: '/images/gmdc/GMDC-logo.png',
    color: '#4f46e5',
    featured: true,
  },
  {
    id: 'reposentry',
    title: 'RepoSentry: AI Coding Agent for GitHub',
    subtitle: 'React · TypeScript · Node.js · Express · PostgreSQL · Prisma · Gemini API',
    desc: 'A full-stack AI agent that signs in with GitHub, explores your repositories in plain English, reviews code and fixes bugs on its own. Eight GitHub tools are wired to Gemini function calling, and every fix lands as a commit on one shared branch and a single pull request, never on main.',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Gemini API', 'GitHub OAuth'],
    caseStudy: '/projects/reposentry',
    github: 'https://github.com/KrishPatel511/codepilot.ai',
    live: 'https://reposentry-ai.vercel.app/',
    image: '/projects/reposentry.svg',
    color: '#06b6d4',
    featured: true,
  },
  {
    id: 'auralyx',
    title: 'Auralyx: Luxury Skin, Hair & Longevity Website',
    subtitle: 'Next.js 16 · React 19 · TypeScript · PostgreSQL · Headless WordPress',
    desc: 'A production website for a luxury skin, hair and longevity clinic. It has 20 pages including 7 skin-concern and 5 treatment pages, a headless WordPress blog, before-and-after sliders, and secure contact and careers forms saved to PostgreSQL and emailed to the team, with strict security headers and spam protection.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'WordPress', 'Prisma', 'Zod'],
    caseStudy: '/projects/auralyx',
    github: 'https://github.com/KrishPatel511/Auralyx',
    live: 'https://waldor.vercel.app/',
    image: '/projects/auralyx.jpg',
    color: '#f43f5e',
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'Krish Patel Portfolio: An Interactive Developer Experience',
    subtitle: 'React 19 · Vite · WebGL · GSAP · Framer Motion · MapLibre · Web Audio',
    desc: 'The portfolio you are viewing, built entirely by hand with no UI kit. It features a WebGL fluid cursor, a generative canvas rainbow, 3D flip cards, a real visitor map, sounds synthesized with the Web Audio API and a smooth animated light and dark theme.',
    tech: ['React', 'Vite', 'WebGL', 'GSAP', 'Framer Motion', 'MapLibre GL', 'Web Audio', 'CSS Tokens'],
    caseStudy: '/projects/portfolio',
    github: 'https://github.com/KrishPatel511/portfolio2026',
    live: 'https://www.krishpatel.website/',
    liveLabel: 'Live Website',
    image: '/projects/portfolio.jpg',
    color: '#10b981',
    featured: true,
  },
];

const SKILL_CATEGORIES = [
  {
    label: 'Frontend',
    color: '#4f46e5',
    skills: [
      { name: 'React.js', Icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', Icon: SiNextdotjs, color: 'var(--color-text)' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript (ES6+)', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
      { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', Icon: SiCss, color: '#1572B6' },
      { name: 'GSAP', Icon: SiGreensock, color: '#88CE02' },
      { name: 'Framer Motion', Icon: SiFramer, color: '#ec4899' },
    ],
  },
  {
    label: 'Backend',
    color: '#10b981',
    skills: [
      { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
      { name: 'Express.js', Icon: SiExpress, color: 'var(--color-text-secondary)' },
      { name: 'NestJS', Icon: SiNestjs, color: '#E0234E' },
      { name: 'REST API Design', Icon: FiCode, color: '#10b981' },
      { name: 'JWT & RBAC', Icon: FiAward, color: '#f59e0b' },
    ],
  },
  {
    label: 'Database',
    color: '#0ea5e9',
    skills: [
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'Prisma ORM', Icon: SiPrisma, color: 'var(--color-text)' },
      { name: 'PL/SQL', Icon: FiZap, color: '#f43f5e' },
    ],
  },
  {
    label: 'Cloud & Tools',
    color: '#f59e0b',
    skills: [
      { name: 'AWS', Icon: FaAws, color: '#FF9900' },
      { name: 'Vercel', Icon: SiVercel, color: 'var(--color-text)' },
      { name: 'Git / GitHub', Icon: SiGit, color: '#F05032' },
      { name: 'CI/CD', Icon: SiGithub, color: 'var(--color-text)' },
      { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
    ],
  },
  {
    label: 'AI & Integrations',
    color: '#ec4899',
    skills: [
      { name: 'Gemini API', Icon: SiGooglegemini, color: '#8E75B2' },
      { name: 'GitHub API', Icon: SiGithub, color: 'var(--color-text)' },
      { name: 'OAuth', Icon: FiAward, color: '#10b981' },
      { name: 'Third-Party APIs', Icon: FiExternalLink, color: '#38BDF8' },
      { name: 'Headless CMS', Icon: SiWordpress, color: '#21759B' },
    ],
  },
];

const SKILL_NOTES = {
  'React.js': 'My main UI library for production apps, including the GMDC checkpoint system.',
  'Next.js': 'App Router sites with TypeScript, such as the Auralyx clinic website.',
  TypeScript: 'Typed code for safer, easier-to-maintain frontends and APIs.',
  'JavaScript (ES6+)': 'The language behind everything I build, on the client and the server.',
  'Tailwind CSS': 'Fast, consistent styling for responsive layouts.',
  HTML5: 'Semantic, accessible markup as the base of every page.',
  CSS3: 'Custom layouts, animations and theming without heavy frameworks.',
  GSAP: 'Timeline-based animation and scroll effects.',
  'Framer Motion': 'Declarative React animations and page transitions.',
  'Node.js': 'REST services, including integrations with 5 national government systems.',
  'Express.js': 'Lightweight APIs with middleware, validation and auth.',
  NestJS: 'Structured, modular backends for larger services.',
  'REST API Design': 'Clean, versioned endpoints with sub-second responses.',
  'JWT & RBAC': 'Token authentication and role-based access control.',
  PostgreSQL: 'Relational data modelling, queries and indexing.',
  MySQL: 'Transactional data for client and internal systems.',
  MongoDB: 'Flexible document storage for fast-moving schemas.',
  'Prisma ORM': 'Type-safe database access and migrations.',
  'PL/SQL': 'Stored procedures and reporting logic in Oracle.',
  AWS: 'Deploying and maintaining production infrastructure.',
  Vercel: 'Preview and production deploys for frontend apps.',
  'Git / GitHub': 'Branching, reviews and collaborative workflows.',
  'CI/CD': 'Automated builds and CI-based releases.',
  Postman: 'Designing, testing and documenting APIs.',
  'Gemini API': 'Powers the agent in my AI GitHub Coding Agent.',
  'GitHub API': 'Reading repos, committing fixes and opening pull requests.',
  OAuth: 'Secure third-party sign-in and delegated access.',
  'Third-Party APIs': 'Integrating external services into client workflows.',
  'Headless CMS': 'Headless WordPress (WPAPI) feeding Next.js frontends.',
};

const EXPERIENCE = [
  {
    id: 'exp-amnex',
    role: 'Software Developer',
    company: 'AMNEX Infotechnologies',
    period: 'Mar 2026 – Present',
    location: 'Ahmedabad',
    type: 'Full-time',
    desc: 'Building production-grade web applications and government-sector systems, from requirement gathering with clients to go-live.',
    highlights: [
      'Built and shipped 3+ responsive production web apps with React.js, Next.js, TypeScript and Node.js/Express, using JWT authentication and role-based access control',
      'Engineered Node.js REST services integrating 5 national government systems (Parivahan, Saarthi, FASTag, GST e-Invoice, e-Way Bill) with sub-second response times',
      'Deployed and maintained production infrastructure on AWS and Hostinger (domain, SSL, CI-based releases)',
      'Independently delivered 3+ concurrent client projects end-to-end',
    ],
  },
  {
    id: 'exp-beyondata',
    role: 'Junior Software Developer',
    company: 'BeyonData Solutions',
    period: 'Apr 2025 – Feb 2026',
    location: 'Ahmedabad',
    type: 'Full-time',
    desc: 'Delivered data-driven interfaces and backend automation used daily by internal teams for reporting and decision-making.',
    highlights: [
      'Designed and delivered 15+ data-driven React.js dashboards and operational forms integrated with REST APIs and SQL backends',
      'Automated backend workflows with stored procedures, functions and triggers, cutting manual processing effort by 40%',
      'Contributed to schema design and query optimization across PostgreSQL and MySQL',
    ],
  },
  {
    id: 'exp-sufalam',
    role: 'Web Developer Intern (React.js)',
    company: 'Sufalam Technology',
    period: 'Dec 2024 – Apr 2025',
    location: 'Ahmedabad',
    type: 'Internship',
    desc: 'Learned production React.js while working on a live visitor management system.',
    highlights: [
      'Built reusable UI components for a production-deployed visitor management system',
      'Worked with Hooks, state management and React Router',
      'Integrated the interface with REST APIs',
    ],
  },
];

const EDUCATION = [
  {
    id: 'edu-mca',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Shri Chimanbhai Patel Institute [SVGU]',
    period: '2025',
    logo: '/education/scpi-logo.png',
    score: 'Ahmedabad, India',
    desc: '',
  },
  {
    id: 'edu-bca',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'J G College Of Computer Application',
    period: '2022',
    logo: '/education/jgcollege-logo-crop.png',
    score: 'Ahmedabad, India',
    desc: '',
  },
];

const CERTIFICATIONS = [
  { title: 'Government Project Collaboration', issuer: 'GMDC, a Government of Gujarat Enterprise', year: 'Ongoing', color: '#2e7d32', logo: '/certifications/gmdc.png', tall: true },
  { title: 'Oracle Cloud Certified Professional', issuer: 'Oracle', year: '2025', color: '#C74634', logo: '/certifications/oracle.svg' },
  { title: 'SQL Certification', issuer: 'HackerRank', year: '2024', color: '#00EA64', logo: '/certifications/hackerrank.png', bare: true },
  { title: 'React.js', issuer: 'Scaler', year: '2026', color: '#0F5BFF', logo: '/certifications/scaler.png' },
];

const PAGE_HEADERS = {
  projects: {
    kicker: 'Projects',
    texture: 'amber',
    title: 'Real systems, real users.',
    sub: 'Government and enterprise software I have designed, built and shipped.',
  },
  skills: {
    kicker: 'Skills',
    texture: 'violet',
    title: 'The tools I build with.',
    sub: 'A full stack toolkit, from React interfaces to Node.js services, databases and AWS.',
  },
  experience: {
    kicker: 'Experience',
    texture: 'emerald',
    title: 'From intern to government-scale systems.',
    sub: 'Three roles in Ahmedabad, each with more ownership than the last.',
  },
};

/* ─── COMPONENT ──────────────────────────────────────────────────────────── */

export const PortfolioContent = ({ page = 'projects' }) => {
  const [activeSkillCategory, setActiveSkillCategory] = useState('Frontend');

  return (
    <div className="portfolio-content-wrapper">
      <div className="portfolio-content-container">

        <header className="pc-page-header">
          <HeaderSplash />
          <span className="pc-page-kicker">{PAGE_HEADERS[page].kicker}</span>
          <PageTitle text={PAGE_HEADERS[page].title} texture={PAGE_HEADERS[page].texture} />
          <p className="pc-page-sub">{PAGE_HEADERS[page].sub}</p>
        </header>

        {/* ── Projects ─────────────────────────────────── */}
        {page === 'projects' && (
          <section className="pc-section" aria-labelledby="projects-heading" id="projects">
            <header className="section-kicker-header">
              <span className="section-kicker">PROJECTS &amp; WORK</span>
            </header>

            <div className="projects-showcase">
              {PROJECTS.map((project, i) => (
                <article
                  key={project.id}
                  className={`showcase-card ${i % 2 ? 'reverse' : ''}`}
                  style={{ '--accent': project.color }}
                >
                  <div className="showcase-media">
                    <div className="showcase-frame">
                      <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
                    </div>
                  </div>
                  <div className="showcase-info">
                    <span className="showcase-index">
                      {String(i + 1).padStart(2, '0')}
                      {project.featured && <em>Featured</em>}
                    </span>
                    <h2 className="project-title">{project.title}</h2>
                    <p className="project-subtitle">{project.subtitle}</p>
                    <p className="project-desc">{project.desc}</p>
                    <div className="project-tech-tags">
                      {project.tech.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.caseStudy && (
                        <StarButton as="a" primary href={project.caseStudy} onClick={() => soundFx.playPop()}>
                          <FiArrowRight size={14} />
                          <span>Read Case Study</span>
                        </StarButton>
                      )}
                      {project.github && (
                        <StarButton as="a" href={project.github} target="_blank" rel="noreferrer" onClick={() => soundFx.playPop()}>
                          <FiGithub size={14} />
                          <span>Source Code</span>
                        </StarButton>
                      )}
                      {project.live && (
                        <StarButton as="a" href={project.live} target="_blank" rel="noreferrer" onClick={() => soundFx.playPop()}>
                          <FiExternalLink size={14} />
                          <span>{project.liveLabel || 'Live Demo'}</span>
                        </StarButton>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ───────────────────────────────────── */}
        {page === 'skills' && (
          <section className="pc-section" aria-labelledby="skills-heading" id="skills">
            <header className="section-kicker-header">
              <span className="section-kicker">TECHNICAL SKILLS</span>
            </header>

            <div className="skills-category-tabs">
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  className={`skill-cat-tab ${activeSkillCategory === cat.label ? 'active' : ''}`}
                  onClick={() => {
                    soundFx.playPop();
                    setActiveSkillCategory(cat.label);
                  }}
                  style={{ '--cat-color': cat.color }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {SKILL_CATEGORIES.filter((c) => c.label === activeSkillCategory).map((cat) => (
              <div key={cat.label} className="skills-grid">
                {cat.skills.map(({ name, Icon, color }, i) => (
                  <TiltedCard
                    key={`${cat.label}-${name}`}
                    className="skill-tilt"
                    containerWidth="100%"
                    containerHeight="190px"
                    imageWidth="100%"
                    imageHeight="170px"
                    radius={16}
                    rotateAmplitude={16}
                    scaleOnHover={1.08}
                    glare={0.45}
                    shadow={0.35}
                    introDelay={i * 60}
                    showTooltip={false}
                    captionText={name}
                    altText={name}
                    onFlip={() => soundFx.playPop()}
                    backContent={
                      <div
                        className="skill-tilt__back"
                        style={{ '--cat-color': cat.color }}
                      >
                        <span className="skill-tilt__cat">{cat.label}</span>
                        <h4 className="skill-tilt__title">{name}</h4>
                        <p className="skill-tilt__note">{SKILL_NOTES[name] || 'Used across production projects.'}</p>
                      </div>
                    }
                  >
                    <div
                      className="skill-tilt__front"
                      style={{ '--cat-color': cat.color, '--skill-color': color }}
                    >
                      <TiltedCardLayer depth={-10}>
                        <span className="skill-tilt__orb" />
                      </TiltedCardLayer>
                      <TiltedCardLayer depth={34}>
                        <div className="skill-tilt__icon" style={{ color }}>
                          <Icon size={44} />
                        </div>
                      </TiltedCardLayer>
                      <TiltedCardLayer depth={20}>
                        <span className="skill-tilt__name">{name}</span>
                      </TiltedCardLayer>
                    </div>
                  </TiltedCard>
                ))}
              </div>
            ))}

            <div className="skills-soft-section">
              <h3 className="aside-heading">SOFT SKILLS</h3>
              <div className="soft-skills-grid">
                {[
                  'Problem Solving',
                  'Client Coordination',
                  'Requirement Gathering',
                  'On-site Testing',
                  'End-to-end Ownership',
                  'Fast Learner',
                ].map((skill) => (
                  <span key={skill} className="soft-skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Experience ───────────────────────────────── */}
        {page === 'experience' && (
          <section className="pc-section" aria-labelledby="experience-heading" id="experience">
            <header className="section-kicker-header">
              <span className="section-kicker">WORK EXPERIENCE</span>
            </header>

            <div className="timeline">
              {EXPERIENCE.map((exp, idx) => (
                <article key={exp.id} className="timeline-entry">
                  <div className="timeline-indicator">
                    <div className="timeline-dot" />
                    {idx < EXPERIENCE.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <div>
                        <h2 className="timeline-role">{exp.role}</h2>
                        <p className="timeline-company">{exp.company} · {exp.location}</p>
                      </div>
                      <div className="timeline-meta">
                        <span className="timeline-period">{exp.period}</span>
                        <span className={`timeline-type ${exp.type === 'Internship' ? 'internship' : 'fulltime'}`}>
                          {exp.type}
                        </span>
                      </div>
                    </div>
                    <p className="timeline-desc">{exp.desc}</p>
                    <ul className="timeline-highlights">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="timeline-highlight">
                          <FiArrowRight size={12} className="highlight-arrow" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ────────────────────────────────── */}
        {page === 'experience' && (
          <section className="pc-section" aria-labelledby="education-heading" id="education">
            <header className="section-kicker-header">
              <span className="section-kicker">EDUCATION</span>
            </header>

            <div className="education-list">
              {EDUCATION.map((edu) => (
                <article key={edu.id} className="edu-card">
                  <div className="edu-icon-col">
                    {edu.logo ? (
                      <div className="edu-logo">
                        <img src={edu.logo} alt={`${edu.institution} logo`} loading="lazy" />
                      </div>
                    ) : (
                      <div className="edu-icon-ring">
                        <FiBook size={22} />
                      </div>
                    )}
                  </div>
                  <div className="edu-body">
                    <h2 className="edu-degree">{edu.degree}</h2>
                    <p className="edu-institution">{edu.institution}</p>
                    <div className="edu-meta-row">
                      <span className="edu-period">{edu.period}</span>
                      {edu.score && <span className="edu-score">{edu.score}</span>}
                    </div>
                    {edu.desc && <p className="edu-desc">{edu.desc}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Certifications ───────────────────────────── */}
        {page === 'experience' && (
          <section className="pc-section" aria-labelledby="certifications-heading" id="certifications">
            <header className="section-kicker-header">
              <span className="section-kicker">CERTIFICATIONS &amp; ACHIEVEMENTS</span>
            </header>

            <div className="certs-grid">
              {CERTIFICATIONS.map((cert) => (
                <article key={cert.title} className="cert-card">
                  <div className="cert-color-bar" style={{ backgroundColor: cert.color }} />
                  <div className="cert-body">
                    {cert.logo ? (
                      <div className={`cert-logo ${cert.bare ? 'cert-logo--bare' : ''} ${cert.tall ? 'cert-logo--tall' : ''}`}>
                        <img src={cert.logo} alt={`${cert.issuer} logo`} loading="lazy" />
                      </div>
                    ) : (
                      <div className="cert-icon" style={{ color: cert.color }}>
                        <FiAward size={20} />
                      </div>
                    )}
                    <h3 className="cert-title">{cert.title}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>
                    <span className="cert-year">{cert.year}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
