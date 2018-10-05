var mongoose=require('mongoose')
var voucher_codes = require('voucher-code-generator');
var schema=mongoose.Schema({
	fname:{type:String},
	lname:{type:String},
	password:{type:String},
	
	phnumber:{type:Number,},

	email:{type:String,unique:true},
	age:{type:Number,},
	refercode:{type:String,unique: true },
	role:{type:String,enum:['TEACHER','STUDENT']},
	Points:{type:Number,default:function()
		{
			if(this.role=='STUDENT') 
			{
				return 25;
			}

			else if(this.role=='TEACHER')
			{
				return 0;
			}
		}
	},


	gender:{type:String,enum:['male','female'],default:'male'},
	status:{type:String,enum:['active','inactive'],default:'active'},
	class:[{type:mongoose.Schema.Types.ObjectId,ref:"teacher"}],
	//class:[mongoose.Schema.Types.ObjectId]
});
module.exports=mongoose.model('users',schema);



