module angular {
    interface CacheOptions {
        capacity: number;
    }

    interface CacheInfo {
        id: string;
        size: number;
        options: CacheOptions;
    }

    interface Cache {
        put(key: string, value: any): void;
        get(key: string): any;
        remove(key: string): void;
        removeAll(): void;
        destroy(): void;
        info(): CacheInfo;
    }

    interface CacheFactory {
        (cacheId: string, options: CacheOptions): Cache;
        get(cacheId: string): Cache;
        info();
    }
}