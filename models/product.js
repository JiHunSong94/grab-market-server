module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    soldout: {
      //sqite에서는 일반적으로 참/거짓 판단하는 Boolean 형태를 제공하지 않는다. 또한 이미 테이블이 만들어진 상태(위에 테이블)에서 필드를 수정해도 squelize에서는 지원하지 않는다. 따라서 직접 수정해줘야 한다.
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0, // 데이터베이스에 있는 레코드가 하나 생성될때 soldout에 값을 안 넣었다면 defaultValue가 작동한다.
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  });
  return product;
};
