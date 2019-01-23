// PORT
process.env.PORT = process.env.PORT || 3000;

// Deployment
process.env.NODE_DEV = process.env.NODE_DEV || 'dev';

//Connection URL
let urlDB;
if (process.env.NODE_DEV === 'dev')
    urlDB = 'mongodb://localhost:27017/CECyTEApp';
else
    urlDB = process.env.MONGO_URL;


process.env.URL_DB = urlDB;

//ExpiresIn and Seed
process.env.EXPIRATION_TOKEN = '4320h';
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'cecytea-test-simulation';

//Cloudinary Configuration
process.env.CLOUD_NAME = process.env.CLOUD_NAME || 'romo'
process.env.API_KEY = process.env.API_KEY || '221298566537766'
process.env.API_SECRET = process.env.API_SECRET || 'Fe_oJYOsJ2OEv2IgjSjjSCbftUo'