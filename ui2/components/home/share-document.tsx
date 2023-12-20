"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export function DemoShareDocument() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflows</CardTitle>
        <CardDescription>
          Create a New Workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Tabs defaultValue="new" >
        <div className="flex items-center justify-center space-x-4">
            <TabsList className="mb-4 content-center">
                <TabsTrigger value="new">Create New</TabsTrigger>
                <TabsTrigger value="existing">Open Existing</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="new">
        <Tabs defaultValue="account" >
            <div className="flex items-center justify-between space-x-4">
            <h2>Create from: </h2>
            <TabsList className="mb-4 ">
                <TabsTrigger value="account">Data Source</TabsTrigger>
                <TabsTrigger value="password">Workflow</TabsTrigger>
            </TabsList>
            </div>
            <TabsContent value="account">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Create from Data Source</h4>
                    <div className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                            <AvatarImage src="/avatars/03.png" />
                            <AvatarFallback>TR</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="text-sm font-medium leading-none">
                                The Republic
                            </p>
                            <p className="text-sm text-muted-foreground">23,023 words</p>
                            </div>
                        </div>
                        <Button variant="secondary">
                            View
                        </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="password">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Copy Workflow</h4>
                    <div className="grid gap-6">
                        <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                            <AvatarImage src="/avatars/03.png" />
                            <AvatarFallback>TR</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="text-sm font-medium leading-none">
                                The Republic - Analysis
                            </p>
                            <p className="text-sm text-muted-foreground">50 phases</p>
                            </div>
                        </div>
                        <Button variant="secondary">
                            View
                        </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>

        
        
       
        <Separator className="my-4" />
        <div className="flex space-x-2">
          <Input placeholder="Workflow Name..." value="" readOnly />
          <Button className="shrink-0">
            Create
          </Button>
        </div>
        </TabsContent>
        <TabsContent value="existing">
            <div className="space-y-4">
                <div className="grid gap-6">
                    <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                        <AvatarImage src="/avatars/03.png" />
                        <AvatarFallback>TR</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium leading-none">
                            The Republic - Analysis
                        </p>
                        <p className="text-sm text-muted-foreground">50 phases</p>
                        </div>
                    </div>
                    <Button variant="secondary">
                        Open
                    </Button>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
                <div className="grid gap-6">
                    <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                        <AvatarImage src="/avatars/03.png" />
                        <AvatarFallback>TR</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium leading-none">
                            The Republic - Analysis 2
                        </p>
                        <p className="text-sm text-muted-foreground">50 phases</p>
                        </div>
                    </div>
                    <Button variant="secondary">
                        Open
                    </Button>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
                <div className="grid gap-6">
                    <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                        <AvatarImage src="/avatars/03.png" />
                        <AvatarFallback>TR</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium leading-none">
                            The Republic - Analysis 3
                        </p>
                        <p className="text-sm text-muted-foreground">50 phases</p>
                        </div>
                    </div>
                    <Button variant="secondary">
                        Open
                    </Button>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
                <div className="grid gap-6">
                    <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                        <AvatarImage src="/avatars/03.png" />
                        <AvatarFallback>TR</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium leading-none">
                            The Republic - Analysis 4
                        </p>
                        <p className="text-sm text-muted-foreground">50 phases</p>
                        </div>
                    </div>
                    <Button variant="secondary">
                        Open
                    </Button>
                    </div>
                </div>
            </div>
        </TabsContent>
        </Tabs>
        
      </CardContent>
    </Card>
  )
}