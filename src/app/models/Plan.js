import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        duration: Sequelize.INTEGER,
        title: Sequelize.STRING,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  getTotalPrice() {
    return this.duration * this.price;
  }
}

export default Plan;
