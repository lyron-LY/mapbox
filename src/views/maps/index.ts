import { Vue, Component } from "vue-property-decorator";
import "./_index.scss";

@Component({
    template: require("./index.html")
})
export default class Maps extends Vue {}
