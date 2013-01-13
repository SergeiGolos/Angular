module angular {
    function module(name: string): Module;
    function module(name: string, requires: string[]): Module;
    function module(name: string, requires: string[], configFn: Function): Module;
    function module(name: string, configFn: Function): Module;

    interface Provider {
        get(): any;
    }

    interface Module {
        requires: string[];
        name: string;

        provider(name: string, provider: Provider): Module;
        provider(name: string, provider: () => Provider): Module;
        provider(name: string, provider: any[]): Module;

        factory(name: string, getFn: Function): Module;
        factory(name: string, getFn: any[]): Module;
        service(name: string, constructor: any): Module;
        value(name: string, value: any): Module;
        constant(name: string, constant: any): Module;

        filter(name: string, factory: any): Module;

        
        controller(name: string, controller: Function): Module;
        controller(name: string, controller: any[]): Module;
        controller(name: string, controller: any): Module;
        
        directive(name: string, directiveFactory: any): Module;
        directive(name: string, directiveFactory: any[]): Module;
        directive(directives: Object): Module;

        config(configFn: Function): Module;
        config(configFn: any[]): Module;
        run(block: Function): Module;
        run(block: any[]): Module;
    }
}