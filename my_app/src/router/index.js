import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Note from '../views/Note.vue'
import MyList from '../views/MyList.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Note',
    component: Note
  },
  {
    path: '/MyList',
    name: 'MyList',
    component: MyList
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
