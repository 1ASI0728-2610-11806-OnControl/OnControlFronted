"use client"

import Link from "next/link"
import { ArrowLeft, Wifi } from "lucide-react"

import { RealtimeVitalsCard } from "@/components/dashboard/patient/RealtimeVitalsCard"
import { Button } from "@/components/ui/button"

export default function DemoIotPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary/10 p-2">
                <Wifi className="h-6 w-6 text-primary" />
              </span>
              <h1 className="text-3xl font-bold tracking-tight">Demo IoT</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Datos recibidos desde Wokwi / ESP32 a traves de EdgeService.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </header>

        <RealtimeVitalsCard />
      </div>
    </main>
  )
}
