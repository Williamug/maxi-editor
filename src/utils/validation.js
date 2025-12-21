/**
 * Validation Utility Functions
 * Input validation helpers
 */

/**
 * Validates if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function isValidURL(url) {
  if (!url || typeof url !== 'string') return false;

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return false;
    }
  }

  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol);
  } catch {
    // If not a full URL, check if it's a relative path
    return /^(\/|\.\/|\.\.\/|#)/.test(url);
  }
}

/**
 * Validates a number within a range
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number|null} - Validated number or null
 */
export function validateNumberInRange(value, min, max) {
  const num = parseInt(value, 10);

  if (isNaN(num)) return null;
  if (num < min || num > max) return null;

  return num;
}

/**
 * Validates file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} - True if valid
 */
export function isValidFileType(file, allowedTypes) {
  if (!file || !file.type) return false;
  return allowedTypes.includes(file.type);
}

/**
 * Validates file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInBytes - Maximum size in bytes
 * @returns {boolean} - True if valid
 */
export function isValidFileSize(file, maxSizeInBytes) {
  if (!file || !file.size) return false;
  return file.size <= maxSizeInBytes;
}

/**
 * Sanitizes a string for use as an attribute
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeAttribute(str) {
  if (!str) return '';
  return str.replace(/[<>"']/g, '');
}

/**
 * Validates color string (hex, rgb, named)
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid
 */
export function isValidColor(color) {
  if (!color || typeof color !== 'string') return false;

  // Check hex colors
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return true;

  // Check rgb/rgba
  if (/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?\)$/i.test(color)) return true;

  // Check named colors (basic set)
  const namedColors = [
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
    'pink', 'brown', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy',
    'teal', 'olive', 'maroon', 'aqua', 'fuchsia', 'silver'
  ];

  return namedColors.includes(color.toLowerCase());
}
