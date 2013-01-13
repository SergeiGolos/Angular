/// <reference path="q.d.ts" />

module angular {
    interface HttpDefaults {
        transformResponse(data: any): any;
        transformRequest(d: any): string;

        headers: any;
    }

    interface HttpConfig {
        method?: string;
        url?: string;
        params?: any;
        data?: any;
        headers?: Object;
        transformRequest?: any;
        transformResponse?: any;
        cache?: any;
        timeout?: number;
        withCredentials?: bool;
        responseType?: string;
    }

    interface HttpResponse {
        data: any;
        status: number;
        headers(): Object;
        headers(name: string): string;
        config: HttpConfig;
    }

    interface HttpCallback {
        (data: any, status?: number, headers?: Function, config?: HttpConfig);
    }

    interface HttpPromise extends Promise {
        then(success: (response: HttpResponse) => void , error?: (response: HttpResponse) => void ): Promise;
        success(fn: HttpCallback): HttpPromise;
        error(fn: HttpCallback): HttpPromise;
    }

    interface HttpProvider {
        get(): HttpService;
        defaults: HttpDefaults;
        responseInterceptors: (Promise) => Promise[];
    }

    interface HttpService {
        (config: HttpConfig): HttpPromise;

        get(url: string, config?: HttpConfig): HttpPromise;
        delete (url: string, config?: HttpConfig): HttpPromise;
        head(url: string, config?: HttpConfig): HttpPromise;
        jsonp(url: string, config?: HttpConfig): HttpPromise;
        post(url: string, data: any, config?: HttpConfig): HttpPromise;
        put(url: string, data: any, config?: HttpConfig): HttpPromise;

        defaults: HttpDefaults;
    }
}