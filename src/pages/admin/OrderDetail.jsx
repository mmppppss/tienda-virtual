import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, ExternalLink, Clock, Check, Truck, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LocationMap } from '../../components/ui/LocationMap'

export function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setOrder(data)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (newStatus) => {
    const { error } = await supabase
      .from('ordenes')
      .update({ estado: newStatus })
      .eq('id', id)

    if (!error) {
      setOrder({ ...order, estado: newStatus })
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

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500">Cargando...</div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-slate-500">Pedido no encontrado</div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/pedidos')}
        className="flex items-center gap-2 text-slate-600 hover:text-primary mb-6"
      >
        <ArrowLeft size={20} />
        Volver a pedidos
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pedido #{id.slice(0, 8)}</h1>
          <p className="text-slate-500">{formatDate(order.created_at)}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(order.estado)}`}
        >
          {getStatusIcon(order.estado)}
          {order.estado}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Dirección */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Dirección de entrega
            </h2>
            
            <div className="space-y-2">
              <p className="text-slate-700">
                {order.direccion?.calle} {order.direccion?.numero || ''}
                {order.direccion?.zona ? `, ${order.direccion.zona}` : ''}
              </p>
              <p className="text-slate-700">{order.direccion?.ciudad}</p>
              {order.direccion?.referencia && (
                <p className="text-sm text-slate-500">
                  Referencia: {order.direccion.referencia}
                </p>
              )}
              <p className="text-sm text-slate-500">
                Teléfono: {order.direccion?.telefono || order.telefono}
              </p>

              {order.direccion?.ubicacion && (
                <a
                  href={`https://www.google.com/maps?q=${order.direccion.ubicacion.lat},${order.direccion.ubicacion.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-dark mt-2"
                >
                  <ExternalLink size={14} />
                  Abrir en Google Maps
                </a>
              )}
            </div>

            {order.direccion?.ubicacion && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                <LocationMap
                  position={[
                    order.direccion.ubicacion.lat,
                    order.direccion.ubicacion.lng,
                  ]}
                  readOnly
                />
              </div>
            )}
          </div>

          {/* Productos */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Productos</h2>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
                  {item.imagen_url && (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.nombre}</p>
                    <p className="text-sm text-slate-500">
                      {formatPrice(item.precio)} x {item.cantidad}
                    </p>
                  </div>
                  <p className="font-medium text-slate-800">
                    {formatPrice(item.precio * item.cantidad)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resumen */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Resumen</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-slate-800">
                <span>Total</span>
                <span className="text-primary text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">Método de pago</p>
              <p className="capitalize font-medium">{order.metodo_pago?.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Actualizar estado */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Actualizar estado</h2>
            <div className="space-y-2">
              {order.estado !== 'pendiente' && (
                <button
                  onClick={() => updateOrderStatus('pendiente')}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg text-sm hover:bg-yellow-600"
                >
                  Pendiente
                </button>
              )}
              {order.estado !== 'confirmada' && (
                <button
                  onClick={() => updateOrderStatus('confirmada')}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
                >
                  Confirmar
                </button>
              )}
              {order.estado !== 'entregada' && (
                <button
                  onClick={() => updateOrderStatus('entregada')}
                  className="w-full bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600"
                >
                  Entregada
                </button>
              )}
              {order.estado !== 'cancelada' && (
                <button
                  onClick={() => updateOrderStatus('cancelada')}
                  className="w-full bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
