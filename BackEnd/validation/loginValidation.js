import connection from "../config/connectDB.js";

export function checkExistingEmail(email, account_type) {
    return new Promise ((resolve, reject) => {
        let account_table = account_type === "User" ? "user_information" : "admin_information"
        
        const querySQL = `SELECT email
        FROM ${account_table}
        WHERE email = ?`
        
        connection.query(querySQL, [email], (error, result) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            
            if (Object.keys(result).length === 0) {
                resolve({exist: true})
            } else {
                resolve({exist: false});
            }
        })
    })
}