import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Clock, Check, Truck, X, Package } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
    setLoading(false)
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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Iniciá sesión para ver tus pedidos</h1>
          <p className="text-slate-500 mt-2">Creá una cuenta o iniciá sesión para ver tu historial</p>
          <Link
            to="/"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Mis Pedidos</h1>
      <p className="text-slate-500 mb-8">Historial de tus compras</p>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">No tenés pedidos aún</h2>
          <p className="text-slate-500 mt-2">¿Qué esperás? ¡Hacé tu primer pedido!</p>
          <Link
            to="/productos"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-500">Pedido</span>
                    <span className="font-mono text-sm text-slate-700">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.estado)}`}
                    >
                      {getStatusIcon(order.estado)}
                      {order.estado}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>

                  <div className="mt-2">
                    <p className="text-sm text-slate-600">
                      {order.direccion?.calle} {order.direccion?.numero || ''},
                      {order.direccion?.zona ? ` ${order.direccion.zona},` : ''}{' '}
                      {order.direccion?.ciudad}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                      >
                        {item.nombre} x{item.cantidad}
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="text-xs text-slate-400">
                        +{order.items.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-slate-500 capitalize mt-1">
                    {order.metodo_pago?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
