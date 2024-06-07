module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("token", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expiry: {
        type: 'TIMESTAMP',
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
  
    return Token;
};