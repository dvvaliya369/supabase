# Sidebar Overlay Fix - Implementation Plan

## Overview

This document provides a detailed implementation plan to fix the sidebar overlay issue where the sidebar overlaps main content (project cards) when in "expandable" mode.

---

## Problem Statement

When the sidebar is configured in "expandable" mode (expand on hover), it overlays the main content instead of pushing or resizing it. This creates visual overlap between sidebar text and project content.

**Root Cause:** The sidebar wrapper only takes up 48px of layout space when `overflowing={true}`, but the expanded sidebar is 208px wide, causing a ~160px overlap.

---

## Proposed Solutions

### Solution 1: Change Default Sidebar Behavior (Quick Fix)

**Complexity:** Low  
**Impact:** Low  
**Time Estimate:** 5 minutes  

#### Changes Required

**File:** `/vercel/sandbox/apps/studio/components/interfaces/Sidebar.tsx`

```typescript
// Line 50 - Change default behavior
export const DEFAULT_SIDEBAR_BEHAVIOR = 'open'  // Changed from 'expandable'
```

#### Pros
- ✅ One-line change
- ✅ No CSS modifications needed
- ✅ No layout refactoring required
- ✅ Immediate fix

#### Cons
- ❌ Removes the space-saving expandable behavior
- ❌ Sidebar always takes full width
- ❌ Less screen space for content

---

### Solution 2: Dynamic Margin Adjustment (Recommended)

**Complexity:** Medium  
**Impact:** Medium  
**Time Estimate:** 2-3 hours  

#### Implementation Steps

##### Step 1: Add Sidebar State to DefaultLayout

**File:** `/vercel/sandbox/apps/studio/components/layouts/DefaultLayout.tsx`

```typescript
import { useSidebar } from 'ui'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { LOCAL_STORAGE_KEYS } from 'common'

export const DefaultLayout = ({
  children,
  headerTitle,
  hideMobileMenu,
}: PropsWithChildren<DefaultLayoutProps>) => {
  const { ref } = useParams()
  const router = useRouter()
  const appSnap = useAppStateSnapshot()
  
  // Add these lines
  const { state: sidebarState } = useSidebar()
  const [sidebarBehaviour] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.SIDEBAR_BEHAVIOR,
    'expandable'
  )
  
  // Calculate dynamic margin
  const isExpandable = sidebarBehaviour === 'expandable'
  const isExpanded = sidebarState === 'expanded'
  const shouldPushContent = isExpandable && isExpanded
  
  // ... rest of component
```

##### Step 2: Apply Dynamic Classes to Main Content

```typescript
<div className="flex flex-1 w-full overflow-y-hidden">
  {!router.pathname.startsWith('/account') && <Sidebar />}
  
  <ResizablePanelGroup
    direction="horizontal"
    className={cn(
      "h-full w-full overflow-x-hidden flex-1 flex flex-row gap-0",
      // Add dynamic margin
      shouldPushContent && "ml-[10rem]",  // 160px = 13rem - 3rem
      // Add smooth transition
      "transition-[margin] duration-200 ease-linear"
    )}
    autoSaveId="default-layout-content"
  >
    {/* ... rest of content */}
  </ResizablePanelGroup>
</div>
```

##### Step 3: Update Sidebar Component for Smooth Transitions

**File:** `/vercel/sandbox/apps/studio/components/interfaces/Sidebar.tsx`

```typescript
// Update transition timing to match content transition
<SidebarMotion
  {...props}
  transition={{ delay: 0, duration: 0.2 }}  // Changed from 0.4s to 0.2s
  overflowing={sidebarBehaviour === 'expandable'}
  collapsible="icon"
  variant="sidebar"
  onMouseEnter={() => {
    if (sidebarBehaviour === 'expandable') setOpen(true)
  }}
  onMouseLeave={() => {
    if (sidebarBehaviour === 'expandable') setOpen(false)
  }}
>
```

#### Pros
- ✅ Maintains expandable behavior
- ✅ Prevents content overlap
- ✅ Smooth transitions
- ✅ Preserves all three sidebar modes

#### Cons
- ❌ Content shifts on hover (may be jarring)
- ❌ Requires state management
- ❌ More complex implementation

---

### Solution 3: Modify Sidebar CSS Architecture (Long-term)

