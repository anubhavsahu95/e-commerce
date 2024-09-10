require('dotenv').config();
const cloudinary=require("cloudinary");
const fs=require("fs");
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

const allowedOrigins = [
  'https://e-commerce-admin-gsnx.onrender.com',
  'https://e-commerce-frontend-5b1g.onrender.com',
  'https://e-commerce-back-end-vmli.onrender.com',
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(null,false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization',],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Database Connection With MongoDB
mongoose.connect(
  process.env.MONGO_URI
);

// API Creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});


//Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath)=>{
  
    if(!localFilePath)return null

    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"
    });
    console.log("file is uploaded on cloudinary",response.url);
    return response;

}

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for Images
// app.use("/images", express.static("upload/images"));
// app.post("/upload", upload.single("product"), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: `https://e-commerce-back-end-vmli.onrender.com/images/${req.file.filename}`,
//   });
// });

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), async (req, res) => {
  const localFilePath = req.file.path;
  const uploadResponse = await uploadOnCloudinary(localFilePath);
  if (uploadResponse) {
    res.json({
      success: 1,
      image_url: uploadResponse.url,
    });
  } else {
    res.status(500).json({ success: 0, message: "Upload failed" });
  }
});

// Schema for Creating Products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id = 1;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    seccess: true,
    name: req.body.name,
  });
});

// Creating API for deleting Products

app.post("/removeproduct", async (req, res) => {
  const productId = req.body.id;

  // Set the product quantity to 0 in all users' carts
  await Users.updateMany(
    { [`cartData.${productId}`]: { $exists: true } },
    { $set: { [`cartData.${productId}`]: 0 } }
  );
  
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for getting all Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// Schema Creating for User Model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating Endpoint for registering the user

app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
      res.status(400).json({success:false,errors:"Existing user found with same Email Address"})
    }
    let cart={};
    for (let i = 0; i < 300; i++) {
      cart[i]=0;
    }
    const user = new Users({
      name:req.body.username,
      email:req.body.email,
      password:req.body.password,
      cartData:cart,
    })

    await user.save();

    const data = {
      user:{
        id:user.id
      }
    }

    const token= jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

// Creating endpoint for user login

app.post('/login',async(req,res)=>{
  let user=await Users.findOne({email:req.body.email});
  if(user){
    const passCompare = req.body.password===user.password;
    if(passCompare){
      const data={
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data,'secret_ecom');
      res.json({success:true,token});
    }
    else{
      res.json({success:false,errors:"Wrong Password !"});
    }
  }
  else{
    res.json({success:false,errors:"Wrong Email-Id"})
  }
});

// Creating endpoint for NewCollection Data
app.get('/newcollection',async (req,res)=>{
  //let product = await Product.find({});
  let product = await Product.find({}).sort({ _id: -1 }).limit(8);
  let newcollection = product;
  console.log("NewCollection Fetched");
  res.send(newcollection);
});

// Creating endpoint for Popular in Women
app.get('/popularinwomen',async (req,res)=>{
  let product = await Product.find({category:"women"});
  let popular_in_women = product.slice(0,4);
  console.log("Popular in Women Fetched");
  res.send(popular_in_women);
});

// Creating endpoint for Popular in Men
app.get('/popularinmen',async (req,res)=>{
  let product = await Product.find({category:"men"});
  let popular_in_men = product.slice(0,4);
  console.log("Popular in Men Fetched");
  res.send(popular_in_men);
})

// Creating middleware to fetch user
  const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
      res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
      try {
        const data = jwt.verify(token,'secret_ecom');
        req.user=data.user;
        next();
      } catch (error) {
        rmSync.status(401).send({errors:"Please authenticate usin a valid token"});
      }
    }
  }

// Creating Endpoint for Add to Cart
app.post('/addtocart',fetchUser,async (req,res)=>{
  console.log("Added",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId]+=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Added")
})

// Creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
  console.log("Removed",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId]-=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Removed")
})

// Creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
  console.log("GetCart");
  let userData=await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
});


app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});
