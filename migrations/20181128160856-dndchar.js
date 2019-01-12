'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dnd_characters', {
      username: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        allowNull: false
      },
      ownerId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      race: {
        type: Sequelize.STRING,
        allowNull: false
      },
      male: {
        type: Sequelize.BOOLEAN,
        default: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      alignment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      class: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        default: []
      },
      ideals: {
        type: Sequelize.STRING(400)
      },
      bonds: {
        type: Sequelize.STRING(400)
      },
      flaws: {
        type: Sequelize.STRING(400)
      },
      statStrength: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        default: [0]
      },

      statDexterity: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        default: [0]
      },
      statConstitution: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        default: [0]
      },
      statIntelligence: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        default: [0]
      },
      statWisdom: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        default: [0]
      },
      statCharisma: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        default: [0]
      },
      story: {
        type: Sequelize.TEXT,
        default: ''
      },
      customAttributes: {
        type: Sequelize.JSON,
        default: {}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dnd_characters');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
