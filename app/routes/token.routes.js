module.exports = app => {
    const token = require("../controllers/token.controller.js");
  
    var router = require("express").Router();

    // Password reset
    router.post("/reset/:id/:max", token.createResetToken);

    // Get the max id
    router.get("/maxID", token.getMaxID);

    // Get tokens by their user or token content, respectively
    router.get("/tokenExists/:user_id", token.findByUser);

    router.get("/byToken/:token", token.findByToken);

    // Delete token based on user
    router.delete("/:user_id", token.delete);

    // Registration
    router.post("/registration", token.createRegistrationToken)

    router.get("/registration/:user_id", token.getOneRegistration);

    // Update tokens - on successful registration and on generating a new token, respectively
    router.put("/registration/:user_id", token.updateRegistration);

    router.put("/registrationRefresh/:user_id", token.updateRegistrationNewToken);

    // Delete based on user
    router.delete("/registration/:user_id", token.deleteRegistration);

    // Get max ID recorded for registration records
    router.get("/registrationMaxID", token.getMaxRegistrationID);

    // Get tokens by their token content or user, respectively
    router.get("/registrationByToken/:token", token.findRegistrationByToken);

    router.get("/registrationExists/:user_id", token.findRegistrationByUser);

    app.use('/api/tokens', router);
}