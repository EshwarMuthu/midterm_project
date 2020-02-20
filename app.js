const express = require('express');
var bodyParser = require('body-parser');
const home = require('./home');
const stud_dash = require('./student/dashboard');
const stud_newsubs = require('./student/newcourse');
const stud_editsubs = require('./student/editcourse');
const stud_swapsubs = require('./student/swapcourse');
const fac_dash = require('./faculty/dashboard_fac');
const stud_viewsubs=require('./student/viewcourse');

var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');
app.set('views', './ui');

app.get('/', (req, res) => home.myhome(req, res));
app.get('/stud/dashboard', (req, res) => stud_dash.mydashboard(req, res));

app.get('/stud/newcourse', (req, res) => stud_newsubs.subscribenewcourseGet(req, res));
app.post('/stud/newcourse', (req, res) => stud_newsubs.subscribenewcoursePost(req, res));

app.get('/stud/editcourse', (req, res) => stud_editsubs.editsubscoursesGet(req, res));
app.get('/stud/delete', (req, res) => stud_editsubs.delsubscoursesGet(req, res));
app.get('/stud/swap', (req, res) => stud_swapsubs.swapcoursesGet(req, res));
app.post('/stud/swapped', (req, res) => stud_swapsubs.swappedcoursesPost(req, res));

app.get('/fac/dashboard', (req, res) =>fac_dash.facdashGet(req,res));
app.post('/fac/dashboard', (req, res) =>fac_dash.facdashPost(req,res));

app.get('/stud/viewcourses',(req,res)=>stud_viewsubs.viewsubs(req,res));

app.listen(8080);