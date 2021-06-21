module.exports = (sequelize, DataTypes) => {
  const ShopsMenu = sequelize.define(
    "ShopsMenu",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, comment: "메뉴명" },
      price: { type: DataTypes.INTEGER, comment: "가격" },
    },
    {
      tableName: "ShopsMenu",
    }
  );

  ShopsMenu.associate = (models) => {
    // ManyToMany (Checkout <-> ShopsMenu)
    ShopsMenu.belongsToMany(models.Checkout, {
      through: {
        // 교차테이블
        model: "CheckoutMenu",
        unique: false,
      },
      as: "Checkout",
      foreignKey: "menu_id",
      sourceKey: "id",
      constraints: false,
    });
  };

  return ShopsMenu;
};
