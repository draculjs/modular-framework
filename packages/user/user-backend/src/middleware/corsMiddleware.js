import cors from 'cors';

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Origin', 'X-Requested-With', 'Content-Type',
    'Accept', 'Access-Control-Allow-Request-Method', 'apollo-require-preflight'
  ],
  exposedHeaders: ['apollo-require-preflight']
};

const corsMiddleware = cors(corsOptions);

const combinedCors = (req, res, next) => {
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  
  corsMiddleware(req, res, next);
};

export default combinedCors;