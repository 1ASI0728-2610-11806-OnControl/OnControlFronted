import { AppointmentDetailsPage } from "@/components/appointment-details"

export default async function DoctorAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AppointmentDetailsPage id={id} role="DOCTOR" />
}
