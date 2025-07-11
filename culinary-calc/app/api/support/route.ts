import { type NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { subject, message, priority } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Assunto e mensagem são obrigatórios" }, { status: 400 })
    }

    await AdminService.createSupportTicket(userId, subject, message, priority || "medium")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Create support ticket error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
