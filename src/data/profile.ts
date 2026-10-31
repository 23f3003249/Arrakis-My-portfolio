export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface CapabilityItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  annotations: string[];
  geometryType: 'monolith-slab' | 'twin-pillars' | 'stepped-citadel' | 'orbital-prism';
}

export interface ProcessStage {
  number: string;
  stage: string;
  label: string;
  description: string;
  visualMetaphor: string;
}

export interface TechGroup {
  category: string;
  items: string[];
}

/**
 * ============================================================================
 * ARRAKIS — CENTRAL PROFILE & PORTFOLIO CONFIGURATION
 * ============================================================================
 * Update this file to modify personal details, social links, experience
 * timeline, engineering capabilities, process stages, and technical stack.
 */

export const PROFILE_DATA = {
  // === 1. BRAND & IDENTITY ===
  brand: 'ARRAKIS',
  copyrightYear: 2026,
  tagline: 'IDEAS. CODE. EXPERIENCES.',
  roleLabel: 'CREATIVE DEVELOPER / BUILDING DIGITAL WORLDS',
  footerRole: 'CREATIVE DEVELOPER / DIGITAL BUILDER',
  name: 'Souvik Ghosh',
  headline: 'I BUILD WORLDS THROUGH CODE.',
  heroSubtitle: 'EXPLORING THE INTERSECTION OF CREATIVITY, TECHNOLOGY AND ENGINEERING.',
  currentFocus: 'INTERACTIVE 3D EXPERIENCES',
  aboutQuote:
    'I enjoy exploring technology, designing useful digital products and turning complex problems into thoughtful digital experiences.',
  awakeningQuote:
    'Curiosity keeps me exploring. Engineering helps me turn discoveries into something useful.',
  education: 'IIT Madras BS in Data Science',
  location: 'India',

  // === 2. CONTACT & SOCIAL CHANNELS ===
  contact: {
    email: 'souvikghosh6392@gmail.com',
    github: 'https://github.com/23f3003249',
    linkedin: 'https://linkedin.com/in/souvik-ghosh-3a8562217',
    medium: 'https://medium.com/@souvikghosh6392',
    location: 'India',
  },

  // === 3. BIO & CORE HIGHLIGHTS ===
  bioParagraphs: [
    'Pursuing the BS in Data Science and Applications at IIT Madras, I work across full-stack engineering, real-time data interfaces, and spatial web experiences.',
    'From building real-time MQTT & REST telemetry dashboards during my internship at Flostat to co-founding Apex Circle and serving as a Miro Ambassador, my work centers on clarity, structure, and human connection.',
  ],
  profileHighlights: [
    'IIT Madras BS in Data Science',
    'Software development & systems architecture',
    'React, TypeScript and MERN development',
    'Python and SQL data workflows',
    'Community building through Apex Circle',
    'Miro Ambassador experience',
    'Dashboard development internship at Flostat',
  ],

  // === 4. EXPERIENCE & COMMUNITY TIMELINE ===
  timeline: [
    {
      id: 'flostat',
      role: 'Dashboard Development Intern',
      organization: 'Flostat',
      period: 'INTERNSHIP · ENGINEERING',
      summary:
        'Engineered responsive React and TypeScript monitoring interfaces for industrial IoT water management systems with real-time MQTT and REST API integration.',
      highlights: ['React & TypeScript Architecture', 'MQTT Live Telemetry', 'REST API Integration'],
    },
    {
      id: 'apex-circle',
      role: 'Co-Founder',
      organization: 'Apex Circle',
      period: 'COMMUNITY · LEADERSHIP',
      summary:
        'Co-founded a builder community focused on collaborative software engineering, hands-on technology sessions, and student hackathon organization.',
      highlights: ['Community Building', 'Technical Sessions', 'Hackathon Organization'],
    },
    {
      id: 'miro',
      role: 'Miro Ambassador',
      organization: 'Miro Community',
      period: 'AMBASSADOR · VISUAL COLLABORATION',
      summary:
        'Facilitated visual systems thinking, architecture mapping, and collaborative product design workflows across developer and student groups.',
      highlights: ['Systems Mapping', 'Collaborative Workflows', 'Design Workshops'],
    },
    {
      id: 'iitm',
      role: 'BS in Data Science & Applications',
      organization: 'IIT Madras',
      period: 'ACADEMIC · DATA & COMPUTATION',
      summary:
        'Rigorous foundation in Python, SQL, statistical modeling, data structures, and full-stack application engineering.',
      highlights: ['Python & SQL', 'Data Science', 'Computational Thinking'],
    },
  ] as ExperienceItem[],
  capabilities: [
    {
      id: 'frontend',
      index: '01',
      title: 'Frontend Engineering',
      subtitle: 'INTERFACE PRECISION',
      description:
        'Component-driven interfaces engineered with React, Next.js, and TypeScript—prioritizing state predictability, accessibility, and zero-latency responsiveness.',
      annotations: ['REACT / NEXT.JS', 'TYPESCRIPT STRICT', 'ACCESSIBLE DOM'],
      geometryType: 'monolith-slab',
    },
    {
      id: 'backend',
      index: '02',
      title: 'Backend Architecture',
      subtitle: 'SYSTEMS & DATA PIPELINES',
      description:
        'Resilient REST APIs, real-time MQTT streams, and relational/document data models built with Node.js, Express, Python, and SQL.',
      annotations: ['NODE / EXPRESS / PYTHON', 'SQL & DOCUMENT STORES', 'MQTT / REST STREAMS'],
      geometryType: 'twin-pillars',
    },
    {
      id: 'creative',
      index: '03',
      title: 'Creative Development',
      subtitle: 'SPATIAL & MOTION SYSTEMS',
      description:
        'Custom WebGL shaders, Three.js environments, and choreographed GSAP scroll timelines that bridge narrative direction with GPU performance.',
      annotations: ['THREE.JS / GLSL SHADERS', 'GSAP SCROLLTRIGGER', '60FPS KINEMATICS'],
      geometryType: 'stepped-citadel',
    },
    {
      id: 'problem-solving',
      index: '04',
      title: 'Problem Solving',
      subtitle: 'ALGORITHMIC CLARITY',
      description:
        'Translating ambiguous product requirements and noisy sensor or operational datasets into clear, maintainable software architectures.',
      annotations: ['DATA MODELING', 'SYSTEM DECOMPOSITION', 'PERFORMANCE AUDITING'],
      geometryType: 'orbital-prism',
    },
  ] as CapabilityItem[],
  processStages: [
    {
      number: '01',
      stage: 'DISCOVER',
      label: '01 / UNDERSTAND THE PROBLEM',
      description:
        'Understand the requirements, users, context and constraints before choosing a technical solution.',
      visualMetaphor: 'Scattered particles representing initial ideas.',
    },
    {
      number: '02',
      stage: 'DESIGN',
      label: '02 / SHAPE THE EXPERIENCE',
      description:
        'Establish information architecture, interaction patterns, component structure and visual direction.',
      visualMetaphor: 'Particles form clear geometric patterns.',
    },
    {
      number: '03',
      stage: 'ENGINEER',
      label: '03 / BUILD THE SYSTEM',
      description:
        'Transform the design into reusable components, connected APIs, database operations and functional interfaces.',
      visualMetaphor: 'Geometric structures become precise architectural systems.',
    },
    {
      number: '04',
      stage: 'REFINE',
      label: '04 / PERFECT THE DETAILS',
      description:
        'Test responsiveness, accessibility, performance and user interactions.',
      visualMetaphor: 'The architecture becomes complete and illuminated by warm golden light.',
    },
  ] as ProcessStage[],
  techCapabilities: [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express.js', 'Python', 'Flask'],
    },
    {
      category: 'Data',
      items: ['MongoDB', 'PostgreSQL', 'SQL', 'Supabase'],
    },
    {
      category: 'Creative',
      items: ['Three.js', 'GSAP', 'Framer Motion'],
    },
  ] as TechGroup[],
};
