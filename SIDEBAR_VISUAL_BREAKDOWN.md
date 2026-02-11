# Sidebar Layout Visual Breakdown

## Layout Structure Diagram

### Current Layout (Expandable Mode - Collapsed)

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Banner                                │
├─────────────────────────────────────────────────────────────────┤
│                     Mobile Navigation Bar                        │
├─────────────────────────────────────────────────────────────────┤
│                       Layout Header                              │
├────┬────────────────────────────────────────────────────────────┤
│    │                                                             │
│ S  │                                                             │
│ i  │                  Main Content Area                          │
│ d  │                                                             │
│ e  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│ b  │  │ Project  │  │ Project  │  │ Project  │                 │
│ a  │  │  Card 1  │  │  Card 2  │  │  Card 3  │                 │
│ r  │  └──────────┘  └──────────┘  └──────────┘                 │
│    │                                                             │
│ 48 │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│ px │  │ Project  │  │ Project  │  │ Project  │                 │
│    │  │  Card 4  │  │  Card 5  │  │  Card 6  │                 │
│    │  └──────────┘  └──────────┘  └──────────┘                 │
│    │                                                             │
└────┴────────────────────────────────────────────────────────────┘
     ↑
     └─ Sidebar wrapper: 48px width (w-12)
```

**Status:** ✅ No overlap - Everything looks good

---

### Current Layout (Expandable Mode - Expanded) ❌ ISSUE

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Banner                                │
├─────────────────────────────────────────────────────────────────┤
│                     Mobile Navigation Bar                        │
├─────────────────────────────────────────────────────────────────┤
│                       Layout Header                              │
├────┬────────────────────────────────────────────────────────────┤
│    │                                                             │
│ ┌──┼──────────────┐                                             │
│ │  │              │         Main Content Area                   │
│ │  │   Sidebar    │                                             │
│ │  │   Content    │ ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│ │  │              │ │ Project  │  │ Project  │  │ Project  │  │
│ │  │   208px      │ │  Card 1  │  │  Card 2  │  │  Card 3  │  │
│ │  │              │ └──────────┘  └──────────┘  └──────────┘  │
│ │  │   (13rem)    │                                             │
│ │  │              │ ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│ │  │              │ │ Project  │  │ Project  │  │ Project  │  │
│ │  │              │ │  Card 4  │  │  Card 5  │  │  Card 6  │  │
│ │  │              │ └──────────┘  └──────────┘  └──────────┘  │
│ │  │              │                                             │
│ └──┼──────────────┘                                             │
│    │                                                             │
└────┴────────────────────────────────────────────────────────────┘
     ↑
     └─ Wrapper still 48px, but sidebar overlays 208px!
     
     ┌─────────────┐
     │   160px     │ ← Overlap amount (208px - 48px)
     │  OVERLAP!   │
     └─────────────┘
```

**Status:** ❌ Sidebar overlaps project cards by ~160px

**Visual Issues:**
- Sidebar text overlaps project card content
- Project cards are partially obscured
- Shadow from sidebar covers cards
- Poor user experience

---

### Desired Layout (Expandable Mode - Expanded) ✅ GOAL

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Banner                                │
├─────────────────────────────────────────────────────────────────┤
│                     Mobile Navigation Bar                        │
├─────────────────────────────────────────────────────────────────┤
│                       Layout Header                              │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                 │
│                │                                                 │
│    Sidebar     │         Main Content Area                       │
│    Content     │                                                 │
│                │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│     208px      │  │ Project  │  │ Project  │  │ Project  │     │
│                │  │  Card 1  │  │  Card 2  │  │  Card 3  │     │
│    (13rem)     │  └──────────┘  └──────────┘  └──────────┘     │
│                │                                                 │
│                │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│                │  │ Project  │  │ Project  │  │ Project  │     │
│                │  │  Card 4  │  │  Card 5  │  │  Card 6  │     │
│                │  └──────────┘  └──────────┘  └──────────┘     │
│                │                                                 │
└────────────────┴────────────────────────────────────────────────┘
                 ↑
                 └─ Main content starts at 208px (no overlap!)
