import { Sequelize } from 'sequelize';
import { initSchema } from './schema';
import { seedInitialRolesAndRights } from './seed';

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
    this.connectWithRetry();
  }

  private async connectWithRetry(retries = 5, delayMs = 3000) {
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('✅ Verbindung zur Datenbank erfolgreich hergestellt.');

        initSchema();

        await sequelize.sync({ alter: true });
        console.log('✅ Datenbanktabellen erfolgreich synchronisiert.');

        await seedInitialRolesAndRights();
        console.log('✅ Initialdaten erfolgreich eingefügt.');

        return;
      } catch (error: any) {
        console.error(`❌ Verbindungsversuch fehlgeschlagen (${6 - retries}/5):`, error.message);
        retries--;

        if (retries === 0) {
          console.error('❌ Keine weiteren Verbindungsversuche. Server wird ohne DB gestartet.');
          return;
        }

        console.log(`🔁 Neuer Versuch in ${delayMs / 1000} Sekunden...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
}
