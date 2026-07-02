import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart'

export function ProductCard({ product }) {
  const { addItem } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/producto/${product.id}`}>
        <div className="aspect-square bg-slate-100">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Sin imagen
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-medium text-slate-800 hover:text-primary truncate">
            {product.nombre}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mt-1 capitalize">{product.categoria}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-primary">
            {formatPrice(product.precio)}
          </span>
          <button
            onClick={() => addItem(product)}
            className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
