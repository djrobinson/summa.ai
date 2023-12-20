"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DemoCreateAccount() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create a Data Source</CardTitle>
        <CardDescription>
          Upload a file to create a new data source.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
    
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="data-source-name">Data Source Name</Label>
          <Input id="data-source-name" type="data-source-name" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="picture">File</Label>
            <Input id="picture" type="file" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create Data Source</Button>
      </CardFooter>
    </Card>
  )
}