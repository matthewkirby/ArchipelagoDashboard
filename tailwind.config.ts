import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'primary-variant': 'var(--color-primary-variant)',
        'secondary': 'var(--color-secondary)',
        'background': 'var(--color-background)',

        'surface': 'var(--color-surface)',
        'surfaceL2': 'var(--color-surface-above)',
        'error': 'var(--color-error)',

        'on': {
          'primary': 'var(--color-on-primary)',
          'secondary': 'var(--color-on-secondary)',
          'bg': 'var(--color-on-background)',
          'bgSubtle': 'var(--color-on-background-subtle)',
          'surface': 'var(--color-on-surface)',
          'surfaceSubtle': 'var(--color-on-surface-subtle)'
        },

        'item': {
          'progression': 'var(--color-item-progression)',
          'important': 'var(--color-item-important)',
          'trap': 'var(--color-item-trap)',
          'default': 'var(--color-item-default)'
        },

        'location': {
          'name': 'var(--color-location-name)',
          'pending': 'var(--color-location-pending)',
          'found': 'var(--color-location-found)'
        }











      }

    },
  },
  plugins: [],
}
export default config
