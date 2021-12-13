const express = require('express'),
    path = require('path'),
    routers = require('./routes/routes.js');
const port = 3001;

require('./db/mongoose')
const app = express();

app.use('/list', express.static(path.join(__dirname, 'html/index.html')));
app.use('/add_site/:id', express.static(path.join(__dirname, 'html/add_site_form.html')));
app.use('/add_tour', express.static(path.join(__dirname, 'html/add_tour_form.html')));
app.use('/createGuide', express.static(path.join(__dirname, 'html/add_guide_form.html')));
app.use('/edit_tour/:id', express.static(path.join(__dirname, 'html/edit_tour_form.html')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});