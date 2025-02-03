import { heroui } from '@heroui/react'

const config = {
  content: ['./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [
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
}

export default config
