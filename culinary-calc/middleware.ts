import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "./lib/auth"
import { AdminService } from "./lib/admin"

const publicPaths = ["/", "/login", "/register"]
const apiPublicPaths = ["/api/auth/login", "/api/auth/register"]
const adminPaths = ["/admin"]
const apiAdminPaths = ["/api/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir arquivos estáticos
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next()
  }

  // Verificar se é uma rota pública
  if (publicPaths.includes(pathname) || apiPublicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar token de autenticação
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const user = await AuthService.validateSession(token)

    if (!user) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Sessão inválida" }, { status: 401 })
      }
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    // Verificar se é rota administrativa
    const isAdminPath =
      adminPaths.some((path) => pathname.startsWith(path)) || apiAdminPaths.some((path) => pathname.startsWith(path))

    if (isAdminPath) {
      const isAdmin = await AdminService.isAdmin(user.id)

      if (!isAdmin) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Acesso negado - Apenas administradores" }, { status: 403 })
        }
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // Adicionar informações do usuário ao header para as rotas da API
    if (pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", user.id)
      requestHeaders.set("x-user-email", user.email)
      requestHeaders.set("x-user-role", user.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware auth error:", error)

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Erro de autenticação" }, { status: 500 })
    }

    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth-token")
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
