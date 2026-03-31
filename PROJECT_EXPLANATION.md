# Ann Arbor Skyline Project: Detailed Study Guide

This guide explains your project at a beginner level but with much more depth, so you can confidently discuss how every page and section works.

---

## 1) What this project is (in one clear sentence)

This is a **static, mobile-first, responsive, accessibility-focused website** for the Ann Arbor Skyline Cross Country team, built with plain HTML, CSS, and JavaScript.

Key idea: there is **no backend runtime** and **no database query at page load**. The browser renders prebuilt files.

---

## 2) Core project goals

Your implementation satisfies the major course goals:

1. **Mobile-first design**  
   Base styles are built for small screens first, then enhanced with media queries.

2. **Responsive layouts**  
   Components reflow from phone to tablet/desktop (cards, tables, gallery, comparison layout).

3. **JavaScript interaction**  
   Sorting, card flipping, race filtering, athlete comparison, and link hardening.

4. **Accessibility quality**  
   Semantic landmarks, skip links, form semantics, live regions, dark mode and reduced motion support.

---

## 3) Deliverable 5 requirement-to-project mapping

This section maps your assignment requirements directly to what is implemented.

### Requirement: "Tablet or desktop website built on mobile-first default"
- Met by using a mobile-first CSS base in `styles/main.css`.
- Larger-screen styles are layered through min-width media queries.
- Same content remains available at all screen sizes (layout changes, content does not disappear).

### Requirement: "Responsive and all content viewable at larger sizes"
- Met by responsive card grid, comparison layout shifts, table reflow, and gallery mode changes.
- Team page and athlete pages keep full content access from phone to desktop.

### Requirement: "At least one JavaScript component"
- Exceeded: site includes multiple JS features:
  - card flip interaction
  - roster sorting
  - athlete result filtering
  - athlete comparison rendering
  - external-link hardening

### Requirement: "Fully accessible; pass WAVE and axe"
- Implemented with semantic landmarks, skip links, labels, fieldset/legend, `aria-describedby`, live regions, keyboard focus treatment, and preference media queries.
- Additional fixes include contrast tuning and avoiding nested interactive patterns.
- Final validation should be re-run before demo/submission after any last edits.

### Requirement: "Submit deployed URL and be ready to present/make live changes"
- Deployed URL: `https://dulikim.github.io/si338-client-project-deliverable/`
- Site updates via commit + push to `main` (GitHub Pages rebuild).
- Document includes "live edit" options and presentation Q/A prep.

### Requirement: "Comments from mobile view + creativity/clean code/demo agility"
- Mobile-first architecture is preserved.
- Code organization is clear (`reset.css`, `main.css`, `main.js`, structured pages).
- Interactions and animations (card flip, dynamic comparison) strengthen creativity and demo quality.

---

## 4) Rubric risk checklist (penalty prevention)

Use this before presenting to avoid preventable point losses:

- **Keyboard accessibility is required:** test full keyboard flow (`Tab`, `Shift+Tab`, `Enter`, `Space`) on nav, forms, compare button, links, and back-to-top controls.
- **Do not use `!important`:** this can trigger direct rubric deductions. Current project state should remain at zero `!important` usage.
- **Alt text quality matters:** slight issues can cost around `-2`; repeated poor alt text can cost around `-5`.  
  - Decorative image: use `alt=""` (and optionally `aria-hidden="true"`).  
  - Informative image: use concise, meaningful alt text.
- **Use a full reset/default stylesheet:**  
  - Incomplete reset can cost around `-1.5`.  
  - No reset can cost around `-2.5`.  
  - This project uses full `normalize.css` in `styles/reset.css`, linked from all HTML pages.
- **Validators:** run both WAVE and axe on home page and at least one athlete detail page after final edits.
- **ARIA correctness:** only use ARIA where needed, with valid relationships (`aria-describedby`, live region usage).

---

## 5) Project structure and what each part does

```text
si338-client-project-deliverable/
  index.html
  athletes/
    index.html
    21615274/index.html
    21654321/index.html
    21789456/index.html
    21987654/index.html
  styles/
    reset.css
    main.css
  scripts/
    main.js
  images/
    athletes/...
```

- `index.html`: team landing page with all major sections.
- `athletes/index.html`: all-athletes roster page with sorting and profile links.
- `athletes/<id>/index.html`: individual athlete detail pages.
- `styles/reset.css`: baseline style normalization across browsers.
- `styles/main.css`: visual system, responsive layout, theme, motion handling.
- `scripts/main.js`: all interactive site behavior.
- `images/athletes/...`: profile photos, gallery images, performance chart images.

