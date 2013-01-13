module angular {
    function element(element: string): jqLite;
    function element(element: jqLite): jqLite;
    function element(element: Element): jqLite;

    interface jqLiteEvent {
        preventDefault(): void;
        stopPropagation(): void;
        target: Node;
        defaultPrevented: bool;
        isDefaultPrevented(): bool;
    }

    interface jqLite {
        (element: string): jqLite;
        (element: jqLite): jqLite;
        (element: Element): jqLite;

        ready(fn: Function): void;
        eq(index: number): jqLite;
        length: number;
        push(item: any): any;
        sort(): void;
        splice(): any;

        data(key: string): any;
        data(data: Object): jqLite;
        data(key: string, value: any): jqLite;

        removeData(): jqLite;

        inheritedData(key: string): any;

        scope(): any;
        controller(): any;
        injector(): any;

        removeAttr(name: string): jqLite;

        hasClass(selector: string): bool;

        css(name: string): string;
        css(css: Object): jqLite;
        css(name: string, value: string): jqLite;

        attr(name: string): string;
        attr(attr: Object): jqLite;
        attr(name: string, value: string): jqLite;

        prop(name: string): string;
        prop(prop: Object): jqLite;
        prop(name: string, value: string): jqLite;

        text(): string;
        text(value: string): jqLite;

        val(): string;
        val(value: string): jqLite;

        html(): string;
        html(value: string): jqLite;

        dealoc(): jqLite;

        bind(type: string, fn: (event: jqLiteEvent) => void): jqLite;
        unbind(type?: string, fn?: (event: jqLiteEvent) => void): jqLite;

        replaceWith(replaceNode: string): jqLite;
        replaceWith(replaceNode: jqLite): jqLite;
        replaceWith(replaceNode: Element): jqLite;

        append(node: Node): jqLite;
        append(node: jqLite): jqLite;
        prepend(node: Node): jqLite;
        prepend(node: jqLite): jqLite;
        wrap(wrapNode: Element): jqLite;
        wrap(wrapNode: jqLite): jqLite;
        remove(): jqLite;
        after(newElement: Node): jqLite;
        after(newElement: jqLite): jqLite;

        addClass(selector: string): jqLite;
        removeClass(selector: string): jqLite;
        toggleClass(selector: string, condition: bool): jqLite;

        parent(): jqLite;
        children(): jqLite;
        contents(): jqLite;
        next(): jqLite;
        find(selector: string): jqLite;
        clone(): jqLite;
    }
}