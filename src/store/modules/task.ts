import { webSetting } from "@/settings";

const task = {
    state: {
        tasks: new Map(),  // 任务仓库
        runner: new Map(), // 存放要执行的任务
        running: new Map() // 正在执行列表
    },
    mutations: {
        // 添加并开始新任务
        addTask(state: any, payload: any) {
            if (!payload) {
                console.error("加入任务队列失败, 请检查任务：", payload);
                return;
            }
            if (state.tasks.has(payload)) {
                console.error("加入任务队列失败, 任务重复：", payload);
                return;
            }

            state.tasks.set(payload, payload);
            state.runner.set(payload, payload);
            payload instanceof Function && payload();
            (<any>this).commit("startTask", payload);
        },
        // 删除任务
        clearTask(state: any, payload: any) {
            if (payload) {
                (<any>this).commit("stopTask", payload);
                state.tasks.has(payload) && state.tasks.delete(payload);
                state.runner.has(payload) && state.runner.delete(payload);
            } else {
                (<any>this).commit("stopTask");
                state.tasks.clear();
                state.runner.clear();
            }
        },
        // 打开任务
        startTask(state: any, payload: any) {
            if (state.runner.size && state.running["hub"] && payload) {
                if (!state.tasks.has(payload)) {
                    (<any>this).commit("addTask", payload);
                } else if (!state.runner.has(payload)) {
                    state.runner.set(payload, payload);
                }
            } else {
                const run = () => {
                    [...state.running.values()].forEach(g => g && clearTimeout(g));
                    state.running.clear();
                    [...state.runner.values()].forEach((g, i, arr) => {
                        if (g instanceof Function) {
                            state.running.set(g, setTimeout(() => g(), ~~Math.min(webSetting.dataRefreshTime, 5000) * i / arr.length));
                        }
                    });
                };
                run();
                state.running["hub"] = setInterval(() => run(), webSetting.dataRefreshTime || 5000);
            }
        },
        // 关闭任务
        stopTask(state: any, payload: any) {
            if (!state.running["hub"]) return;

            if (payload) {
                if (state.running.has(payload)) {
                    clearTimeout(state.running.get(payload));
                    state.running.delete(payload);
                }
                state.runner.has(payload) && state.runner.delete(payload);
            } else {
                clearInterval(state.running["hub"]);
                state.running["hub"] = null;
                [...state.running.values()].forEach(g => g && clearTimeout(g));
                state.running.clear();
            }
        }
    }
};

export default task;
