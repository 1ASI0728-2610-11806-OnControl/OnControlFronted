"use client"

import { Wifi } from "lucide-react"

import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RealtimeVitalsCard } from "@/components/dashboard/patient/RealtimeVitalsCard"

export default function PacienteIotPage() {
  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary/10 p-2">
                <Wifi className="h-6 w-6 text-primary" />
              </span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Monitor IoT
              </h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Datos recibidos desde Wokwi / ESP32 a traves de EdgeService.
            </p>
          </div>

          <RealtimeVitalsCard />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
