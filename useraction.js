var model=require('./model')
var model1=require('./model1')
var randomstring = require("randomstring");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var secret  ='this_is-a-secret';
var jwtDecode = require('jwt-decode');

function register(req,res)
{
	console.log("In Registration Function")
	console.log("body",req.body.gender)
		var user=new model(req.body)
		var random_number= randomstring.generate();
		user.refercode=random_number;
		var hash = bcrypt.hashSync(user.password, 10);
		user.password=hash;
		var ref=req.body.ref;
		if(!ref)
		{
			user.save((err,data)=>
				{
						if(err)
						{
							//return res.json("Email-id And First-name should be Uniq")
							return res.json({code:500,msg:"Email-id And First-name should be Uniq",data:data})
						}
						else
						{
							//return res.json({data:data})
							return res.json({code:200,msg:"Registered-Successfully",data:data})
						}

				})	
		}
		else{
		
			model.findOneAndUpdate({ "refercode":ref},{$inc:{"Points":100}},(err,fdata)=>
				{
					if(err)
					{
						console.log("Error in refer-code-generate ")
					}
					else if(fdata)
					{
						//console.log("Registered-Successfully Using Refercode",fdata)
						//console.log(1)
						user.Points+=20
						user.save((err,data)=>
						{
							if(err)
							{
								//return res.json("Email-id And First-name should be Uniq")
								return res.json({code:500,msg:"Email-id And First-name should be Uniq",data:data})
							}
							else
							{
								return res.json({code:200,msg:"Registered-Successfully Using Refercode(Get +20points)",data:data})
		
								//return res.json({data:data})
							}
		
						})
		}
	})
	// 	model.findOneAndUpdate({ "refercode": req.query.refercode},{$inc:{"Points":100}},(err,fdata)=>
	// 	{
	// 		if(err)
	// 		{
	// 			console.log("Error in refer-code-generate ")
	// 		}
	// 		else if(fdata)
	// 		{
	// 			//console.log("Registered-Successfully Using Refercode",fdata)
	// 			//console.log(1)
	// 			user.Points+=20
	// 			user.save((err,data)=>
	// 			{
	// 				if(err)
	// 				{
	// 					//return res.json("Email-id And First-name should be Uniq")
	// 					return res.json({code:500,msg:"Email-id And First-name should be Uniq",data:data})
	// 				}
	// 				else
	// 				{
	// 					return res.json({code:200,msg:"Registered-Successfully Using Refercode(Get +20points)",data:data})

	// 					//return res.json({data:data})
	// 				}

	// 			})
				
			
	// 		}
	// 		else
	// 		{
				
	// 			//console.log("Registered Sucessfully")
	// 			user.save((err,data)=>
	// 			{
	// 				if(err)
	// 				{
	// 					//return res.json("Email-id And First-name should be Uniq")
	// 					return res.json({code:500,msg:"Email-id And First-name should be Uniq",data:data})
	// 				}
	// 				else
	// 				{
	// 					//return res.json({data:data})
	// 					return res.json({code:200,msg:"Registered-Successfully",data:data})
	// 				}

	// 			})	

		
	// 		}
	// })
}
}
/*function login(req,res)
{
	
	
	model.find({$and:[{email: {$eq:req.body.email }},{password: { $eq:req.body.password }}]},(err,data)=>

	//model.find({$and:[{email: {$eq:req.body.email }},{password: { $eq:req.body.password }}]},(err,data)=>
		//model.find({$and:[{email: {$eq:req.body.email }},]},(err,data)=>
		//model.find({$and:[{password: {$eq:req.body.password }}]},(err,data)=>

	{
		
		
		if(err)
		{
			//return res.json(err)
			console.log(err)	

		}
		else if(data == 0)
		{
			console.log("Invalid Details")
		 return res.json({code:500,msg:"Unauthorized user"})
		}
		else if(data)
		{
			console.log("Welcome")
			 return res.json({code:500,msg:"Welcome user"})
		}
	




	}) 
}*/
async function login(req,res)
{
      console.log("in login function")
        model.findOne({"email":req.body.email},async(err,data)=>
                 
                 {
                     if(err)
                     {
                         console.log(err)
                         return res.json("Error in Login")
                     }
                     else
                     {
                     								//console.log(req.body.password)
                     								//console.log(data.password)
                     	 
                      const match = await bcrypt.compare(req.body.password, data.password);

                      								 //console.log(req.body.password)
                     							    //console.log(match)
                       if(match)
                       {
                             						// console.log("login successfully")
                            console.log(data.role)
                            const token = await jwt.sign({firstName:data.fname,id:data._id},secret,{expiresIn:60*60});
                             						// console.log("login successfully")
                            return res.json({code:200,msg:"login successfully",token:token,data:data.role})
                         }
                         else
                         {
                             						// console.log("Invalid password")
                            						// console.log("Invalid password")
                             return res.json({code:500,msg:"Unauthorized user"})
                         }
                         
                     }
                 })
}
function classgenerate(req,res)
{
	model.findById({"_id":req.body.t_id},(err,data)=>
	{
		if(err)
		{
			console.log("Error In Class-Generate")
			console.log(data)
			//return res.json({code:500,msg:"Error In Class-Generate",err})

		}
		else if(data.role == 'TEACHER')  
		{
			var user1=new model1(req.body)
			user1.save((err,body)=>
			{
				if(err)
				{
					console.log("Error In Class-Generat",err)
					return res.json({code:500,msg:"Error In Class-Generat",err})
				}
				else
				{
					console.log("Class Generate Sucessfully:-",body)
					return res.json({code:200,msg:"Class Generated  Sucessfully",body})
					//return res.json({body})
				}
			})
		}
		else 
		{
			console.log("Only Teacher Can Generate-class")
			return res.json({code:500,msg:"Only Teacher Can Generate-class",body})
			//return res.json("Only Teacher Can Generate-class")
		}
	})
}
// function buyclass(req,res)
// {
// 	console.log(token)
// 	console.log("in buyclass")
// 	model.findById({"_id":req.body.id},(err,data)=>{

