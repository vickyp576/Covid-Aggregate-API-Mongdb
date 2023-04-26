// const express = require('express')
// const app = express()
// const bodyParser = require("body-parser");
// const port = 8080

// // Parse JSON bodies (as sent by API clients)
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// const { connection } = require('./connector')






// app.listen(port, () => console.log(`App listening on port ${port}!`))

// module.exports = app;

const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080;


// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');
const { Collection } = require('mongoose');

app.get("/totalRecovery",async(req,res)=>{

try{
    
 const recover=await connection.aggregate([
    {
        $group:{
            _id:"total",
            recovered:{$sum:"$recovered"}
        }
    }])
    console.log(recover)
    return res.status(200).send("success")
}
catch(e){
    console.log(e)
}

})

app.get("/totalActive",async(req,res)=>{
    try{
    const activemember= await connection.aggregate([
        {
          $group: {
            _id: "total",
            active: { $sum: { $subtract: ['$infected', '$recovered']}
        }
        }}
    ])
console.log(activemember)
return res.status(200).send("success")
    }
    catch(e){
        console.log(e)
    } 
    
})

app.get("/totalDeath",async(req,res)=>{
    try{
     const death=await connection.aggregate([
        {
            $group:{
                _id:"total",
                death:{$sum:"$death"}
            }
        }
    ])
 console.log(death)
 return res.status(200).send("success")
}
catch(e){
    console.log(e)
}
    
})

app.get("/hotspotStates",async(req,res)=>{
   
    try{
        const hotspot=await connection.aggregate([
                { 
                    $project:{ 
                        _id:0,
                       state: 1,
                        rate:{$round:[{ $divide: [{ $subtract: ['$infected', '$recovered']}, "$infected" ] },4]} 
                    }
                 }
            ])
            console.log(hotspot)
            return res.status(200).send("success")
       }
       catch(e){
           console.log(e)
       }
   
    
})
app.get("/healthyStates",async(req,res)=>{

    try{
        const healthy=await connection.aggregate([
                { 
                    $project:
                     { 
                        _id:0,
                       state: 1,
                        mortality:{$round:[{ $divide: [ "$death", "$infected" ] },4]} 
                    }
                 }
        ])
            console.log(healthy)
            return res.status(200).send("success")
        }
       catch(e){
           console.log(e)
       }
   
    
})




app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;