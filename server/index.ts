import express, { Express, Request, Response } from 'express';
import { API } from './api'
import * as http from 'http'
import { Database } from './database'
import cors from 'cors'
import helmet from 'helmet';
import { errorHandler } from './api/errorHandler';



class Backend {
  // Properties
  private _app: Express
  private _api: API
  private _database: Database
  private _env: string

  // Getters
  public get app(): Express {
    return this._app
  }

  public get api(): API {
    return this._api
  }

  public get database(): Database {
    return this._database
  }

  // Constructor
  constructor() {
    this._app = express()
    this._app.disable('x-powered-by');
    this._app.use(helmet());
    this._app.use(cors())
    this._app.use(express.json())

    this._database = new Database()
    this._api = new API(this._app)
    this._env = process.env.NODE_ENV || 'development'

    this.setupRoutes()
    this._app.use(errorHandler);
    this.startServer()
  }

  private setupRoutes(): void {
    this._app.get('/', (_, res) => {
      res.status(200).send('🚀 MiniTwitter Backend läuft');
    });
  }

  private startServer(): void {
    if (this._env === 'production') {
      http.createServer(this.app).listen(3000, () => {
        console.log('Server is listening on port 3000!')
      })
    } else {
      this._app.listen(3000, () => {
        console.log('Server is listening on port 3000 (Development Mode)!')
      })
    }
  }
}

const backend = new Backend()
export const viteNodeApp = backend.app
