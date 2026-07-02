export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Tienda. Todos los derechos reservados.</p>
          <p className="mt-1">Precios en BS (Bolivianos)</p>
        </div>
      </div>
    </footer>
  )
}
