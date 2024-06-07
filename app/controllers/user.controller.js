const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

// Utility for password requirements
const isPasswordInvalid = async function(password, passwordConfirmation){
    let errors=[];
    let mainHash;

    // Contain at least 1 digit
    let pattern=/[0-9]/;
    let containsDigits = pattern.test(password);

    if(!containsDigits){
        errors.push("Password must contain at least one number!");
    }

    // Lower case
    pattern = /[a-z]/
    let lowercasePresent = pattern.test(password);

    if(!lowercasePresent){
        errors.push("Password must contain at least one lowercase letter!")
    }

    // Uppercase
    pattern = /[a-z]/
    let uppercasePresent = pattern.test(password);

    if(!uppercasePresent){
        errors.push("Password must contain at least one uppercase letter!")
    }

    // Special characters
    pattern = /\W/
    let specialPresent = pattern.test(password);

    if(!specialPresent){
        errors.push("Password must contain at least one special character!")
    }

    // Length
    pattern =/^[A-Za-z0-9\W]{8,}$/
    let requiredLength = pattern.test(password);
    
    if(!requiredLength){
        errors.push("Password must be at least 8 characters long!")
    }

    mainHash = await bcrypt.hash(password, 10).then(hash => {
        return hash;
    })
    .catch(err => {
        console.log(err);
    })

    const passwordAccepted = await bcrypt.compare(passwordConfirmation, mainHash).then(res=>{
        return res;
    })
    .catch(err => {
        console.log(err);
    })
    
    if(!passwordAccepted){
        errors.push("The passwords do not match.")
    }

    if(errors.length !== 0){
        return errors
    }
    return mainHash;
}

const verifyPasswordLogin = async function(password, stored){
    const accepted = await bcrypt.compare(password, stored).then(res=>{
        return res;
    })
    .catch(err => {
        console.log(err);
    })

    return accepted;
}

// Create and save a new User(INSERT INTO users (<attributes>) VALUES (<values>))
exports.create = (req, res) => {
    // Validation
    if (!req.body.username) {
        res.status(400).send({
          message: "Username cannot be empty!"
        });
        return;
    }

    if (!req.body.email) {
        res.status(400).send({
          message: "Email cannot be empty!"
        });
        return;
    }

    if (!req.body.role) {
        res.status(400).send({
          message: "Role cannot be empty!"
        });
        return;
    }

    let passwordResult;
    const checkPassword = async() => {
        passwordResult = await isPasswordInvalid(req.body.password, req.body.passwordConfirm)
    }

    checkPassword().then(()=>{
        if(passwordResult[0] !== '$'){
            res.status(400).send({
                message: "Password does not match requirements!"
            });
            return;
        }
        else{
            const date = new Date();
            // Create a User
            const user = {
                user_id: req.body.user_id,
                username: req.body.username,
                password: passwordResult,
                email: req.body.email,
                created_at: date,
                last_login: date,
                role: req.body.role
            };
            
            // Save User in the database
            User.create(user)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
                });
            });
        }
    });
};

// Retrieve all Users from the database (SELECT * FROM users)
exports.findAll = (req, res) => {
    User.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single User with an id (SELECT * FROM users WHERE id=<id>)
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find user with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving user with id=" + id
        });
      });
};

// Update a User by the id in the request (UPDATE users SET <attributes>=<new value> WHERE id=<id>)
exports.update = (req, res) => {
    const username = req.body.username;

    // Validation
    if (!username) {
        res.status(400).send({
          message: "Username cannot be empty!"
        });
        return;
    }

    if (!req.body.email) {
        res.status(400).send({
          message: "Email cannot be empty!"
        });
        return;
    }

    if (!req.body.role) {
        res.status(400).send({
          message: "Role cannot be empty!"
        });
        return;
    }

    // Password was changed and must be re-hashed
    if(req.body.password[0] != '$'){
        let passwordResult;
        const checkPassword = async() => {
            passwordResult = await isPasswordInvalid(req.body.password, req.body.passwordConfirm)
        }

        checkPassword().then(() => {
            if(passwordResult[0] !== '$'){
                res.status(400).send({
                    message: "Password does not match requirements!"
                });
                return;
            }
            else{
                var user = {
                    user_id: req.body.user_id,
                    username: req.body.username,
                    password: passwordResult,
                    email: req.body.email,
                    created_at: req.body.created_at,
                    last_login: req.body.last_login,
                    role: req.body.role
                };
                
                User.update(user, {
                    where: { username: username }
                })
                .then(num => {
                    if (num == 1) {
                    res.send({
                        message: "User was updated successfully."
                    });
                    } else {
                    res.send({
                        message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`
                    });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({
                        message: "Error updating User with username=" + username
                    });
                });
            }
        })
    }
    // Password unchanged
    else{
        User.update(req.body, {
            where: { username: username }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating User with username=" + username
            });
        });
    }
};

// Delete a User with the specified id in the request (DELETE FROM users WHERE id = <id>)
exports.delete = (req, res) => {
    const username = req.params.username;

    User.destroy({
      where: { username: username }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
};

exports.verifyPassword = (req, res) => {
    const password = req.params.password;
    const stored= req.params.stored;

    let result;
    const checkPassword = async() => {
        result = await verifyPasswordLogin(password, stored);
    }

    checkPassword().then(() => {
        res.send(result);
    })
    .catch(() => {
        res.send(false);
    })
};

exports.findByUsername = (req, res) => {
    const username = req.params.username
  
    User.findOne({ where: { username: username}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user with username " + username + "."
      });
    });
}

exports.findByEmail = (req, res) => {
    const email = req.params.email
  
    User.findOne({ where: { email: email}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user with email " + email + "."
      });
    });
}

// Find the max recorded ID for inserting new records (SELECT max(id) from users) 
exports.findMaxID = (req, res) => {
  User.findOne({
    attributes: [db.Sequelize.fn('max', db.Sequelize.col('user_id'))],
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

exports.updateLogin = (req, res) => {
    const username = req.params.username;
  
    User.update(req.body, {
      where: { username: username }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: "Error updating User with username=" + username
        });
      });
  };

// Retrieve all Users from the database, optionally with a username query (SELECT * FROM users WHERE username=<username> LIMIT <size> OFSET <page-1>*<size>) with paging
exports.findAllPaged = (req, res) => {
    const username = req.params.query;
    const page = req.params.page;
    const size = req.params.size;
  
    var condition = username ? { username: { [Op.iLike]: `%${username}%` }} : null;
  
    User.findAll({ where: condition, limit: size, offset: (page-1) * size, order: [['username', 'ASC']], })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving user."
        });
      });
  };
  
// Retrieve all Users from the database, optionally with a username query (SELECT * FROM users WHERE username=<username>) and without paging
exports.findAllUnpaged = (req, res) => {
  const username = req.params.query;

  var condition = username ? { username: { [Op.iLike]: `%${username}%` }} : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

