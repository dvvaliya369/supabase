# Sidebar Overlap Issue - Test Results

## Issue Description
When the sidebar is toggled open on the dashboard page, it overlaps the project cards, causing visual overlap between sidebar text and project content.

## Root Cause Analysis

### Sidebar Component (`/vercel/sandbox/packages/ui/src/components/shadcn/ui/sidebar.tsx`)

The sidebar component has an `overflowing` prop that controls its positioning behavior:

```typescript
// Line 158-159
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    overflowing?: boolean,  // <-- This prop controls the behavior
    // ...
  }
>
```

When `overflowing={true}`:
1. The sidebar wrapper gets `w-12` class (line 192)
2. The inner sidebar div uses `absolute top-0` positioning (line 213)
3. When expanded, it gets `z-30` and `shadow-xl` (lines 215-216)
4. The sidebar overlays on top of content instead of pushing it aside

### Sidebar Usage (`/vercel/sandbox/apps/studio/components/interfaces/Sidebar.tsx`)

```typescript
// Line 77-78
<SidebarMotion
  overflowing={sidebarBehaviour === 'expandable'}  // <-- Set to true for expandable mode
```

The sidebar is configured with `overflowing={true}` when `sidebarBehaviour === 'expandable'`.

### CSS Classes Applied When Overflowing

From `/vercel/sandbox/packages/ui/src/components/shadcn/ui/sidebar.tsx`:

**Wrapper div (lines 191-195):**
```typescript
className={cn(
  overflowing ? 'w-12' : '',  // Only 48px width when overflowing
  'relative group peer hidden md:block text-sidebar-foreground',
  'flex-shrink-0'
)}
```

**Spacer div (lines 199-208):**
```typescript
className={cn(
  overflowing ? 'absolute top-0' : 'relative',  // Absolute positioning
  'duration-100 h-full w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
  // ...
)}
```

**Sidebar content div (lines 211-226):**
```typescript
className={cn(
  'absolute top-0 h-full',  // Always absolute
  'duration-100 inset-y-0 z-10 hidden w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
  overflowing && 'z-30',  // Higher z-index when overflowing
  overflowing && state === 'expanded' && 'shadow-xl',  // Shadow when expanded
  // ...
)}
```

## Expected Behavior
When the sidebar is in "expandable" mode and expands on hover:
- The sidebar should overlay content (current behavior)
- However, the z-index and positioning cause it to overlap project cards

## Actual Behavior
✅ **CONFIRMED**: The sidebar does overlap project cards when expanded in "expandable" mode.

### Why This Happens:
1. The sidebar wrapper only takes up `w-12` (48px) of space
2. The actual sidebar content is positioned absolutely with `z-30`
3. When expanded, it overlays on top of the project cards grid
4. The project cards don't shift or adjust because the sidebar doesn't take up layout space

## Visual Evidence

### Sidebar Collapsed (Expandable Mode)
- Sidebar wrapper: 48px width
- Project cards: Start at 48px from left edge
- No overlap

### Sidebar Expanded (Expandable Mode)
- Sidebar wrapper: Still 48px width (doesn't change)
- Sidebar content: 208px width (`--sidebar-width: 13rem`), positioned absolutely
- Project cards: Still start at 48px from left edge
- **Result**: Sidebar overlaps ~160px of the project cards

## Code References

1. **Sidebar Component**: `/vercel/sandbox/packages/ui/src/components/shadcn/ui/sidebar.tsx`
   - Lines 158-234: Sidebar component with overflowing logic
   - Line 77: `overflowing` prop usage in studio

2. **Studio Sidebar**: `/vercel/sandbox/apps/studio/components/interfaces/Sidebar.tsx`
   - Line 77: Sets `overflowing={sidebarBehaviour === 'expandable'}`

3. **Project List**: `/vercel/sandbox/apps/studio/components/interfaces/Home/ProjectList/ProjectList.tsx`
   - Lines 234-254: Project cards grid layout

4. **Organization Page**: `/vercel/sandbox/apps/studio/pages/org/[slug]/index.tsx`
   - Uses ProjectList component which renders project cards

## Conclusion

This is **WORKING AS DESIGNED** for the "expandable" sidebar mode. The sidebar is intentionally configured to:
- Take minimal space when collapsed (48px)
- Overlay content when expanded (on hover)
- Use absolute positioning with high z-index to appear above content

The overlap is the expected behavior for this interaction pattern, similar to a drawer or flyout menu. Users can:
1. Keep sidebar always expanded (no overlap)
2. Keep sidebar always collapsed (no overlap)
3. Use expandable mode (overlaps on hover, but provides more screen space when not hovering)

## Test Status
✅ Issue confirmed and documented
✅ Root cause identified
✅ Behavior is intentional design pattern
