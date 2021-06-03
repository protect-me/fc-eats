module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 50], // 0 <= 글자수 <= 50
        },
        allowNull: false, // 빈 값을 넣으면 안됨
      },

      password: {
        type: DataTypes.STRING,
        validate: {
          len: [3, 100],
        },
        allowNull: false,
      },

      displayname: { type: DataTypes.STRING },
    },
    {
      tableName: "User",
    }
  );
  return User;
};
