import ServiceBase from "./service-base";
// import { webSetting } from "@/settings";
// import { serviceHandler as service } from "@/common/decorators/service-handler";

/**
 * 公共接口
 *
 * @export
 * @abstract
 * @class CommonService
 * @extends {ServiceBase}
 * @description 所有项目公用的接口；项目（非页面中，例如 footer）私有接口，放在在各自项目app.ts中，作为项目所有页面公共接口；
 */
export default abstract class CommonService extends ServiceBase {

    public static subscribes: Map<string, any> = new Map();

    /**
     * 取消订阅
     */
    public unsubscribe(name?: string) {
        if (name) {
            CommonService.subscribes.get(name).unsubscribe();
        } else {
            [...CommonService.subscribes.values()].forEach(g => g.unsubscribe && g.unsubscribe());
        }
    }

}
