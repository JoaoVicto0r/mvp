import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    const user = await AuthService.createUser({ name, email, password })
    const token = await AuthService.createSession(user.id)

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    // Configurar cookie seguro
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return response
  } catch (error) {
    console.error("Register error:", error)

    if (error instanceof Error && error.message === "Email já está em uso") {
      return NextResponse.json({ message: error.message }, { status: 409 })
    }

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
