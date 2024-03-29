const mongoose=require("mongoose");
const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()
mongoose.connect(process.env.DB).then(()=>{
    console.log("database connect successfull");
}).catch((e)=>{
    console.log(e);
})

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confpassword:{
        type: String,
        required: true
    },
    // for jwt token
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
// JWT Create Token 
schema.methods.generateToken=async function(){
    try {
        // const tokenuser =jwt.sign({_id:this._id.toString()},process.env.KEY);
        const tokenuser= jwt.sign({_id:this._id.toString()}, process.env.KEY)
          this.tokens =this.tokens.concat({token:tokenuser})
          await this.save();
        return tokenuser
    } catch (error) {
        
    }
}
// Bcrypt Password
schema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
    }
   
    next();
})
const usermodel= mongoose.model("userdetail",schema);

module.exports=usermodel;