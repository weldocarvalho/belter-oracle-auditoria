My apologies for that format failure. Many AI chat interfaces strip out raw HTML input tags for security, which breaks the clickable elements completely.
Let's switch back to the standard Markdown format (- [ ] and - [x]). This is the universal format for repository documentation, which matches your core principle: "Repository documentation is the source of truth."
You can copy and paste this text directly into your local backlog.md file in your repository, where your code editor (like VS Code) or GitHub will render them as real, clickable checkboxes.

------------------------------
## 📑 Living Backlog: Phase 1 — Frontend & UI/UX## 🧱 1. Design System & Token Configuration

* Extend Tailwind Config: Update tailwind.config.js to map the brand palette keys (cream, sage, rose-gold, sand, aqua) into the local theme.
* Inject CSS Variables: Add the HSL values for the soft custom colors into the global.css file under the base @layer directives.
* Configure Font Tokens: Ensure clean, premium sans-serif typography is configured globally for optimized mobile legibility.
* Verify Theme Initialization: Install and test standard Shadcn button and sheet primitives to verify theme color inheritance works out of the box.

## 📱 2. Mobile-First Layout & In-App Browser Optimization

* Scaffold Mobile Shell: Build a core wrapper layout component constrained to a maximum width (max-w-md) centered on the viewport for desktop fallbacks.
* Disable Screen Scaling Jitter: Inject the appropriate <meta> tags in the root layout to avoid auto-zooming bugs inside Instagram and TikTok WebViews.
* Implement Premium Sticky Header: Design a minimal header featuring your brand mark with a high-blur backdrop effect (backdrop-blur-md).
* Optimize Safe-Area Overlays: Configure margins and paddings using CSS env(safe-area-inset-bottom) to account for mobile navigation bars.

## 📣 3. Hero Section & Copywriting Execution

* Build Premium Hero Typography Stack: Implement the primary headline with a high-contrast text layout utilizing the Sand and Dark Sage colors.
* Integrate the UVP Callout: Render the exact value proposition phrase prominently: "Dermatologist-grade cellulite protocols for the price of a single sheet mask."
* Design Flash Badges: Add a small, premium badge near the top saying something highly converting like "Acesso Digital Imediato via PIX" using the Aqua Blue color token.

## 🗺️ 4. "How It Works" Visual Stepper Component

* Scaffold Stepper Grid: Build a responsive vertical sequence component using Shadcn card primitives.
* Code Step 1 (Assess): Detail the zero-friction onboarding step using simple icon layouts.
* Code Step 2 (Generate): Detail the asynchronous .NET worker generation step with a micro-badge stating "AI-Powered".
* Code Step 3 (Track): Detail the side-by-side visual vault outcome to emphasize visual tracking value.
* Polish Hover & Focus States: Implement smooth micro-interactions using Tailwind transitions for touch actions.

## 🔐 5. Bottom Sheet Authentication Gate (One-Click Auth)

* Install Shadcn Sheet Component: Import the drawer/sheet primitive configured to slide smoothly from the viewport bottom on mobile devices.
* Place a Primary Interactive Button on the landing page using the Pastel Rose Gold color to trigger the auth sheet.
* Implement Social Auth Layout: Render beautiful, clean single-tap authentication buttons for Google and Apple OAuth.
* Implement Passwordless Magic-Link Input: Build a clean form element with a single email text field and an immediate validation script.
* Integrate Loading States: Add fluid loading spinners or skeleton pulses to prevent double-submitting data when users tap buttons in slow mobile connections.

------------------------------
## 🚀 Next Steps to Proceed
Now that this clean Markdown is ready for your backlog.md, where should we write the actual code first?

* Do you want to generate the exact tailwind.config.js and global.css code setup?
* Do you want to build the Next.js Page layout shell for the landing page elements?
