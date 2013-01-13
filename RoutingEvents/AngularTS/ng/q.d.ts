module angular {
    interface Promise {
        then(callback: Function, errback?: Function): Promise;
    }

    interface Deffered {
        resolve(val: any): void;
        reject(reason: any): void;
        promise: Promise;
    }

    interface QService {
        defer(): Deffered;
        reject(reason: any): Promise;
        when(value: any, callback?: Function, errback?: Function): Promise;
        all(promises: Promise[]): Promise;
    }
}