// 		if(err)
// 		{
// 			console.log("error in Buy class")


// 		}
// 		else if(data.role == 'TEACHER')  
// 		{

// 			console.log("Teacher Can`t Buy Class")
// 			return res.json({code:500,msg:"Teacher Can`t Buy Class"})
			

// 		}
// 		{

// 			//console.log("Student Can Buy Class")
// 			console.log("Your Current Balance is",data.Points)
// 			model1.findById({"_id":req.body.id1},(err,data1)=>{
// 				if(data.class.indexOf(data1._id)>=0)
// 				{
// 					console. log("You Had Already Buy This Class") 
// 					return res.json({code:500,msg:"You Had Already Purchased This Class"})
					
// 				}

// 				if(err)
// 				{
// 					console.log("Error in read")
// 				}

// 				else if(data.Points < data1.t_price)
					
// 						//console.log(data.Points)
// 						//console.log(data1.t_price)

// 						{
// 						console.log("Sorry..You Dont Have Enough_Balance")
// 						return res.json({code:500,msg:"Sorry..You Dont Have Enough_Balance"})
// 						}

// 						else if(data.Points >= data1.t_price)
// 						{
// 							console.log("You Have Enough Balance")
						
// 						model.findByIdAndUpdate({_id:req.body.id},{$push:{class:data1._id}},(err,data)=>{
// 							//model.findByIdAndUpdate({_id:req.params.id},{$push:{class:{ $each: [data1._id,data1.t_price,data1.t_name] }}},(err,data)=>{
// 							if(err)
// 							{
// 								console.log("Error into push Class_Name",err);
// 							}
// 							else
// 							{
// 								console.log("Buy class")
// 								res.json({code:200,msg:"You Had Buy class Sucessfully"})
// 								var new_student_points = data.Points-data1.t_price
// 							 // var new_points = new_student_points
// 							 model.findByIdAndUpdate({_id:req.body.id},{$set:{Points: new_student_points}},(err,data)=>{

// 							 	if (err) {console.log("error in updation")}
// 							 		else{console.log("Points updated In Your Account")

//       						//update student points

// 			      					console.log(new_student_points)
// 			      					console.log( data1.t_id)
// 							 	// var new_Teacher_points = data1.t_price+data.Points
//       							 //console.log(new_Teacher_points)


