var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651')
const contract = require(`${__dirname}/config/contract`)
const keystore = require(`${__dirname}/config/keystore`)

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

const koreaVehicleVendors = contract.koreaVehicleVendors
const recall = contract.recall
const keyChain = keystore.keyChain
feePayer = undefined
hyundai = undefined
kia = undefined

const setup = async () => {
  feePayer = await caver.klay.accounts.wallet.add(
    keyChain['government']['privateKey'],
    keyChain['government']['address']
  )

  hyundai = await caver.klay.accounts.wallet.add(
    keyChain['hyundai']['privateKey'],
    keyChain['hyundai']['address']
  )

  kia = await caver.klay.accounts.wallet.add(
    keyChain['kia']['privateKey'],
    keyChain['kia']['address']
  )
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


setup()
app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!')); 
module.exports = app;
