import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    
    const token = authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {;
            if (err) {
                console.log(err)
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({message: "Forbidden -- expired token "}); //Forbidden (Expired token)
                } else {
                    return res.status(401).json({message: "Unauthorized -- invalid token"}) //Unauthorized (Invalid Token)
                }
            }
            
            req.user = decoded.UserInfo.ID; 
            req.accountType = decoded.UserInfo.accountType
            next();
        }
    )
}