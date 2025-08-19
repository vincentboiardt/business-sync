'use client'

import { useRouter } from 'next/navigation'
import { LogOut as SignOutIcon } from 'lucide-react'
import { useAuth } from './providers'
import Logo from './Logo'
import Button from './Button'

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return null
  }

  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo className="h-8 text-brand" />
          <div className="flex items-center space-x-4">
            <span className="hidden md:block">
              Welcome, {user.user_metadata?.full_name || user.email}
            </span>
            <Button onClick={handleSignOut}>
              <SignOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
