import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './hooks/useCart'
import { AuthProvider } from './hooks/useAuth'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AdminLayout } from './components/layout/AdminLayout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Login } from './pages/admin/Login'
import { Dashboard } from './pages/admin/Dashboard'
import { ProductsAdmin } from './pages/admin/ProductsAdmin'
import { ProductForm } from './pages/admin/ProductForm'
import { OrdersAdmin } from './pages/admin/OrdersAdmin'
import { OrderDetail } from './pages/admin/OrderDetail'
import { MyOrders } from './pages/MyOrders'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/productos"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Products />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/producto/:id"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <ProductDetail />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/carrito"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Cart />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Checkout />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/mis-pedidos"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <MyOrders />
                </main>
                <Footer />
              </div>
            }
          />

          <Route path="/admin" element={<Login />} />
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="productos" element={<ProductsAdmin />} />
            <Route path="productos/nuevo" element={<ProductForm />} />
            <Route path="productos/:id/editar" element={<ProductForm />} />
            <Route path="pedidos" element={<OrdersAdmin />} />
            <Route path="pedidos/:id" element={<OrderDetail />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
