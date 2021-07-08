import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import Modelling from '@/views/index.vue'
const routes = [
    {
        path: "/", name: "Modelling", component: Modelling,

    },
];

// 3. 创建路由实例
const router = createRouter({
    // 4. 采用hash 模式
    history: createWebHashHistory(),
    // 采用 history 模式
    // history: createWebHistory(),
    routes, // short for `routes: routes`
});
//路由守卫
// router.beforeEach((to, from, next) => {
//     if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//     else next()
//   })
export default router