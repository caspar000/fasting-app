# Design Audit Report — Fasting App

**Date:** March 15, 2026
**File:** `design.pen`
**Screens audited:** Dashboard (Active, Idle, Backdate), Calendar, Protocols, Statistics, Settings
**Design system:** Tailwind-based palette, Inter + DM Sans typography

---

## Anti-Patterns Verdict

**Pass.** The design no longer looks AI-generated. The single-hue blue gradient (blue-500 → blue-700) avoids the telltale blue-to-purple AI palette. The blue → indigo → violet zone progression is purposeful and semantically meaningful. Clean Tailwind grays, no glassmorphism, no gradient text, no generic hero metrics dashboard. The design looks like a real product.

**One flag:** The zone bar's 4-color segment pattern is mildly formulaic, but it's functionally justified (metabolic zones) so it gets a pass.

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 2 |
| Medium | 4 |
| Low | 3 |
| **Total** | **10** |

**Quality score: 8/10** — Significant improvement from the original 6/10. Design system is established, tokens are applied, accessibility was improved. Remaining issues are mostly about variable hygiene and a few remaining hardcoded values.

**Top issues:**
1. Variable definitions have accumulated stale values from 3 palette iterations — needs cleanup
2. Zone bar white text on light blue fails WCAG AA contrast
3. Many accent/zone colors remain hardcoded (won't adapt to dark mode)

---

## Detailed Findings

### Critical Issues

#### C1: Stale variable accumulation
- **Location:** All design variables
- **Category:** Theming
- **Description:** Variable definitions have accumulated stale values from 3 palette iterations (original, warm organic, Tailwind). Each color variable has 4-6 value entries instead of 2 clean themed values. For example, `accent-blue` contains `#3B82F6`, `#3B82F6`, `#C17F24`, `#2563EB` — only the last is the active Tailwind value.
- **Impact:** Variables are bloated and confusing. Any programmatic access will get wrong values. Dark mode may resolve to the wrong palette.
- **Recommendation:** Clean all variables to only contain the active Tailwind values with clean light/dark theme entries.
- **Suggested command:** `/normalize`

---

### High-Severity Issues

#### H1: Zone bar text contrast failure
- **Location:** Dashboard zone bar (Fed/Fat Burn/Ketosis/Deep Ketosis labels)
- **Category:** Accessibility
- **Description:** White text (#FFFFFF) on `#60A5FA` (blue-400) for the "Fed" zone has a contrast ratio of ~2.5:1. Fails WCAG AA minimum of 4.5:1.
- **Impact:** Users with visual impairments cannot read zone labels.
- **WCAG:** 1.4.3 (Contrast Minimum)
- **Recommendation:** Darken zone background colors, increase text size, or use a darker shade of each color for text instead of pure white.
- **Suggested command:** `/harden`

#### H2: Hardcoded accent colors across screens
- **Location:** Zone bar fills, calendar day fills, chart bar gradients
- **Category:** Theming
- **Description:** Many accent colors are still hardcoded hex values rather than design tokens. Zone bar uses `#60A5FA`, `#3B82F6`, `#6366F1`, `#8B5CF6`. Calendar days use `#DBEAFE`, `#BFDBFE`. Chart bars use hardcoded gradients.
- **Impact:** These elements won't update with theme changes. Dark mode will show bright colored cells on dark backgrounds without proper adaptation.
- **Recommendation:** Create zone-specific and calendar-specific variables for these colors.
- **Suggested command:** `/normalize`

---

### Medium-Severity Issues

#### M1: "Change protocol" link touch target
- **Location:** Dashboard (Idle state)
- **Category:** Accessibility
- **Description:** The "Change protocol" interactive text link uses 12px text. The tap area is likely smaller than the 44px minimum.
- **Impact:** Hard to tap on mobile, especially one-handed use.
- **WCAG:** 2.5.5 (Target Size)
- **Recommendation:** Wrap in a frame with minimum 44px height padding.
- **Suggested command:** `/adapt`

#### M2: Calendar legend text readability
- **Location:** Calendar screen legend
- **Category:** Accessibility
- **Description:** Legend text ("Completed", "Started", "Today") at 11px with `$text-tertiary` color. At the tertiary value `#6B7280` on `#F9FAFB` background, contrast is ~4.2:1 — borderline for small text.
- **Impact:** Marginal readability for legend items.
- **Recommendation:** Increase font size to 12px or use `$text-secondary` color.
- **Suggested command:** `/harden`

#### M3: Settings content clipping
- **Location:** Settings screen
- **Category:** Responsive
- **Description:** Content still clips at the bottom. The "Export Data" row is truncated by the tab bar. No scroll indicator in the design.
- **Impact:** Users might not realize more content exists below the visible area.
- **Recommendation:** Add a subtle gradient fade at the bottom of the content area, or show the full content by reducing spacing.
- **Suggested command:** `/polish`

#### M4: "Adjust" link discoverability
- **Location:** Dashboard (Active state), under "Started" time
- **Category:** Accessibility
- **Description:** The "Adjust" link with pencil icon is very small (11px text). Low discoverability for the backdate feature.
- **Impact:** Users who need to backdate their fast start time may not notice this feature exists.
- **Recommendation:** Consider making the entire "Started / 11:15 PM" row tappable, or increase the link size.
- **Suggested command:** `/clarify`

---

### Low-Severity Issues

#### L1: Calendar component divergence
- **Location:** Calendar screen vs Design System component
- **Category:** Consistency
- **Description:** The Calendar on the History screen uses inline day headers, but the Calendar component in the Design System now has its own built-in headers and month navigation. These two implementations will diverge over time.
- **Impact:** Maintenance burden — changes to one won't affect the other.
- **Recommendation:** Replace the screen's calendar with an instance of the Design System component.
- **Suggested command:** `/normalize`

#### L2: PRO badge gradient inconsistency
- **Location:** Statistics screen header
- **Category:** Consistency
- **Description:** The PRO badge uses an amber gradient (`#F59E0B` → `#D97706`) which is hardcoded and doesn't use design token variables.
- **Impact:** Badge won't adapt to theme changes.
- **Recommendation:** Define a `pro-badge` gradient variable or accept as intentional branding.
- **Suggested command:** `/extract`

#### L3: Typo in Protocol Card
- **Location:** Protocols screen, default protocol card
- **Category:** Content
- **Description:** The label reads "Default Protocal" — should be "Default Protocol".
- **Impact:** Minor but visible on a prominent UI element.
- **Recommendation:** Fix the typo.
- **Suggested command:** `/polish`

---

## Patterns & Systemic Issues

1. **Variable accumulation** — The most significant systemic issue. Three palette iterations (original, warm, Tailwind) left behind stale values in every variable. Variables need a complete cleanup to only contain the active Tailwind palette.

2. **Zone/calendar colors remain hardcoded** — While structural elements (backgrounds, text, borders) use design tokens, the zone bar, calendar day fills, and chart bar colors are all hardcoded hex values. These should be variable-ized for dark mode support.

3. **Dashboard screens diverged** — The Dashboard, Dashboard Idle, and Dashboard Backdate are separate copies rather than component instances. Changes to one don't propagate to others.

---

## Positive Findings

- **Clean, professional palette** — Tailwind blue reads as intentional and polished, not AI-generated
- **Blue → purple zone gradient** is semantically meaningful and visually distinctive
- **Comprehensive design system** with 12+ reusable components, color swatches, typography scale, and live examples
- **Three Dashboard states** (Idle, Active, Backdate) cover the complete user journey
- **Strong typographic hierarchy** — DM Sans for display numerals, Inter for body, clear size/weight progression
- **Consistent card treatment** — white surfaces, 16px radius, subtle shadows throughout
- **Touch targets** mostly meet 44px minimum after previous adaptation pass
- **Calendar legend** clearly explains day state colors
- **Backdate UX** is well-designed — zero friction for normal use, discoverable for edge case

---

## Recommendations by Priority

### 1. Immediate
- Clean up stale variable values (C1)

### 2. Short-term
- Fix white-on-light-blue contrast in zone bar (H1)
- Create variables for zone/calendar hardcoded colors (H2)
- Fix "Protocal" typo (L3)

### 3. Medium-term
- Improve "Adjust" link discoverability (M4)
- Address Settings clipping (M3)
- Increase legend text size (M2)
- Ensure "Change protocol" meets touch target minimum (M1)

### 4. Long-term
- Unify Dashboard screen variants through component composition (L1)
- Formalize PRO badge styling (L2)

---

## Suggested Commands for Fixes

| Command | Issues Addressed | Description |
|---------|-----------------|-------------|
| `/normalize` | C1, H2, L1 | Clean stale variables, create zone color tokens, unify component usage |
| `/harden` | H1, M2 | Fix zone bar contrast, improve legend readability |
| `/polish` | M3, M4, L3 | Fix clipping, improve Adjust link, fix typo |
| `/adapt` | M1 | Ensure Change Protocol link meets touch target minimum |
