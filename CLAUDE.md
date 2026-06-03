# CLAUDE.md — Frontend Website Rules

## WAT Framework

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

**2. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with me before running again)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)

**3. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless I explicitly tell you to.

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow with the new approach
5. Move on with a more robust system

## File Structure

**Directory layout:**
```
.tmp/                     # Temporary files (scraped data, intermediate exports). Regenerated as needed.
tools/                    # Python scripts for deterministic execution
workflows/                # Markdown SOPs defining what to do and how
temporary screenshots/    # Auto-saved screenshots from Puppeteer (never delete manually)
.env                      # API keys and environment variables (NEVER store secrets anywhere else)
credentials.json, token.json  # Google OAuth (gitignored)
```

**Core principle:** Local files are just for processing. Anything I need to see or use lives in cloud services. Everything in `.tmp/` is disposable.

---

## Local Server

- Always serve the site on **port 3000** using `python3 -m http.server 3000`
- Before starting, check if port 3000 is already in use — if it is, do NOT start a second instance
- The site is always accessible at `http://localhost:3000`
- Keep the server running during the entire build and screenshot loop
- Only shut it down when explicitly asked

---

## Screenshot Workflow

Puppeteer is used to take screenshots so Claude can visually review and improve the site automatically.

**Setup (first time only):**
- Install Puppeteer: `npm i puppeteer` in the project directory
- The `screenshot.mjs` script lives in the project root — use it as-is
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten)

**How to take a screenshot:**
```
node screenshot.mjs http://localhost:3000
```

**With a label:**
```
node screenshot.mjs http://localhost:3000 hero
```
This saves as `screenshot-N-hero.png`

**After every screenshot:**
- Read the PNG from `temporary screenshots/` using the Read tool
- Claude can see and analyze the image directly
- Compare it against the brand guidelines and reference designs
- Be specific when describing issues: "heading is 32px but should be ~24px", "card gap is 16px but should be 24px"

**What to check in every screenshot:**
- Spacing and padding consistency
- Font size, weight, and line-height
- Colors (exact hex values match brand)
- Alignment and visual balance
- Border radius and shadows
- Image sizing and aspect ratios
- Animations rendering correctly
- Mobile responsiveness

**Two-pass review process:**
1. Build the full page and take initial screenshots
2. Review all screenshots, identify issues
3. Fix all issues in one pass
4. Take final screenshots to confirm fixes

---

## Output Defaults

- Primary output file: `index.html` (single file with all CSS and JS inline unless told otherwise)
- All fonts loaded via Google Fonts CDN
- All animations use CSS or vanilla JS — no heavy libraries unless specifically requested
- Images use placeholder URLs unless real assets are provided
- Code must be clean, commented, and production-ready
- Always build mobile-responsive layouts by default
- Default viewport for screenshots: 1440px wide (desktop)
- After building, always start the server and run the screenshot loop automatically

---

## Brand: EndoGeniety Society

- **Brand name**: EndoGeniety Society (NOT "AIS")
- **Primary color**: Electric cyan/blue — `#00D4FF`
- **Background**: Deep dark — `#0A0A0A` or `#050510`
- **Accent**: Glowing blue — `#0066FF`
- **Typography**: Bold, futuristic — avoid generic fonts like Inter, Roboto, Arial
- **Aesthetic**: Dark futuristic, "Build Beyond Limits" energy
- **Logo**: Neon blue circular arrow with smirk icon — use as provided
- **Tone**: Premium, ambitious, community-driven

---

## Bottom Line

You sit between what I want (workflows) and what actually gets done (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

Stay pragmatic. Stay reliable. Keep learning.
