import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { Credential } from "@/common/utils/credential";
import { webSetting } from "@/settings";
import { Workbench } from "@/settings/workbench";

// Axios请求拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = Credential.token;
        if (token && config.url && ~config.url.indexOf("unity")) {
            config.headers.Authorization = `bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
/**
 * 业务服务基类。
 * @abstract
 * @class
 * @version 1.0.0
 */
export default abstract class ServiceBase {

    private static globalSource: CancelTokenSource = axios.CancelToken.source();

    protected get config(): AxiosRequestConfig {
        return {
            baseURL: webSetting.mock?.open ? webSetting.mock.url : webSetting.serviceUrl,
            timeout: 10000,
            cancelToken: ServiceBase.globalSource.token,
            validateStatus: (status: number) => {
                // token 失效
                if (status === 401) {
                    Credential.clear("token");
                    Workbench.app?.$router?.push({ name: "login" });
                }
                return status >= 200 && status < 300;
            }
        };
    }

    /**
     * 取消请求
     * @param msg 描述信息
     * @param source CancelToken源(为空则取消所有请求)
     */
    protected cancel(source: CancelTokenSource = ServiceBase.globalSource, msg?: string) {
        source.cancel(msg);
    }

    /**
     * 发送post请求
     * @param url 请求地址
     * @param data 发送的参数
     * @param config 请求配置
     */
    protected _post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return axios.post(url, data, { ...this.config, ...config }).then(res => res.data);
    }

    /**
     * 发送get请求
     * @param url 请求地址
     * @param config 请求配置
     */
    protected _get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return axios.get(url, { ...this.config, ...config }).then(res => res.data);
    }

    /**
     * 发送put请求
     * @param url 请求地址
     * @param data 请求参数
     * @param config 请求配置
     */
    protected _put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return axios.put(url, data, { ...this.config, ...config }).then(res => res.data);
    }

    /**
     * 发送delete请求
     * @param url 请求地址
     * @param config 请求配置
     */
    protected _delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return axios.delete(url, { ...this.config, ...config }).then(res => res.data);
    }

    /**
     * 导出数据
     * @param url 
     * @param data 
     */
    protected _export<T>(url: string, data?: any): Promise<any> {
        return axios.post(url, data, { headers: { "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/json; charset=UTF-8", "Access-Control-Allow-Origin": "*" }, "responseType": "arraybuffer" }).then((res: any) => {
            let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
            let objectUrl = URL.createObjectURL(blob);
            window.location.href = objectUrl;
        });
    }

    /**
     * Get方法-导出数据
     * @param url 
     * @param condition
     */
    protected async  _exportGet<T>(url: string, condition?: any): Promise<any> {
        let exportUrl = webSetting.serviceUrl + url + "?access_token=" + Credential.token + "&query=" + JSON.stringify(condition);
        (<any>window).open(exportUrl, "_blank");
    }
}