//       							 model.findByIdAndUpdate({"_id":data1.t_id},{$inc:{Points: +data1.t_price}},(err,dat)=>
//       							 {

// 	      							 	if(err)
// 	      							 	{
// 	      							 		console.log("Error into Add Teacher Points",err);
// 	      							 	}
// 	      							 	else
// 	      							 	{
// 	      							 		console.log(dat)
// 	      							 		console.log(data1.t_price)
	      								

// 										}

// 								})

//       							}
//       						})



// 							}

// 						})
// 					}
// 				})
// 		}
// 	})
// }
// function buyclass(req,res)
// {

// 	model.findById({"_id":req.params.id},(err,data)=>{

// 		if(err)
// 			{
// 				console.log("error in Buy class")
				
				
// 			}
// 		else if(data.role == 'TEACHER')  
// 			{

// 					console.log("Teacher Can`t Buy Class",data.role)
// 					res.json("(Role=Teacher) You Can`t Buy Class")

// 			}
// 		else if(data.role == 'STUDENT')  
// 			{

// 					console.log("Student Can Buy Class")
// 					console.log("Your Current Balance is",data.Points)
// 					model1.findById({"_id":req.params.id1},(err,data1)=>{
// 						if(data.class.indexOf(data1._id)>=0)
// 							{
// 								console. log("You Had Already Buy This Class") 
// 								res.json("You Had Already Buy This Class")
// 								return ;
// 							}

// 					if(err)
// 						{
// 							console.log("Error in read")
// 						}
					
// 					else if(data.Points < data1.t_price)
					
// 						//console.log(data.Points)
// 						//console.log(data1.t_price)
					
// 						{
// 						console.log("Sorry..You Dont Have Enough_Balance")
// 						res.json("Sorry..You Dont Have Enough_Balance")
// 						}
					
// 					else if(data.Points >= data1.t_price)
// 					{
// 						console.log("You Have Enough Balance")
// 						res.json("You Have Enough Balance")
// 						/*var pclass=model.class.push(data1.t_price)
// 						console.log(pclass)
// 						console.log("Can Buy Class")
// 						var classname=data1.t_name
// 						console.log(classname)
// 						var new_student_points = data.Points-data1.t_price
// 						//var new_points = data.Points
// 						console.log(new_student_points)*/
// 						// var id1=
// 						model.findByIdAndUpdate({_id:req.params.id},{$push:{class:data1._id}},(err,data)=>{
// 							if(err)
// 							{
//      						   console.log("Error into push Class_Name",err);
//       						}
//       						else
//       						{
//       						  console.log("Buy class")
//       						  res.json("Class Buy Sucessfully")
//       						  var new_student_points = data.Points-data1.t_price
// 							 // var new_points = new_student_points
// 						      model.findByIdAndUpdate({_id:req.params.id},{$set:{Points: new_student_points}},(err,data)=>{

//       						if (err) {console.log("error in updation")}
// 								else{console.log("Points updated In Your Account")

//       						//update student points

// 							 console.log(new_student_points)
// 							 console.log( data1.t_id)
// 							 	// var new_Teacher_points = data1.t_price+data.Points
//       							 //console.log(new_Teacher_points)


// 							 	model.findByIdAndUpdate({"_id":data1.t_id},{$inc:{Points: +data1.t_price}},(err,dat)=>{

// 								if(err)
// 								{
//      						   		console.log("Error into Add Teacher Points",err);
//       							}
//       							else
//       							{
//       								  console.log(dat)
//       								  console.log(data1.t_price)
//       								 // console.log(data.Points)
//       								  //var new_Teacher_points = data1.t_price+data.Points
//       								//console.log(new_Teacher_points)


//       								 /*model.findByIdAndUpdate({_id:req.params.id},{$set:{Points: new_student_points}},(err,data)=>{
//       								  	if (err) {console.log("error in updation")}
// 										else{console.log("Points updated In Teacher Account")}


//       								  })*/


//       							}

// 							 	})
							
//       						}
//       						})
      					
		
						
// 					}
				
