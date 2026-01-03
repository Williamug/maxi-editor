# Changelog

All notable changes to MaxiEditor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-22

### Added

#### Core Features
- Complete modular architecture with 24 separate modules
- `getStats()` method for content statistics (characters, words, paragraphs, sentences, reading time)
- Keyboard shortcuts system with 14 default shortcuts and Mac compatibility
- Comprehensive error handling with ErrorHandler utility
- Memory management with `destroy()` method and automatic cleanup
- Content sanitization with DOMPurify integration

#### Plugins
- **TextColorPlugin** - Change text color with color picker
- **BackgroundColorPlugin** - Change background color with color picker
- **HighlightPlugin** - Highlight text with customizable colors
- **ImageUploadPlugin** - Upload images with validation, preview, and auto-resize
- **TablePlugin** - Insert tables with modal dialog
- **InsertLinkPlugin** - Insert links with URL validation
- **StrikeThroughPlugin** - Strikethrough text formatting
- **RemoveLinkPlugin** - Remove links from text

#### UI Components
- **ColorPicker** - Beautiful color picker with recent colors and custom input
- **Modal** - Reusable modal dialog with custom buttons
- **Toolbar** - Accessible toolbar with keyboard navigation

#### Utilities
- **KeyboardHandler** - Keyboard shortcut management
- **A11yHelper** - Accessibility utilities (screen reader announcements, focus management)
- **ErrorHandler** - Centralized error handling
- **Validation** - Input validation utilities
- **Sanitizer** - XSS protection and content sanitization

#### Accessibility
- WCAG 2.1 Level AA compliance
- Screen reader support (NVDA, JAWS, VoiceOver)
- Keyboard navigation
- ARIA labels and roles
- High contrast mode support
- Reduced motion support
- Live announcements

#### Testing
- 33 comprehensive tests (18 unit + 15 integration)
- Test utilities and fixtures
- Jest configuration
- 100% test pass rate

#### Documentation
- SECURITY.md - Security guidelines and CSP configuration
- ACCESSIBILITY.md - Accessibility features and testing
- KEYBOARD_SHORTCUTS.md - Complete keyboard shortcut reference
- CONTRIBUTING.md - Contribution guidelines
- CHANGELOG.md - Version history

### Changed
- **Breaking:** Restructured entire codebase into modular architecture
- **Breaking:** Changed initialization API to use `MaxiEditor.set()` or `new MaxiEditor()`
- Improved paste handling with multiple clipboard formats
- Enhanced toolbar with better keyboard navigation
- Updated color picker to support customizable palettes

### Fixed
- Memory leaks from event listeners
- XSS vulnerabilities in content handling
- Paste handling edge cases
- Destroy method not cleaning up properly
- History size limits not enforced

### Security
- Added DOMPurify for XSS protection
- Implemented URL validation to block dangerous protocols
- Added input sanitization on paste
- Created SECURITY.md with CSP guidelines
- Sanitize all user-provided content

### Performance
- Debounced history saves (300ms)
- Debounced toolbar updates (50ms)
- History size limits (100 entries default)
- Efficient event listener management
- Optimized rendering

## [1.0.0] - Previous Version

### Initial Release
- Basic rich text editing
- Simple toolbar
- Basic formatting commands
- Undo/redo functionality

---

## Migration Guide

### From 1.x to 2.0

#### Initialization

**Before (1.x):**
```javascript
const editor = new MaxiEditor('#editor');
```

**After (2.0):**
```javascript
const editor = MaxiEditor.set('#editor', {
  toolbar: ['bold', 'italic', 'underline'],
  height: '400px'
});
```

#### Plugins

**Before (1.x):**
Plugins were built-in

**After (2.0):**
```javascript
import { HighlightPlugin, InsertLinkPlugin } from './plugins/index.js';

const editor = MaxiEditor.set('#editor', {
  plugins: [HighlightPlugin, InsertLinkPlugin]
});
```

#### Cleanup

**Before (1.x):**
No cleanup method

**After (2.0):**
```javascript
editor.destroy(); // Always call when done
```

---

[2.0.0]: https://github.com/username/maxi-editor/releases/tag/v2.0.0
[1.0.0]: https://github.com/username/maxi-editor/releases/tag/v1.0.0
