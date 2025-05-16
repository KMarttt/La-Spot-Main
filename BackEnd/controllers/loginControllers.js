import connection from "../config/connectDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import * as loginValidation from "../validation/loginValidation.js";

dotenv.config();

// Setup Nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ojjivillamar4@gmail.com',
        pass: 'hzex bgcv ebku iqxd',
}
});

transporter.verify((err) => {
    if (err) console.error("SMTP config error:", err);
    else console.log("Server ready to send email");
});

// Login and Authentication 
export const handleLogin = async (req, res) => {
    const { email: username, password } = req.body;

    let sqlQuerySearchUser;
    if (username.includes("@")){
        sqlQuerySearchUser =  `SELECT user_id as ID, account_password, account_type
        FROM user_information
        WHERE email = ?`
    } else {
        sqlQuerySearchUser =  `SELECT admin_id as ID, account_password, 'Admin' as account_type
        FROM admin_information
        WHERE admin_code = ?;`
    }

    let sqlQuerySetRefreshKey;
    if (username.includes("@")) {
        sqlQuerySetRefreshKey = `UPDATE user_information
        SET refresh_token = ?
        WHERE email = ?`
    } else {
        sqlQuerySetRefreshKey = `UPDATE admin_information
        SET refresh_token = ?
        WHERE admin_code = ?`
    }

    connection.query(sqlQuerySearchUser, [username], (err, userData) => {
        if (err) {
            return res.status(500).json({ "message": "Database query error" });
        }
        
        if (Object.keys(userData).length === 0) {
            return res.status(400).json({ "message": "Invalid email" });
        } 

        bcrypt.compare(password, userData[0].account_password)
            .then (match => {
                if (!match) {
                    return res.status(400).json({ "message": "Incorrect password" });
                } 

                // Creating JWT TOKENS
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
                const refreshToken = jwt.sign(
                    
                    { "ID": userData[0].ID },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1D' }
                );

                // Saving refresh token 
                connection.query(sqlQuerySetRefreshKey, [refreshToken, username], (err, data) => {
                    if (err) {
                        console.log('Error in updating refresh token')
                    }
                    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); 
                    // set to one day
                    // not available to js
                    res.json({ accessToken, ID: userData[0].ID, accountType: userData[0].account_type })
                })
            }).catch (error => {
                console.log(error.message);
                return res.status(500).json({"message": "Error during password comparison"})
            })
    })  
}


const getAdminEmail = (adminCode) => {
    return new Promise((resolve, reject) => {
        const sqlGetAdminEmail = `SELECT email FROM admin_information WHERE admin_code = ?`
        connection.query(sqlGetAdminEmail, [adminCode], (err, data) => {
            if (err) return reject(err);
            if (Object.keys(data).length === 0) return resolve (null);
            resolve(data[0].email);
        })
    })
}


export const forgotPassword = async(req, res) => {
    let { email, accountType } = req.body;

    try {

        if (accountType === "Admin") {
            email = await getAdminEmail(email); // Will get the real email of the admin
            if (email === null) {
                return res.status(404).json({ message: "Email not found" });
            }
        } else {
            const resultEmailErrorChecking = await loginValidation.checkExistingEmail(email, accountType);
            if (resultEmailErrorChecking.exist == true) {
                console.log(resultEmailErrorChecking);
                return res.status(404).json({ message: "Email not found" });
            }
        }

        const otpCode = Math.floor(10000 + Math.random() * 90000).toString();
        const password_reset_table = accountType === "User" ? "user_password_reset" : "admin_password_reset";

        const sql = `
            INSERT INTO ${password_reset_table} (email, otp_code, expires_at)
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
            ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
        `;

        connection.query(sql, [email, otpCode], (err) => {
            if (err) {
                console.error("Error saving OTP:", err);
                return res.status(500).json({ message: "Server error.", err });
            }

            let mailText = `
            Hello ${accountType}!

            You requested to reset your password. Your one-time password (OTP) code is: ${otpCode}. 
            
            This code will expire in 10 minutes.If you did not request a password reset, please ignore this message.
            
            Thank you,
            La Spot Support Team`

            transporter.sendMail({
                from: 'ojjivillamar4@gmail.com',
                to: email,
                subject: "Your Password Reset Code",
                text: mailText,
            }, (err) => {
                if (err) {
                    console.error("Email send error:", err);
                    return res.status(500).json({ message: "Failed to send email", err });
                }
                return res.status(200).json({ message: "Reset code sent to email.", email });
            });
        }); 
    } catch(error) {
        console.log(error);
    }
}


export const verifyCode = async(req, res) => {
    const { email, code, accountType } = req.body;

    const password_reset_table = accountType === "User" ? "user_password_reset" : "admin_password_reset";

    const sql = `SELECT * FROM ${password_reset_table} WHERE email = ? AND otp_code = ? AND expires_at > NOW()`;
        connection.query(sql, [email, code], (err, rows) => {
        if (err) {
            console.error('Error verifying code:', err);
            return res.status(500).json({ message: 'Server error during verification', err });
        }

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        return res.status(200).json({ message: 'Code verified' });
    });
};

export const resetPassword = (req, res) => {
    const { otp, newPassword, accountType } = req.body;

    const password_reset_table = accountType === "User" ? "user_password_reset" : "admin_password_reset";
    const account_information_table = accountType === "User" ? "user_information" : "admin_information"

    const fetchSQL = `SELECT * FROM ${password_reset_table} WHERE otp_code = ? AND expires_at > NOW()`;
    connection.query(fetchSQL, [otp], async (err, rows) => {
        if (err) return res.status(500).json({ message: "Fetch failed", err });

        if (rows.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

        const email = rows[0].email;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateSQL = `UPDATE ${account_information_table} SET account_password = ? WHERE email = ?`;
        connection.query(updateSQL, [hashedPassword, email], (err) => {
            if (err) return res.status(500).json({ message: "Database password update failed."});

            connection.query(`DELETE FROM ${password_reset_table} WHERE otp_code = ?`, [otp], (err) => {
                if (err) return res.status(500).json({ message: "Cleanup failed", err });

                return res.status(200).json({ success: true, message: 'Password reset successfully.' });
            });
        });
    });
};