```

**Status:** ✅ No overlap - Sidebar pushes content

**Benefits:**
- No content overlap
- All project cards fully visible
- Clean visual separation
- Better user experience

---

## CSS Box Model Breakdown

### Sidebar Wrapper (overflowing={true})

```
┌─────────────────────────────────────────────────────────┐
│  Wrapper Div                                            │
│  className: "w-12 relative group peer hidden md:block" │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Spacer Div                                       │ │
│  │  className: "absolute top-0 h-full w-[13rem]"    │ │
│  │  (Removed from layout flow!)                     │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │  Content Div                                │ │ │
│  │  │  className: "absolute top-0 z-30"           │ │ │
│  │  │  (Overlays on top!)                         │ │ │
│  │  │                                             │ │ │
│  │  │  [Sidebar Navigation Items]                 │ │ │
│  │  │                                             │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Width: 48px (w-12)                                    │
│  Actual sidebar width: 208px (13rem)                   │
│  Overlap: 160px                                        │
└─────────────────────────────────────────────────────────┘
```

**Key Issues:**
1. Wrapper only 48px wide
2. Spacer is absolutely positioned (doesn't affect layout)
3. Content is absolutely positioned with z-30 (overlays)

---

### Sidebar Wrapper (overflowing={false})

```
┌─────────────────────────────────────────────────────────┐
│  Wrapper Div                                            │
│  className: "relative group peer hidden md:block"      │
│  (No fixed width!)                                     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Spacer Div                                       │ │
│  │  className: "relative h-full w-[13rem]"          │ │
│  │  (In layout flow - creates space!)               │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │  Content Div                                │ │ │
│  │  │  className: "absolute top-0 z-10"           │ │ │
│  │  │                                             │ │ │
│  │  │  [Sidebar Navigation Items]                 │ │ │
│  │  │                                             │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Width: 208px (natural width from spacer)              │
│  Actual sidebar width: 208px (13rem)                   │
│  Overlap: 0px ✅                                        │
└─────────────────────────────────────────────────────────┘
```

**Key Differences:**
1. Wrapper takes natural width (208px)
2. Spacer is relatively positioned (affects layout)
3. Content still absolute but wrapper creates space

---

## Z-Index Stacking Context

### Current Stacking (Expandable Mode)

```
Layer 5: Sidebar Content (z-30) ← Overlays everything
         ┌──────────────────┐
         │  Sidebar Items   │
         │  • Home          │
         │  • Projects      │
         │  • Settings      │
         └──────────────────┘
                │
                ├─ Overlaps ─┐
                │            │
Layer 4: Sidebar Shadow      │
         (shadow-xl)         │
                             ↓
Layer 3: Project Cards (z-10 or default)
         ┌──────────┐  ┌──────────┐
         │ Project  │  │ Project  │
         │  Card 1  │  │  Card 2  │
         └──────────┘  └──────────┘
                │
Layer 2: Main Content Background
                │
Layer 1: Page Background
```

**Issue:** Sidebar at z-30 overlays project cards

---

### Desired Stacking (No Overlap)

```
Layer 3: Sidebar Content (z-10)
         ┌──────────────────┐
         │  Sidebar Items   │
         │  • Home          │
         │  • Projects      │
         │  • Settings      │
         └──────────────────┘
                             
Layer 2: Project Cards (default)
                             ┌──────────┐  ┌──────────┐
                             │ Project  │  │ Project  │
                             │  Card 1  │  │  Card 2  │
                             └──────────┘  └──────────┘
                                      │
Layer 1: Page Background              │
```

**Solution:** Sidebar and content in separate layout columns

---

## Width Calculations

### CSS Variables

```css
--sidebar-width: 13rem;        /* 208px */
--sidebar-width-icon: 3rem;    /* 48px */
--sidebar-width-mobile: 18rem; /* 288px */
```

### Tailwind Classes

```
w-12           = 48px  (3rem)
w-[13rem]      = 208px
w-[18rem]      = 288px
```

### Overlap Calculation

```
Sidebar expanded width:  208px (--sidebar-width)
Wrapper width:           48px  (w-12)
─────────────────────────────────────
Overlap amount:          160px (208 - 48)
```

### Margin Needed (Solution 2)

```
ml-[10rem]     = 160px (13rem - 3rem)
```

This pushes content by exactly the overlap amount.

---

## Responsive Breakpoints

### Mobile (< md breakpoint, < 768px)

```
┌─────────────────────────────────────┐
│         App Banner                  │
├─────────────────────────────────────┤
│      Mobile Navigation Bar          │
│  [☰ Menu]  [Logo]  [User]          │
├─────────────────────────────────────┤
│                                     │
│        Main Content Area            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Project Card 1           │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Project Card 2           │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘

Sidebar: Hidden (uses Sheet/Drawer instead)
Status: ✅ No overlap issue on mobile
```

### Tablet (md breakpoint, 768px - 1024px)

```
┌─────────────────────────────────────────────────┐
│              App Banner                         │
├─────────────────────────────────────────────────┤
│           Mobile Navigation Bar                 │
├────┬───────────────────────────────────────────┤
│    │                                            │
│ S  │         Main Content Area                  │
│ i  │                                            │
│ d  │  ┌──────────┐  ┌──────────┐              │
│ e  │  │ Project  │  │ Project  │              │
│ b  │  │  Card 1  │  │  Card 2  │              │
│ a  │  └──────────┘  └──────────┘              │
│ r  │                                            │
│    │  ┌──────────┐  ┌──────────┐              │
│    │  │ Project  │  │ Project  │              │
│    │  │  Card 3  │  │  Card 4  │              │
│    │  └──────────┘  └──────────┘              │
│    │                                            │
└────┴───────────────────────────────────────────┘

