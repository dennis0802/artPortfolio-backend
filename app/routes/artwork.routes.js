module.exports = app => {
    const artwork = require("../controllers/artwork.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Artwork
    router.post("/", artwork.create);
  
    // Retrieve all artwork
    router.get("/", artwork.findAll);
  
    // Retrieve all published artwork
    router.get("/published", artwork.findAllPublished);
  
    // Retrieve a single Artwork with id
    router.get("/:id", artwork.findOne);
  
    // Update a Artwork with id
    router.put("/:id", artwork.update);
  
    // Delete a Artwork with id
    router.delete("/:id", artwork.delete);
  
    // Create a new Artwork
    router.delete("/", artwork.deleteAll);
  
    app.use('/api/artwork', router);
  };