---

## 6) Data model and content pipeline (important to understand)

The project is static, but still data-driven in how content was prepared:

- Athlete/event data appears directly in HTML tables/cards.
- `index.html` includes an embedded `ATHLETES_DATA` object used by the comparison tool.
- The file comments indicate this data was generated by `team-builder.py` from CSV inputs.

What this means in plain terms:
- The live site is not connected to an external spreadsheet in real time.
- You can use CSV + Python as a **build step**.
- After generation, the website serves fixed HTML/JS/CSS.

---

## 7) Page-by-page explanation (what each page does)

## Page A: `index.html` (Team home page)

Purpose: this is the main experience. It combines roster browsing, achievements, athlete comparison, event history, and team gallery.

### Sections on `index.html`

1. **Top navigation (`#main-nav`)**
   - Includes skip link for keyboard users.
   - Anchor links jump to major sections (`Roster`, `Accomplishments`, `Comparison`, `Events`, `Gallery`).

2. **Header**
   - Displays main title: Ann Arbor Skyline Team Roster.

3. **Main section: The Athletes (`#team-roster`)**
   - Contains sorting controls (`#sort-by`) with options Name, Grade, SR, PR.
   - Includes roster card grid (`#athlete-roster`) where each `.athlete-card` stores sortable values in `data-*`.
   - Each card has front and back:
     - Front: image + name
     - Back: name, grade, SR, PR, and profile link
   - JavaScript handles card flip and sorting.

4. **Main section: Team Accomplishments (`#team-accomplishments`)**
   - Static highlights list of key team metrics.
   - Good for quick storytelling and summary stats.

5. **Main section: Compare Athletes (`#player-comparison`)**
   - Two dropdowns select athlete A and athlete B.
   - Compare button triggers dynamic rebuild of results area.
   - Output includes:
     - Two comparison cards
     - Shared meets table (if shared meets exist)
   - Uses `ATHLETES_DATA` embedded in the page.
   - Announces updates via screen-reader live region (`#compare-status`).

6. **Main section: Team Events (`#team-events`)**
   - Event results table with columns Race, Date, Placement, Results.
   - External result links open in a new tab and are hardened by JS (`rel` attrs).

7. **Main section: Team Gallery (`#team-gallery`)**
   - Scrollable/gallery layout that adapts by screen size.
   - Uses `tabindex`, ARIA naming, and lazy-loading for accessibility/performance.

8. **Footer (`#site-footer`)**
   - Data attribution text (Athletic.net).
   - Floating back-to-top control.

---

## Page B: `athletes/index.html` (All-athletes page)

Purpose: dedicated roster directory with simpler navigation and quick links to individual athlete pages.

### Sections on `athletes/index.html`

1. **Navigation (`#athlete-nav`)**
   - Skip link.
   - Page title label and link back to team home page.

2. **Header**
   - Heading: Ann Arbor Skyline Athletes.

3. **Main section: All Athletes (`#athletes-central`)**
   - Same sort controls as home page.
   - Roster card structure mirrors `index.html`.
   - Cards include profile links to `athletes/<id>/index.html`.

4. **Footer**
   - Attribution + back-to-top.

This page acts like an athlete index/hub without accomplishments/comparison/events blocks.

---

## Page C: Individual athlete pages (`athletes/<id>/index.html`)

Purpose: detailed profile for a specific athlete (bio summary + race history + progression visual + gallery).

All four athlete pages share the same page template and behavior.

### Sections on each athlete detail page

1. **Navigation (`#athlete-nav`)**
   - Skip link.
   - Link back to team home page.

2. **Athlete header (`#athlete-header`)**
   - Name, profile image, school, current grade.
   - Link to Athletic.net profile.
   - Season Record and Personal Record summary.

3. **Race results section (`#athlete-results`)**
   - Filter controls:
     - text search by race/location
     - date picker
   - Results table columns:
     - Race Name, Date, Location, Distance, Time, Place, Grade, Results link
   - JavaScript hides/shows rows based on active filters.

4. **Performance graph section (`#performance-graph`)**
   - Performance image (`performance.png`) with descriptive context paragraph.
   - ARIA description linkage improves non-visual understanding.

5. **Gallery section (`#athlete-gallery`)**
   - Athlete-specific gallery region.
   - Some pages include many photos; others currently have placeholder/empty gallery container.

6. **Footer**
   - Attribution and back-to-top link.

---

## 8) JavaScript behavior explained step-by-step (`scripts/main.js`)

When DOM is ready, the script runs:
- `hardenExternalLinks()`
- `initCardFlip()`
- `initSort()`
- `initFilter()`
- `initCompare()`

