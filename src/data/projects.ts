export interface ArchitectureNode {
  id: string;
  layer: 'Frontend' | 'API Layer' | 'Backend' | 'Authentication' | 'Database' | 'External Integrations';
  title: string;
  description: string;
  tech: string;
}

export interface ProjectFeature {
  id: string;
  index: string;
  title: string;
  description: string;
  annotation: string;
  diagramType: 'event-feed' | 'community-graph' | 'admin-matrix' | 'drive-workflow' | 'telemetry-wave' | 'sensor-topology';
}

export interface EngineeringChallenge {
  id: string;
  title: string;
  problem: string;
  solution: string;
}

export interface ProjectRecord {
  slug: 'sweve' | 'connectville' | 'placement-portal' | 'iot-dashboard';
  number: string;
  title: string;
  category: string;
  role: string;
  timeline: string;
  shortDescription: string;
  summary: string;
  technologies: string[];
  showcaseBullets: string[];
  liveUrl: string;
  githubUrl: string;
  caseStudyRoute: string;
  challenge: {
    background: string;
    targetUsers: string;
    requirements: string[];
    constraints: string[];
  };
  approach: {
    research: string;
    architecture: string;
    techSelection: string;
    uxDecisions: string;
  };
  systemArchitecture: ArchitectureNode[];
  keyFeatures: ProjectFeature[];
  engineeringChallenges: EngineeringChallenge[];
  resultsAndLearnings: {
    deliverables: string[];
    learnings: string[];
  };
}

/**
 * ============================================================================
 * ARRAKIS — FEATURED ARTIFACTS & CASE STUDIES REGISTRY
 * ============================================================================
 * To add or update a project in the future:
 * 1. Add the slug to `ProjectRecord['slug']` union type above.
 * 2. Add or edit the project object inside `PROJECTS_DATA` below.
 * 3. Each entry automatically populates both the Artifacts index section
 *    and its dedicated `/work/[slug]` Case Study route.
 */
