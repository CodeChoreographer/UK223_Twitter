import mysql from 'mysql2/promise'
import { USER_TABLE, TWEET_TABLE, COMMENT_TABLE, LIKE_TABLE, NOTIFICATION_TABLE } from './schema'

export class Database {
  private _pool: mysql.Pool

  constructor() {
    this._pool = mysql.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }

  private async initializeDBSchema() {
    try {
      const connection = await this._pool.getConnection()

      await connection.query(USER_TABLE)
      await connection.query(TWEET_TABLE)
      await connection.query(COMMENT_TABLE)
      await connection.query(LIKE_TABLE)
      await connection.query(NOTIFICATION_TABLE)

      connection.release()
      console.log('✅ Datenbanktabellen erfolgreich erstellt und initialisiert.')
    } catch (error) {
      console.error('❌ Fehler beim Initialisieren der Datenbanktabellen:', error)
    }
  }

  public getPool(): mysql.Pool {
    return this._pool
  }
}
