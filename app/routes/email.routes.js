module.exports = app => {
    const email = require("../controllers/email.controller")   
    var router = require("express").Router();

    router.post("/reset/:username/:email/:code/:token", email.sendEmailReset)

    router.post("/register/:username/:email/:code/:token", email.sendEmailRegistration)

    app.use('/api/emails', router);
}