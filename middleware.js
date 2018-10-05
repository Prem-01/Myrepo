var jwt = require('jsonwebtoken');
var secret  ='this_is-a-secret'
async function verifyToken(req,res,next){
	//
	if(!req.headers.authorization){
		return res.json({message:"Please provide Tokken "})
	}else{
		let status = await jwt.verify(req.headers.authorization,secret);
		console.log(status)
		if(status){
			console.log('authorized user');
			next();
		}else{
			 return res.json({message:"Tokken invalid"})
		}
	}

}



module.exports = {
	verifyToken
}
