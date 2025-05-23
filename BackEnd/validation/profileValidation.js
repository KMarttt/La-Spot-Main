import connection from "../config/connectDB.js";

export function checkExistingEmail(email, ID, user) {
    return new Promise((resolve, reject) => {
        console.log("checking email existence in the database");

        let sqlQuerySearchUser = user === "User" 
        ? "SELECT email, user_id as account_id FROM user_information WHERE email = ?"
        : "SELECT email, admin_id as account_id FROM admin_information WHERE email = ?"
        
        connection.query(sqlQuerySearchUser, [email], (error, data) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                let emailError = {}
                
                if (data[0]?.account_id == ID) {
                    resolve(emailError.exist = false);  
                } else {
                    if (Object.keys(data).length !== 0) {
                    resolve(emailError.exist = true);
                } else {
                    resolve(emailError.exist = false);
                }
                }

                
            }
        })
    })
}