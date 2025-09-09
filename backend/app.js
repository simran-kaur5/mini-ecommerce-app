const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const {MongoClient , ObjectId} = require("mongodb");



app.use((req , res , next)=>{
    if(req.method =="GET"){
        return next();
    }
    next();
})
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});
const cors = require("cors");
app.use(cors());
const URL = "mongodb://localhost:27017/";

let db  , coll;
 async function connect(){
   const client =  await MongoClient.connect(URL);
    db = client.db("basic-ecommerce");
    console.log("Connected to dataBase");
}
connect();

app.get("/customers" ,async (req , res)=>{
    try{
        const allCustomers = await db.collection("customers").find().toArray();
        res.send(allCustomers);
    }catch(err){
        res.status(500).send({error:err.message});
        }
})

app.get("/orders" ,async (req , res)=>{
try{
        const detail = await db.collection("orders").aggregate([
            {
                $lookup:{
                   
                    from:"customers",
                    localField:"customerEmail",
                    foreignField:"email",
                    as:"customersDetails"
                }
            },
            {$unwind:"$customersDetails"}
            ,{
                $lookup:{
                     from:"products",
                    localField:"productName",
                    foreignField:"name",
                    as:"productsDetails"
                }
            },
            {$unwind:"$productsDetails"},
            {$project:{
                _id:1,
                "productsDetails.name":1,
                "customersDetails.email":1,
                quantity:1,
                status:1,
            }}
        ]).toArray();
        res.send(detail);
    }catch(err){
        res.status(500).send({error:err.message});
        }
})

app.get("/products" ,async (req , res)=>{
    try{
        const allProducts = await db.collection("products").find().toArray();
        res.send(allProducts);
    }catch(err){
        res.status(500).send({error:err.message});
        }
})

app.post("/customer/sign" , async(req , res)=>{
    try{
    const {name  , email , city} = req.body;
    const existing = await db.collection("customers").findOne({email});
    if(!existing){
    const result = await db.collection("customers").insertOne({name , email , city});
    res.json({message:"Customers added" , customerId: result.insertedId  , name , email , city});
    }else{
        res.send("the email already exits");
    }
    }catch(err){
        res.status(500).send("error occured ",err);
    }
})

app.post("/products/add" , async(req , res)=>{
    try{
    const {name  , price , category} = req.body;
    const existing = await db.collection("products").findOne({name});
    if(!existing){
    const result = await db.collection("products").insertOne({name , price , category});
    res.json({message:"Customers added" , customerId: result.insertedId , name  , price , category});
    }else{
        res.send("the product is already available in the stock");
    }
    }catch(err){
        res.status(500).send("error occured ",err);
    }
})

app.post("/order/place" , async (req , res)=>{
   try{
        const { productName , customerEmail , quantity , status} = req.body;
        console.log("Request body:", req.body);
        if(!quantity || quantity<=0){
            return res.status(400).send("Quantity must be greater then 0");
        }
        
        const customerExit = await db.collection("customers").findOne({email:customerEmail});
         if(!customerExit){
                return res.status(500).send("Customer not found");
            }
         const productExit = await db.collection("products").findOne({name:productName});
         if(!productExit){
                   return res.status(500).send("The product is not available in the stock"); 
                }

        const result = await db.collection("orders").insertOne({
            productName:productName,
            customerEmail:customerEmail,
            quantity:quantity,
            status:status
        });
       res.send({orderId:result.insertedId , productName , customerEmail , quantity , status});
       
    }catch(err){
        res.status(500).send("Error occured ",err);
    }
})
app.listen(port , ()=>{
    console.log("your port is ",port )
})

