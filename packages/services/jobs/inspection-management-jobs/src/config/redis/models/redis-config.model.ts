export class RedisConfigModel {
    port: number;
    host: string;
    password?: string;
    /**
     * 
     * @param port 
     * @param host 
     * @param password 
     */
    constructor(port: number, host: string, password: string) {
        this.port = port;
        this.host = host;
        this.password = password;
    }
}
