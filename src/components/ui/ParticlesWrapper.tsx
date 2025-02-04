'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Particles } from '~/components/ui'

export function ParticlesWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  const [color, setColor] = useState('#1E1E1E')

  useEffect(() => {
    setColor(theme === 'light' ? '#1E1E1E' : '#F6F6F6')
  }, [theme])

  return (
    <div className="relative h-full">
      {children}

      {/* Background  */}
      <Particles className="absolute inset-0" color={color} ease={80} quantity={100} refresh />
    </div>
  )
}
