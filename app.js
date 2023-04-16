const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
var cors = require('cors')

const https = require('https');
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');


const userRoutes = require('./routes/user')
const purchaseRoutes = require('./routes/purchase')
const resetPasswordRoutes = require('./routes/resetpassword')

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
    }));
app.use(cors());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

app.use(compression());

// app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json());  //this is for handling jsons

app.get('/', (req, res) => {
    res.send('<h1>Welcome to my website!</h1>');
    });

console.log("request has arrived");

app.use('/user', userRoutes)

app.use('/purchase', purchaseRoutes)

app.use('/password', resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()
    .then(() => {
       app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

