// 插件样式
import "normalize.css";
import "view-design/dist/styles/iview.css";
import "mapbox-gl/dist/mapbox-gl.css";
// 项目样式
import "./index.scss";

import { webSetting } from "@/settings";
import { Global } from "@/common/namespace/global";
/**
 * 屏幕分辨率自适应
 *
 * @export
 * @class Screen
 */
export class Screen {
    /**
     * 设计稿屏幕宽度
     *
     * @protected
     * @type {number}
     * @memberof Screen
     */
    protected designWidth!: number;
    /**
     * 设计稿屏幕高度
     *
     * @protected
     * @type {number}
     * @memberof Screen
     */
    protected designHeight!: number;
    /**
     * 最小屏幕宽度
     *
     * @protected
     * @type {number}
     * @memberof Screen
     */
    protected minWidth!: number;
    /**
     * 最小屏幕高度
     *
     * @protected
     * @type {number}
     * @memberof Screen
     */
    protected minHeight!: number;

    public constructor(options: { width: number; height: number; minWidth?: number; minHeight?: number }) {
        this.designWidth = options.width || 1920;
        this.designHeight = options.height || 1080;
        this.minWidth = options.minWidth || 700;
        this.minHeight = options.minHeight || 620;
        this.resize();
        // this.setWindowTitle();
        addEventListener("resize", this.resize.bind(this));
    }

    public resize() {
        const htmlHeight = Math.max(document.documentElement.clientHeight, this.minHeight);
        document.documentElement.style.cssText = Global.isDev || this.designWidth > 1920 ?
            `width: 100%;
            height: ${htmlHeight}px;
            font-size: ${htmlHeight / (this.designHeight / 100)}px;`
            :
            `width: 100%;
            height: 100%;
            min-width: ${this.minWidth}px;
            min-height: ${this.minHeight}px;
            font-size: ${htmlHeight / (this.designHeight / 100)}px;`;
    }

    public setWindowTitle() {
        const titleEle = document.querySelector("title");
        if (!webSetting.heading || !titleEle) return;
        titleEle.innerText = webSetting.heading;
    }

}

export default class Style {

    public constructor() {
        new Screen(webSetting.screen);
        // this.setCssVar();
    }

    // public setCssVar() {
    //     document.body.style.setProperty("--pluginsUrl", webSetting.pluginsUrl);
    // }
}