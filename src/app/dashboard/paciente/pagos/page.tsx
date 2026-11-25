"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CreditCard } from "lucide-react"
import { notFound } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard-updated"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient, type DemoPaymentMethod, type DemoPaymentScenario } from "@/lib/api"

const scenarios: { value: DemoPaymentScenario; label: string }[] = [
  { value: "VALID_VISA", label: "Visa válida" },
  { value: "VALID_MASTERCARD", label: "Mastercard válida" },
  { value: "DECLINED", label: "Tarjeta rechazada" },
  { value: "EXPIRED", label: "Tarjeta vencida" },
]

export default function PaymentMethodsPage() {
  if (process.env.NEXT_PUBLIC_PAYMENTS_DEMO !== "true") notFound()

  return (
    <AuthGuard requiredRole="PATIENT">
      <DashboardLayout>
        <DemoPaymentMethods />
      </DashboardLayout>
    </AuthGuard>
  )
}

function DemoPaymentMethods() {
  const [methods, setMethods] = useState<DemoPaymentMethod[] | null>(null)
  const [scenario, setScenario] = useState<DemoPaymentScenario | "">("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    apiClient.listDemoPaymentMethods(controller.signal).then(setMethods).catch(() => {
      if (!controller.signal.aborted) setError("No pudimos cargar tus métodos de prueba.")
    })
    return () => controller.abort()
  }, [])

  async function addMethod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!scenario) return
    setBusy(true)
    setError("")
    setStatus("")
    try {
      const method = await apiClient.addDemoPaymentMethod(scenario)
      setMethods((items) => [method, ...(items ?? [])])
      setScenario("")
      setStatus("Método de prueba guardado.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar el método.")
    } finally {
      setBusy(false)
    }
  }

  async function removeMethod(id: number) {
    setBusy(true)
    setError("")
    setStatus("")
    try {
      await apiClient.removeDemoPaymentMethod(id)
      setMethods((items) => items?.filter((method) => method.id !== id) ?? [])
      setStatus("Método de prueba eliminado.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos eliminar el método.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Métodos de pago</h1>
        <p className="text-muted-foreground">Modo de prueba con tarjetas ficticias. No se realizan cobros.</p>
      </header>
      {error && <p role="alert" className="rounded-md border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
      {status && <p role="status" className="text-sm font-medium text-primary">{status}</p>}
      <Card>
        <CardHeader><CardTitle>Agregar método de prueba</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addMethod} className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="w-full space-y-2">
              <Label htmlFor="payment-scenario">Tarjeta de prueba</Label>
              <Select value={scenario} onValueChange={(value: DemoPaymentScenario) => setScenario(value)} disabled={busy}>
                <SelectTrigger id="payment-scenario" className="w-full"><SelectValue placeholder="Elige una tarjeta de prueba" /></SelectTrigger>
                <SelectContent>
                  {scenarios.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={busy || !scenario || !methods}>Guardar método</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Mis métodos guardados</CardTitle></CardHeader>
        <CardContent>
          {!methods && !error && <p role="status" className="text-sm text-muted-foreground">Cargando métodos…</p>}
          {methods?.length === 0 && <p className="text-sm text-muted-foreground">Aún no tienes métodos guardados.</p>}
          <ul className="divide-y">
            {methods?.map((method) => (
              <li key={method.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <CreditCard aria-hidden="true" className="size-5 text-muted-foreground" />
                  <span>{method.brand} ···· {method.lastFour}</span>
                </div>
                <Button type="button" variant="outline" size="sm" disabled={busy}
                  aria-label={`Quitar ${method.brand} terminada en ${method.lastFour}`}
                  onClick={() => void removeMethod(method.id)}>Quitar</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
