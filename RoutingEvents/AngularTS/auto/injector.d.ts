module angular {
    interface Injector {
        get(name: string): any;
        invoke(fn: Function, self?: any, locals?: Object): any;
        instantiate(type: Function, locals?: Object): any;
        annotate(fn: Function): string[];
        annotate(fn: any[]): string[];
    }

    interface Provide {
        decorator(serviceName: string, decorFn: Function): any;
    }
}