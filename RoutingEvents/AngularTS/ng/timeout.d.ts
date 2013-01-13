/// <reference path="q.d.ts" />

module angular { 
    interface TimeoutService {
        (fn: Function, delay: number, invokeApply: bool): Promise;
        cancel(promise: Promise): bool;
    }
}