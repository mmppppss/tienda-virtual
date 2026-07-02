import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...current, { ...product, cantidad: 1 }]
    })
  }

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, cantidad) => {
    if (cantidad <= 0) {
      removeItem(productId)
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, cantidad } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
