---
name: Tactical Intelligence & Surveillance
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#a078ff'
  on-tertiary-container: '#340080'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
  surface-base: '#0B0F19'
  surface-canvas: '#0D1322'
  surface-card: '#131B2E'
  surface-card-elevated: '#162035'
  border-subtle: '#1E293B'
  border-tactical: '#26354A'
  border-glow: '#3B82F633'
  threat-critical: '#EF4444'
  threat-critical-glow: '#EF44443D'
  threat-high: '#F97316'
  threat-high-glow: '#F9731633'
  threat-medium: '#F59E0B'
  threat-normal: '#10B981'
  threat-normal-glow: '#10B9812E'
  intel-anpr: '#A855F7'
  intel-anpr-glow: '#A855F733'
  text-primary: '#F8FAFC'
  text-secondary: '#94A3B8'
  text-tertiary: '#64748B'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  data-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  label-tactical:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.375rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.25rem
  space-2xl: 1.5rem
  space-3xl: 2rem
  sidebar-width: 240px
  sidebar-collapsed: 68px
  hud-gap: 0.75rem
  card-padding: 1rem
---

## Brand & Style

This design system is engineered for mission-critical defense, tactical operations centers (TOC), and high-security border monitoring environments. Operating 24/7 in low-light command posts and multi-screen video walls, the UI serves operators who must ingest high-velocity real-time telemetry, detect anomalies within split seconds, and execute swift triage under immense cognitive load.

The design movement is **Tactical Glassmorphism meets HUD Mission-Control**. It eliminates decorative visual clutter in favor of an ergonomic, deep-space canvas where background surfaces recede into slate-navy darkness, allowing critical status signals, tracking envelopes, and live sensor overlays to command immediate visual priority. Structural clarity is reinforced by razor-thin container seams, subtle backplate luminescences, and monospace telemetry readouts.

## Colors

The color architecture is built exclusively for a dark-first environment. Neutral foundations begin with deep midnight navy (`#0B0F19`), rising through stepped surface elevations (`#0D1322`, `#131B2E`) to maintain spatial hierarchy without stark lightness jumps.

Interactive controls and core system highlights utilize electric tactical blues (`#3B82F6`, `#38BDF8`). Semantic alerting is strictly disciplined:
- **Critical / Intrusion Breach (`#EF4444`):** Highest alert tier, paired with semi-transparent warning halos for live bounding boxes and urgent stream alerts.
- **High Alert / Suspicious Event (`#F97316`):** Secondary alert tier for unknown face detections and rapid perimeter movements.
- **Medium / Caution (`#F59E0B`):** Loitering warnings and system threshold notifications.
- **Normal / Operational (`#10B981`):** Verified clearance, live camera status, and nominal hardware telemetry.
- **Intelligence / ANPR (`#A855F7`):** License plate tracking, biometric hits, and specialized intelligence markers.

## Typography

The typographical strategy employs dual type systems tailored for military/surveillance interfaces:
1. **Primary Interface:** High-legibility grotesque sans-serif (`Inter`) for navigational menus, incident summaries, and dashboard narrative headings.
2. **Tactical Telemetry:** Fixed-width monospaced engine (`JetBrains Mono`) for bounding box tags, confidence percentages, RTSP timestamps, coordinates, plate numbers, and FPS telemetry. 

Numeric tabular alignments eliminate jittering during real-time data streaming. All tactical HUD badges and status pills use capitalized micro-typography with letter-spacing for rapid visual scanning under low ambient light.

## Layout & Spacing

The layout is built upon a dense, screen-space optimizing 12-column grid system tuned for command centers, wide-format surveillance walls, and high-density operator terminals.

- **Desktop & Multi-Monitor Ops:** Fixed-width left navigation rail (`240px` expanded, `68px` iconized), adjacent to an adaptive modular canvas. Main content divides into top telemetry metric strips, an interactive central multi-camera matrix (configurable 2x2, 3x3, or 1+5 focus layout), and a right-aligned real-time triage sidebar (`340px` to `380px`).
- **Rhythm & Padding:** Uses a standard `4px` / `8px` baseline with tight `12px` (`0.75rem`) gutters between surveillance feeds and diagnostic modules to maximize live canvas area without wasted empty space.
- **Responsive Adaptability:** On lower resolutions or tablets, the active alert triage column docks into a tabbed bottom drawer, while the camera grid automatically reflows to single-stream focus or 2-column stacked feeds.

