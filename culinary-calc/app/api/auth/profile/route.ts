import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userEmail = request.headers.get("x-user-email")
    const userName = request.headers.get("x-user-name")
    const userRole = request.headers.get("x-user-role")

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    return NextResponse.json({
      id: userId,
      email: userEmail,
      name: userName,
      role: userRole,
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
