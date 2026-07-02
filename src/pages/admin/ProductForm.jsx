import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen_url: '',
    activo: true,
  })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre')

    setCategories(data || [])
  }

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setForm({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio,
        categoria: data.categoria,
        stock: data.stock,
        imagen_url: data.imagen_url || '',
        activo: data.activo,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      ...form,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
    }

    if (isEditing) {
      await supabase
        .from('productos')
        .update(productData)
        .eq('id', id)
    } else {
      await supabase
        .from('productos')
        .insert([productData])
    }

    navigate('/admin/productos')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <Input
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (BS)"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={handleChange}
            required
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="URL de imagen"
          name="imagen_url"
          type="url"
          value={form.imagen_url}
          onChange={handleChange}
          placeholder="https://..."
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-slate-700">Producto activo</span>
        </label>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/productos')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </div>
  )
}
