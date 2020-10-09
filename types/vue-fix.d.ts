import VueRouter, { Route } from "vue-router";
import { Store } from "vuex";

// node_modelus 模块声明处理
declare module "vue/types/vue" {
    interface Vue {

        $router: VueRouter;
        $route: Route;
        $store: Store<any>;
        /**
         * 事件总线
         *
         * @type {Vue}
         * @memberof Vue
         */
        $bus: Vue;
    }
}