import { heroui } from '@heroui/react'

const config = {
  content: ['./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [heroui()],
}

export default config
