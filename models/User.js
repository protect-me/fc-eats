const passwordHash = require("../helpers/passwordHash");

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

  User.associate = (models) => {
    // 즐겨찾기 구현
    User.belongsToMany(models.Shops, {
      through: {
        model: "LikesShops",
        unique: false,
      },
      as: "Likes",
      foreignKey: "user_id",
      sourceKey: "id",
      constraints: false,
    });
  };

  User.beforeCreate((user, _) => {
    user.password = passwordHash(user.password);
  });

  return User;
};
