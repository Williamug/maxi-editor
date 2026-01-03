/**
 * Error Handler Utility
 * Centralized error handling and user-friendly error messages
 */

export class ErrorHandler {
  /**
   * Error types
   */
  static ErrorTypes = {
    VALIDATION: 'ValidationError',
    COMMAND: 'CommandError',
    PLUGIN: 'PluginError',
    SANITIZATION: 'SanitizationError',
    INITIALIZATION: 'InitializationError',
    NETWORK: 'NetworkError'
  };

  /**
   * Handles an error with user-friendly messaging
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @param {Object} options - Additional options
   */
  static handle(error, context, options = {}) {
    const {
      showAlert = false,
      logToConsole = true,
      customMessage = null,
      severity = 'error' // 'error', 'warning', 'info'
    } = options;

    // Log to console
    if (logToConsole) {
      const logMethod = severity === 'warning' ? console.warn : console.error;
      logMethod(`[MaxiEditor ${context}]:`, error);
    }

    // Get user-friendly message
    const userMessage = customMessage || this.getUserMessage(error, context);

    // Show alert if requested
    if (showAlert) {
      alert(userMessage);
    }

    // Return formatted error info
    return {
      type: error.name || 'Error',
      context,
      message: error.message,
      userMessage,
      severity,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Gets a user-friendly error message
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @returns {string} - User-friendly message
   */
  static getUserMessage(error, context) {
    const messages = {
      'ValidationError': 'Invalid input. Please check your data and try again.',
      'CommandError': 'Unable to execute command. Please try again.',
      'PluginError': 'Plugin failed to load. Some features may be unavailable.',
      'SanitizationError': 'Content could not be sanitized. Please check the content.',
      'InitializationError': 'Editor failed to initialize. Please refresh the page.',
      'NetworkError': 'Network error. Please check your connection.',
      'URLValidationError': 'Invalid URL. Please enter a valid web address.',
      'FileValidationError': 'Invalid file. Please check the file type and size.',
      'RangeError': 'Value is out of acceptable range.',
      'TypeError': 'Invalid data type provided.'
    };

    // Try to match error name
    if (messages[error.name]) {
      return messages[error.name];
    }

    // Try to match context
    if (context.includes('URL')) {
      return messages['URLValidationError'];
    }
    if (context.includes('File')) {
      return messages['FileValidationError'];
    }
    if (context.includes('Plugin')) {
      return messages['PluginError'];
    }
    if (context.includes('Command')) {
      return messages['CommandError'];
    }

    // Default message
    return 'An error occurred. Please try again or contact support.';
  }

  /**
   * Creates a validation error
   * @param {string} message - Error message
   * @param {Object} details - Additional details
   * @returns {Error} - Validation error
   */
  static createValidationError(message, details = {}) {
    const error = new Error(message);
    error.name = this.ErrorTypes.VALIDATION;
    error.details = details;
    return error;
  }

  /**
   * Creates a command error
   * @param {string} commandName - Command name
   * @param {Error} originalError - Original error
   * @returns {Error} - Command error
   */
  static createCommandError(commandName, originalError) {
    const error = new Error(`Command '${commandName}' failed: ${originalError.message}`);
    error.name = this.ErrorTypes.COMMAND;
    error.commandName = commandName;
    error.originalError = originalError;
    return error;
  }

  /**
   * Creates a plugin error
   * @param {string} pluginName - Plugin name
   * @param {Error} originalError - Original error
   * @returns {Error} - Plugin error
   */
  static createPluginError(pluginName, originalError) {
    const error = new Error(`Plugin '${pluginName}' failed: ${originalError.message}`);
    error.name = this.ErrorTypes.PLUGIN;
    error.pluginName = pluginName;
    error.originalError = originalError;
    return error;
  }

  /**
   * Validates and throws if invalid
   * @param {boolean} condition - Condition to check
   * @param {string} message - Error message if condition is false
   * @param {Object} details - Additional details
   */
  static assert(condition, message, details = {}) {
    if (!condition) {
      throw this.createValidationError(message, details);
    }
  }

  /**
   * Wraps a function with error handling
   * @param {Function} fn - Function to wrap
   * @param {string} context - Context for error handling
   * @param {Object} options - Error handling options
   * @returns {Function} - Wrapped function
   */
  static wrap(fn, context, options = {}) {
    return function (...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        return ErrorHandler.handle(error, context, options);
      }
    };
  }

  /**
   * Wraps an async function with error handling
   * @param {Function} fn - Async function to wrap
   * @param {string} context - Context for error handling
   * @param {Object} options - Error handling options
   * @returns {Function} - Wrapped async function
   */
  static wrapAsync(fn, context, options = {}) {
    return async function (...args) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        return ErrorHandler.handle(error, context, options);
      }
    };
  }
}

export default ErrorHandler;
