const db = require("../models");
const Rating = db.rating;
const Op = db.Sequelize.Op;
const approvedOrigin = "https://localhost:8081";

const isAuth = function(req){
  if(req.get('origin') !== approvedOrigin){
    return false;
  }
  return true;
}

// Create a rating
exports.createRating = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

    if(parseInt(req.body.rating) < 1 || parseInt(req.body.rating) > 5){
        res.status(400).send({
            message: "A valid rating must be selected!"
          });
          return;
    }

    var date = new Date();

    var feedback = {
        id: req.body.id,
        user_id: req.body.user_id,
        art_id: req.body.art_id,
        rating: req.body.rating,
        comment: req.body.comment + " ----------- POSTED: " + date
    }
  
    Rating.create(feedback)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the feedback."
        });
    });
  }

// Find the max recorded ID for inserting new records (SELECT max(id) from ratings) 
exports.findMaxID = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

    Rating.findOne({
      attributes: [db.Sequelize.fn('max', db.Sequelize.col('id'))],
      raw: true
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error occurred while retrieving max id"
      })
    })
  }

exports.findByArtwork = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

    const id = req.params.art_id;

    var condition = { art_id: id};

    Rating.findAll({where: condition})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving feedback"
        });
      });
}

exports.findByRating = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.id;

  var condition = { id: id};

  Rating.findOne({where: condition})
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving feedback"
      });
    });
}

// Find the average rating of Rating (SELECT avg(rating) from ratings) 
exports.avgRating = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.art_id;

  var condition = { art_id: id};

  Rating.findOne({
    where: condition,
    attributes: [db.Sequelize.fn('avg', db.Sequelize.col('rating'))],
    raw: true
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Error occurred while retrieving average rating"
    })
  })
}

// Update a Rating by the id in the request (UPDATE ratings SET <attributes>=<new value> WHERE id=<id>)
exports.update = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.id;

  // Validate request
  if(parseInt(req.body.rating) < 1 || parseInt(req.body.rating) > 5){
    res.status(400).send({
        message: "A valid rating must be selected!"
      });
      return;
  }

  var date = new Date();

  var data = {
    id: req.body.id,
    user_id: req.body.user_id,
    art_id: req.body.art_id,
    rating: req.body.rating,
    comment: req.body.comment + " ----------- EDITED: " + date
  }

  Rating.update(data, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rating was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Rating with id=${id}. Maybe Rating was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Rating with id=" + id
      });
    });
};

// Delete a rating with the specified id in the request (DELETE FROM ratings WHERE id = <id>)
exports.delete = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.id;

  Rating.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rating was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Rating with id=${id}. Maybe Rating was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Rating with id=" + id
      });
    });
};

// Delete a rating with the specified user in the request (DELETE FROM ratings WHERE user_id = <user_id>)
exports.deleteByUser = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.user_id;

  Rating.destroy({
    where: { user_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rating was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Rating with id=${id}. Maybe Rating was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Rating with id=" + id
      });
    });
};

// Delete a rating with the specified art in the request (DELETE FROM ratings WHERE art_id = <art_id>)
exports.deleteByArt = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.art_id;

  Rating.destroy({
    where: { art_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rating was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Rating with id=${id}. Maybe Rating was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Rating with id=" + id
      });
    });
};