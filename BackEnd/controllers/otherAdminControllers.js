import connection from "../config/connectDB.js";

export const accountRecord = (req, res) => {
    const queryAccountRecord = "SELECT user_information.user_id, CONCAT(first_name, ' ', last_name) AS name, user_information.account_type, user_information.email, vehicle.vehicle_plate, vehicle.vehicle_type " +
    "FROM user_information " +
    "LEFT JOIN vehicle " +
    "ON user_information.user_id = vehicle.user_id " +
    "ORDER BY user_information.user_id ASC;"
    
    connection.query( queryAccountRecord, [], (err, data) => {
        if (err) {
            console.log("An error has occured")
            return res.status(500).json({isValid: false, message: "Database query failed"})
        } else {
            console.log(data)
            res.json(data)
        }
    })
}

export const adminParkingHistory = (req, res) => {
    const queryAccountHistory = `SELECT parking.user_id, user_information.account_type, CONCAT(zone, " ", lot_id) AS parking_lot, vehicle.vehicle_type, vehicle.vehicle_plate, parking.occupied_at, parking.vacated_at, parking.duration 
    FROM parking 
    LEFT JOIN user_information ON user_information.user_id = parking.user_id 
    LEFT JOIN vehicle ON vehicle.user_id = user_information.user_id
    ORDER BY parking_id DESC`

    connection.query(queryAccountHistory, [], (err, data) => {
        if (err){
            console.log("An error has occured")
            return res.status(500).json({isValid: false, message: "Database query failed"})
        } else {
            console.log(data)
            res.json(data)
        }
    })
}