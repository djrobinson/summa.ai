import { Metadata } from "next"
import Image from "next/image"

import { cn } from "@/lib/utils"

import { DemoCookieSettings } from "@/components/home/cookie-settings"
import { DemoCreateAccount } from "@/components/home/create-account"
import { DemoNotifications } from "@/components/home/notifications"
import { DemoShareDocument } from "@/components/home/share-document"
import { DemoTeamMembers } from "@/components/home/team-members"
import DataSources from "@/components/home/datasources"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Cards",
  description: "Examples of cards built using the components.",
}

function DemoContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full",
        className
      )}
      {...props}
    />
  )
}

export default function HomePage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/cards-light.png"
          width={1280}
          height={1214}
          alt="Cards"
          className="block dark:hidden"
        />
        <Image
          src="/examples/cards-dark.png"
          width={1280}
          height={1214}
          alt="Cards"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-1 grid items-start gap-6 lg:col-span-1">
          <DemoContainer>
            <DemoCreateAccount />
          </DemoContainer>
          <DemoContainer>
            <DemoShareDocument />
          </DemoContainer>
        </div>
        <div className="col-span-2 grid items-start gap-6 lg:col-span-2">
          <DemoContainer>
            <DataSources />
          </DemoContainer>
        </div>
      </div>
    </>
  )
}