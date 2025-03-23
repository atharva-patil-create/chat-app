export const initializeTheme = () => {
  // Check if theme is stored in localStorage
  const savedTheme = localStorage.getItem("theme");

  // If no theme is stored, check system preference
  if (!savedTheme) {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    localStorage.setItem("theme", systemPrefersDark ? "dark" : "light");
    if (systemPrefersDark) {
      document.documentElement.classList.add("dark");
    }
    return;
  }

  // Apply stored theme
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
