const db = require("../models");
const Token = db.token;
const Status = db.status;
const Op = db.Sequelize.Op;
const uuid = require("uuid");

// Reset a password - ie. create a token entry 
exports.createResetToken = (req, res) => {
    const id = req.params.id;
    const max = req.params.max;
    const code = Math.random().toString().slice(2,17);
    const tokenContent = uuid.v4();
    var date = new Date();
    date.setMinutes(date.getMinutes() + 20);

    var token = {
        id: parseInt(max) + 1,
        user_id: id,
        content: tokenContent,
        expiry: new Date(date),
        code: code
    }
  
    Token.create(token)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the Token."
        });
    });
  }

// Find the max recorded ID for inserting new records (SELECT max(id) from users) 
exports.getMaxID = (req, res) => {
    Token.findOne({
      attributes: [db.Sequelize.fn('max', db.Sequelize.col('id'))],
      raw: true
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
        con
      res.status(500).send({
        message:
          err.message || "Error occurred while retrieving max id"
      })
    })
  }

// Find a single Token with a user (SELECT * FROM tokens WHERE user_id=<user_id>)
exports.findByUser = (req, res) => {
    const user = req.params.user_id;
  
    Token.findOne({ where: { user_id: user}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Token with user id " + user + "."
      });
    });
}

// Find a single Token with specific content (SELECT * FROM tokens WHERE content=<content>)
exports.findByToken = (req, res) => {
  const token = req.params.token;

  Token.findOne({ where: { content: token}})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Token with token content " + token + "."
    });
  });
}

// Delete a User with the specified id in the request (DELETE FROM users WHERE id = <id>)
exports.delete = (req, res) => {
    const id = req.params.user_id;

    Token.destroy({
      where: { user_id: id}
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Token was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete token with user id=${id}. Maybe token was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete token with user id=" + id
        });
      });
};

exports.createRegistrationToken = (req, res) => {
  const code = Math.random().toString().slice(2,17);
  const tokenContent = uuid.v4();
  var date = new Date();
  date.setMinutes(date.getMinutes() + 20);

  var token = {
    id: req.body.id,
    user_id: req.body.user_id,
    isactive: req.body.isactive,
    token: tokenContent,
    code: code,
    tokenexpiry: new Date(date),
  }

  Status.create(token)
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
      message:
          err.message || "Some error occurred while creating the Status token."
      });
  });
}

exports.getOneRegistration = (req, res) => {
  const user = req.params.user_id;
  
  Status.findOne({ where: { user_id: user}})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Status with user id " + user + "."
    });
  });
}

// Find a single Token with specific content (SELECT * FROM status WHERE token=<token>)
exports.findRegistrationByToken = (req, res) => {
  const token = req.params.token;

  Status.findOne({ where: { token: token}})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Status with token content " + token + "."
    });
  });
}

// Find a single Token with a user (SELECT * FROM status WHERE user_id=<user_id>)
exports.findRegistrationByUser = (req, res) => {
  const user = req.params.user_id;

  Status.findOne({ where: { user_id: user}})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Status with user id " + user + "."
    });
  });
}

exports.updateRegistration = (req, res) => {
  const id = req.params.user_id;
  
  Status.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Status was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Status with user_id=${id}. Maybe Status was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Status with user_id=" + id
      });
    });
}

exports.updateRegistrationNewToken = (req, res) => {
  const id = req.params.user_id;
  const code = Math.random().toString().slice(2,17);
  const tokenContent = uuid.v4();
  var date = new Date();
  date.setMinutes(date.getMinutes() + 20);

  console.log("test");

  var data = {
    id: req.body.id,
    user_id: req.body.user_id,
    isactive: req.body.isactive,
    token: tokenContent,
    code: code,
    tokenexpiry: new Date(date)
  }
  
  Status.update(data, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Status was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Status with user_id=${id}. Maybe Status was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Status with user_id=" + id
      });
    });
}

exports.deleteRegistration = (req, res) => {
  const id = req.params.user_id;

  Status.destroy({
    where: { user_id: id}
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Status was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete status with user id=${id}. Maybe status was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete status with user id=" + id
      });
    });
}

// Find the max recorded ID for inserting new records (SELECT max(id) from users) 
exports.getMaxRegistrationID = (req, res) => {
  Status.findOne({
    attributes: [db.Sequelize.fn('max', db.Sequelize.col('id'))],
    raw: true
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
      con
    res.status(500).send({
      message:
        err.message || "Error occurred while retrieving max id"
    })
  })
}