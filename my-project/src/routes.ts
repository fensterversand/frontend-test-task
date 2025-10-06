import { createMemoryHistory, createRouter } from 'vue-router';
// TODO add more views
const CartPage = () => import('./views/pages/CartPage.vue');

const routes = [{ path: '/', component: CartPage }];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
