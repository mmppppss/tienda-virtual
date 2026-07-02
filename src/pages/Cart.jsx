import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart'

export function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Tu carrito está vacío</h1>
          <p className="text-slate-500 mt-2">Agrega productos para continuar</p>
          <Link
            to="/productos"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Carrito de compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.imagen_url ? (
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 truncate">{item.nombre}</h3>
                <p className="text-primary font-semibold mt-1">{formatPrice(item.precio)}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-error transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <span className="font-semibold text-slate-800">
                  {formatPrice(item.precio * item.cantidad)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} productos)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-slate-800">
                <span>Total</span>
                <span className="text-primary text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Finalizar compra
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-3 text-slate-500 hover:text-error text-sm py-2"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
