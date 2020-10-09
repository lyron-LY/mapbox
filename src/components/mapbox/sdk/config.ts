// import { ISetting, IOptions } from "./interface";

export const setting: ISetting = {
    accessToken: "",
    center: [112.4296, 37.83017],
    zoom: 12,
    viewMode: "2D",
    lang: "zh_cn",
    mapStyle: "amap://styles/blue"
};

export const options: IOptions = {
    onEvent: (eventName: string, evt: Event) => {
        // console.log(event, evt);
    }
};