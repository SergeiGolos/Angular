module angular {
    interface ScopeEvent {
        targetScope: Scope;
        currentScope: Scope;
        name: string;
        stopPropagation(): void;
        preventDefault(): void;
        defaultPrevented: bool;
    }

    interface Scope {
        $id: number;

        $new(isolate?: bool): Scope;
        $watch(watchExpression: string, listener: string, objectEquality?: bool): Function;
        $watch(watchExpression: string, listener: (newValue?: any, oldValue?: any, scope?: Scope) => void, objectEquality?: bool): Function;
        $watch(watchExpression: (scope?: Scope) => any, listener: string, objectEquality?: bool): Function;
        $watch(watchExpression: (scope?: Scope) => any, listener: (newValue?: any, oldValue?: any, scope?: Scope) => void, objectEquality?: bool): Function;
        $digest(): void;
        $destroy(): void;
        $eval(exp: (scope: Scope) => any): any;
        $eval(exp: string): any;
        $evalAsync(exp: (scope: Scope) => any): void;
        $evalAsync(exp: string): void;
        $apply(exp: (scope: Scope) => any): any;
        $apply(exp: string): any;
        $on(name: string, listener: (event: ScopeEvent, ...args: any[]) => void ): Function;
        $emit(name: string, ...args: any[]): ScopeEvent;
        $broadcast(name: string, ...args: any[]): ScopeEvent;
    }

    interface RootScopeProvider {
        get(): Scope;

        digestTtl(value?: number): number;
    }
}