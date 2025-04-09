import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'minitwitter',
  process.env.DB_USER || 'minitwitter',
  process.env.DB_PASSWORD || 'supersecret123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mariadb',
    logging: false,
  }
);

export class Database {
  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      await sequelize.authenticate();
      console.log('✅ Verbindung zur Datenbank erfolgreich hergestellt.');

      await sequelize.sync({ alter: true });
      console.log('✅ Datenbank ist aktuell.');

    } catch (error) {
      console.error('❌ Fehler beim Verbinden mit der Datenbank:', error);
    }
  }
}
