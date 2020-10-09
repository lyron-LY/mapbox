import Vue from "vue";
/**
 * 服务处理装饰器
 * @param serviveType   服务类型 [query: 查询类 | save: 服务保存类，包含delete/update/save]
 * @param option        控制参数 {title?: 服务名 | dataName?: 指定返回数据对象 | showTip?: 开启页面提示}
 */
export function serviceHandler(
    serviveType?: string,
    option?: { title?: string; dataName?: string; showTip?: boolean }
) {
    return (target: any, name: string, descriptor: any) => {
        let handler: Function;
        switch (serviveType) {
            case "query": handler = ResponseHandler.query; break;
            case "save": handler = ResponseHandler.save; break;
            default: handler = ResponseHandler.query; break;
        }
        descriptor.value = handler(target, target[name], option);
    };
}

class ResponseHandler {
    /**
     * 查询服务接口处理器
     * @param service 类的构造函数
     * @param method  服务接口
     * @param option  控制参数
     */
    public static query(
        service: FunctionConstructor,
        method: Function,
        option?: { title?: string; dataName?: string; showTip?: boolean }
    ) {
        return async function (this: any) {
            let { title = "", dataName = "", showTip = false } = option || {};
            return method.call(this || service, ...arguments).then((res: any) => {
                let msg: string;
                if (!res) {
                    msg = `${title}结果异常`;
                    showTip && ResponseHandler.message.warning(msg);
                    console.warn(msg);
                    return null;
                }
                if (res.hasError) {
                    msg = `请求${title}服务出错: ${res.message}`;
                    showTip && ResponseHandler.message.error(msg);
                    console.error(msg);
                    return null;
                }
                let data = dataName ? res[dataName] : res;
                if (!data || data.$isEmpty()) {
                    msg = `暂无${title}数据`;
                    showTip && ResponseHandler.message.warning(msg);
                    showTip && console.warn(msg);
                    return data;
                }

                msg = `请求${title}成功`;
                showTip && ResponseHandler.message.success(msg) && console.log(msg);
                return data;
            }).catch((err: any) => {
                let msg: string = `请求${title}出错`;
                showTip && ResponseHandler.message.error(msg);
                console.error(msg, err);
            });
        };
    }

    /**
     * 保存服务接口处理器
     * @param service 类的构造函数
     * @param method  服务接口
     * @param option  控制参数
     */
    public static save(
        service: FunctionConstructor,
        method: Function,
        option?: { title?: string; dataName?: string; showTip?: boolean }
    ) {
        return async function (this: any) {
            let { title = "", dataName = "", showTip = false } = option || {};
            return method.call(this || service, ...arguments).then((res: any) => {
                let msg: string;
                if (res.hasError) {
                    msg = `请求${title}服务出错`;
                    showTip && ResponseHandler.message.error(msg);
                    console.error(msg);
                    return null;
                }
                let data = dataName ? res[dataName] : res;

                showTip && ResponseHandler.message.warning("请求服务成功");
                return data;
            }).catch((err: any) => {
                let msg: string = `请求${title}出错`;
                showTip && ResponseHandler.message.error(msg);
                console.error(msg, err);
            });
        };
    }

    /**
     * 全局通知对象
     */
    public static get message() {
        return Vue.prototype.$Message;
    }
}