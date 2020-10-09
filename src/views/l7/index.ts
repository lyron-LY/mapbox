import { Vue, Component } from "vue-property-decorator";
// import * as monaco from "monaco-editor";
// import Service from "./service";
// import { autowired } from "@/common/decorators/autowired";
// // import { webSetting } from "@/settings";
import { Mapbox } from "@antv/l7-maps";
import { Scene, RasterLayer, ImageLayer, PointLayer } from "@antv/l7";
import { MapUtils } from "./uties";
import "./_index.scss";

declare let mapboxgl: any;

@Component({
    template: require("./index.html"),
    components: {
        // Comp
    }
})
export default class L7 extends Vue {

    // @autowired(Service)
    // public service!: Service;

    public map!: any;

    public mounted() {
        this.map = new Scene({
            id: "l7",
            map: new Mapbox(
                {
                    center: [112.4296, 37.83017],
                    zoom: 12,
                    style: {
                        version: 8,
                        name: "blank",
                        sources: {
                            // "osm-tiles": {
                            //     "type": "raster",
                            //     "tiles": [
                            //         "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            //     ],
                            //     "tileSize": 256
                            // },
                            "taiyuan": {
                                type: "raster",
                                tileSize: 256,
                                tiles: [
                                    "http://www.egova.top:30039/emap/free/spatial/proxy/wmts/363a2402-bbf0-4bd8-b181-6c01ac2980b0?level={z}&row={y}&col={x}"
                                ]
                            }
                        },
                        layers: [
                            {
                                id: "background",
                                type: "background",
                                paint: {
                                    "background-color": "white"
                                }
                            },
                            // {
                            //     "id": "123",
                            //     "type": "raster",
                            //     "source": "osm-tiles",
                            //     "source-layer": "osmtiles"
                            // },
                            {
                                "id": "taiyuan",
                                "type": "raster",
                                "source": "taiyuan"
                            }
                        ]
                    }
                }
            )
        });

        this.map.on("click", (evt: any) => {
            console.log("L7 -> mounted -> evt", evt);
        });
        this.map.on("load", () => {
            const layer = new ImageLayer({});
            layer.source("http://www.egova.top:30039/supervision/free/spatial/proxy/wms/40e9349d-2291-4df2-9616-04fbcc90da29", {
                parser: {
                    type: "image",
                    extent: [111.508791115, 37.4569813750001, 113.151282834, 38.4205203710001]
                }
            });
            // this.map.addLayer(layer);

            const pointLayer = new PointLayer({});
            const lonlat = MapUtils.gcj_decrypt(37.870435, 112.549659);
            pointLayer.source([
                {
                    id: "1",
                    x: lonlat.lon,
                    y: lonlat.lat
                },
                {
                    id: "2",
                    x: 113.09303765423887,
                    y: 38.282708129797435
                },
                {
                    id: "3",
                    x: 112.42967207320835,
                    y: 37.83017857424891
                }
            ], {
                parser: {
                    type: "json",
                    x: "x",
                    y: "y"
                }
            })
                .shape("circle")
                .size(4)
                .active(true)
                .color("red")
                .style({
                    opacity: 0.5,
                    strokeWidth: 0
                });

            this.map.addLayer(pointLayer);
        });
    }

}
