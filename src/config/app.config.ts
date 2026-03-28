export default () => ({
    PORT: parseInt(process.env.PORT ?? '3000', 10),
    jwt: {
        secret: process.env.ACCESS_TOKEN_SECRET,
        secret_life: process.env.ACCESS_TOKEN_LIFE,
        refresh_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_life: process.env.REFRESH_TOKEN_LIFE,
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    //   jwt: {
    //     secret: process.env.JWT_SECRET,
    //     expiresIn: process.env.JWT_EXPIRES_IN,
    //   },
});
