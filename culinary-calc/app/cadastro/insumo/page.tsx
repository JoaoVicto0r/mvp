"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CadastroInsumoPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para a página de novo insumo
    router.replace("/insumos/novo")
  }, [router])

  return null
}
