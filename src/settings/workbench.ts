import Vue from "vue";
import Vuex, { Store, StoreOptions } from "vuex";
import Router, { RouterOptions } from "vue-router";
// import math from "halo-math";

import { directives } from "@/common/utils/directive";
import "@/common/namespace/global";

// 导入样式
import Style from "@/assets/styles";
new Style();
Vue.config.devtools = true;

export interface IOptions {
    routerOptions: RouterOptions;
    storeOptions: StoreOptions<any>;
}
/**
 * 项目启动工作台
 *
 * @export
 * @class Workbench
 */
export class Workbench {

    private router!: Router;
    private store!: Store<any>;

    public static app: Vue;

    public constructor(options: IOptions) {
        this.initComponent();
        this.initRouter(options.routerOptions);
        this.initStore(options.storeOptions);
        this.initDirective();

        this.run();
    }

    /**
     * 初始化全局组件
     *
     * @memberof Workbench
     */
    public initComponent() {
        // 挂载全局事件
        Vue.prototype.$bus = new Vue();
        // 注册应用组件
        // Vue.use(math);
    }

    /**
     * 初始化路由
     *
     * @param {RouterOptions} options
     * @returns
     * @memberof Workbench
     */
    public initRouter(options: RouterOptions) {
        Vue.use(Router);
        return this.router = new Router(options);
    }

    /**
     * 初始化状态库
     *
     * @param {StoreOptions<any>} options
     * @returns
     * @memberof Workbench
     */
    public initStore(options: StoreOptions<any>) {
        Vue.use(Vuex);
        return this.store = new Vuex.Store(options);
    }

    /**
     * 初始化自定义指令
     *
     * @memberof Workbench
     */
    public initDirective() {
        Vue.use(directives);
    }

    private run() {
        Workbench.app = new Vue({
            el: "#app",
            router: this.router,
            store: this.store,
            template: "<div id='app'><router-view /></div>"
        });
    }

}