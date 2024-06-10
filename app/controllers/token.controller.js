const db = require("../models");
const Token = db.token;
const Status = db.status;
const Op = db.Sequelize.Op;
const uuid = require("uuid");
const approvedOrigin = "https://localhost:8081";

const isAuth = function(req){
  if(req.get('origin') !== approvedOrigin){
    return false;
  }
  return true;
}

// Reset a password - ie. create a token entry 
exports.createResetToken = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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

// Find the max recorded ID for inserting new records (SELECT max(id) from tokens) 
exports.getMaxID = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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

// Delete a token with the specified id in the request (DELETE FROM tokens WHERE id = <id>)
exports.delete = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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

// Create a registration token
exports.createRegistrationToken = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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

// Get one registration token for a specified user (SELECT * from status where user_id=<user_id>)
exports.getOneRegistration = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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

// Update a registration token (UPDATE status SET attributes=<newAttributes> WHERE user_id=<user_id>)
exports.updateRegistration = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.user_id;
  
  Status.update(req.body, {
    where: { user_id: id }
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

// Update a registration token and give a new token (UPDATE status SET attributes=<newAttributes> WHERE user_id=<user_id>)
exports.updateRegistrationNewToken = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

  const id = req.params.user_id;
  const code = Math.random().toString().slice(2,17);
  const tokenContent = uuid.v4();
  var date = new Date();
  date.setMinutes(date.getMinutes() + 20);

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

// Delete a registration token (DELETE FROM status WHERE user_id=<user_id>)
exports.deleteRegistration = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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

// Find the max recorded ID for inserting new registrations (SELECT max(id) from status) 
exports.getMaxRegistrationID = (req, res) => {
  if(!isAuth(req)){
    res.status(403).send({
      message:
        "Unauthorized."
    })
    return;
  }

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