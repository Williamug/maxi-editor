import MaxiEditor from '../maxi-editor.js';

describe('MaxiEditor', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="editor"></div>';
    container = document.getElementById('editor');
  });

  it('should initialize with a contenteditable element', () => {
    const editor = new MaxiEditor(container, { toolbar: ['bold'], height: '100px' });
    expect(container.contentEditable).toBe(true);
    expect(container.classList.contains('maxi-editor')).toBe(true);
  });

  it('should set the height from config', () => {
    const editor = new MaxiEditor(container, { toolbar: ['bold'], height: '123px' });
    expect(container.style.height).toBe('123px');
  });
});
