import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Check, X, Clock, Truck } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('ordenes')
      .update({ estado: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, estado: newStatus } : o)))
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-blue-100 text-blue-700',
      entregada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <Clock size={14} />
      case 'confirmada':
        return <Check size={14} />
      case 'entregada':
        return <Truck size={14} />
      case 'cancelada':
        return <X size={14} />
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
        <span className="text-sm text-slate-500">{orders.length} pedidos totales</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No hay pedidos aún</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Fecha</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Cliente</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Estado</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {order.direccion?.telefono || 'Sin teléfono'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.direccion?.calle}, {order.direccion?.ciudad}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.estado)}`}
                    >
                      {getStatusIcon(order.estado)}
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/pedidos/${order.id}`}
                        className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
