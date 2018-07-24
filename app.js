const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const data  = require('./data');
const port = 3000;
const fileUpload = require('express-fileupload'); 

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'));
app.use(express.static(__dirname + '/Photo_wall'));
app.use(express.static(__dirname + '/Styles'));
app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render('index.ejs', {data});
});

app.get('/new', (req,res)=>{
    res.render('addStudent')
});

app.get('/:student', (req,res)=>{
    const foundStudent = req.params.student;
    const student = data.find((student)=>foundStudent === student.firstName);
    res.render('student', {student});
});

app.post('/addStudent',(req,res)=>{
    
    if(!req.files)
    return res.status(400).send('No files were uploaded.');
    let photo = req.files.image;
    photo.mv(__dirname + '/Photo_wall/'+photo.name,function(err) {
        if (err)
          return res.status(500).send(err);
      });
    
    const student = req.body;
    const skillsArray = student.skills.split(',');
    student.skills = skillsArray;
    student.src = photo.name;
    student.alt = photo.name;
    data.push(student);
    console.log(data);
    res.redirect('/');
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});