import { Metadata } from "next"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

export default async function SampleDataTable() {
  const tasks: any[] = [];

  return (

      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
            <p className="text-muted-foreground">
              Here&apos;s the latest public activity on the platform
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
  )
}
