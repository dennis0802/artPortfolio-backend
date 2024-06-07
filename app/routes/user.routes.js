module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new user
    router.post("/", user.create);

    // Get the max id
    router.get("/maxID", user.findMaxID);

    // Paging based routes
    router.get("/unpaged/:query?", user.findAllUnpaged)

    router.get("/paged/:page/:size/:query?", user.findAllPaged)

    // Retrieve all users
    router.get("/", user.findAll);

    // Find one or based on email/username
    router.get("/:id", user.findOne)

    router.get("/email/:email", user.findByEmail)

    router.get("/username/:username", user.findByUsername)

    // Login/Registration
    router.get("/password/:password?/:stored?", user.verifyPassword)

    router.put("/usernameLogin/:username", user.updateLogin)

    // Update
    router.put("/:username", user.update);

    // Delete a user with username
    router.delete("/:username", user.delete);

    app.use('/api/users', router);
  };