// 				})
// 			}
// 				})
// 				}
// 				})
// }

function buyclass(req,res)
{
	console.log("in buyclass")
	model.findById({"_id":req.params.id},(err,data)=>{

		if(err)
		{
			console.log("error in Buy class")


		}
		else if(data.role == 'TEACHER')  
		{

			console.log("Teacher Can`t Buy Class")
			return res.json({code:500,msg:"Teacher Can`t Buy Class"})
			

		}
		{

			//console.log("Student Can Buy Class")
			console.log("Your Current Balance is",data.Points)
			model1.findById({"_id":req.params.id1},(err,data1)=>{
				if(data.class.indexOf(data1._id)>=0)
				{
					console. log("You Had Already Buy This Class") 
					return res.json({code:500,msg:"You Had Already Purchased This Class"})
					
				}

				if(err)
				{
					console.log("Error in read")
				}

				else if(data.Points < data1.t_price)
					
						//console.log(data.Points)
						//console.log(data1.t_price)

						{
						console.log("Sorry..You Dont Have Enough_Balance")
						return res.json({code:500,msg:"Sorry..You Dont Have Enough_Balance"})
						}

						else if(data.Points >= data1.t_price)
						{
							console.log("You Have Enough Balance")
						
						model.findByIdAndUpdate({_id:req.params.id},{$push:{class:data1._id}},(err,data)=>{
							//model.findByIdAndUpdate({_id:req.params.id},{$push:{class:{ $each: [data1._id,data1.t_price,data1.t_name] }}},(err,data)=>{
							if(err)
							{
								console.log("Error into push Class_Name",err);
							}
							else
							{
								console.log("Buy class")
								res.json({code:200,msg:"You Had Buy class Sucessfully"})
								var new_student_points = data.Points-data1.t_price
// 							 // var new_points = new_student_points
							 model.findByIdAndUpdate({_id:req.params.id},{$set:{Points: new_student_points}},(err,data)=>{

							 	if (err) {console.log("error in updation")}
							 		else{console.log("Points updated In Your Account")

//       						//update student points

			      					console.log(new_student_points)
			      					console.log( data1.t_id)
// 							 	// var new_Teacher_points = data1.t_price+data.Points
//       							 //console.log(new_Teacher_points)


      							 model.findByIdAndUpdate({"_id":data1.t_id},{$inc:{Points: +data1.t_price}},(err,dat)=>
      							 {

	      							 	if(err)
	      							 	{
	      							 		console.log("Error into Add Teacher Points",err);
	      							 	}
	      							 	else
	      							 	{
	      							 		console.log(dat)
	      							 		console.log(data1.t_price)
	      								

										}

								})

      							}
      						})



							}

						})
					}
				})
		}
	})
}
/*function buyclass1(req,res)
{

	model.findById({"_id":req.params.id},(err,data)=>{

		if(data.role == 'TEACHER')  
			{
					console.log("Teacher Can`t Buy Class",data.role)
					res.json("(Role=Teacher) You Can`t Buy Class")
				
				
			}
		else if(data.role == 'STUDENT')   
			{
					console.log("Student Can Buy Class")
					console.log("Your Current Balance is",data.Points)
					model1.findById({"_id":req.params.id1},(err,data1)=>{
						if(data.class.indexOf(data1._id)>=0)
							{
								console. log("You Had Already Buy These Class") 
								res.json("You Had Already Buy These Class")
								return ;
							}
						})
			}
		else if(data.Points < data1.t_price)
			{
				console.log("Sorry..You Dont Have Enough_Balance")
			}
					
		else if(data.Points >= data1.t_price)
			{
				console.log("You Have Enough Balance")
			    model.findByIdAndUpdate({_id:req.params.id},{$push:{class:data1._id}},(err,data)=>{
				if(err)
				{
     			console.log("Error into push Class_Name",err);
      			}
      			else
      			{
      			console.log("Buy class")
      			var new_student_points = data.Points-data1.t_price
				model.findByIdAndUpdate({_id:req.params.id},{$set:{Points: new_student_points}},(err,data)=>{

      				if (err)
      				 {
      				 	console.log("error in updation")
      				 }
					else
					{
						console.log("Points updated In Your Account")
						//update student points
						console.log(new_student_points)
						console.log( data1.t_id)
						// var new_Teacher_points = data1.t_price+data.Points
      				    //console.log(new_Teacher_points)
						model.findByIdAndUpdate({"_id":data1.t_id},{$inc:{Points: +data1.t_price}},(err,dat)=>{
						if(err)
								{
     						   		console.log("Error into Add Teacher Points",err);
      							}
      					else
      							{
      								  console.log(dat)
      								  console.log(data1.t_price)
      					        }

							 	})
							
      						}
      						})
      					
		
						
					}
				
				//}
				
}				
}*/
function ViewRegisterationData(req,res)
{
	model.find().populate('class','t_id t_name').exec((err,data)=>{
		if(err)
		{
			console.log("error in read")
		}
		else
		{
			console.log(data)
			return res.json({data:data})
		}
	})
}

