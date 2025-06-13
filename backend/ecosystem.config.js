module.exports = {
  apps: [
    {
      name: 'encuestas',
      script: 'dist/main.js',
      env: {
        PORT: 4000,
        NODE_ENV: 'production',
        CORS_ORIGIN: 'localhost',
        DB_HOST: process.env.HOST,
        DB_PORT: Number(process.env.PORT_DB),
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.PASS,
        DB_NAME: process.env.DATABASE,
        DB_LOGGING: 'false',
        GLOBAL_PREFIX: 'api',
        SWAGGER_HABILITADO: false,
      },
      time: true,
    },
  ],
};