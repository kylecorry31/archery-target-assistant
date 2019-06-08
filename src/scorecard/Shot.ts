/**
 * An archery shot
 */
class Shot {
    private display: string;
    public static readonly DISPLAY_MISS: string = 'M';
    public static readonly DISPLAY_BULLSEYE: string = 'X';


    /**
     * Default constructor
     * @param value the value in points
     * @param display the display name (ex. 1, 2, X, M) (optional)
     */
    constructor(private value: number, display?: string) {
        if (!display){
            this.display = value.toString();
        } else {
            this.display = display;
        }
    }

    /**
     * @returns the point value
     */
    getValue(): number {
        return this.value;
    }

    /**
     * @returns the display name
     */
    getDisplay(): string {
        return this.display;
    }

    /**
     * Create a missed shot
     * @returns a missed shot
     */
    public static createMiss(): Shot {
        return new Shot(0, this.DISPLAY_MISS);
    }

    /**
     * Creates a bullseye shot
     * @returns the bullseye shot
     */
    public static createBullseye(): Shot {
        return new Shot(10, this.DISPLAY_BULLSEYE);
    }
}

export = Shot;