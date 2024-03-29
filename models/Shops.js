const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Shops = sequelize.define("Shops", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, comment: "상점명" },
    thumbnail: { type: DataTypes.STRING, comment: "상점사진" },
    address: { type: DataTypes.STRING, comment: "주소" },
    location: { type: DataTypes.STRING, comment: "상세주소" },
    geo: { type: DataTypes.GEOMETRY("POINT"), comment: "위도,경도" },
    phone: { type: DataTypes.STRING, comment: "전화번호" },
    open_time: { type: DataTypes.STRING, comment: "운영시간" },
    cell_phone: { type: DataTypes.STRING, comment: "핸드폰번호" },
  });

  Shops.associate = (models) => {
    Shops.hasMany(models.ShopsMenu, {
      as: "Menu",
      foreignKey: "shop_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });

    Shops.hasOne(models.Checkout, {
      as: "Checkout",
      foreignKey: "shop_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });

    // 즐겨찾기 구현
    Shops.belongsToMany(models.User, {
      through: {
        model: "LikesShops",
        unique: false,
      },
      as: "LikeUser",
      foreignKey: "shop_id",
      sourceKey: "id",
      constraints: false,
    });
    Shops.belongsToMany( models.Tag ,{
      through: {
          model: 'TagShop',
          unique: false
      },
      as : 'Tag',
      foreignKey: 'shop_id',
      sourceKey: 'id',
      constraints: false
    });
  };

  Shops.prototype.dateFormat = (date) => moment(date).format("YYYY-MM-DD");

  return Shops;
};
