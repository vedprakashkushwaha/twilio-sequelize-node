module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("address", {
    line1: {
      type: Sequelize.STRING
    },
    line2: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    zip: {
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
         model: 'users',
         key: 'id',
      }
   },
    address_type: {
      type: Sequelize.STRING
    }
  });
  return Address;
};
