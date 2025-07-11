import { type NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = request.headers.get("x-user-id")
    const { response, status } = await request.json()

    if (!adminId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    await AdminService.respondToTicket(params.id, adminId, response, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Respond to ticket error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
