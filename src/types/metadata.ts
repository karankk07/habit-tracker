import type { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    default: 'Habit Tracker',
    template: '%s | Habit Tracker'
  },
  description: 'Track and manage your daily habits',
  viewport: 'width=device-width, initial-scale=1',
} 