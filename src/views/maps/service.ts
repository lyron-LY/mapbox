import CommonService from "@/services/common-service";
import { serviceHandler as service } from "@/common/decorators/service-handler";

export default class Service extends CommonService {

    // scss -> css
    @service("query", { title: "scss -> css", dataName: "result" })
    public getCss(scss: string): Promise<any> {
        return this._post<any>("/scss-css", { scss: scss });
    }

}