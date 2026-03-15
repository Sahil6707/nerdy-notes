const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{

const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(" ")[1];

if(!token){
return res.status(401).json({
message:"Access denied"
});
}

try{

const verified = jwt.verify(token,"nerdysecretkey");

req.user = verified;

next();

}catch(error){

res.status(401).json({
message:"Invalid token"
});

}

};

module.exports = authMiddleware;