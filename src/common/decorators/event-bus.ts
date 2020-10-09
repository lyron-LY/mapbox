import Vue from "vue";

/**
 * 全局广播
 *
 * @export
 * @param {string} [topic]
 * @returns
 */
export function Broadcast(topic?: string) {
    return function (_target: Vue, key: string, descriptor: any) {
        const original = descriptor.value;
        descriptor.value = function emitter(...args: Array<any>) {
            const emit = (returnValue: any) => {
                if (returnValue !== undefined) args.unshift(returnValue);
                this.$bus && this.$bus.$emit(topic || key, ...args);
            };

            const returnValue: any = original.apply(this, args);

            if (returnValue instanceof Promise) {
                returnValue.then(returnValue => {
                    emit(returnValue);
                });
            } else {
                emit(returnValue);
            }

            return returnValue;
        };
    };
}

/**
 * 全局订阅
 *
 * @export
 * @param {string} [topic]
 * @returns
 */
export function Subscribe(topic?: string) {
    return function (_target: any, key: string, descriptor: any) {
        const original = descriptor.value;
        const mounted = _target.mounted;
        const beforeDestroy = _target.beforeDestroy;
        topic = topic || key;
        _target.mounted = function (...args: Array<any>) {
            let $bus = this.$bus || Vue.prototype.$bus;
            if (!$bus) {
                $bus = this.$bus = Vue.prototype.$bus = new Vue();
            }
            this[`_subscribe_${key}`] = original.bind(this);
            if ((<any>Events)[topic as string]) {
                $bus.$on(topic, this[`_subscribe_${key}`]);
            }
            mounted && mounted.apply(this, args);
        };
        _target.beforeDestroy = function (...args: Array<any>) {
            this.$bus && this.$bus.$off(topic, this[`_subscribe_${key}`]);
            beforeDestroy && beforeDestroy.apply(this, args);
        };
    };
}

/**
 * 事件URL
 *
 * @description 驼峰命名 操作-对象(操作和对象都描述详细)
 * @export
 * @enum {number}
 */
export enum Events {
    GetMap = "GetMap"                      // 获取地图
}
