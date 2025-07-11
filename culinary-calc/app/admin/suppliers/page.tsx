"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building, Search, Eye, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

interface Supplier {
  id: string
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  user: {
    name: string
    email: string
  }
  createdAt: string
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalSuppliers, setTotalSuppliers] = useState(0)

  useEffect(() => {
    fetchSuppliers()
  }, [currentPage, searchTerm])

  const fetchSuppliers = async () => {
    try {
      // Dados simulados por enquanto
      setSuppliers([
        {
          id: "1",
          name: "Distribuidora Pão & Cia",
          contact: "João Silva",
          email: "joao@paoecompanhia.com",
          phone: "(11) 99999-9999",
          address: "Rua das Padarias, 123 - São Paulo, SP",
          isActive: true,
          user: { name: "João Silva", email: "joao@teste.com" },
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "Açúcar & Mel Ltda",
          contact: "Maria Santos",
          email: "maria@acucaremel.com",
          phone: "(11) 88888-8888",
          address: "Av. Doce Vida, 456 - São Paulo, SP",
          isActive: true,
          user: { name: "Maria Santos", email: "maria@teste.com" },
          createdAt: "2024-01-20T14:30:00Z",
        },
      ])
      setTotalSuppliers(2)
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Todos os Fornecedores</h1>
            <p className="text-slate-600">Visualize e gerencie todos os fornecedores do sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Total: {totalSuppliers} fornecedores
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar fornecedores por nome, contato ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredSuppliers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhum fornecedor encontrado" : "Nenhum fornecedor cadastrado"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? "Tente buscar com outros termos" : "Ainda não há fornecedores no sistema"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-indigo-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Ativo
                          </Badge>
                        </div>

                        {supplier.contact && <p className="text-sm text-gray-600 mb-2">Contato: {supplier.contact}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">Cadastrado por:</div>
                            <div className="font-medium text-sm">{supplier.user.name}</div>
                            <div className="text-xs text-gray-500">{supplier.user.email}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-500">Data de Cadastro:</div>
                            <div className="font-medium text-sm">
                              {new Date(supplier.createdAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {supplier.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{supplier.email}</span>
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{supplier.phone}</span>
                            </div>
                          )}
                          {supplier.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-xs">{supplier.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalSuppliers > 20 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {currentPage} de {Math.ceil(totalSuppliers / 20)}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalSuppliers / 20)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
