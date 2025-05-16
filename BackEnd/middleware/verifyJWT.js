import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    // console.log(authHeader); //Beared token
    
    const token = authHeader.split(" ")[1]
    console.log("Token received:", token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {;
            if (err) {
                console.log(err)
                if (err.name === "TokenExpiredError") {
                    console.log("sending 403 error")
                    // return res.status(403).json({ status: 403 });
                    return res.status(403).json({message: "Forbidden -- expired token "}); //Forbidden (Expired token)
                } else {
                    return res.status(401).json({message: "Unauthorized -- invalid token"}) //Unauthorized (Invalid Token)
                }
            }
            
            
            console.log("Decoded JWT:", decoded);
            req.user = decoded.UserInfo.ID; 
            req.accountType = decoded.UserInfo.accountType
            next();
        }
    )
}