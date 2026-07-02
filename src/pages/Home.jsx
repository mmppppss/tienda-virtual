import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ProductGrid } from '../components/products/ProductGrid'

export function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(8)

    setProducts(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800">Bienvenido a Tienda</h1>
        <p className="text-slate-500 mt-2">Los mejores productos al mejor precio</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <>
          <ProductGrid products={products} />
          <div className="text-center mt-12">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
            >
              Ver todos los productos
              <ArrowRight size={18} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
