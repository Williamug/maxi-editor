/**
 * Test Fixtures
 * Sample data for testing
 */

export const sampleHTML = {
  simple: '<p>Hello World</p>',
  formatted: '<p><strong>Bold</strong> and <em>italic</em> text</p>',
  multiParagraph: '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>',
  withHeadings: '<h1>Title</h1><p>Content</p><h2>Subtitle</h2><p>More content</p>',
  withList: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
  withLink: '<p>Check out <a href="https://example.com">this link</a></p>',
  withImage: '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="Test"></p>',
  withTable: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>',
  empty: '',
  xssAttempt: '<script>alert("XSS")</script><p>Safe content</p>'
};

export const sampleText = {
  simple: 'Hello World',
  multiWord: 'The quick brown fox jumps over the lazy dog',
  multiParagraph: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
  withPunctuation: 'Hello! How are you? I am fine.',
  empty: ''
};

export const sampleConfig = {
  minimal: {
    toolbar: ['bold', 'italic'],
    height: '200px'
  },
  full: {
    toolbar: [
      'bold', 'italic', 'underline', 'strikethrough',
      'justifyLeft', 'justifyCenter', 'justifyRight',
      'insertUnorderedList', 'insertOrderedList',
      'insertLink', 'undo', 'redo'
    ],
    height: '400px',
    placeholder: 'Test placeholder'
  },
  withPlugins: {
    toolbar: ['bold', 'highlight', 'insertLink'],
    plugins: []
  }
};

export const sampleStats = {
  empty: {
    characters: 0,
    charactersWithSpaces: 0,
    words: 0,
    paragraphs: 0,
    sentences: 0,
    lines: 0,
    readingTimeMinutes: 0
  },
  simple: {
    characters: 10, // "HelloWorld"
    charactersWithSpaces: 11, // "Hello World"
    words: 2,
    paragraphs: 1,
    sentences: 1,
    lines: 1,
    readingTimeMinutes: 1
  }
};