**Complexity:** High  
**Impact:** High  
**Time Estimate:** 1-2 days  

#### Implementation Steps

##### Step 1: Refactor Sidebar Component

**File:** `/vercel/sandbox/packages/ui/src/components/shadcn/ui/sidebar.tsx`

```typescript
// Lines 191-195 - Update wrapper
className={cn(
  // Remove fixed width, use dynamic width
  overflowing && state === 'collapsed' ? 'w-12' : 'w-[--sidebar-width]',
  'relative group peer hidden md:block text-sidebar-foreground',
  'flex-shrink-0',
  // Add smooth transition
  'transition-[width] duration-200 ease-linear'
)}
```

```typescript
// Lines 199-208 - Update spacer
className={cn(
  'relative',  // Always relative, never absolute
  'duration-200 h-full transition-[width] ease-linear',
  overflowing && state === 'collapsed' ? 'w-12' : 'w-[--sidebar-width]',
  'group-data-[collapsible=offcanvas]:w-0',
  // ... rest of classes
)}
```

```typescript
// Lines 211-226 - Update content
className={cn(
  'relative',  // Change from absolute to relative
  'duration-200 inset-y-0 z-10 hidden transition-[width] ease-linear md:flex',
  overflowing && state === 'collapsed' ? 'w-12' : 'w-[--sidebar-width]',
  overflowing && state === 'expanded' && 'shadow-xl',
  // Remove absolute positioning classes
  // ... rest of classes
)}
```

##### Step 2: Test All Sidebar Variants

Test the following combinations:
- ✅ Sidebar variant: sidebar, floating, inset
- ✅ Collapsible mode: offcanvas, icon, none
- ✅ Side: left, right
- ✅ Overflowing: true, false

##### Step 3: Update Documentation

Update component documentation to reflect new behavior.

#### Pros
- ✅ Proper layout flow
- ✅ No content shifting
- ✅ Sidebar naturally pushes content
- ✅ More maintainable long-term

#### Cons
- ❌ Major refactoring required
- ❌ Risk of breaking other layouts
- ❌ Extensive testing needed
- ❌ May affect other projects using this component

---

### Solution 4: CSS Grid Layout (Alternative)

**Complexity:** High  
**Impact:** High  
**Time Estimate:** 2-3 days  

#### Implementation Steps

##### Step 1: Restructure DefaultLayout

**File:** `/vercel/sandbox/apps/studio/components/layouts/DefaultLayout.tsx`

```typescript
<div className="flex flex-col h-screen w-screen">
  <AppBannerWrapper />
  <div className="flex-shrink-0">
    <MobileNavigationBar hideMobileMenu={hideMobileMenu} />
    <LayoutHeader
      showProductMenu={showProductMenu}
      headerTitle={headerTitle}
      backToDashboardURL={
        router.pathname.startsWith('/account') ? backToDashboardURL : undefined
      }
    />
  </div>
  
  {/* Change from flex to grid */}
  <div className="grid grid-cols-[auto_1fr] flex-1 w-full overflow-y-hidden">
    {!router.pathname.startsWith('/account') && <Sidebar />}
    
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full overflow-x-hidden"
      autoSaveId="default-layout-content"
    >
      {/* ... content */}
    </ResizablePanelGroup>
  </div>
</div>
```

##### Step 2: Update Sidebar to Work with Grid

```typescript
// Sidebar should naturally take its width in grid
// No changes needed to sidebar component
```

#### Pros
- ✅ Grid handles width changes automatically
- ✅ Clean layout structure
- ✅ No manual margin calculations

#### Cons
- ❌ Major layout refactor
- ❌ May affect other layouts
- ❌ Requires extensive testing
- ❌ Learning curve for grid layout

---

## Recommended Approach

### Phase 1: Immediate Fix (Solution 1)
**Timeline:** Immediate  
**Effort:** Minimal  

Change default sidebar behavior to "open" to prevent overlay while planning long-term solution.

### Phase 2: Short-term Improvement (Solution 2)
**Timeline:** 1 week  
**Effort:** Medium  

Implement dynamic margin adjustment to maintain expandable behavior while preventing overlap.

### Phase 3: Long-term Refactor (Solution 3 or 4)
**Timeline:** 1-2 months  
**Effort:** High  

Refactor sidebar CSS architecture or migrate to CSS Grid for a more robust solution.

