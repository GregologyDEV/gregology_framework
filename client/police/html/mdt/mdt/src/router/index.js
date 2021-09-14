import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Informacje from "../views/Informacje.vue"
import Taryfikator from "../views/Taryfikator.vue"
import Management from "../views/Management.vue"
import Dispatch from "../views/Dispatch.vue"
import TowedVehicles from "../views/TowedVehicles.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/informacje',
    name: 'informacje',
    component: Informacje
  },
  {
    path: '/taryfikator',
    name: 'taryfikator',
    component: Taryfikator
  },
  {
    path: '/management',
    name: 'management',
    component: Management
  },
  {
    path: '/dispatch',
    name: 'dispatch',
    component: Dispatch
  },
  {
    path: '/towedVehicles',
    name: 'towedVehicles',
    component: TowedVehicles
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
