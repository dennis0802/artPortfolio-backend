module.exports = (sequelize, Sequelize) => {
    const Artpiece = sequelize.define("artwork", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING
      },
      month: {
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });
  
    return Artpiece;
};