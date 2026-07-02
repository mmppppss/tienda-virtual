export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
