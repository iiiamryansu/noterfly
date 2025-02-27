import { heroui } from '@heroui/theme'
import tailwindcssTypography from '@tailwindcss/typography'

const config = {
  content: ['./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [
    tailwindcssTypography,
    heroui({
      themes: {
        dark: {
          colors: {
            background: '#222222',
            base: {
              default: '#1E1E1E',
            },
            divider: '#333333',
          },
        },
        light: {
          colors: {
            background: '#FFFFFF',
            base: {
              default: '#F6F6F6',
            },
            divider: '#ECECEC',
          },
        },
      },
    }),
  ],
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            code: {
              '&::after': {
                display: 'none',
              },
              '&::before': {
                display: 'none',
              },
              'backgroundColor': 'rgba(135,131,120,.15)',
              'borderRadius': '4px',
              'color': '#eb5757',
              'fontSize': '85%',
              'padding': '0.2em 0.4em',
            },
          },
        },
      }),
    },
  },
}

export default config