### A) Card flipping (`initCardFlip`, `toggleCard`)

- Targets all `.athlete-card` elements.
- Click on card toggles `.flipped`.
- Clicks on links inside cards are ignored (so navigation still works).
- Visual flip effect itself is CSS-driven.

### B) Roster sorting (`initSort`, `sortCards`, `timeToSeconds`)

- Listens to `#sort-by` change.
- Pulls sort values from card `data-*` attributes.
- Converts time strings (like `17:22.3`) to seconds for correct numeric ordering.
- Re-appends the same DOM nodes in sorted order.

### C) Athlete result filtering (`initFilter`)

- Only activates on pages containing `#results-table`.
- Search field matches race name and location text.
- Date field compares selected date to row date.
- Non-matching rows are hidden with `display: none`.

### D) Athlete comparison (`initCompare`, `updateComparison`, `comparisonCard`)

- Only activates on pages with compare controls (team page).
- Reads selected athlete IDs from dropdowns.
- Looks up athletes in global `ATHLETES_DATA`.
- Computes intersection of meets.
- Regenerates comparison cards + shared meets table HTML.
- Updates polite live region with a status message.

### E) External-link hardening (`hardenExternalLinks`)

- Finds every `a[target="_blank"]`.
- Adds `rel="noopener noreferrer"` for security and quality checks.

---

## 9) CSS and responsive design: what to say confidently

Your CSS architecture demonstrates:

- **Tokenized design values** via custom properties in `:root`.
- **Mobile-first defaults**, then breakpoint enhancements.
- **Component-level styling** for cards, tables, forms, gallery, comparison blocks.
- **User preference support**:
  - `prefers-color-scheme: dark`
  - `prefers-reduced-motion: reduce`

Typical responsive transformations:
- Roster cards: single-column to multi-column.
- Tables: mobile-friendly stacking/card-like behavior to full table layout.
- Gallery: horizontal scroll/snap on small screens, grid on larger screens.
- Comparison block: stacked cards on mobile, side-by-side cards on wider screens.

---

## 10) Accessibility checklist by implementation area

### Navigation and landmarks
- Semantic layout (`nav`, `header`, `main`, `section`, `article`, `footer`).
- Skip links for keyboard users.

### Forms and controls
- Proper `label` usage.
- `fieldset` + `legend` for grouped controls.
- `aria-describedby` for extra help text on sort/filter/compare controls.

### Dynamic UI feedback
- Compare action announces updates through an `aria-live` region.

### Media and visuals
- Lazy-loaded images.
- Context paragraphs linked to graph imagery.
- Dark mode and reduced motion accommodations.

### Security/accessibility overlap
- External link `rel` hardening for new-tab links.

---

## 11) How to run, test, and verify

Run local server:

```bash
python3 -m http.server 8000
```

Open:
- `http://localhost:8000/`

Verification checklist:
- Test on mobile width first, then tablet/desktop.
- Sort roster by all 4 options.
- Flip cards and open profile links.
- Use athlete page search/date filters.
- Use compare tool with multiple athlete pairs.
- Test keyboard-only navigation.
- Test dark mode and reduced motion settings.
- Run WAVE and axe browser tools.

---

## 12) Presentation-ready explanation (long version)

"This project is a static, mobile-first website for the Ann Arbor Skyline Cross Country team. The structure is built with semantic HTML across a team homepage, an all-athletes page, and individual athlete pages. Styling is centralized in a responsive CSS system that starts with phone layouts and progressively enhances for larger screens. JavaScript adds interaction including card flipping, roster sorting, athlete race filtering, and a dynamic comparison tool that reads from an embedded athlete dataset generated during the site build process. Accessibility is addressed through skip links, form semantics, ARIA descriptions, live-region announcements, motion and color-scheme preferences, and contrast/security improvements validated with WAVE and axe."

---

## 13) If a classmate asks "where is the data coming from?"

Use this exact answer:

"The published site is static. We can prepare data in CSV files and run a Python generation script to create/update HTML, but the deployed pages are fixed files. There is no live database or spreadsheet connection at runtime."

---

## 14) Quick glossary for this project

- **Static site**: pages served as files, no runtime backend logic.
- **DOM**: browser's in-memory representation of HTML.
- **`data-*` attributes**: custom per-element metadata used by JS.
- **ARIA live region**: an area screen readers monitor for updates.
- **Mobile-first**: smallest-screen styles are the base.
- **Media query**: CSS condition for applying styles at specific viewport sizes.
- **Progressive enhancement**: add advanced behavior without breaking baseline access.
