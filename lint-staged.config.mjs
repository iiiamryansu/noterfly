import path from 'path'

function buildEslintCommand(filenames) {
  return `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`
}

const config = {
  '*.{css,json,yml,md}': ['prettier --write'],
  '*.{mjs,js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'],
}

export default config
