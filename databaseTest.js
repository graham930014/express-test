var mongoose = require('mongoose');
var  Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/myapp',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("database connection open")
    })
    .catch(err =>{
        console.log("database connect error")
        console.log(err)   
    })


productList=[
    {name:'ddd'},
    {name:'eee'},
    {name:'ccc'}
]
    
    Product.insertMany(productList)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    
    // const p = new Product({
    //     name:'p2'
    // })
    // p.save().then(p =>{
    //     console.log("Save!")
    //     console.log(p)
    // })