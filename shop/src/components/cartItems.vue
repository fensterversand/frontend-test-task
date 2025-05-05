<script setup lang="ts">
import {useCartStore} from "@/stores/cart.ts";
import {onMounted} from "vue";

const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchProduct()
})
</script>

<template>
  <!--  TODO: Add styling for Table overall-->
  <!--  TODO: Not the best idea to overflow on mobile, rather change positions / widths / show less-->
  <div class="cart-items pt-16 w-full overflow-x-auto">
    <table v-if="cartStore.cartItems.length > 0" class="table-auto w-full">
      <thead>
      <!--      TODO: Add Header Styling-->
      <!--      TODO: Define Header width-->
      <tr>
        <th class="text-center">Product</th>
        <th class="text-center">Price</th>
        <th class="text-center">Quantity</th>
        <th class="text-center">Total</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="cartItem in cartStore.cartItems">
        <td class="py-2 px-4 border-b border-gray-200">
          <div class="flex">

            <div class="relative w-[5rem] h-[5rem] aspect-square">
              <img :src="cartItem?.image" alt="product-image"
                   class="w-[5rem] h-[5rem] object-contain"/>

              <!--            TODO: Add X-->
              <button
                @click="cartStore.removeCartItemById(cartItem.id)"
                class="bg-black rounded-[100%] cursor-pointer hover:bg-pink-500 transition-colors w-[.75rem] h-[.75rem] absolute top-0 right-0">
              </button>
            </div>

            <div class="p-4 w-full">
              <h2 class="text-md">{{ cartItem?.title }}</h2>
              <!-- TODO: Add right trim-->
              <p v-if="cartItem?.description" class="text-xs text-gray-500">
                {{ cartItem?.description?.substring(0, 80) }} ...
              </p>
            </div>
          </div>
        </td>

        <!--        TODO: Add Currency-->
        <td class="py-2 px-4 border-b border-gray-200">
          <p class="text-center">{{ cartItem?.price.toFixed(2) }}</p>
        </td>

        <td class="py-2 px-4 border-b border-gray-200 text-center">
          <!--          TODO: Value cant be below 0-->
          <!--          TODO: Add Validation-->
          <input v-model="cartItem.quantity" @input="cartStore.updateTotals" type="number"
                 name="quantity" min="0"
                 class="w-[4rem]"/>
        </td>

        <!--        TODO: Add Currency-->
        <!--      TODO: Add right formating  -->
        <td class="py-2 px-4 border-b border-gray-200">
          <p class="w-[5rem] text-center mx-auto">
            {{ (cartItem?.quantity * cartItem?.price).toFixed(2) }}
          </p>
        </td>
      </tr>
      </tbody>
    </table>

    <!--    TODO: Loading should not flicker -->
    <div v-else-if="cartStore.isLoading">loading...</div>
    <div v-else-if="cartStore.error">error</div>
    <div v-else>
      <h2 class="w-full py-20 text-center"> No Cart Items added - Feel free to add</h2>
    </div>
  </div>
</template>
