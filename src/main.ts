import { Workbench } from "@/settings/workbench";
import { routes } from "@/routes";
import modules from "@/store";

new Workbench({
    routerOptions: { routes },
    storeOptions: { modules }
});