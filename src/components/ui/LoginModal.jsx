import { useState } from 'react'
import { X, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (isLogin) {
      const { data, error } = await signIn(email, password)
      if (error) {
        console.error('Login error:', error)
        setError('Email o contraseña incorrectos')
        setLoading(false)
        return
      }
      setSuccess('¡Sesión iniciada!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 500)
    } else {
      if (!phone || phone.length < 8) {
        setError('Ingresá un número de teléfono válido')
        setLoading(false)
        return
      }

      const { data, error } = await signUp(email, password, phone)
      console.log('SignUp result:', { data, error })
      
      if (error) {
        console.error('SignUp error:', error)
        if (error.message.includes('rate limit')) {
          setError('Demasiados intentos. Esperá unos minutos y volvé a intentar.')
        } else if (error.message.includes('already registered')) {
          setError('Este email ya está registrado. Iniciá sesión.')
        } else if (error.message.includes('valid email')) {
          setError('Email inválido')
        } else if (error.message.includes('6 characters')) {
          setError('La contraseña debe tener al menos 6 caracteres')
        } else {
          setError(error.message || 'Error al crear la cuenta')
        }
        setLoading(false)
        return
      }

      setSuccess('¡Cuenta creada! Ya podés iniciar sesión.')
      setTimeout(() => {
        setIsLogin(true)
        setSuccess('')
      }, 2000)
    }

    setLoading(false)
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setPhone('')
    setError('')
    setSuccess('')
    setIsLogin(true)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
            <User size={24} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isLogin
              ? 'Ingresa para guardar tus pedidos'
              : 'Creá tu cuenta para guardar tus pedidos'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono *
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Ej: 71234567"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setSuccess('')
            }}
            className="text-sm text-primary hover:text-primary-dark"
          >
            {isLogin ? '¿No tenés cuenta? Creá una' : '¿Ya tenés cuenta? Iniciá sesión'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onSuccess?.()
              handleClose()
            }}
            className="w-full text-sm text-slate-500 hover:text-slate-700"
          >
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  )
}