## Elevation & Depth

Visual depth avoids excessive drop shadows, which cause blur and distraction in tactical environments. Instead, depth is established through **calibrated surface luminescence, crisp hairline strokes, and optical alert glows**:

- **Ground Plane (`#0B0F19`):** The primary chassis layer behind all structural modules.
- **Card Containers (`#131B2E`):** Distinct structural zones framed with a precise `1px` border (`#1E293B`).
- **Elevated Interactive Overlays (`#162035`):** Modals, camera stream controls, and popover menus bordered with tactical slate (`#26354A`) and supported by a subtle directional shadow (`0 8px 24px rgba(0, 0, 0, 0.5)`).
- **HUD Live Layers:** Camera bounding boxes and video overlay pills employ a semi-transparent dark backdrop (`rgba(11, 15, 25, 0.75)`) with backdrop blur (`blur(4px)`). Active alerts project a focused luminous outer glow matching their threat severity tier (`0 0 12px var(--threat-glow)`).

## Shapes

The geometric architecture uses tight, restrained corner radiuses (`roundedness: 1` = `0.25rem` / `4px` to `0.5rem` / `8px`). This preserves a precision-tooled, militarized feel and prevents the casual softness of consumer web products.

- **Containers & Stream Frames:** Formed with `8px` (`0.5rem`) outer rounding and crisp `1px` structural borders.
- **HUD Badges, Tags, & Status Pills:** Configured with `4px` (`0.25rem`) corners for tight visual packing over video feeds.
- **Bounding Boxes & Video Annotation Vectors:** Strict `0px` sharp rectilinear corners with high-contrast outlines and micro-corner brackets for targeting feel.

## Components

### 1. Tactical Telemetry Stat Cards
- Enclosed in `#131B2E` with a `1px` border of `#1E293B`.
- Contains an icon container featuring a desaturated tinted background (`rgba(59, 130, 246, 0.15)`) with a high-saturation semantic glyph.
- Large numeric metric set in `JetBrains Mono` or bold `Inter`, paired with secondary percentage trends (e.g., green `↑ 12% vs yesterday`).

### 2. Multi-Camera Surveillance Grid Feeds
- 16:9 aspect ratio viewports framed with `#1E293B`.
- **Stream Header Overlay:** Pill positioned at top-left containing live status indicator (pulsing green dot `#10B981`) and camera name (`BOP Alpha - North Gate`). Top-right displays synced hardware timestamp in `data-mono-sm`.
- **Bounding Box Overlays:** Color-coded 2px borders with matching label tags:
  - Detection category and confidence (e.g., `Person 95%`, `Intrusion 93%`, `Vehicle 97%`).
  - Label tag anchored at the top-left of the bounding box with `rgba(0,0,0,0.8)` or semantic flood fill and crisp white monospace typography.

### 3. Real-Time Alert Stream & Triage Panel
- Vertically stacked incident cards with a left severity accent border (`3px` solid `#EF4444` for breach, `#F97316` for unknown face, `#A855F7` for ANPR).
- Thumbnail snapshot of the detection frame on the right side (`56px × 36px` with border radius `4px`).
- Monospace timestamp and checkpoint location metadata.
- Contextual action bar appearing on hover or focus (`Acknowledge`, `Escalate`, `Flag`).

### 4. Tactical Minimap Component
- Dark satellite / vector cartography skin matching `#0B0F19` and `#131B2E`.
- Camera field-of-view (FOV) cones rendered as semi-transparent cyan vector fans (`#38BDF822`).
- Checkpoint markers and live pulsing incident markers colored according to active threat tiers.

### 5. Buttons & Controls
- **Primary Tactical Action:** Background `#2563EB`, text `#FFFFFF`, subtle inner highlight, active state `#1D4ED8`.
- **Secondary / Ghost Tactical Action:** Background `rgba(30, 41, 59, 0.6)`, border `1px solid #26354A`, hover border `#38BDF8`.
- **Destructive / Emergency Action:** Background `#EF4444`, text `#FFFFFF`, alert pulse animation.
- All buttons maintain a compact `32px` or `36px` height with `JetBrains Mono` or medium `Inter` typography.

### 6. System Health Meters
- Compact resource strips for AI Inference FPS, GPU Load, Storage, and Network Bandwidth.
- Progress tracks in `#1E293B` filled with tactical green (`#10B981`) transitioning to amber/red under threshold saturation.