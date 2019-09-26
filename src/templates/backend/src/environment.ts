export class Environment {
    
    public static getVersion(): string {
        return '/api/v1';
    }

    public static getENV() {
        return (process.env.NODE_ENV) || 'production';
    }

    public static getPort(): number {
        return (process.env.PORT as number) || 3000;
    }

    public static getJWTSecret(): string {
        return "@Tab@llen";
    }
}