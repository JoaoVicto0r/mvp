import { type NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { role } = await request.json()
    await AdminService.updateUserRole(params.id, role)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update user role error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
