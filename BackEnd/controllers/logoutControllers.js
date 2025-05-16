import connection from "../config/connectDB.js";
// import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();


export const handleLogout = (req, res) => {
    // On Client, also delete the access token

    const cookies = req.cookies

    // username, account_type, refresh_token
    const sqlQuerySearchUser =  `SELECT admin_information.admin_code AS username, "Admin" AS account_type, admin_information.refresh_token
    FROM admin_information
    WHERE refresh_token = ?

    UNION ALL

    SELECT user_information.email as username, user_information.account_type, user_information.refresh_token
    FROM user_information
    WHERE refresh_token = ?`

    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Find the refresh token in the DB
    connection.query(sqlQuerySearchUser, [refreshToken, refreshToken], (err, userData) => {
        if (err) {
            return res.status(500).json({ message: "Database query error" });
        } 

        if (Object.keys(userData).length === 0) {
            res.clearCookie('jwt', {httpOnly: true, secure: true,})
            return res.sendStatus(204); //Successfull but no content
        } 

        let sqlQueryDeleteRefreshKey;

        if (userData[0].account_type === "Student" || userData[0].account_type === "Worker") {
            sqlQueryDeleteRefreshKey = `UPDATE user_information
            SET refresh_token = null
            WHERE user_id = ?`
        } else if (userData[0].account_type === "Admin") {
            sqlQueryDeleteRefreshKey = `UPDATE admin_information
            SET refresh_token = null
            WHERE admin_id = ?`
        }

        // Delete the refresh token in the database
        connection.query(sqlQueryDeleteRefreshKey, [userData[0].ID], (err, data) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            }
            
            console.log("Log out: deleting refresh key")
            res.clearCookie('jwt', {httpOnly: true, secure: true,}) 
            res.sendStatus(204);
        }) 
    })  
}