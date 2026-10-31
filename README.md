ARRAKIS — Cinematic Developer Portfolio
A cinematic, desert-inspired developer portfolio exploring the intersection of engineering, creativity, and interactive digital experiences.

ARRAKIS uses an editorial visual direction: a minimal dark canvas, a framed rectangular video stage, refined typography, and a sequence of atmospheric desert environments. The experience is designed to feel like one continuous journey through seven chapters.
Status: In development. Update the live URL, screenshots, and feature status below as the project evolves.

Table of Contents

- Overview
- Experience
- Tech Stack
- Getting Started
- Environment Variables
- Video Assets
- Animation Architecture
- Project Structure
- Deployment
- Performance and Accessibility
- Development Notes
- License
  Overview
  ARRAKIS is a personal portfolio built around a cinematic desert environment. Instead of presenting projects as a conventional list, the website guides visitors through a sequence of visual chapters:
  Chapter Purpose Video asset
  01 — Arrival Introduction and identity 01-arrival.mp4
  02 — The Desert About and philosophy 02-desert.mp4
  03 — Awakening Skills and capabilities 03-awakening.mp4
  04 — Architecture Engineering approach 04-architecture.mp4
  05 — Artifacts Selected projects 05-artifacts.mp4
  06 — Method Development process 06-method.mp4
  07 — Horizon Contact and closing 07-horizon.mp4

The visual identity uses dark charcoal, bronze, sandstone, ivory, and restrained amber accents.
Experience
The design is based on a few principles:

- Framed cinematic stage: a rectangular video experience sits inside a dark outer canvas.
- Editorial typography: large, lightweight headlines, compact navigation, and generous negative space.
- Continuous visual world: chapter changes use video crossfades and consistent colour grading.
- Meaningful motion: scroll reveals and pointer interactions support the content rather than compete with it.
- Project-led storytelling: selected work should explain the problem, contribution, technical decisions, and outcome—not only display technology logos.
  Planned / optional interactions
  Enable these as they are implemented in the project:
- Scroll-triggered chapter video crossfades.
- Masked line and word reveals for headings.
- Subtle background zoom and text parallax.
- Image-mask reveals for project previews.
- A small pointer-following sand-particle trail.
- Restrained mouse-based parallax.
- Responsive chapter navigation and project hover previews.
  Tech Stack
  The project is designed around the following stack. Confirm the installed packages in package.json before adding or removing dependencies.
  Technology Role
  Next.js React framework and application routing
  React Component-based UI
  TypeScript Type safety
  Tailwind CSS Styling and responsive layout
  GSAP + ScrollTrigger Scroll-driven animation and transitions
  Three.js Lightweight interactive particle effects, where needed
  Lenis Optional smooth scrolling; synchronize with ScrollTrigger if installed
  Vercel Application hosting and deployments
  Cloudflare R2 Optional external storage for large video assets

Getting Started
Prerequisites

- Node.js (use the version supported by the installed Next.js release).
- npm, pnpm, yarn, or the package manager used by this repository.
- Git.

1. Clone the repository
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   cd <YOUR_PROJECT_DIRECTORY>
2. Install dependencies
   Use the package manager matching the lockfile in the repository:
   npm install
   Alternatively, use pnpm install or yarn install if the project uses those package managers.
3. Configure environment variables
   Create a local environment file if the project requires one:
   cp .env.example .env.local
   Add the variables required by your implementation. Do not commit .env.local or credentials to Git.
4. Start the development server
   npm run dev
   Open http://localhost:3000 in your browser.
5. Build for production
   npm run build
   npm run start
   The available scripts depend on package.json. Check that file if a command is not defined.
   Environment Variables
   The portfolio can be configured without environment variables if all assets are served from public/. If videos or other media are hosted externally, define the media base URL in the environment rather than hard-coding it throughout the components.

Example .env.example:

# Optional: base URL for externally hosted ARRAKIS media

NEXT*PUBLIC_MEDIA_BASE_URL=
Use the variable only if the application code reads it. NEXT_PUBLIC* variables are exposed to the browser, so never put private keys, passwords, or access tokens in them.
Video Assets
The seven Google Flow clips form the visual foundation of the experience.
Local development
For local testing, place the clips in:
public/
└── videos/
└── arrakis/
├── 01-arrival.mp4
├── 02-desert.mp4
├── 03-awakening.mp4
├── 04-architecture.mp4
├── 05-artifacts.mp4
├── 06-method.mp4
└── 07-horizon.mp4
A file in public/videos/arrakis/01-arrival.mp4 is referenced in the browser as:
/videos/arrakis/01-arrival.mp4
Create poster images for the clips where possible. Posters provide a visual fallback while a video loads and can be used for reduced-motion experiences.
Production media hosting
For larger video files, consider hosting media separately from the application deployment. One possible setup is:

- Website and Next.js application: Vercel.
- Video files: Cloudflare R2 behind a custom media domain.
- Source code: GitHub.
  When using external media, update the video source paths to use the configured media base URL. Keep the bucket or media domain publicly readable only for the assets intended to be public. Never expose storage credentials in client-side code.
  Video delivery recommendations
