import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Store, User, LogOut, Package } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { LoginModal } from '../ui/LoginModal'

export function Navbar() {
  const { items } = useCart()
  const { user, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  const handleLogout = async () => {
    await signOut()
    setShowMenu(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Store size={24} />
              Tienda
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link to="/productos" className="text-slate-600 hover:text-primary transition-colors">
                Productos
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/carrito" className="relative text-slate-600 hover:text-primary">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Conectado como</p>
                        <p className="text-sm text-slate-700 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/mis-pedidos"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <Package size={16} />
                        Mis Pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Iniciar sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  )
}
