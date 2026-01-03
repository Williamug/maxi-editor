/**
 * Command Registry
 * Manages command registration and execution
 */

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  /**
   * Registers a command
   * @param {string} name - Command name
   * @param {Function} handler - Command handler function
   */
  register(name, handler) {
    if (typeof handler !== 'function') {
      throw new Error(`Command handler for '${name}' must be a function`);
    }
    this.commands.set(name, handler);
  }

  /**
   * Executes a command
   * @param {string} name - Command name
   * @param {*} value - Optional value to pass to command
   * @returns {*} - Command result
   */
  execute(name, value = null) {
    const command = this.commands.get(name);

    if (!command) {
      console.error(`Command '${name}' is not registered`);
      return false;
    }

    try {
      return command(value);
    } catch (error) {
      console.error(`Error executing command '${name}':`, error);
      return false;
    }
  }

  /**
   * Checks if a command is registered
   * @param {string} name - Command name
   * @returns {boolean}
   */
  has(name) {
    return this.commands.has(name);
  }

  /**
   * Unregisters a command
   * @param {string} name - Command name
   */
  unregister(name) {
    this.commands.delete(name);
  }

  /**
   * Gets all registered command names
   * @returns {string[]}
   */
  getCommandNames() {
    return Array.from(this.commands.keys());
  }

  /**
   * Clears all commands
   */
  clear() {
    this.commands.clear();
  }
}
