var mongoose=require('mongoose')
var schema1=mongoose.Schema({
	t_id:{type:String},
	t_name:{type:String},
	t_price:{type:Number}
});
module.exports=mongoose.model('teacher',schema1);