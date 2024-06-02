module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      last_login: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
      },
      role: {
        type: Sequelize.TEXT
      }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
  
    return User;
};