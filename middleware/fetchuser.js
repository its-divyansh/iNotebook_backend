var jwt = require ("jsonwebtoken");

const JWT_SECRET= "harry is a good boy";

const fetchuser=(req,res, next)=>{
    // console.log(req);
    const token =req.header('auth-token');
    if(!token){
        res.status(401).send({error : " Please authenticate yourself using a valid token "});}

    try {
        const data=jwt.verify(token, JWT_SECRET);
        //Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
        
        req.user= data.user;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).send({error : " Please authenticate yourself using a valid token "});
    }

}

module.exports=fetchuser;