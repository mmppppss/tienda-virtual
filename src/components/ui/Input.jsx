export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          error ? 'border-error' : 'border-slate-200'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
