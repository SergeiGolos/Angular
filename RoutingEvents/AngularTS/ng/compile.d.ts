/// <reference path="../jqLite.d.ts" />
/// <reference path="rootScope.d.ts" />

module angular {
    interface Attributes {
        $normalize(name: string): string;
        $set(key: string, value: string, writeAttr?: bool, attrName?: string): void;
        $observe(key: string, fn: (value: string) => void ): Function;
    }

    interface Directive {
        compile?: (tElement: jqLite, tAttrs: Attributes, transclude?: Function) => any;
        link?: (scope: Scope, iElement: jqLite, iAttrs?: Attributes, controller?: any) => any;
        controller?: ($scope: Scope, $element: jqLite, $attrs?: Attributes, $transclude?: Function) => any;
        restrict?: string;
        require?: any;
        replace?: bool;
        transclude?: bool;
        scope?: any;
        priority?: number;
        template?: string;
        templateUrl?: string;
        terminal?: bool;
    }

    interface CompileProvider {
        get(): CompileService;

        directive(name: string, directiveFactory: () => Directive): CompileProvider;
        directive(name: string, directiveFactory: Function): CompileProvider;
    }

    interface CompileService {
        ($compileNode: jqLite, transcludeFn: Function, maxPriority: number): Function;
    }
}