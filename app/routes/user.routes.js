module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new user
    router.post("/", user.create);

    // Get the max id
    router.get("/maxID", user.findMaxID);

    router.get("/unpaged/:query?", user.findAllUnpaged)

    router.get("/paged/:page/:size/:query?", user.findAllPaged)

    // Retrieve all users
    router.get("/", user.findAll);

    router.get("/:id", user.findOne)

    router.get("/username/:username", user.findByUsername)

    router.get("/password/:password?/:stored?", user.verifyPassword)

    router.get("/email/:email", user.findByEmail)

    router.put("/usernameLogin/:username", user.updateLogin)

    router.put("/:username", user.update);

    // Delete a user with username
    router.delete("/:username", user.delete);
  
    app.use('/api/users', router);
  };