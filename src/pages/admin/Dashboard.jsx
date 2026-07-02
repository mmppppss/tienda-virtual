import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    categories: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { count: totalProducts } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })

    const { count: activeProducts } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('activo', true)

    const { count: categories } = await supabase
      .from('categorias')
      .select('*', { count: 'exact', head: true })

    setStats({
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      categories: categories || 0,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <Link
          to="/admin/productos/nuevo"
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total productos</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Activos</p>
              <p className="text-2xl font-bold text-slate-800">{stats.activeProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Categorías</p>
              <p className="text-2xl font-bold text-slate-800">{stats.categories}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
