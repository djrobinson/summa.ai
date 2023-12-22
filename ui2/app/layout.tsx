import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/UserNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="dark bg-background h-screen">
        <Menubar className="w-full align-items-space-between p-2">
          <MenubarMenu>
          <Link href="/"><Button>Home</Button></Link>
            <Link href="/account"><Button>Account</Button></Link>
            <MenubarTrigger>Options</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
            </MenubarContent>
            <MenubarSeparator />
          </MenubarMenu>
          <div className="flex md:flex md:flex-grow flex-row justify-end space-x-1 pr-1">
            <UserNav />
          </div>
        </Menubar>
        {children}
        </main>
        </body>
    </html>
  )
}