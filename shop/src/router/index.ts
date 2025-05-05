import {createRouter, createWebHistory} from 'vue-router'
import ShoppingCart from "@/views/shoppingCart.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shoppingCart',
      component: ShoppingCart,
    },
    //   TODO: Route to Checkout
  ],
})

export default router