function ViewTeacherSchema(req,res)
{

	model1.findById({"_id":req.params.id},(err,data)=>{
		if(err)
		{
			console.log("error in read")
		}
		else
		{
			console.log(data)
			return res.json({data:data})
		}
	})
}
function TeacherSchema(req,res)
{

	model1.find({},'t_id t_name t_price',(err,data)=>{
		if(err)
		{
			console.log("error in read")
		}
		else
		{
			console.log(data)
			return res.json({data:data})
		}
	})
}

function update(req,res)
{
	// var user=new model(req.body)

	model.findOneAndUpdate({"_id":req.params.id},{$set:{fname:req.body.fname}},(err,data)=>
		
	{
		if (err) {console.log("error in updation")}
			else{console.log("updated")}
		})
}

function remove(req,res)
{
	// var user=new model(req.body)
	model.findByIdAndDelete({"_id":req.params.id},(err,data)=>
	{
		if (err) {console.log("error in remove")}
			else{console.log("removed")}
		})
}
function age(req,res)
{
	//db.student.find({$and:[{"sex":"Male"},{"grd_point":{ $gte: 31 }},{"class":"VI"}]}).pretty();
	model.find({$and:[{age: { $gte: 18 }},{age: { $lt: 35 }}]},(err,data)=>
	//model.find({age: { $gte: 25 }},(err,data)=>
	{
		console.log(model)
		if (err)
		{
			console.log("No such a Data")
			return res.json(err)
		}
		else
		{
			console.log("Your result is:-" ,{data:data})
			return res.json({data:data})
		}
	})
}
function status(req,res)
{
	model.find({status:'active'},(err,data)=>
	{
		if (err)
		{
			console.log("No such a Data")
		}
		else
		{
			console.log("Your result is:-" ,{data:data})
			return res.json({data:data})
		}	
	})
}
function Retrive_Specify_Field(req,res)
//Retrive data of specific Field(fname,lname,points) from entire data
//use sign(-)((-fname -lname -points)) for reverse result
{
	//model.find({},'fname lname Points',(err,data)=>
	//model.count('fname lname Points',(err,data)=>
	//model.remove({status:'active'},(err,data)=>
	//model.find().distinct('_id',{'Points':{$eq:0}},(err,data)=>
	//model.find().$where((Points == 25),(err,data)=>

	{

		if(err)
		{
				console.log("err",err)
		}
		else
		{
				return res.json({data:data})
		}
	}
}
function role_teacher(req,res)
{

	model.find({role:'TEACHER'},(err,data)=>
		{
		if (err)
		{
			console.log("No such a Data")
		}
		else
		{
			console.log("Your result is:-" ,{data:data})
			return res.json({data:data})
		}	
	})
}
function role_student(req,res)
{
	model.find({role:'STUDENT'},(err,data)=>
	{
		if(err)
		{
			console.log("No such a Data")

		}
		else
		{
			console.log("Your result is:-",{data:data})
			return res.json({data:data})
		}
	})
}
module.exports ={
	remove,
	register,
	login,
	update,
	ViewRegisterationData,
	ViewTeacherSchema,
	age,
	status,
	role_teacher,
	role_student,
	classgenerate,
	buyclass,
	TeacherSchema,
	Retrive_Specify_Field
	
	
}