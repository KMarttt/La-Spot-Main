import connection from "../config/connectDB.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();


export const handleRefreshToken = (req, res) => {
    const cookies = req.cookies

    const sqlQuerySearchUser = `SELECT admin_information.admin_id AS ID, "Admin" AS account_type, admin_information.refresh_token
    FROM admin_information
    WHERE refresh_token = ?
    UNION 
    SELECT user_information.user_id as ID, user_information.account_type, user_information.refresh_token
    FROM user_information
    WHERE refresh_token = ?`

    if (!cookies?.jwt) return res.send(401).json({message: "Unauthorized"}); // Unauthorized
    const refreshToken = cookies.jwt;



    connection.query(sqlQuerySearchUser, [refreshToken, refreshToken], (err, userData) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database query error", err: err });
        } 

        console.log("refresh token stuff:", userData);
        if (Object.keys(userData).length === 0) {
            return res.status(403).json({message: "Forbidden -- Invalid refresh token"}); //Forbidden
        }

        

        // Evaluate JWT
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                console.log(userData[0].refresh_token);
                console.log(userData[0].ID);
                console.log(decoded.ID);
                console.log("err from refresh page", err)
                if (err || userData[0].ID != decoded.ID) {
                    console.log("err: ", err);
                    console.log("table-id: ", userData[0].ID);
                    console.log("cookie-id: ", decoded.ID);
                    return res.status(403).json({message: "Forbidden -- Refresh token verification failed"});
                } 

                const accessToken = jwt.sign(
                    { 
                        "UserInfo": {
                            "ID": userData[0].ID,
                            "accountType": userData[0].account_type
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' } 
                );
                res.json({ accessToken, ID: userData[0].ID, accountType: userData[0].account_type })
            }
            
        )

        
    })  
}