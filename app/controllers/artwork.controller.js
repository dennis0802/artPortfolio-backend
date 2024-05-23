const db = require("../models");
const Artwork = db.artwork;
const Op = db.Sequelize.Op;

// Create and Save a new Artwork
exports.create = (req, res) => {
  
};

// Retrieve all Artworks from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Artwork.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving artwork."
      });
    });
};

// Find a single Artwork with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Artwork.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find artwork with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Artwork with id=" + id
      });
    });
};

// Update a Artwork by the id in the request
exports.update = (req, res) => {
  
};

// Delete a Artwork with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all Artworks from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Artworks
exports.findAllPublished = (req, res) => {
  
};
