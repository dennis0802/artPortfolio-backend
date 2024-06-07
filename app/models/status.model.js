module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("status", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tokenExpiry: {
        type: 'TIMESTAMP',
        allowNull: true
      },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
  
    return Status;
};