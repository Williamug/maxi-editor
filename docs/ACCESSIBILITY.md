# Accessibility Guide

MaxiEditor is built with accessibility in mind, following WCAG 2.1 Level AA guidelines.

## Accessibility Features

### 1. Keyboard Navigation ⌨️

**Full keyboard support:**
- Navigate toolbar with `Tab` and `Shift+Tab`
- Navigate toolbar buttons with `Arrow keys`
- Activate buttons with `Enter` or `Space`
- All formatting available via keyboard shortcuts

**Keyboard Shortcuts:**
- See [KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md) for complete list
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+Z` - Undo
- etc.

### 2. Screen Reader Support 🔊

**ARIA Labels:**
- All toolbar buttons have descriptive labels
- Editor has `role="textbox"` and `aria-multiline="true"`
- Toolbar has `role="toolbar"`
- Active states announced with `aria-pressed`

**Live Announcements:**
- Format changes announced (e.g., "Bold applied")
- Content changes announced
- Error messages announced

**Example:**
```javascript
// Automatically announces to screen readers
editor.executeCommand('bold');
// Screen reader: "Bold applied"
```

### 3. High Contrast Mode 🎨

**Automatic Detection:**
- Detects Windows High Contrast mode
- Detects `prefers-contrast: high` media query
- Automatically applies high contrast styles

**Features:**
- Increased border thickness
- High contrast colors
- Clear focus indicators
- No reliance on color alone

### 4. Focus Management 🎯

**Visible Focus Indicators:**
- 3px blue outline on focused elements
- 2px offset for clarity
- Works with keyboard navigation

**Focus Trapping:**
- Modals trap focus within dialog
- `Tab` cycles through modal elements
- `Escape` closes modal and returns focus

**Skip Links:**
- "Skip to editor" link for keyboard users
- Visible only when focused
- Allows bypassing toolbar

### 5. Reduced Motion Support 🎬

**Respects User Preferences:**
- Detects `prefers-reduced-motion: reduce`
- Disables animations when requested
- Instant transitions instead of animated

## WCAG 2.1 Compliance

### Level A ✅

- [x] **1.1.1 Non-text Content** - All icons have text alternatives
- [x] **1.3.1 Info and Relationships** - Proper semantic HTML and ARIA
- [x] **1.4.1 Use of Color** - Not relying on color alone
- [x] **2.1.1 Keyboard** - All functionality available via keyboard
- [x] **2.1.2 No Keyboard Trap** - Can navigate in and out
- [x] **2.4.1 Bypass Blocks** - Skip link provided
- [x] **3.2.1 On Focus** - No unexpected context changes
- [x] **4.1.2 Name, Role, Value** - All elements properly labeled

### Level AA ✅

- [x] **1.4.3 Contrast (Minimum)** - 4.5:1 contrast ratio
- [x] **1.4.11 Non-text Contrast** - 3:1 for UI components
- [x] **2.4.7 Focus Visible** - Clear focus indicators
- [x] **3.3.1 Error Identification** - Errors clearly identified
- [x] **3.3.2 Labels or Instructions** - All inputs labeled

## Testing with Screen Readers

### NVDA (Windows) - Free

1. Download from [nvaccess.org](https://www.nvaccess.org/)
2. Install and start NVDA
3. Navigate to editor with `Tab`
4. Use arrow keys to read content
5. Use toolbar with `Tab` and `Enter`

**Expected behavior:**
- "Rich text editor, edit text"
- "Bold button, not pressed"
- After clicking: "Bold button, pressed"

### JAWS (Windows) - Commercial

1. Similar to NVDA
2. Use `Insert+Down Arrow` to read
3. Use `Tab` to navigate

### VoiceOver (Mac) - Built-in

1. Enable: `Cmd+F5`
2. Navigate: `VO+Right Arrow` (VO = Ctrl+Option)
3. Interact: `VO+Space`

**Test checklist:**
- [ ] Can navigate to editor
- [ ] Can hear "Rich text editor"
- [ ] Can navigate toolbar
- [ ] Can hear button labels
- [ ] Can hear active states
- [ ] Can hear format changes
- [ ] Can use keyboard shortcuts

## Configuration

### Enable/Disable Announcements

```javascript
const editor = MaxiEditor.set('#editor', {
  announceChanges: true // Default
});

// Manually announce
import { A11yHelper } from './utils/a11y.js';
A11yHelper.announce('Custom message');
```

### Add Skip Link

```javascript
import { A11yHelper } from './utils/a11y.js';

const editor = MaxiEditor.set('#editor', {});
A11yHelper.addSkipLink(editor.element, 'Skip to editor');
```

### High Contrast Mode

```javascript
import { A11yHelper } from './utils/a11y.js';

// Check if high contrast is enabled
if (A11yHelper.isHighContrastMode()) {
  console.log('High contrast mode detected');
}

// Add high contrast support
A11yHelper.addHighContrastSupport(editor.element);
```

## Best Practices

### 1. Always Provide Text Alternatives

```javascript
// ✅ Good - Has aria-label
<button aria-label="Bold">
  <i class="bi bi-type-bold"></i>
</button>

// ❌ Bad - Icon only
<button>
  <i class="bi bi-type-bold"></i>
</button>
```

### 2. Maintain Focus Order

```javascript
// ✅ Good - Logical tab order
<div class="toolbar">
  <button tabindex="0">Bold</button>
  <button tabindex="0">Italic</button>
</div>

// ❌ Bad - Confusing order
<button tabindex="3">Bold</button>
<button tabindex="1">Italic</button>
```

### 3. Announce Dynamic Changes

```javascript
// ✅ Good - Announces change
editor.executeCommand('bold');
A11yHelper.announce('Bold applied');

// ❌ Bad - Silent change
editor.executeCommand('bold');
```

### 4. Provide Error Messages

```javascript
// ✅ Good - Clear error
if (!isValidURL(url)) {
  alert('Please enter a valid URL');
  return;
}

// ❌ Bad - Silent failure
if (!isValidURL(url)) {
  return;
}
```

## Common Issues and Solutions

### Issue: Screen reader not announcing changes

**Solution:**
```javascript
// Ensure live region exists
import { A11yHelper } from './utils/a11y.js';
A11yHelper.createLiveRegion();

// Then announce
A11yHelper.announce('Your message');
```

### Issue: Focus not visible

**Solution:**
```css
/* Add to your CSS */
.maxi-toolbar button:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}
```

### Issue: Keyboard trap in modal

**Solution:**
```javascript
import { A11yHelper } from './utils/a11y.js';

// Set up focus trap
const cleanup = A11yHelper.setupFocusTrap(modalElement);

// Later, cleanup
cleanup();
```

## Accessibility Checklist

Before deploying:

- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] All form inputs have labels
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] High contrast mode works
- [ ] Color contrast meets WCAG AA
- [ ] No keyboard traps
- [ ] Skip links provided
- [ ] Error messages clear
- [ ] ARIA attributes correct
- [ ] Semantic HTML used
- [ ] Reduced motion respected

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Accessibility Insights](https://accessibilityinsights.io/)

## Support

For accessibility issues or questions:
- Open an issue on GitHub
- Tag with `accessibility` label
- Provide screen reader/browser details
- Include steps to reproduce

We're committed to making MaxiEditor accessible to everyone!
