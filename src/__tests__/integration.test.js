/**
 * Integration Tests
 * Tests for complete workflows and plugin integration
 */

import { MaxiEditor } from '../core/MaxiEditor.js';
import { HighlightPlugin } from '../plugins/HighlightPlugin.js';
import { InsertLinkPlugin } from '../plugins/InsertLinkPlugin.js';
import { TablePlugin } from '../plugins/TablePlugin.js';

describe('Integration Tests', () => {
  let container;
  let editor;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'integration-test-editor';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (editor && typeof editor.destroy === 'function') {
      editor.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Plugin Integration', () => {
    it('should initialize with multiple plugins', () => {
      editor = new MaxiEditor(container, {
        plugins: [HighlightPlugin, InsertLinkPlugin, TablePlugin]
      });

      expect(editor).toBeInstanceOf(MaxiEditor);
      expect(editor.config.plugins.length).toBe(3);
    });

    it('should register plugin commands', () => {
      editor = new MaxiEditor(container, {
        plugins: [HighlightPlugin, InsertLinkPlugin]
      });

      // Check if commands are registered
      expect(editor.commandRegistry.has('highlight')).toBe(true);
      expect(editor.commandRegistry.has('insertLink')).toBe(true);
    });
  });

  describe('Content Workflow', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container);
    });

    it('should handle complete editing workflow', () => {
      // Set initial content
      editor.setContent('<p>Initial content</p>');
      expect(editor.getContent()).toContain('Initial content');

      // Get stats
      const stats = editor.getStats();
      expect(stats.words).toBe(2);

      // Clear content
      editor.setContent('');
      expect(editor.getContent().trim()).toBe('');
    });

    it('should maintain content through multiple operations', () => {
      editor.setContent('<p>First paragraph</p>');
      const content1 = editor.getContent();

      editor.setContent(content1 + '<p>Second paragraph</p>');
      const stats = editor.getStats();

      expect(stats.paragraphs).toBeGreaterThanOrEqual(2);
      expect(stats.words).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Toolbar Integration', () => {
    it('should create toolbar with all buttons', () => {
      editor = new MaxiEditor(container, {
        toolbar: ['bold', 'italic', 'underline', 'undo', 'redo']
      });

      const toolbar = container.previousElementSibling;
      expect(toolbar).toBeTruthy();
      expect(toolbar.classList.contains('maxi-toolbar')).toBe(true);

      const buttons = toolbar.querySelectorAll('button');
      expect(buttons.length).toBe(5);
    });

    it('should execute commands from toolbar', () => {
      editor = new MaxiEditor(container, {
        toolbar: ['bold']
      });

      let commandExecuted = false;
      editor.registerCommand('bold', () => {
        commandExecuted = true;
      });

      editor.executeCommand('bold');
      expect(commandExecuted).toBe(true);
    });
  });

  describe('Sanitization Integration', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container, { sanitize: true });
    });

    it('should sanitize on setContent', () => {
      editor.setContent('<script>alert("xss")</script><p>Safe</p>');
      const content = editor.getContent();

      expect(content).not.toContain('<script>');
      expect(content).toContain('Safe');
    });

    it('should sanitize multiple XSS attempts', () => {
      const malicious = `
        <script>alert('xss')</script>
        <img src=x onerror=alert('xss')>
        <a href="javascript:alert('xss')">Click</a>
        <p>Safe content</p>
      `;

      editor.setContent(malicious);
      const content = editor.getContent();

      expect(content).not.toContain('<script>');
      expect(content).not.toContain('onerror');
      expect(content).not.toContain('javascript:');
      expect(content).toContain('Safe content');
    });
  });

  describe('Statistics Integration', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container);
    });

    it('should calculate stats for complex content', () => {
      const content = `
        <h1>Title</h1>
        <p>First paragraph with multiple words.</p>
        <p>Second paragraph with more content!</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      `;

      editor.setContent(content);
      const stats = editor.getStats();

      expect(stats.words).toBeGreaterThan(10);
      expect(stats.paragraphs).toBeGreaterThan(0);
      expect(stats.sentences).toBeGreaterThan(0);
      expect(stats.readingTimeMinutes).toBeGreaterThan(0);
    });

    it('should update stats after content changes', () => {
      editor.setContent('<p>Short</p>');
      const stats1 = editor.getStats();

      editor.setContent('<p>This is a much longer piece of content with many more words</p>');
      const stats2 = editor.getStats();

      expect(stats2.words).toBeGreaterThan(stats1.words);
      expect(stats2.characters).toBeGreaterThan(stats1.characters);
    });
  });

  describe('Destroy Integration', () => {
    it('should clean up all resources', () => {
      editor = new MaxiEditor(container, {
        toolbar: ['bold', 'italic'],
        plugins: [HighlightPlugin]
      });

      const toolbar = container.previousElementSibling;
      expect(toolbar).toBeTruthy();

      editor.destroy();

      expect(toolbar.parentNode).toBeFalsy();
      expect(container.contentEditable).toBe(false);
      expect(editor.element).toBeNull();
    });

    it('should handle destroy with no toolbar', () => {
      editor = new MaxiEditor(container, { toolbar: [] });

      expect(() => editor.destroy()).not.toThrow();
    });
  });

  describe('Configuration Integration', () => {
    it('should apply all configuration options', () => {
      editor = new MaxiEditor(container, {
        height: '350px',
        width: '600px',
        placeholder: 'Integration test',
        toolbar: ['bold', 'italic'],
        sanitize: true,
        maxHistorySize: 50
      });

      expect(container.style.height).toBe('350px');
      expect(container.style.width).toBe('600px');
      expect(container.getAttribute('data-placeholder')).toBe('Integration test');
      expect(editor.config.sanitize).toBe(true);
      expect(editor.config.maxHistorySize).toBe(50);
    });
  });

  describe('Error Handling Integration', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container);
    });

    it('should handle invalid content gracefully', () => {
      expect(() => {
        editor.setContent(null);
      }).not.toThrow();

      expect(() => {
        editor.setContent(undefined);
      }).not.toThrow();
    });

    it('should handle invalid commands gracefully', () => {
      expect(() => {
        editor.executeCommand('nonexistent');
      }).not.toThrow();

      expect(() => {
        editor.executeCommand(null);
      }).not.toThrow();
    });
  });
});
