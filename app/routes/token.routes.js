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

    // Registration
    router.post("/registration", token.createRegistrationToken)

    router.get("/registration/:user_id", token.getOneRegistration);

    router.put("/registration/:user_id", token.updateRegistration);

    router.put("/registrationRefresh/:user_id", token.updateRegistrationNewToken);

    router.delete("/registration/:user_id", token.deleteRegistration);

    router.get("/registrationMaxID", token.getMaxRegistrationID);

    router.get("/registrationByToken/:token", token.findRegistrationByToken);

    router.get("/registrationExists/:user_id", token.findRegistrationByUser);

    app.use('/api/tokens', router);
}