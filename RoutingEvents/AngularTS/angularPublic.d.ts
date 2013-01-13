module angular {
    function bootstrap(element: Element, modules: any[]): any;
    function forEach(array: any[], iterator: (item: any) => void );    
    function forEach(array: any, iterator: (value: any, key: string) => void );
    function copy(source: any, destination?: any): any;
    function equals(o1: any, o2: any): bool;
    function extend(dst: Object, ...src: Object[]): Object;
    function noop(): any;
    function identity($: any): any;
    function bind(self: any, fn: Function, ...arguments: any[]): Function;
    function lowercase(value: string): string;
    function uppercase(value: string): string;
    function toJson(obj: any, pretty: bool): string;
    function fromJson(json: string): any;

    function isDefined(value: any): bool;
    function isUndefined(value: any): bool;
    function isObject(value: any): bool;
    function isString(value: any): bool;
    function isNumber(value: any): bool;
    function isDate(value: any): bool;
    function isArray(value: any): bool;
    function isFunction(value: any): bool;
    function isElement(value: any): bool;
}