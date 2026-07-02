import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'

export function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteModal.product) return

    await supabase
      .from('productos')
      .delete()
      .eq('id', deleteModal.product.id)

    setProducts(products.filter((p) => p.id !== deleteModal.product.id))
    setDeleteModal({ open: false, product: null })
  }

  const toggleActive = async (product) => {
    const { error } = await supabase
      .from('productos')
      .update({ activo: !product.activo })
      .eq('id', product.id)

    if (!error) {
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, activo: !p.activo } : p
        )
      )
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo producto
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Producto</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Precio</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Stock</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Estado</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.imagen_url ? (
                          <img src={product.imagen_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            -
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{product.nombre}</p>
                        <p className="text-sm text-slate-500 capitalize">{product.categoria}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {formatPrice(product.precio)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.activo
                          ? 'bg-success/10 text-success'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {product.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/productos/${product.id}/editar`}
                        className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, product })}
                        className="p-2 text-slate-500 hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No hay productos. ¡Crea el primero!
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Eliminar producto"
      >
        <p className="text-slate-600 mb-6">
          ¿Estás seguro de eliminar <strong>{deleteModal.product?.nombre}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, product: null })}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
