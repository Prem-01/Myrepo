var mongoose=require('mongoose')
var bodyparser=require('body-parser')
var express=require('express')
var config=require('./config')
var useraction=require('./useraction');
const middleware  = require('./middleware')
var cors = require('cors')
var app = express()
 
app.use(cors())
var randomstring = require("randomstring");
app.use(bodyparser.json())
mongoose.connect(config.URL,{userNewUrlParser:true})
app.post("/register",(req,res)=>useraction.register(req,res))
app.post("/login",(req,res)=>useraction.login(req,res))
app.get("/ViewRegisterationData/:id",[middleware.verifyToken],(req,res)=>useraction.ViewRegisterationData(req,res))
app.get("/ViewTeacherSchema/:id",(req,res)=>useraction.ViewTeacherSchema(req,res))
app.put("/classgenerate",(req,res)=>useraction.classgenerate(req,res))
app.put("/buyclass/:id/:id1",(req,res)=>useraction.buyclass(req,res))
app.put("/update/:id",(req,res)=>useraction.update(req,res))
app.delete("/remove/:id",(req,res)=>useraction.remove(req,res))
app.get("/age",(req,res)=>useraction.age(req,res))
app.get("/status",(req,res)=>useraction.status(req,res))
app.get("/role_teacher",(req,res)=>useraction.role_teacher(req,res))
app.get("/role_student",(req,res)=>useraction.role_student(req,res))
app.put("/TeacherSchema",(req,res)=>useraction.TeacherSchema(req,res))
app.get("/Retrive_Specify_Field",(req,res)=>useraction.Retrive_Specify_Field(req,res))

app.listen(config.port,()=>
{
	console.log(`server started `)
})


