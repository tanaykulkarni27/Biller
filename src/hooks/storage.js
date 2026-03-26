const PREFIX = "app:"; // avoids key collisions

export const storage = {
  set(key, value) {
    try {
      const data =
        typeof value === "string"
          ? value
          : JSON.stringify(value);

      localStorage.setItem(PREFIX + key, data);
      return true;
    } catch (err) {
      console.error("Storage set error:", err);
    }
  },

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
