module.exports = {
  darkMode: 'class',
  content: ['app/**/*.{ts,tsx,js,jsx}', 'components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        pv: {
          primary: 'var(--pv-primary)',
          primary2: 'var(--pv-primary-2)',
          bg: 'var(--pv-bg)',
          surface: 'var(--pv-surface)',
          text: 'var(--pv-text)',
          muted: 'var(--pv-text-muted)',
          border: 'var(--pv-border)',
          ring: 'var(--pv-ring)',
          success: 'var(--pv-success)',
          warning: 'var(--pv-warning)',
          danger: 'var(--pv-danger)'
        }
      },
      boxShadow: {
        pv: 'var(--pv-shadow)'
      },
      borderRadius: {
        pv: 'var(--pv-radius)',
        'pv-sm': 'var(--pv-radius-sm)',
        'pv-lg': 'var(--pv-radius-lg)'
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      transitionProperty: {
        'colors-opacity-transform': 'color, background-color, border-color, opacity, transform'
      }
    }
  },
  plugins: []
};
