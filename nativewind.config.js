/** @type {import('nativewind').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0E7CFF',
        accent: '#00C2A8',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        light: '#F6F8FB',
        dark: '#0A0F1A',
      },
    },
  },
  plugins: [],
};
