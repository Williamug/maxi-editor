/**
 * MaxiEditor Core Tests
 * Comprehensive unit tests for MaxiEditor
 */

import { MaxiEditor } from '../core/MaxiEditor.js';
import { sampleHTML, sampleConfig } from '../test-fixtures.js';

describe('MaxiEditor', () => {
  let container;
  let editor;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-editor';
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

  describe('Initialization', () => {
    it('should initialize with a contenteditable element', () => {
      editor = new MaxiEditor(container);
      expect(container.contentEditable).toBe(true);
      expect(container.classList.contains('maxi-editor')).toBe(true);
    });

    it('should set the height from config', () => {
      editor = new MaxiEditor(container, { height: '300px' });
      expect(container.style.height).toBe('300px');
    });

    it('should set ARIA attributes', () => {
      editor = new MaxiEditor(container);
      expect(container.getAttribute('role')).toBe('textbox');
      expect(container.getAttribute('aria-multiline')).toBe('true');
      expect(container.getAttribute('aria-label')).toBe('Rich text editor');
    });
  });

  describe('Content Management', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container);
    });

    it('should set content', () => {
      editor.setContent(sampleHTML.simple);
      expect(container.innerHTML).toContain('Hello World');
    });

    it('should get content', () => {
      container.innerHTML = sampleHTML.simple;
      const content = editor.getContent();
      expect(content).toContain('Hello World');
    });

    it('should sanitize content when setting', () => {
      editor.setContent(sampleHTML.xssAttempt);
      const content = editor.getContent();
      expect(content).not.toContain('<script>');
      expect(content).toContain('Safe content');
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container);
    });

    it('should return zero stats for empty content', () => {
      editor.setContent('');
      const stats = editor.getStats();
      expect(stats.characters).toBe(0);
      expect(stats.words).toBe(0);
      expect(stats.paragraphs).toBe(0);
    });

    it('should count characters correctly', () => {
      editor.setContent('<p>Hello World</p>');
      const stats = editor.getStats();
      expect(stats.characters).toBe(10);
      expect(stats.charactersWithSpaces).toBe(11);
    });

    it('should count words correctly', () => {
      editor.setContent('<p>The quick brown fox</p>');
      const stats = editor.getStats();
      expect(stats.words).toBe(4);
    });

    it('should count paragraphs correctly', () => {
      editor.setContent(sampleHTML.multiParagraph);
      const stats = editor.getStats();
      expect(stats.paragraphs).toBe(3);
    });

    it('should calculate reading time', () => {
      const words = Array(200).fill('word').join(' ');
      editor.setContent(`<p>${words}</p>`);
      const stats = editor.getStats();
      expect(stats.readingTimeMinutes).toBe(1);
    });
  });

  describe('Commands', () => {
    beforeEach(() => {
      editor = new MaxiEditor(container);
    });

    it('should register a command', () => {
      let called = false;
      editor.registerCommand('testCommand', () => {
        called = true;
      });
      editor.executeCommand('testCommand');
      expect(called).toBe(true);
    });

    it('should handle unknown commands gracefully', () => {
      expect(() => {
        editor.executeCommand('unknownCommand');
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should destroy editor and remove event listeners', () => {
      editor = new MaxiEditor(container);
      const toolbar = container.previousElementSibling;

      editor.destroy();

      expect(toolbar.parentNode).toBeFalsy();
      expect(container.contentEditable).toBe(false);
    });

    it('should not throw when destroying twice', () => {
      editor = new MaxiEditor(container);
      editor.destroy();
      expect(() => editor.destroy()).not.toThrow();
    });
  });

  describe('Static Methods', () => {
    it('should create editor with set() method', () => {
      container.id = 'unique-test-editor';
      editor = MaxiEditor.set('#unique-test-editor', { height: '250px' });
      expect(editor).toBeInstanceOf(MaxiEditor);
      expect(container.style.height).toBe('250px');
    });
  });

  describe('Configuration', () => {
    it('should accept minimal configuration', () => {
      editor = new MaxiEditor(container, sampleConfig.minimal);
      expect(editor.config.toolbar).toEqual(['bold', 'italic']);
    });

    it('should use default values when not specified', () => {
      editor = new MaxiEditor(container);
      expect(editor.config.height).toBe('200px');
      expect(editor.config.sanitize).toBe(true);
    });
  });
});
