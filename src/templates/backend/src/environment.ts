export const environment = {
  production: process.env.PROD || 'development',
  API_URL: process.env.API_URL || '/api/v1',
  PORT: ((process.env.PORT as unknown) as number) || 3000,
  DATABSE_URL: process.env.DATABSE_URL || '',
  TOKEN_HEADER: process.env.TOKEN_HEADER || 'Authorization',
  TOKEN_KEY: process.env.TOKEN_KEY || '@Tab@llen',
  TOKEN_EXP: process.env.TOKEN_EXP || '1h',
  CORS_OPT: {
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
  }
};
