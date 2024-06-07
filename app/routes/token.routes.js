module.exports = app => {
    const token = require("../controllers/token.controller.js");
  
    var router = require("express").Router();

    // Password reset
    router.post("/reset/:id/:max", token.createResetToken);

    // Get the max id
    router.get("/maxID", token.getMaxID);

    router.get("/tokenExists/:user_id", token.findByUser);

    router.get("/byToken/:token", token.findByToken);

    router.delete("/:user_id", token.delete);

    app.use('/api/tokens', router);
}