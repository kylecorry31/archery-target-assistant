class Utils {
    private constructor(){}

    static requireNonNull<T>(obj: T): T {
        if (obj == null || obj == undefined || typeof obj === 'undefined'){
            throw new Error("Null pointer error");
        }
        return obj;
    }
}

export = Utils;