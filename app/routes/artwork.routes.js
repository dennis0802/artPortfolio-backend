module.exports = app => {
    const artwork = require("../controllers/artwork.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Artwork
    router.post("/", artwork.create);
  
    // Retrieve all artwork
    router.get("/", artwork.findAll);

    router.get("/maxID", artwork.findMaxID);
  
    // Retrieve artwork by year
    router.get("/artworkByYear/:year", artwork.findByYear);

    // Retrieve artwork by title
    router.get("/artworkByTitle/:title", artwork.findByTitle);
  
    // Retrieve a single Artwork with id
    router.get("/:id", artwork.findOne);
  
    // Update a Artwork with id
    router.put("/:id", artwork.update);
  
    // Delete a Artwork with id
    router.delete("/:id", artwork.delete);

    // Delete Artwork by year
    router.delete("/artworkByYear/:year", artwork.deleteByYear);
  
    // Create a new Artwork
    //router.delete("/", artwork.deleteAll);
  
    app.use('/api/artwork', router);
  };