export const PROJECTS_DATA: ProjectRecord[] = [
  {
    slug: 'sweve',
    number: '001',
    title: 'Sweve',
    category: 'DIGITAL PRODUCT / FRONTEND & FULL-STACK',
    role: 'Frontend & Full-Stack Developer',
    timeline: 'FEATURED FRONTEND APPLICATION',
    shortDescription: 'A responsive, modern web application and frontend platform.',
    summary:
      'An interactive frontend and full-stack web application engineered with React, TypeScript, and modern responsive design patterns, delivering high-performance UI components, modular architectures, and fluid user interactions.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'Vite'],
    showcaseBullets: [
      'Responsive, component-driven frontend architecture',
      'Fluid state management and interactive feedback loops',
      'Clean modular design system with responsive layouts',
      'High-performance rendering with zero-jank micro-interactions',
    ],
    liveUrl: 'https://github.com/23f3003249/sweve-frontend',
    githubUrl: 'https://github.com/23f3003249/sweve-frontend',
    caseStudyRoute: '/work/sweve',
    challenge: {
      background:
        'Modern web applications demand fluid responsiveness, component modularity, and rapid feedback loops without sacrificing architectural maintainability or performance.',
      targetUsers:
        'Users seeking seamless digital product workflows, clean aesthetic navigation, and accessible interactive interfaces.',
      requirements: [
        'Component-driven frontend architecture with strict TypeScript contracts.',
        'Responsive layout scaling elegantly from mobile touchscreens to ultrawide displays.',
        'Predictable, type-safe state mutations and client-side routing.',
      ],
      constraints: [
        'Ensuring zero-jank animation performance and fast initial load times.',
        'Maintaining high maintainability across modular UI component boundaries.',
      ],
    },
    approach: {
      research:
        'Analyzed modern component design systems and state coordination patterns to ensure scalable separation of concerns between presentation and application logic.',
      architecture:
        'Architected with reusable, strongly typed UI components, centralized state orchestration, and optimized bundle delivery.',
      techSelection:
        'Employed React and TypeScript for strong type safety and predictable runtime contracts, complemented by Tailwind CSS for high-fidelity styling.',
      uxDecisions:
        'Prioritized clean typography, intentional negative space, clear visual hierarchies, and swift micro-interactions.',
    },
    systemArchitecture: [
      {
        id: 'sw-fe',
        layer: 'Frontend',
        title: 'React & TypeScript Interface',
        description: 'Modular UI components, responsive layouts, and interactive application states.',
        tech: 'React · TypeScript · Tailwind CSS',
      },
      {
        id: 'sw-api',
        layer: 'API Layer',
        title: 'API Client & Data Ingestion',
        description: 'Typed API service layers and client-side data orchestration.',
        tech: 'REST API · Typed Fetch Client',
      },
      {
        id: 'sw-state',
        layer: 'Authentication',
        title: 'State & Session Guard',
        description: 'Predictable client-side state handling and protected action boundaries.',
        tech: 'Context / Hook State · Session Guard',
      },
      {
        id: 'sw-build',
        layer: 'Database',
        title: 'Build & Delivery Pipeline',
        description: 'Tree-shaken asset bundling and rapid hot module development.',
        tech: 'Vite / Modern Bundler · PostCSS',
      },
    ],
    keyFeatures: [
      {
        id: 'sw-feat-1',
        index: '01',
        title: 'Responsive Component Architecture',
        description:
          'Modular and reusable UI building blocks crafted for seamless cross-platform adaptability and high accessibility.',
        annotation: 'MODULAR UI · STRICT TYPESCRIPT',
        diagramType: 'event-feed',
      },
      {
        id: 'sw-feat-2',
        index: '02',
        title: 'Fluid Interactive Workflows',
        description:
          'Carefully tuned transitions and instant feedback states that deliver a snappy, desktop-class digital experience.',
        annotation: 'ZERO-JANK INTERACTIONS · HIGH FPS',
        diagramType: 'community-graph',
      },
    ],
    engineeringChallenges: [
      {
        id: 'sw-chal-1',
        title: 'Modular State Management Across Dynamic Views',
        problem:
          'Coordinating complex view transitions and interactive inputs without introducing prop-drilling or redundant re-renders.',
        solution:
          'Encapsulated shared domain state into scoped custom hooks with memoized selectors to maintain stable render cycles.',
      },
      {
        id: 'sw-chal-2',
        title: 'Cross-Device Layout Stability & Fluid Typography',
        problem:
          'Ensuring typography and spacing maintain editorial balance across diverse viewport proportions without layout shifts.',
        solution:
          'Implemented clamp-based fluid typographic scales paired with container-aware layout constraints.',
      },
    ],
    resultsAndLearnings: {
      deliverables: [
        'Complete open-source frontend codebase hosted on GitHub at 23f3003249/sweve-frontend.',
        'Reusable UI component architecture with clean separation of concerns.',
        'Accessible, mobile-responsive interactive user experience.',
      ],
      learnings: [
        'Strict TypeScript interfaces early in the design phase significantly reduce downstream integration friction.',
        'Polished micro-interactions and intentional negative space elevate user perception of software quality.',
      ],
    },
  },
  {
    slug: 'placement-portal',
    number: '002',
    title: 'Placement Portal',
    category: 'WEB APPLICATION / ENGINEERING',
    role: 'Full-Stack Engineer',
    timeline: 'SYSTEMS APPLICATION · EDITABLE TIMELINE',
    shortDescription:
      'A campus recruitment platform supporting administrators, companies and students.',
    summary:
      'A structured multi-role campus recruitment management system engineered to coordinate placement drives, student eligibility workflows, company listings, and placement analytics across administrators, recruiters, and candidates.',
    technologies: ['React', 'TypeScript', 'Python', 'SQL', 'Node.js', 'Tailwind CSS'],
    showcaseBullets: [
      'Admin dashboard.',
      'Company drive management.',
      'Student application workflow.',
      'Placement analytics.',
    ],
    liveUrl: 'https://placement-portal-placeholder.example.com',
    githubUrl: 'https://github.com/souvikghosh-placeholder/placement-portal',
    caseStudyRoute: '/work/placement-portal',
    challenge: {
      background:
        'Campus recruitment involves three distinct stakeholders—placement cell administrators, visiting recruiting companies, and applying students—each requiring strict data visibility boundaries and structured stage tracking.',
      targetUsers:
        'University placement coordinators managing hundreds of candidates, company HR representatives posting job drives, and students tracking eligibility and application statuses.',
      requirements: [
        'Admin dashboard for verifying student records and scheduling company recruitment drives.',
        'Company drive management workflow with eligibility criteria (CGPA, branch, active backlogs).',
        'Student application workflow with one-click apply and stage progression tracking.',
        'Placement analytics summarizing drive participation and department-level status.',
      ],
      constraints: [
        'Relational data integrity was critical to prevent ineligible applications or duplicate submissions.',
        'Interfaces needed high-density tabular clarity without visual clutter.',
      ],
    },
    approach: {
      research:
        'Analyzed the end-to-end lifecycle of a campus recruitment season—from profile verification and job posting to shortlisting, interview rounds, and final offer tracking.',
      architecture:
        'Designed around a relational SQL schema enforcing foreign-key constraints between Students, Companies, PlacementDrives, and Applications, exposed through role-scoped API controllers.',
      techSelection:
        'Used SQL for transactional integrity and structured reporting queries, paired with a modular React and TypeScript frontend featuring tabular numerals and clean role switching.',
      uxDecisions:
        'Separated the interface into three dedicated workspace views—Admin Control, Company Drive Manager, and Student Portal—so each user sees only actionable controls.',
    },
    systemArchitecture: [
      {
        id: 'pp-fe',
        layer: 'Frontend',
        title: 'Multi-Role Portal Interface',
        description: 'Dedicated dashboards for Admin governance, Company drives, and Student applications.',
        tech: 'React · TypeScript · Tailwind CSS',
      },
      {
        id: 'pp-auth',
        layer: 'Authentication',
        title: 'RBAC Policy Engine',
        description: 'Role-Based Access Control enforcing Admin, Company, and Student permissions.',
        tech: 'RBAC Middleware · Session Auth',
      },
      {
        id: 'pp-be',
        layer: 'Backend',
        title: 'Application & Eligibility Service',
        description: 'Validates student academic criteria against drive rules and computes analytics.',
        tech: 'Python / Node.js · REST API',
      },
      {
        id: 'pp-db',
        layer: 'Database',
        title: 'Relational SQL Schema',
        description: 'Normalized tables for student academic profiles, company drives, and round statuses.',
        tech: 'SQL · Relational Constraints',
      },
    ],
    keyFeatures: [
      {
        id: 'pp-feat-1',
        index: '01',
        title: 'Admin Dashboard & Drive Governance',
        description:
          'Centralized command view allowing coordinators to onboard recruiting companies, configure drive eligibility rules, and monitor real-time application pipelines.',
        annotation: 'ADMIN GOVERNANCE · ANALYTICS',
        diagramType: 'admin-matrix',
      },
      {
        id: 'pp-feat-2',
        index: '02',
        title: 'Student Application & Eligibility Workflow',
        description:
          'Automated eligibility verification checks student academic metadata against company drive thresholds before enabling one-click application and round tracking.',
        annotation: 'AUTOMATED ELIGIBILITY · STAGE TRACKING',
        diagramType: 'drive-workflow',
      },
    ],
    engineeringChallenges: [
      {
        id: 'pp-chal-1',
        title: 'Deterministic Eligibility Evaluation Across Complex Rules',
        problem:
          'Recruiting drives specify multi-variable eligibility rules (department subsets, minimum grade thresholds, and existing offer policies) that must be evaluated consistently.',
        solution:
          'Encapsulated eligibility logic into a pure, unit-tested evaluation module executed both for UI status indicators and server-side submission guards.',
      },
      {
        id: 'pp-chal-2',
        title: 'Role-Scoped Data Aggregation for Placement Analytics',
        problem:
          'Administrators required real-time breakdowns of active drives and application stages without exposing sensitive individual candidate records to unauthorized roles.',
        solution:
          'Built parameterized SQL aggregation queries behind admin-only middleware to deliver clean summary datasets to the analytics dashboard.',
      },
    ],
    resultsAndLearnings: {
      deliverables: [
        'Role-based campus recruitment portal covering Admin, Company, and Student workflows.',
        'Normalized SQL database schema with deterministic eligibility validation.',
        'Interactive placement analytics view with filterable drive cohorts.',
      ],
      learnings: [
        'Relational modeling and strict server-side authorization are indispensable when multiple user roles interact with shared state machines.',
        'High-density administrative tools benefit massively from clean typography and tabular numeric alignment.',
      ],
    },
  },
  {
    slug: 'iot-dashboard',
    number: '003',
    title: 'Real-time IoT Dashboard',
    category: 'REAL-TIME DATA / FRONTEND',
    role: 'Dashboard Development Intern (Flostat)',
    timeline: 'FLOSTAT INTERNSHIP · REAL-TIME SYSTEMS',
    shortDescription: 'An interface for monitoring IoT water management systems.',
    summary:
      'Engineered during my Dashboard Development Internship at Flostat, this real-time monitoring interface visualizes sensor readings, flow telemetry, tank levels, and device states for IoT water management systems using React, TypeScript, MQTT, and REST APIs.',
    technologies: ['React', 'TypeScript', 'MQTT', 'REST APIs', 'Tailwind CSS', 'Data Visualization'],
    showcaseBullets: [
      'Sensor readings.',
      'Data visualization.',
      'Live monitoring interface.',
      'Responsive dashboard layout.',
    ],
    liveUrl: 'https://iot-dashboard-placeholder.example.com',
    githubUrl: 'https://github.com/souvikghosh-placeholder/iot-dashboard',
    caseStudyRoute: '/work/iot-dashboard',
    challenge: {
      background:
        'Industrial and municipal IoT water management systems generate continuous telemetry from distributed flow meters, pressure transducers, and level sensors. Operators need an immediate, legible interface to monitor live readings and detect anomalies.',
      targetUsers:
        'Facility operators, water management engineers, and field technicians monitoring distributed pump stations and storage reservoirs.',
      requirements: [
        'Live sensor readings updated continuously via MQTT message streams.',
        'Historical and real-time data visualization for flow rate, tank capacity, and valve telemetry.',
        'Live monitoring interface with clear node health states and threshold alerts.',
        'Responsive dashboard layout usable on both control-room monitors and field tablets.',
      ],
      constraints: [
        'High-frequency MQTT packets could trigger excessive React re-renders if state was not buffered carefully.',
        'Telemetry views had to remain scannable under varying ambient lighting conditions.',
      ],
    },
    approach: {
      research:
        'Studied operator workflows at Flostat to identify which telemetry metrics require instant glanceability (active flow rate, reservoir percentage, connection state) versus historical trend analysis.',
      architecture:
        'Combined initial historical state hydration via REST API endpoints with a persistent MQTT WebSocket client that buffers incoming sensor payloads into a normalized state store.',
      techSelection:
        'Built with React and TypeScript for type-safe telemetry packet parsing, integrating MQTT client subscriptions alongside REST APIs and custom SVG/Canvas data visualizations.',
      uxDecisions:
        'Prioritized tabular numerals, high-contrast semantic threshold indicators (pairing explicit text labels with color), and a responsive grid that adapts cleanly from 1440px desktops to mobile field devices.',
    },
    systemArchitecture: [
      {
        id: 'iot-ext',
        layer: 'External Integrations',
        title: 'IoT Sensor Nodes & MQTT Broker',
        description: 'Distributed flow meters, level sensors, and pump controllers publishing telemetry topics.',
        tech: 'MQTT Broker · WebSockets',
      },
      {
        id: 'iot-api',
        layer: 'API Layer',
        title: 'REST & Stream Ingestion Layer',
        description: 'Combines REST endpoints for historical logs with live MQTT topic subscriptions.',
        tech: 'REST API · MQTT Client',
      },
      {
        id: 'iot-fe',
        layer: 'Frontend',
        title: 'Buffered Telemetry Dashboard',
        description: 'TypeScript state buffer, real-time waveform visualizers, and responsive node cards.',
        tech: 'React · TypeScript · Tailwind CSS',
      },
    ],
    keyFeatures: [
      {
        id: 'iot-feat-1',
        index: '01',
        title: 'Live MQTT Sensor Readings & Telemetry Stream',
        description:
          'Subscribes to hierarchical MQTT sensor topics to display live flow rates (L/min), reservoir levels, and pressure readings with sub-second visual updates.',
        annotation: 'MQTT LIVE STREAM · TABULAR METRICS',
        diagramType: 'telemetry-wave',
      },
      {
        id: 'iot-feat-2',
        index: '02',
        title: 'Multi-Node Water System Visualization',
        description:
          'Interactive topology and time-series visualization correlating pump status, valve actuation, and tank consumption across connected water management zones.',
        annotation: 'TOPOLOGY MAP · RESPONSIVE GRID',
        diagramType: 'sensor-topology',
      },
    ],
    engineeringChallenges: [
      {
        id: 'iot-chal-1',
        title: 'Preventing UI Jank During High-Frequency MQTT Bursts',
        problem:
          'Multiple IoT sensor nodes publishing telemetry simultaneously caused rapid React state updates and chart re-draws.',
        solution:
          'Implemented a ref-backed message buffer that coalesces incoming MQTT packets and flushes normalized state updates on a controlled cadence.',
      },
      {
        id: 'iot-chal-2',
        title: 'Resilient Reconnection & Stale-Data Signaling',
        problem:
          'Field networks occasionally drop WebSocket connections, risking operators acting on stale sensor readings.',
        solution:
          'Added per-node heartbeat tracking and explicit connection state labels that visually flag stale telemetry and automatically reconcile with REST snapshots upon reconnect.',
      },
    ],
    resultsAndLearnings: {
      deliverables: [
        'Production-grade React and TypeScript dashboard interface developed during the Flostat internship.',
        'Integrated MQTT live telemetry streaming alongside REST API historical data fetching.',
        'Responsive multi-panel layout supporting sensor readings, data visualization, and live monitoring.',
      ],
      learnings: [
        'Decoupling network ingestion frequency from UI render frequency is essential for smooth real-time dashboards.',
        'Clear typographic hierarchy and explicit status labels matter far more than decorative gauges in operational software.',
      ],
    },
  },
];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  if (slug === 'connectville') {
    return PROJECTS_DATA.find((p) => p.slug === 'sweve');
  }
  return PROJECTS_DATA.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: ProjectRecord; next: ProjectRecord } {
  const index = PROJECTS_DATA.findIndex((p) => p.slug === slug);
  const safeIndex = index === -1 ? 0 : index;
  const prevIndex = (safeIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
  const nextIndex = (safeIndex + 1) % PROJECTS_DATA.length;
  return {
    prev: PROJECTS_DATA[prevIndex],
    next: PROJECTS_DATA[nextIndex],
  };
}
