import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Banknote, QrCode, Phone, User } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { LocationMap } from '../components/ui/LocationMap'
import { LoginModal } from '../components/ui/LoginModal'

export function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [metodoPago, setMetodoPago] = useState('contra_entrega')
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [location, setLocation] = useState(null)
  const [direccion, setDireccion] = useState({
    zona: '',
    calle: '',
    numero: '',
    referencia: '',
    telefono: user?.user_metadata?.phone || '',
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(price)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDireccion((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationSelect = (loc) => {
    setLocation(loc)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!direccion.calle || !direccion.telefono) {
      alert('Por favor completa calle y teléfono')
      return
    }

    setLoading(true)

    const orderData = {
      user_id: user?.id || null,
      items: items.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen_url: item.imagen_url,
      })),
      total: total,
      metodo_pago: metodoPago,
      estado: 'pendiente',
      direccion: {
        ciudad: 'Camiri',
        zona: direccion.zona,
        calle: direccion.calle,
        numero: direccion.numero,
        referencia: direccion.referencia,
        telefono: direccion.telefono,
        ubicacion: location,
      },
    }

    const { error } = await supabase.from('ordenes').insert([orderData])

    setLoading(false)

    if (error) {
      console.error('Error al guardar orden:', error)
      alert('Error al procesar el pedido. Intenta novamente.')
      return
    }

    alert(
      `¡Pedido confirmado!\n\n` +
        `Método de pago: Contra entrega\n` +
        `Entrega en: ${direccion.calle} ${direccion.numero || ''}, ` +
        `${direccion.zona ? direccion.zona + ', ' : ''}Camiri\n\n` +
        `Total: ${formatPrice(total)}\n\n` +
        `Te contactaremos al ${direccion.telefono} para coordinar la entrega.`
    )
    clearCart()
    navigate('/')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">No hay productos en el carrito</h1>
          <Link
            to="/productos"
            className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

      {/* Login status */}
      <div className="mb-6">
        {user ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User size={16} className="text-primary" />
            <span>Conectado como <strong>{user.email}</strong></span>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
          >
            <User size={16} />
            Iniciar sesión para guardar tu pedido
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Datos de entrega */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-slate-800">Datos de entrega</h2>
              </div>

              {/* Ciudad fija */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
                <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  Camiri
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Zona / Barrio
                  </label>
                  <input
                    type="text"
                    name="zona"
                    value={direccion.zona}
                    onChange={handleChange}
                    placeholder="Ej: Centro, San Martín"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={direccion.numero}
                    onChange={handleChange}
                    placeholder="N° de puerta"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Calle *
                  </label>
                  <input
                    type="text"
                    name="calle"
                    value={direccion.calle}
                    onChange={handleChange}
                    required
                    placeholder="Nombre de la calle"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Referencia
                  </label>
                  <input
                    type="text"
                    name="referencia"
                    value={direccion.referencia}
                    onChange={handleChange}
                    placeholder="Ej: Casa azul, al lado del parque"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="tel"
                      name="telefono"
                      value={direccion.telefono}
                      onChange={handleChange}
                      required
                      placeholder="Ej: 71234567"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Mapa */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccioná tu ubicación en el mapa
                </label>
                <LocationMap onLocationSelect={handleLocationSelect} />
                {location && (
                  <p className="text-xs text-slate-500 mt-2">
                    Ubicación: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-slate-800">Método de pago</h2>
              </div>

              <div className="space-y-3">
                {/* Contra entrega */}
                <label
                  className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                    metodoPago === 'contra_entrega'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="contra_entrega"
                    checked={metodoPago === 'contra_entrega'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={18} className="text-success" />
                      <span className="font-medium text-slate-800">Contra entrega</span>
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                        Disponible
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Paga al recibir tu pedido en efectivo
                    </p>
                  </div>
                </label>

                {/* QR Simple */}
                <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl opacity-60 cursor-not-allowed">
                  <input type="radio" name="metodoPago" disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode size={18} className="text-slate-400" />
                      <span className="font-medium text-slate-600">QR Simple</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        Próximamente
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Pago automático con código QR (próximamente)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Resumen del pedido</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 truncate flex-1 mr-2">
                      {item.nombre} x{item.cantidad}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {formatPrice(item.precio * item.cantidad)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold text-slate-800">
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Confirmar pedido'}
              </button>

              <Link
                to="/carrito"
                className="block w-full mt-3 text-center text-slate-500 hover:text-primary text-sm py-2"
              >
                Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </form>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {}}
      />
    </div>
  )
}
