/**
 * Image Upload Plugin
 * Adds image upload functionality with validation and preview
 */

import { Modal } from '../ui/Modal.js';
import { isValidFileType, isValidFileSize } from '../utils/validation.js';

export class ImageUploadPlugin {
  static init(editor) {
    // Default configuration
    const config = {
      maxFileSize: editor.config.maxImageSize || 5 * 1024 * 1024, // 5MB default
      allowedTypes: editor.config.allowedImageTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxWidth: editor.config.maxImageWidth || 800,
      maxHeight: editor.config.maxImageHeight || 600
    };

    const imageHandler = () => {
      // Create file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!isValidFileType(file, config.allowedTypes)) {
          alert(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`);
          return;
        }

        // Validate file size
        if (!isValidFileSize(file, config.maxFileSize)) {
          const sizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(1);
          alert(`File too large. Maximum size: ${sizeMB}MB`);
          return;
        }

        // Read and preview image
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgSrc = event.target.result;
          showImagePreview(imgSrc, file.name);
        };
        reader.onerror = () => {
          alert('Failed to read file. Please try again.');
        };
        reader.readAsDataURL(file);
      });

      // Trigger file input
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    };

    /**
     * Shows image preview modal
     * @param {string} imgSrc - Image source (base64)
     * @param {string} fileName - File name
     */
    const showImagePreview = (imgSrc, fileName) => {
      const modalContent = `
        <div class="maxi-image-preview">
          <img src="${imgSrc}" alt="Preview" style="max-width: 100%; max-height: 400px; display: block; margin: 0 auto;" />
          <div class="maxi-form-group" style="margin-top: 20px;">
            <label for="image-alt">Alt Text (for accessibility):</label>
            <input
              type="text"
              id="image-alt"
              class="maxi-input"
              placeholder="Describe the image..."
              value="${fileName.replace(/\.[^/.]+$/, '')}"
            />
          </div>
          <div class="maxi-form-group">
            <label for="image-width">Width (px, leave empty for original):</label>
            <input
              type="number"
              id="image-width"
              class="maxi-input"
              placeholder="Auto"
              min="50"
              max="${config.maxWidth}"
            />
          </div>
          <div class="maxi-form-group">
            <label>
              <input type="checkbox" id="image-resize" checked />
              Resize if larger than ${config.maxWidth}×${config.maxHeight}
            </label>
          </div>
        </div>
      `;

      const modal = new Modal({
        title: 'Insert Image',
        content: modalContent,
        buttons: [
          {
            text: 'Cancel',
            className: 'maxi-modal-btn maxi-modal-btn-secondary',
            onClick: () => {
              modal.close();
            }
          },
          {
            text: 'Insert',
            className: 'maxi-modal-btn maxi-modal-btn-primary',
            onClick: () => {
              const altText = document.getElementById('image-alt').value || 'Image';
              const widthInput = document.getElementById('image-width').value;
              const shouldResize = document.getElementById('image-resize').checked;

              // Process image
              if (shouldResize) {
                resizeAndInsertImage(imgSrc, altText, widthInput);
              } else {
                insertImage(imgSrc, altText, widthInput);
              }

              modal.close();
            }
          }
        ]
      });

      modal.show();
    };

    /**
     * Resizes and inserts image
     * @param {string} imgSrc - Image source
     * @param {string} altText - Alt text
     * @param {string} widthInput - Width input value
     */
    const resizeAndInsertImage = (imgSrc, altText, widthInput) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Check if resize is needed
        if (width > config.maxWidth || height > config.maxHeight) {
          const ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);

          // Create canvas to resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get resized image as base64
          const resizedSrc = canvas.toDataURL('image/jpeg', 0.9);
          insertImage(resizedSrc, altText, widthInput || width);
        } else {
          insertImage(imgSrc, altText, widthInput);
        }
      };
      img.src = imgSrc;
    };

    /**
     * Inserts image into editor
     * @param {string} imgSrc - Image source
     * @param {string} altText - Alt text
     * @param {string} width - Width value
     */
    const insertImage = (imgSrc, altText, width) => {
      const widthAttr = width ? ` width="${width}"` : '';
      const imgHTML = `<img src="${imgSrc}" alt="${altText}"${widthAttr} style="max-width: 100%; height: auto;" /><p>&nbsp;</p>`;

      try {
        document.execCommand('insertHTML', false, imgHTML);
        editor.element.focus();
      } catch (error) {
        console.error('Failed to insert image:', error);
        alert('Failed to insert image. Please try again.');
      }
    };

    // Register both 'image' and 'insertImage' for compatibility
    editor.registerCommand('image', imageHandler);
    editor.registerCommand('insertImage', imageHandler);
  }
}

export default ImageUploadPlugin;
