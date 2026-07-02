export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-error text-white hover:bg-red-600',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  }

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