Sidebar: Visible (md:block)
Grid: 2 columns (md:grid-cols-2)
Status: ❌ Overlap issue present
```

### Desktop (lg breakpoint, 1024px+)

```
┌──────────────────────────────────────────────────────────┐
│                    App Banner                            │
├──────────────────────────────────────────────────────────┤
│                Mobile Navigation Bar                     │
├────────────┬────────────────────────────────────────────┤
│            │                                             │
│  Sidebar   │         Main Content Area                   │
│            │                                             │
│            │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│            │  │ Project  │  │ Project  │  │ Project  │ │
│            │  │  Card 1  │  │  Card 2  │  │  Card 3  │ │
│            │  └──────────┘  └──────────┘  └──────────┘ │
│            │                                             │
│            │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│            │  │ Project  │  │ Project  │  │ Project  │ │
│            │  │  Card 4  │  │  Card 5  │  │  Card 6  │ │
│            │  └──────────┘  └──────────┘  └──────────┘ │
│            │                                             │
└────────────┴────────────────────────────────────────────┘

Sidebar: Visible (md:block)
Grid: 3 columns (lg:grid-cols-3)
Status: ❌ Overlap issue present
```

---

## Transition States

### Expandable Mode - Hover Sequence

```
State 1: Collapsed (Mouse Out)
┌────┬─────────────────────────────┐
│    │                             │
│ 48 │    Main Content             │
│ px │                             │
└────┴─────────────────────────────┘

        ↓ Mouse Enter

State 2: Expanding (Transition)
┌────────┬───────────────────────────┐
│        │                           │
│  120px │    Main Content           │
│        │                           │
└────────┴───────────────────────────┘

        ↓ Transition Complete

State 3: Expanded (Mouse Over)
┌──────────────┬─────────────────────┐
│              │                     │
│    208px     │    Main Content     │
│              │    (Overlapped!)    │
└──────────────┴─────────────────────┘

        ↓ Mouse Leave

State 4: Collapsing (Transition)
┌────────┬───────────────────────────┐
│        │                           │
│  120px │    Main Content           │
│        │                           │
└────────┴───────────────────────────┘

        ↓ Transition Complete

Back to State 1: Collapsed
```

**Issue:** Main content doesn't move during transition

---

### Desired Behavior - With Dynamic Margin

```
State 1: Collapsed (Mouse Out)
┌────┬─────────────────────────────┐
│    │                             │
│ 48 │    Main Content             │
│ px │    (margin-left: 0)         │
└────┴─────────────────────────────┘

        ↓ Mouse Enter

State 2: Expanding (Transition)
┌────────┬───────────────────────────┐
│        │                           │
│  120px │    Main Content           │
│        │    (margin-left: 72px)    │
└────────┴───────────────────────────┘

        ↓ Transition Complete

State 3: Expanded (Mouse Over)
┌──────────────┬─────────────────────┐
│              │                     │
│    208px     │    Main Content     │
│              │    (margin: 160px)  │
└──────────────┴─────────────────────┘
                ↑
                └─ No overlap! ✅

        ↓ Mouse Leave

State 4: Collapsing (Transition)
┌────────┬───────────────────────────┐
│        │                           │
│  120px │    Main Content           │
│        │    (margin-left: 72px)    │
└────────┴───────────────────────────┘

        ↓ Transition Complete

Back to State 1: Collapsed
```

**Solution:** Main content margin animates with sidebar width

---

## Component Hierarchy

```
DefaultLayout
├── AppBannerWrapper
├── MobileNavigationBar
├── LayoutHeader
└── div.flex (Main Content Area)
    ├── Sidebar (if not account page)
    │   └── SidebarMotion
    │       ├── overflowing={sidebarBehaviour === 'expandable'}
    │       ├── SidebarContent
    │       │   ├── SidebarContentPrimitive
    │       │   │   ├── ProjectLinks (if projectRef)
    │       │   │   └── OrganizationLinks (if no projectRef)
    │       │   └── SidebarFooter
    │       │       └── SidebarGroup
    │       │           └── DropdownMenu (Sidebar control)
    │       └── SidebarRail
    │
    └── ResizablePanelGroup
        ├── ResizablePanel (Content)
        │   └── div.overflow-y-auto
        │       └── OrganizationLayout
        │           └── PageLayout
        │               └── ScaffoldContainer
        │                   └── ScaffoldSection
        │                       └── ProjectList
        │                           └── ul.grid (Project Cards)
        │                               ├── ProjectCard
        │                               ├── ProjectCard
        │                               └── ...
        │
        └── LayoutSidebar (Right sidebar)
```

**Issue Location:** Between `Sidebar` and `ResizablePanelGroup`

---

## Summary

The sidebar overlay issue is caused by:

1. **Fixed wrapper width** (48px) when `overflowing={true}`
2. **Absolute positioning** of spacer and content divs
3. **High z-index** (z-30) on expanded sidebar
4. **No dynamic margin** on main content

The visual diagrams above show:
- Current broken state (overlap)
- Desired state (no overlap)
- CSS box model breakdown
- Z-index stacking issues
- Responsive behavior
- Transition states

Solutions involve either:
- Changing default behavior (simple)
- Adding dynamic margin (recommended)
- Refactoring CSS architecture (long-term)
