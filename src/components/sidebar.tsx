'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  X, 
  FileText, 
  Lock, 
  Unlock, 
  BookOpen, 
  Code, 
  Home,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'PDF protection tools'
  },
  {
    name: 'API Documentation',
    href: '/api-docs',
    icon: BookOpen,
    description: 'REST API endpoints and usage'
  },
  {
    name: 'qpdf Library',
    href: '/qpdf-docs',
    icon: Code,
    description: 'qpdf library guide and examples'
  }
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">PDF Protector</span>
        </div>
        {mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => mobile && setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-sm mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/" onClick={() => mobile && setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Protect PDF
              </Button>
            </Link>
            <Link href="/" onClick={() => mobile && setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Unlock className="h-4 w-4 mr-2" />
                Unprotect PDF
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>Built with Next.js & qpdf</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r overflow-y-auto">
          <NavContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <NavContent mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}