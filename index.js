const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes); 

//connect to database & listen to server
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'eCommerce_RN_db'})
.then(() => {
    console.log('Database Connection is ready...')
})
.catch(err => {
    console.log(err)
})

//Development
// app.listen(process.env.PORT, () => {
//   console.log(`server is running at port: ${process.env.PORT}`)
// })

//Production
var server = app.listen(process.env.PORT || 3000, () => {
  var port = server.address().port
  console.log('Express is working on port ' + port)
})