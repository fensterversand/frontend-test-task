import {defineStore} from 'pinia'
import {ref} from 'vue'

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface CartItem extends Product {
  quantity: number
  total: number
}


// TODO: Define more Types

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const subtotal = ref<number>(0)
  const tax = ref<number>(0)
  const shipping = ref<number>(0)
  const total = ref<number>(0)

  function updateTotals() {
    subtotal.value = cartItems.value.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)

    cartItems.value.forEach(item => {
      item.total = parseFloat((item.price * item.quantity).toFixed(2))
    })

    tax.value = subtotal.value * 0.20
    total.value = subtotal.value + tax.value + shipping.value
    subtotal.value = parseFloat(subtotal.value.toFixed(2))
    tax.value = parseFloat(tax.value.toFixed(2))
    total.value = parseFloat(total.value.toFixed(2))
  }

  async function addProduct() {
    // TODO: Define Product
    const product: Product = {title: 'New Product', price: 29};
    fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then((data) => {
        const existingItemIndex = cartItems.value.findIndex(item => item.id === data.id)

        if (existingItemIndex !== -1) {

          // TODO: Not the best way
          cartItems.value[existingItemIndex].quantity += 1
          cartItems.value[existingItemIndex].total =
            parseFloat((cartItems.value[existingItemIndex].price *
              cartItems.value[existingItemIndex].quantity).toFixed(2))
        } else {
          cartItems.value.push({
            ...data,
            quantity: 1,
            total: parseFloat(data?.price.toFixed(2))
          })
        }

        updateTotals()
      }).catch((err) => {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Failed to fetch products:', err)
    });
  }

  async function fetchProduct() {
    isLoading.value = true
    error.value = null

    // TODO: Loading only a specific product
    try {
      const response = await fetch('https://fakestoreapi.com/products')

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const products = await response.json()
      const firstFiveProducts = products.slice(0, 5)
      cartItems.value = firstFiveProducts.map((product: Product) => ({
        ...product,
        quantity: 1,
        total: product.price
      }))

      updateTotals()

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Failed to fetch products:', err)
    } finally {
      isLoading.value = false
    }
  }

  function removeCartItemById(productId: number) {
    const index = cartItems.value.findIndex(item => item.id === productId)

    if (index !== -1) {
      cartItems.value.splice(index, 1)
      updateTotals()
    }
  }

  function clearCart() {
    cartItems.value = []
    updateTotals()
  }

  function calculateShipping() {
    // TODO: Only Add Shipping when fields have values
    const min = 0.99;
    const max = 99.00;
    const randomShipping = min + Math.random() * (max - min);
    shipping.value = parseFloat(randomShipping.toFixed(2));

    updateTotals()
  }

  return {
    isLoading,
    error,
    cartItems,
    fetchProduct,
    clearCart,
    removeCartItemById,
    subtotal,
    tax,
    shipping,
    total,
    updateTotals,
    addProduct,
    calculateShipping
  }
})
