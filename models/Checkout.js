const moment = require("moment");

module.exports = function (sequelize, DataTypes) {
  const Checkout = sequelize.define(
    "Checkout",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      imp_uid: { type: DataTypes.STRING }, //고유ID
      merchant_uid: { type: DataTypes.STRING }, //상점 거래ID
      paid_amount: { type: DataTypes.INTEGER }, //결제금액
      apply_num: { type: DataTypes.STRING }, //카드 승인번호

      buyer_email: { type: DataTypes.STRING }, //이메일
      buyer_name: { type: DataTypes.STRING }, //구매자 성함
      buyer_tel: { type: DataTypes.STRING }, //전화번호
      buyer_addr: { type: DataTypes.STRING }, //구매자 주소

      buyer_postcode: { type: DataTypes.STRING }, //우편번호

      status: { type: DataTypes.STRING }, //결재완료, 배송중 등등
    },
    {
      tableName: "Checkout",
    }
  );

  Checkout.associate = (models) => {
    // ManyToMany (Checkout <-> ShopsMenu)
    Checkout.belongsToMany(models.ShopsMenu, {
      through: {
        // 교차테이블
        model: "CheckoutMenu",
        unique: false,
      },
      as: "Menu",
      foreignKey: "checkout_id",
      sourceKey: "id",
      constraints: false,
    });
    Checkout.belongsTo(models.Shops, {
      as: "Shop",
      foreignKey: "shop_id",
      targetKey: "id",
    });
  };

  // 년-월-일
  Checkout.prototype.dateFormat = (date) =>
    moment(date).format("YYYY-MM-DD // h:mm");

  return Checkout;
};
