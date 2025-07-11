import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sql } from "./database"
import type { User } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 dias

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static generateToken(): string {
    return jwt.sign({ random: Math.random() }, JWT_SECRET, { expiresIn: "7d" })
  }

  static async createUser(userData: {
    name: string
    email: string
    password: string
    role?: string
  }): Promise<User> {
    const { name, email, password, role = "user" } = userData

    // Verificar se o email já existe
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      throw new Error("Email já está em uso")
    }

    const passwordHash = await this.hashPassword(password)

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${role})
      RETURNING id, name, email, role, is_active, created_at, updated_at
    `

    return user as User
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (!user) {
      return null
    }

    const isValidPassword = await this.verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as User
  }

  static async createSession(userId: string): Promise<string> {
    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    // Limpar sessões expiradas do usuário
    await sql`
      DELETE FROM user_sessions 
      WHERE user_id = ${userId} AND expires_at < NOW()
    `

    await sql`
      INSERT INTO user_sessions (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt})
    `

    return token
  }

  static async validateSession(token: string): Promise<User | null> {
    const [session] = await sql`
      SELECT s.*, u.id, u.name, u.email, u.role, u.is_active
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token} AND s.expires_at > NOW() AND u.is_active = true
    `

    if (!session) {
      return null
    }

    return {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      is_active: session.is_active,
      created_at: session.created_at,
      updated_at: session.updated_at,
    } as User
  }

  static async deleteSession(token: string): Promise<void> {
    await sql`
      DELETE FROM user_sessions WHERE token = ${token}
    `
  }

  static async getUserById(id: string): Promise<User | null> {
    const [user] = await sql`
      SELECT id, name, email, role, is_active, created_at, updated_at
      FROM users 
      WHERE id = ${id} AND is_active = true
    `

    return (user as User) || null
  }
}
