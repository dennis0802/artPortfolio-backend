module.exports = app => {
    const rating = require("../controllers/feedback.controller")   
    var router = require("express").Router();

    // Create rating
    router.post("/", rating.createRating);

    // Find max id for ratings
    router.get("/feedbackMaxID", rating.findMaxID);

    // Find an artwork's average rating
    router.get("/avgRating/:art_id", rating.avgRating);

    // Find ratings by artwork
    router.get("/artID/:art_id", rating.findByArtwork);

    // Find ratings by their id
    router.get("/:id", rating.findByRating);

    // Update a Artwork with id
    router.put("/:id", rating.update);

    // Delete ratings by their id, artwork, or owner, respectively.
    router.delete("/:id", rating.delete);

    router.delete("/artID/:art_id", rating.deleteByArt);

    router.delete("/userID/:user_id", rating.deleteByUser);

    app.use('/api/feedback', router);
    
}