import { CorsOptions } from './middlewares/cors.middleware';
export class Environment {
  public static getVersion(): string {
    return '/api/v1';
  }
  /** options for cors midddleware
   * + Origin: API_URL
   * + Thêm Header mình muốn
   * + Bỏ Methode ko muốn truy cập
   */
  public static corsOptions: CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization'
    ],
    exposedHeaders: ['Content-Length', 'Authorization', 'X-Custome'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*'
  };

  public static getJWTSecret(): string {
    return '@Tab@llen';
  }

  public static getTokenHeaderKey(): string {
    return 'X-token';
  }
  // khi deloy thay bằng 'production'
  public static getENV() {
    return process.env.NODE_ENV || 'development';
  }

  public static getPort(): number {
    return (process.env.PORT as any) || 3000;
  }
}
