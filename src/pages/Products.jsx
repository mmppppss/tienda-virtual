import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ProductGrid } from '../components/products/ProductGrid'

export function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('todos')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre')

    setCategories(data || [])
  }

  const filteredProducts = category === 'todos'
    ? products
    : products.filter((p) => p.categoria === category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Productos</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === 'todos'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              category === cat.slug
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  )
}
