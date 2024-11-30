import { execSync } from 'child_process'
import pkg from '../package.json'

const requiredDeps = [
  '@supabase/auth-helpers-nextjs',
  '@supabase/supabase-js',
  'next',
  // Add other critical dependencies
] as const

type Dependencies = typeof pkg.dependencies
type RequiredDep = typeof requiredDeps[number]

try {
  requiredDeps.forEach((dep: RequiredDep) => {
    if (!(dep in pkg.dependencies)) {
      throw new Error(`Missing required dependency: ${dep}`)
    }
  })
  console.log('✅ All required dependencies are installed')
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('❌ Dependency check failed:', error.message)
  } else {
    console.error('❌ An unknown error occurred during dependency check')
  }
  process.exit(1)
} 