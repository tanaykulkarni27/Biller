const PREFIX = "app:"; // avoids key collisions

export const storage = {
  /**
   * Save any value to localStorage
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    try {
      const data =
        typeof value === "string"
          ? value
          : JSON.stringify(value);

      localStorage.setItem(PREFIX + key, data);
    } catch (err) {
      console.error("Storage set error:", err);
    }
  },

  /**
   * Get value from localStorage (auto parses JSON)
   * @param {string} key
   * @returns {any | null}
   */
  get(key) {
    try {
      const data = localStorage.getItem(PREFIX + key);
      if (data === null) return null;

      // Try JSON parse, fallback to string
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (err) {
      console.error("Storage get error:", err);
      return null;
    }
  },

  /**
   * Remove a key
   */
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  /**
   * Clear app storage only
   */
  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
