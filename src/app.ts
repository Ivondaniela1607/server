import dotenv from 'dotenv';
const result = dotenv.config({ path: './config/.env' });
import http from 'http';

if (result.error) {
  throw result.error;
}

import express, { Application, Request, Response } from 'express';
import * as timeUntil from 'time-until';
import 'moment/locale/es';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

const ipfilter = require('express-ipfilter').IpFilter;

//* SWAGGER
import swaggerUI from 'swagger-ui-express';
import swaggerSetup from './doc/swagger';

var serveIndex = require('serve-index');

//const webpush = require('web-push');

// Rutas
import tourismRoutes from './routes/tourism.routes';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import presupuestosRoutes from './routes/presupuestos.routes';
import usersRoutes from './routes/users.routes';
import filesRoutes from './routes/files.routes';
import serviciosRoutes from './routes/servicios.routes';



//SOCKET IO
// import socket_io from './sockets/socket-io'
import { CronJobs } from './cronJobs/cron-jobs';
var cron = require('node-cron');
import { NextFunction } from 'express';

//const webpush = require('web-push')
import { Server } from 'socket.io';
import socketIO from 'socket.io';
import { User } from './interface/auth.interface';
import { queryMysql } from './utils/query.helper';

let userList = new Map();

export class App {
  private static _instance: App;

  private app: Application;
  private httpServer: http.Server;
  // public server;
  public io: socketIO.Server;

  public usuario: any = [];

  constructor(private port?: number | string) {
    this.app = express();

    this.httpServer = new http.Server(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
      },
    });

    this.escuharSockets();
    this.settings();
    this.middlewares();
    this.rutas();
    this.database();

    this.webPush();

    this.cronJobs();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  listausuarios: any = [];
  async escuharSockets() {}

  settings() {
    this.app.set('port', this.port || process.env.port || 5634);
  }

  middlewares() {
    //MORGAN
    this.app.use(morgan('dev'));
    this.app.use(express.json());

    //SWAGGER
    this.app.use(
      '/documentacion',
      swaggerUI.serve,
      swaggerUI.setup(swaggerSetup)
    );

    //FILLTER IP
    const ips = [
      '::1',
      '::ffff:127.0.0.1',
      '::ffff:10.110.0.4',
      '::ffff:153.92.7.228',
    ];
    this.app.use(ipfilter(ips, { mode: 'allow' }));

    this.app.use(compression());
    // adding set of security middlewares
    // this.app.use(helmet());
    this.app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
    // parse incoming request body and append data to `req.body`

    var corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200, // For legacy browser support
      methods: 'GET, PUT, PATCH, POST, OPTIONS',
    };
    // enable all CORS request
    this.app.use(cors(corsOptions));
    //this.app.use( cors({ origin: true, credentials: true  }) );
    console.log(process.env.NODE_ENV);
    // if (this.app.settings.env === 'development') { // pedir que otro sitio pida recursos en modo de desarrollo

    // this.app.use((req, res, next) => {
    //   res.setHeader("Access-Control-Allow-Origin", "*");
    //   res.setHeader(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Request-With, Content-Type, Accept"
    //   );
    //   res.setHeader(
    //     "Access-Control-Allow-Methods",
    //     "POST, GET, PATCH, DELETE, OPTIONS"
    //   );
    //   next();
    // });
    //   }

    this.app.use((req, res, next) => {
      let host = req.get('host').split('.');
      let url = req.originalUrl.split('/');
      url.shift();
      next();
    });
  }

  rutas() {
    //* http://localhost:5641/

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/tourism', tourismRoutes);
    this.app.use('/api/products', productsRoutes);
    this.app.use('/api/presupuestos', presupuestosRoutes);
    this.app.use('/api/users', usersRoutes);
    this.app.use('/api/files', filesRoutes);
    this.app.use('/api/servicios', serviciosRoutes);
    this.app.use('/servicios', express.static('uploads/servicios'))
    this.app.use('/uploads/presupuestos', express.static('uploads/presupuestos'))
    // CARPETAS PUBLICAS
    //* ============================================================
    //*! OJO CUANDO ESTE EN PRODUCCION
    //* ============================================================
    //* CREO LA CARPETA 'VIRTUAL' PUBLIC y DENTRO DISPONGO DE LAS SEÑALADAS
    //* CON EL SERVE-INDEX CONSIGO ADEMAS UNA REPRESENTACION DE LAS MISMAS

    // this.app.use(
    //   "/files", TokenValidationFile,
    //   express.static("uploads/usuarios"),
    //   serveIndex("uploads/usuarios", { icons: true })
    // );

    // this.app.use(
    //   '/pdf',
    //   express.static('uploads/pdf'),
    //   serveIndex('uploads/pdf', { icons: true }),
    // )
    // this.app.use("/files", express.static("uploads/pdf"));
    // this.app.use("/uploads", express.static(path.resolve("uploads")));
  }

  imprmirAlgo(req: Request, res: Response, next: NextFunction) {
    console.log('algo');
    console.log(req.headers);
    next();
  }

  webPush() {
    // const vapid_keys = {};
    // 	// tslint:disable-next-line: no-unused-expression
    // 	webpush.setVapidDetails(
    // 		'mailto:josemanuel.delahorra@gmail.com',
    // 		// vapid_keys.publicKey,
    // 		// vapid_keys.privateKey
    // 	);
  }
  cronJobs() {
    // const job = new CronJob('*/5 * * * * *', function () {
    //   const d = new Date()
    //   console.log('You will see this message every second', d)
    // })
    // job.start()
  }

  database() {}

  async listen() {
    let hostname = process.env.HOST;

    this.httpServer.listen(5641, () => {
      console.log(
        'Servidor Grafisant corriendo \x1b[32m%s\x1b[0m',
        hostname,
        5641
      );
      console.log('Entorno: ' + this.app.settings.env);
      // this.socket_io()
    });
  }
  // private socket_io() {
  //   socket_io.connection(this.httpServer)
  // }
}