---

## Testing Plan

### Unit Tests

1. **Sidebar Component Tests**
   - Test all three modes: open, closed, expandable
   - Test state transitions
   - Test prop combinations

2. **Layout Tests**
   - Test sidebar visibility on different routes
   - Test responsive breakpoints
   - Test with/without sidebar

### Integration Tests

1. **Visual Regression Tests**
   - Capture screenshots of all sidebar states
   - Compare before/after changes
   - Test on multiple screen sizes

2. **User Interaction Tests**
   - Test hover behavior
   - Test click behavior
   - Test keyboard navigation

### Manual Testing Checklist

- [ ] Sidebar opens/closes smoothly
- [ ] No content overlap in any mode
- [ ] Transitions are smooth (no jank)
- [ ] Mobile drawer works correctly
- [ ] Project cards are fully visible
- [ ] Sidebar shadow doesn't obscure content
- [ ] Works on all supported browsers
- [ ] Works at different zoom levels
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

---

## Rollback Plan

### If Solution 2 Causes Issues

1. Revert DefaultLayout.tsx changes
2. Revert Sidebar.tsx transition changes
3. Fall back to Solution 1 (change default behavior)

### If Solution 3 Causes Issues

1. Revert sidebar.tsx changes
2. Run full regression test suite
3. Check all projects using the sidebar component
4. Fall back to Solution 2

---

## Performance Considerations

### Solution 2 (Dynamic Margin)

**Potential Issues:**
- Layout thrashing on rapid hover
- Reflow on margin change

**Mitigations:**
- Use CSS transitions (GPU accelerated)
- Debounce hover events if needed
- Use `will-change: margin` for optimization

### Solution 3 (CSS Refactor)

**Potential Issues:**
- Reflow on width change
- Paint on every transition

**Mitigations:**
- Use `transform` instead of `width` if possible
- Use `will-change: width` for optimization
- Minimize repaints with proper CSS

---

## Accessibility Considerations

### Keyboard Navigation

- Ensure sidebar can be toggled via keyboard
- Maintain focus management
- Provide keyboard shortcuts

### Screen Readers

- Announce sidebar state changes
- Provide proper ARIA labels
- Ensure content is accessible when sidebar overlaps

### Motion Preferences

```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<SidebarMotion
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
  // ...
/>
```

---

## Documentation Updates

### Component Documentation

Update sidebar component docs to explain:
- Overflowing behavior
- Layout implications
- Best practices for usage

### Developer Guide

Create guide explaining:
- How sidebar layout works
- When to use each mode
- How to customize behavior

---

## Success Criteria

### Must Have
- ✅ No content overlap in any sidebar mode
- ✅ Smooth transitions between states
- ✅ Works on all supported screen sizes
- ✅ No performance degradation

### Should Have
- ✅ Maintains expandable behavior option
- ✅ Consistent with design system
- ✅ Accessible to all users
- ✅ Well-documented

### Nice to Have
- ✅ Configurable transition timing
- ✅ Custom width options
- ✅ Animation preferences

---

## Timeline

### Week 1
- Implement Solution 1 (immediate fix)
- Plan Solution 2 implementation
- Create test plan

### Week 2
- Implement Solution 2
- Run integration tests
- Gather user feedback

### Month 2-3
- Plan Solution 3 or 4
- Implement long-term refactor
- Full regression testing
- Documentation updates

---

## Resources Required

### Development
- 1 Frontend Developer (full-time)
- 1 QA Engineer (part-time)

### Design
- 1 UX Designer (for review)

### Tools
- Visual regression testing tool
- Browser testing suite
- Performance monitoring

---

## Risk Assessment

### High Risk
- Breaking other layouts that use sidebar component
- Performance degradation on low-end devices
- Accessibility regressions

### Medium Risk
- User confusion with behavior changes
- Inconsistent behavior across browsers
- Mobile layout issues

### Low Risk
- Minor visual glitches
- Transition timing issues
- Documentation gaps

---

## Conclusion

The recommended approach is to implement **Solution 2 (Dynamic Margin Adjustment)** as it provides the best balance of:
- Quick implementation
- Maintains current UX
- Prevents content overlap
- Low risk of breaking changes

This can be followed by **Solution 3 (CSS Refactor)** in the long term for a more robust and maintainable solution.
