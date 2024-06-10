module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define("rating", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      art_id: {
        type: Sequelize.INTEGER,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.STRING
      },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
  
    return Rating;
};