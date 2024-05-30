# artPortfolio-backend
NOTE: This app requires its front-end partner repository, **art-portfolio** (https://github.com/dennis0802/artPortfolio), to function properly. The requests that will be sent to Express and the PostgresSQL database will be coming from this repository.

Both must be running at the same time for the artPortfolio project to run properly. Uses Express, PostgreSQL, multer, serve-index, cors, and fs.

## Startup
Run command node server.js to run the Express server. With the React server active, users can send and retrieve data from the API.

### Including db.config.js
module.exports = {
    HOST: your host for the postgres database,
    USER: your user,
    PASSWORD: your user's password,
    DB: your database,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};
