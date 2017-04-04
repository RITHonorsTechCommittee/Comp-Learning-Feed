const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const url = require('url');
const RedisStore = require('connect-redis')(session);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

mongoose.connect(dbURL, (err) => {
	if(err){
		console.log(`Could not connect to database ${dbURL}`);
		throw err;
	}
});

let redisURL = {
	hostname: 'localhost',
	port: 6379,
};

let redisPASS;

if(process.env.REDISCLOUD_URL){
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPASS = redisURL.auth.split(':')[1];
}

const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(session({
	key: 'sessionid',
	secret: 'Domo Arigato',
	resave: true,
	saveUninitialized: true,
	store: new RedisStore({
		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPASS,
	}),
}));

app.engine('handlebars', expressHandlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

app.listen(port, (err) => {
	if(err){
		throw err;
	}
	console.log(`Listening on port ${port}`);
});