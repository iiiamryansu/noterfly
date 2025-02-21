'use client'

import { CursorArrowRaysIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { GithubIcon } from 'hugeicons-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Particles, Typewriter } from '~/components/ui'

export default function RootPage() {
  const { theme } = useTheme()

  const [color, setColor] = useState('#1E1E1E')

  const router = useRouter()

  const t = useTranslations('WelcomePage')

  useEffect(() => {
    setColor(theme === 'light' ? '#1E1E1E' : '#F6F6F6')
  }, [theme])

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <Chip className="select-none" color="warning" size="sm" variant="dot">
          {t('announcement')}
        </Chip>

        <header className="flex flex-col gap-8">
          <h1 className="flex select-none flex-col gap-2 text-center text-6xl font-semibold">
            <span>The most powerful</span>
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              note application
            </span>
            <div className="flex items-center justify-center gap-4">
              <span>for</span>
              <Typewriter
                className="text-warning"
                cursorChar={'_'}
                deleteSpeed={40}
                speed={70}
                text={['students', 'designers', 'developers', 'everyone!']}
                waitTime={1500}
              />
            </div>
          </h1>
          <p className="max-w-2xl select-none text-center text-lg font-light leading-relaxed text-default-500">
            Effortlessly create, edit, and share documents in real-time with seamless collaboration. Experience smart text
            processing and AI assistance that transforms the way you work.
          </p>
        </header>

        <footer className="flex gap-4">
          <Button
            onPress={() => router.push('https://github.com/iiiamryansu/noterfly')}
            size="md"
            startContent={<GithubIcon className="size-4" />}
          >
            GitHub
          </Button>
          <Button
            className="group"
            color="primary"
            endContent={<CursorArrowRaysIcon className="size-4 transition-all duration-300 group-hover:text-warning-500" />}
            onPress={() => router.push('/auth/sign-up')}
            size="md"
          >
            Sign up here
          </Button>
        </footer>
      </div>

      {/* Background  */}
      <Particles className="absolute inset-0" color={color} ease={80} quantity={100} refresh />
    </div>
  )
}
