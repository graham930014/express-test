var express = require("express");
var app = express();
var mongoose = require('mongoose');
var Article = require('./models/article')
var csv = require('csvtojson');
var fileUpload = require('express-fileupload');
var methodOverride = require('method-override')

app.use(methodOverride('_method'))
app.use(fileUpload());

mongoose.connect('mongodb://localhost:27017/myapp',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("database connection open")
    })
    .catch(err =>{
        console.log("database connect error")
        console.log(err)   
    })

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))


app.set('view engine', 'ejs')

app.get('/',(req,res) => {
    res.render('home.ejs')
})


app.get('/uploadcsv', (req, res) =>{
    res.render('uploadcsv')
})

app.get('/articles',async(req,res) =>{
    const articles = await Article.find({})
    res.render('articles', {articles})
})

app.get('/articles/:id', async (req,res) =>{
    const {id} = req.params;
    const article = await Article.findById(id)
    console.log(article.title)
    res.render('edit',{article})
})

app.put('/articles/:id',async (req,res) =>{
    const{id} = req.params;
    const product = await Article.findByIdAndUpdate(id, req.body, {runValidators:true, new:true})
    res.redirect('/articles');
})

app.post('/upload', async (req, res) =>  {
    console.log('req.body >>>', req.body)
    
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
      }
    console.log('req.files >>>', req.files);
    res.send("We have received your file")
    console.log('req.files.myfile.data >>>',req.files.myfile.data)
      

    await csv()
    .fromString(req.files.myfile.data.toString('utf8'))
    .on('done', () => {
        console.log('done parsing');
    })
    .then((csvRow)=>{
        console.log('csvRow >>',csvRow)

        Article.insertMany(csvRow)
        .then(res => {
            console.log("res >>",res)
        })
        .catch(err => {
            console.log(err)
        })
    
    }); 
    
})

app.listen(3000,() => {
    console.log("Listen on port 3000")
})