- Provide compressed MP4 (H.264) versions and consider WebM where useful.
- Use 1920×1080 desktop assets and smaller mobile encodes where appropriate.
- Keep videos muted, inline, and without unnecessary audio tracks.
- Preload only the initial hero video; load later chapter videos on demand.
- Avoid playing multiple clips simultaneously.
- Use a poster or previous frame while the next clip buffers.
- Test video playback and seeking on mobile Safari and Chrome.
Animation Architecture
Scroll-driven chapters
Each homepage chapter can identify the video it controls using a data-world-scene attribute:
<section id="home" data-world-scene="arrival">
  {/* Hero content */}
</section>

<section id="about" data-world-scene="desert">
  {/* About content */}
</section>

<section id="capabilities" data-world-scene="awakening">
  {/* Skills and capabilities */}
</section>

<section id="architecture" data-world-scene="architecture">
  {/* Engineering approach */}
</section>

<section id="work" data-world-scene="artifacts">
  {/* Selected projects */}
</section>

<section id="process" data-world-scene="method">
  {/* Development process */}
</section>

<section id="contact" data-world-scene="horizon">
  {/* Contact content */}
</section>
A persistent video-stage component can observe these sections with GSAP ScrollTrigger and crossfade between the corresponding clips. Keep the video stage behind the content and ensure section backgrounds do not unintentionally cover it.
Pointer sand particles
The pointer particle effect should remain small and restrained:
- Emit a small number of particles only while the pointer moves.
- Use muted amber and sand tones.
- Give particles a short lifetime and fade them out smoothly.
- Constrain the effect to the rectangular stage.
- Disable or reduce the effect for touch devices and reduced-motion preferences.
- Reuse geometries and materials; dispose of GPU resources when the component unmounts.
Smooth scrolling
If Lenis is used, synchronize its scroll updates with GSAP ScrollTrigger. Avoid running multiple independent smooth-scrolling systems or creating duplicate animation loops.
Project Structure
The exact structure may differ in the current repository. A possible organization is:
.
├── public/
│   ├── images/
│   └── videos/
│       └── arrakis/
├── src/
│   ├── app/
│   ├── components/
│   │   └── arrakis/
│   │       ├── ArrakisVideoBackground.tsx
│   │       └── PointerSandParticles.tsx
│   ├── hooks/
│   ├── lib/
│   └── styles/
├── .env.example
├── package.json
└── README.md
Keep reusable animation logic in components or hooks, and keep chapter data and asset paths centralized so that content can be updated without editing multiple components.
Deployment
Deploy the application to Vercel
1. Push the project to a GitHub repository.
2. Sign in to Vercel with GitHub.
3. Import the ARRAKIS repository.
4. Confirm the framework is detected as Next.js.
5. Configure environment variables, if required.
6. Deploy and test the generated preview URL.
7. Connect a custom domain through the Vercel project settings.
Vercel can create preview deployments for branches and deploy production changes from the configured production branch.
Host video assets separately (optional)
For a media-heavy production site, upload the video clips to Cloudflare R2 or another object-storage/CDN service. Configure a public custom media domain and update the application to reference those URLs.

Before launch, verify:

- The media domain serves the video files over HTTPS.
- Cross-origin requests are configured appropriately for the website.
- Video requests support byte-range playback where required.
- Poster images load correctly.
- The site has a fallback if a video fails to load.
  Performance and Accessibility
  Cinematic effects should not compromise usability.
- Respect prefers-reduced-motion and provide a static visual fallback.
- Keep all navigation and important content accessible without animation.
- Maintain readable contrast over video backgrounds using restrained overlays.
- Provide keyboard-visible focus styles.
- Avoid scroll-jacking; visitors should retain normal browser scrolling.
- Lazy-load non-critical video and image assets.
- Test on mobile devices and lower-powered hardware.
- Ensure animations and event listeners are cleaned up when components unmount.
- Avoid loading the full 3D scene on devices that cannot run it smoothly.
  Development Notes
  Before merging a change, check:
- [ ] The homepage works at desktop, tablet, and mobile widths.
- [ ] All seven chapter mappings activate the intended video.
- [ ] Scrolling down and back up selects the correct chapter.
- [ ] Video transitions do not flash to black.
- [ ] Only the intended video is playing.
- [ ] Text remains readable over every clip.
- [ ] Reduced-motion and touch fallbacks work.
- [ ] No console errors or missing assets remain.
- [ ] Production build completes successfully.
      License
      Add the license that applies to this repository and its assets before making the project open source. Ensure that generated videos, fonts, images, models, and other third-party assets are permitted for the intended use and redistribution.
      Links
- Live site: <ADD_LIVE_URL>
- Repository: <ADD_REPOSITORY_URL>
- Contact: <ADD_PUBLIC_CONTACT_OR_PORTFOLIO_LINK>
