module angular {
    interface LocationProvider {
        get(): LocationService;

        html5Mode(): any;
        html5Mode(value: any): LocationProvider;

        hashPrefix(): string;
        hashPrefix(prefix: string): LocationProvider;
    }

    interface LocationService {
        $$replace: bool;

        $$url: string;
        $$absUrl: string;
        $$protocol: string;
        $$host: string;
        $$port: number;
        $$path: string;
        $$hash: string;
        $$search: string;

        absUrl(): string;
        url(): string;
        url(url: string): LocationService;
        protocol(): string;
        host(): string;
        port(): number;
        path(): string;
        path(path: string): LocationService;
        search(): LocationService;
        search(search: string, paramValue?: string): LocationService;
        hash(): string;
        hash(hash: string): LocationService;
        replace(): LocationService;
    }
}