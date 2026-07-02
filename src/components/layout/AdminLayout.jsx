import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Package, Store, LogOut, ShoppingBag } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/admin')
      return
    }
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/productos', icon: Package, label: 'Productos' },
    { to: '/admin/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Store size={24} />
            Admin
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors"
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="text-sm text-slate-500 mb-3 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-error rounded-lg transition-colors w-full"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
