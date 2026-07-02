import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../hooks/useCart'

export function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()

    setProduct(data)
    setLoading(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-slate-500">Cargando...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-slate-500">Producto no encontrado</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
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

        <div className="flex flex-col">
          <span className="text-sm text-slate-500 capitalize">{product.categoria}</span>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">{product.nombre}</h1>
          <p className="text-3xl font-semibold text-primary mt-4">
            {formatPrice(product.precio)}
          </p>
          <p className="text-slate-600 mt-6 leading-relaxed">{product.descripcion}</p>

          <div className="mt-8">
            <p className="text-sm text-slate-500">
              Stock disponible: <span className="font-medium text-slate-700">{product.stock}</span>
            </p>
          </div>

          <button
            onClick={() => addItem(product)}
            className="mt-8 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
