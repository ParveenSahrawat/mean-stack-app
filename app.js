require('./api/data/db.copy');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var routes = require('./api/routes');
const app = express();

app.set('port', 3000);

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
// Handles post requests
app.use(bodyParser.urlencoded({extended : false}));
app.use('/api', routes);


app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
});