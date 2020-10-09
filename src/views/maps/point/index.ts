import { Vue, Component } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "./_index.scss";

@Component({
    template: require("./index.html"),
    components: {}
})
export default class MapPoint extends Vue {

    public map!: any;

    public mounted() {
        // mapboxgl.accessToken = "pk.eyJ1IjoiYW56aGlodW4iLCJhIjoiY2lsdnhjdjN5MDFvMHVia3NpYTlnbmUzaSJ9.twlExCjpR7uwH2IiFC7aDA";
        this.map = new mapboxgl.Map({
            container: "point",
            center: [112.4296, 37.83017],
            zoom: 12,
            pitch: 30,
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
        });
        // 设置语言
        let language = new MapboxLanguage({ defaultLanguage: "zh" });
        this.map.addControl(language);

        this.map.on("load", () => {
            let point = new mapboxgl.Marker()
            .setLngLat([112.549659, 37.870435])
            .addTo(this.map);

            // this.map.addLayer({
            //     id: "wmslayer",
            //     type: "raster",
            //     source: {
            //         type: "raster",
            //         tiles: [
            //             "http://www.egova.top:30039/supervision/free/spatial/proxy/wms/40e9349d-2291-4df2-9616-04fbcc90da29?service=WMS&format=image/png&transparent=true&version=1.1.1&request=GetMap&styles=&layers=department001:cata_landspot&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857"
            //         ],
            //         tileSize: 256
            //     },
            //     paint: {}
            // });
            // this.map.addLayer({
            //     id: "wmtslayer",
            //     type: "raster",
            //     source: {
            //         type: "raster",
            //         tiles: [
            //             "http://www.egova.top:30039/emap/free/spatial/proxy/wmts/363a2402-bbf0-4bd8-b181-6c01ac2980b0?level={z}&row={y}&col={x}"
            //         ],
            //         tileSize: 256
            //     },
            //     paint: {}
            // });
        });
    }

}