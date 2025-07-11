import { sql } from "./database"
import type { User } from "./database"

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  admin_response?: string
  admin_id?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  user?: {
    name: string
    email: string
  }
  admin?: {
    name: string
  }
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type?: string
  entity_id?: string
  details?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  user?: {
    name: string
    email: string
  }
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalRecipes: number
  totalIngredients: number
  totalSuppliers: number
  openTickets: number
  resolvedTickets: number
  recentActivity: number
}

export class AdminService {
  // Verificar se o usuário é admin
  static async isAdmin(userId: string): Promise<boolean> {
    const [user] = await sql`
      SELECT role FROM users WHERE id = ${userId} AND is_active = true
    `
    return user?.role === "admin"
  }

  // Estatísticas gerais do sistema
  static async getSystemStats(): Promise<AdminStats> {
    const [stats] = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM recipes) as total_recipes,
        (SELECT COUNT(*) FROM ingredients) as total_ingredients,
        (SELECT COUNT(*) FROM suppliers) as total_suppliers,
        (SELECT COUNT(*) FROM support_tickets WHERE status IN ('open', 'in_progress')) as open_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status IN ('resolved', 'closed')) as resolved_tickets,
        (SELECT COUNT(*) FROM activity_logs WHERE created_at > NOW() - INTERVAL '24 hours') as recent_activity
    `

    return {
      totalUsers: Number.parseInt(stats.total_users),
      activeUsers: Number.parseInt(stats.active_users),
      totalRecipes: Number.parseInt(stats.total_recipes),
      totalIngredients: Number.parseInt(stats.total_ingredients),
      totalSuppliers: Number.parseInt(stats.total_suppliers),
      openTickets: Number.parseInt(stats.open_tickets),
      resolvedTickets: Number.parseInt(stats.resolved_tickets),
      recentActivity: Number.parseInt(stats.recent_activity),
    }
  }

  // Listar todos os usuários
  static async getAllUsers(page = 1, limit = 20, search = ""): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit
    const searchPattern = `%${search}%`

    const users = await sql`
      SELECT id, name, email, role, is_active, created_at, updated_at
      FROM users 
      WHERE (name ILIKE ${searchPattern} OR email ILIKE ${searchPattern})
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE (name ILIKE ${searchPattern} OR email ILIKE ${searchPattern})
    `

    return {
      users: users as User[],
      total: Number.parseInt(count),
    }
  }

  // Ativar/Desativar usuário
  static async toggleUserStatus(userId: string, isActive: boolean): Promise<void> {
    await sql`
      UPDATE users 
      SET is_active = ${isActive}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `
  }

  // Alterar role do usuário
  static async updateUserRole(userId: string, role: string): Promise<void> {
    await sql`
      UPDATE users 
      SET role = ${role}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `
  }

  // Listar todos os tickets de suporte
  static async getAllSupportTickets(
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<{ tickets: SupportTicket[]; total: number }> {
    const offset = (page - 1) * limit

    let whereClause = ""
    const params: any[] = [limit, offset]

    if (status && status !== "all") {
      whereClause = "WHERE st.status = $3"
      params.push(status)
    }

    const query = `
      SELECT 
        st.*,
        u.name as user_name,
        u.email as user_email,
        a.name as admin_name
      FROM support_tickets st
      JOIN users u ON st.user_id = u.id
      LEFT JOIN users a ON st.admin_id = a.id
      ${whereClause}
      ORDER BY st.created_at DESC
      LIMIT $1 OFFSET $2
    `

    const tickets = await sql.unsafe(query, params)

    const countQuery = `
      SELECT COUNT(*) as count FROM support_tickets st
      ${whereClause}
    `
    const countParams = status && status !== "all" ? [status] : []
    const [{ count }] = await sql.unsafe(countQuery, countParams)

    return {
      tickets: tickets.map((ticket) => ({
        ...ticket,
        user: {
          name: ticket.user_name,
          email: ticket.user_email,
        },
        admin: ticket.admin_name ? { name: ticket.admin_name } : undefined,
      })) as SupportTicket[],
      total: Number.parseInt(count),
    }
  }

  // Responder ticket de suporte
  static async respondToTicket(ticketId: string, adminId: string, response: string, status: string): Promise<void> {
    await sql`
      UPDATE support_tickets 
      SET 
        admin_response = ${response},
        admin_id = ${adminId},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP,
        resolved_at = ${status === "resolved" ? sql`CURRENT_TIMESTAMP` : null}
      WHERE id = ${ticketId}
    `
  }

  // Criar ticket de suporte
  static async createSupportTicket(userId: string, subject: string, message: string, priority: string): Promise<void> {
    await sql`
      INSERT INTO support_tickets (user_id, subject, message, priority)
      VALUES (${userId}, ${subject}, ${message}, ${priority})
    `
  }

  // Listar todas as receitas (de todos os usuários)
  static async getAllRecipes(page = 1, limit = 20, search = ""): Promise<{ recipes: any[]; total: number }> {
    const offset = (page - 1) * limit
    const searchPattern = `%${search}%`

    const recipes = await sql`
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email,
        c.name as category_name
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.name ILIKE ${searchPattern}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM recipes r
      WHERE r.name ILIKE ${searchPattern}
    `

    return {
      recipes: recipes.map((recipe) => ({
        ...recipe,
        user: {
          name: recipe.user_name,
          email: recipe.user_email,
        },
        category: recipe.category_name ? { name: recipe.category_name } : null,
      })),
      total: Number.parseInt(count),
    }
  }

  // Listar todos os ingredientes (de todos os usuários)
  static async getAllIngredients(page = 1, limit = 20, search = ""): Promise<{ ingredients: any[]; total: number }> {
    const offset = (page - 1) * limit
    const searchPattern = `%${search}%`

    const ingredients = await sql`
      SELECT 
        i.*,
        u.name as user_name,
        u.email as user_email,
        c.name as category_name,
        s.name as supplier_name
      FROM ingredients i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      WHERE i.name ILIKE ${searchPattern}
      ORDER BY i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM ingredients i
      WHERE i.name ILIKE ${searchPattern}
    `

    return {
      ingredients: ingredients.map((ingredient) => ({
        ...ingredient,
        user: {
          name: ingredient.user_name,
          email: ingredient.user_email,
        },
        category: ingredient.category_name ? { name: ingredient.category_name } : null,
        supplier: ingredient.supplier_name ? { name: ingredient.supplier_name } : null,
      })),
      total: Number.parseInt(count),
    }
  }

  // Logs de atividade
  static async getActivityLogs(page = 1, limit = 50): Promise<{ logs: ActivityLog[]; total: number }> {
    const offset = (page - 1) * limit

    const logs = await sql`
      SELECT 
        al.*,
        u.name as user_name,
        u.email as user_email
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [{ count }] = await sql`
      SELECT COUNT(*) as count FROM activity_logs
    `

    return {
      logs: logs.map((log) => ({
        ...log,
        user: {
          name: log.user_name,
          email: log.user_email,
        },
      })) as ActivityLog[],
      total: Number.parseInt(count),
    }
  }

  // Registrar atividade
  static async logActivity(
    userId: string,
    action: string,
    entityType?: string,
    entityId?: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await sql`
      INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
      VALUES (${userId}, ${action}, ${entityType}, ${entityId}, ${JSON.stringify(details)}, ${ipAddress}, ${userAgent})
    `
  }
}
