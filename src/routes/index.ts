export const pageRouter = {
    name: "maps",
    path: "/maps",
    meta: { title: "地图" },
    redirect: "/maps/point",
    component: () => import("@/views/maps"),
    children: [
        {
            name: "point",
            path: "point",
            meta: { title: "点位" },
            component: () => import("@/views/maps/point")
        }
    ]
};

// export const l7 = {
//     name: "l7",
//     path: "/l7",
//     meta: { title: "地图" },
//     component: () => import("@/views/l7")
// };

export const routes: Array<any> = [
    pageRouter,
    {
        path: "/",
        redirect: "/maps"
    },
    {
        name: "500",
        path: "/500",
        component: () => import("@/views/errors/500")
    },
    {
        name: "403",
        path: "/403",
        component: () => import("@/views/errors/403")
    },
    {
        name: "404",
        path: "/*",
        component: () => import("@/views/errors/404")
    }
];
