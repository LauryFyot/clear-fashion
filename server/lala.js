// const allpages = require('./allpages');

// async function prod() {
//     try {
//         var tab = await allpages.scrapeAllProducts();
//         console.log('tab:',tab);
//       } catch (e) {
//       console.error(e);
//       process.exit(1);
//     }
// };

// prod();


const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://WebAPPUser:WebAPPUser@webapp.gteyh.mongodb.net/WebAPP?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'WebAPP';



// const db =  client.db(MONGODB_DB_NAME)

async function lalafunc() {
    try {
        const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
};

lalafunc();