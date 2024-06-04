const db = require("../models");
const Artwork = db.artwork;
const Op = db.Sequelize.Op;

// Create and save a new Artwork (INSERT INTO artworks (<attributes>) VALUES (<values>))
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: "Title cannot be empty!"
      });
      return;
    }

    if (!req.body.imagedata) {
      res.status(400).send({
        message: "An image must be uploaded!"
      });
      return;
    }

    if (req.body.month === 0) {
      res.status(400).send({
        message: "Month cannot be empty!"
      });
      return;
    }

    if (!req.body.year) {
      res.status(400).send({
        message: "Year cannot be empty!"
      });
      return;
    }
  
    // Create an Artwork
    const artwork = {
      id: req.body.id,
      title: req.body.title,
      month: req.body.month,
      imagedata: req.body.imagedata,
      year: req.body.year,
      reflection: req.body.reflection
    };

    console.log(artwork);
  
    // Save Artwork in the database
    Artwork.create(artwork)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Artwork."
        });
      });
};

// Retrieve all Artworks from the database, optionally with a title query (SELECT * FROM artworks WHERE title=<title>)
exports.findAll = (req, res) => {
  const title = req.query.title;

  var condition = title ? { title: { [Op.iLike]: `%${title}%` }} : null;

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

// Find a single Artwork with an id (SELECT * FROM artworks WHERE id=<id>)
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

// Update a Artwork by the id in the request (UPDATE artworks SET <attributes>=<new value> WHERE id=<id>)
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title cannot be empty!"
    });
    return;
  }

  if (!req.body.imagedata) {
    res.status(400).send({
      message: "An image must be uploaded!"
    });
    return;
  }

  if (req.body.month === 0) {
    res.status(400).send({
      message: "Month cannot be empty!"
    });
    return;
  }

  if (!req.body.year) {
    res.status(400).send({
      message: "Year cannot be empty!"
    });
    return;
  }

  Artwork.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Artwork was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Artwork with id=${id}. Maybe Artwork was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Artwork with id=" + id
      });
    });
};

// Delete a Artwork with the specified id in the request (DELETE FROM artworks WHERE id = <id>)
exports.delete = (req, res) => {
  const id = req.params.id;

  Artwork.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Artwork was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Artwork with id=${id}. Maybe Artwork was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Artwork with id=" + id
      });
    });
};

// Delete all Artworks from the database by year (DELETE FROM artworks WHERE year = <year>)
exports.deleteByYear = (req, res) => {
  const year = req.params.year;

  Artwork.destroy({
    where: {year: year},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} All artwork in ${year} were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all artworks."
      });
    });
};

// Find all Artworks by a specified year (SELECT * FROM artworks where year = <year>)
exports.findByYear = (req, res) => {
  const year = req.params.year;
  const size = req.params.size;

  Artwork.findAll({ where: { year: year }, limit: size   })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving " + year + " artwork."
    });
  });
};

exports.findByTitle = (req, res) => {
  const title = req.params.title;
  const year = req.params.year;

  Artwork.findAll({ where: { title: { [Op.iLike]: `%${title}%` },  year: year} })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving artwork with title " + title + "."
    });
  });
}

// Find the max recorded ID for inserting new records (SELECT max(id) from artworks) 
exports.findMaxID = (req, res) => {
  Artwork.findOne({
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

// Retrieve all Artworks from the database, optionally with a title query (SELECT * FROM artworks WHERE title=<title> LIMIT <size> OFSET <page-1>*<size>) with paging
exports.findAllPaged = (req, res) => {
  const title = req.params.title;
  const page = req.params.page;
  const year = req.params.year;
  const size = req.params.size;

  var condition = title ? { title: { [Op.iLike]: `%${title}%` }, year: year} : { year: year};

  Artwork.findAll({ where: condition, limit: size, offset: (page-1) * size, order: [['title', 'ASC']], })
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

// Retrieve all Artworks from the database, optionally with a title query (SELECT * FROM artworks WHERE title=<title>) and without paging
exports.findAllUnpaged = (req, res) => {
  const title = req.params.title;
  const year = req.params.year;

  var condition = title ? { title: { [Op.iLike]: `%${title}%` }, year: year} : { year: year};

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
