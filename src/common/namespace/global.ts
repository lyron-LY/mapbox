// 全局变量
export namespace Global {

    export const isDev: boolean = process.env.NODE_ENV === "development";
    export const isProd: boolean = process.env.NODE_ENV === "production";

}

if (!(<any>window)["Global"]) {
    (<any>window)["Global"] = Global;
}