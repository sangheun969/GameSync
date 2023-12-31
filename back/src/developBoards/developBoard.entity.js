module.exports = (sequelize, DataTypes) => {
  sequelize.define(
    "DevelopBoards",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      image: {
        type: DataTypes.STRING,
      },
      original_filename: {
        type: DataTypes.STRING,
      },
      like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "DevelopBoard",
      freezeTableName: true,
    }
  );
};
