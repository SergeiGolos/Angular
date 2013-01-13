module angular {
    interface RouteMapping {
        controller?: any;
        template?: string;
        templateUrl?: string;
        resolve?: Object;
        redirectTo?: any;
        reloadOnSearch?: bool;
    }

    interface CurrentRouteMapping extends RouteMapping {
        locals: Object;
    }

    interface RouteService {
        routes: RouteMapping[];
        current: CurrentRouteMapping;

        reload(): void;
    }

    interface RouteProvider {
        get(): RouteService;

        when(path: string, route: RouteMapping): RouteProvider;
        otherwise(params: RouteMapping): RouteProvider;
    }
}