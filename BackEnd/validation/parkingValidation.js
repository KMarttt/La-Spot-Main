import connection from "../config/connectDB.js"

export function checkingCarPlate(carPlate) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT vehicle.vehicle_plate AS plate_exist, parking.vehicle_plate as vehicle_parked " +
            "FROM vehicle " +
            "LEFT JOIN parking on vehicle.vehicle_plate = parking.vehicle_plate " +
            "AND parking.vacated_at IS NULL " +
            "WHERE vehicle.vehicle_plate = ? ", [carPlate], (err, data) => {
                if (err){
                    console.log(err);
                    res.json({isValid: false, message: "Database query failed"})
                } else {
                    // if the plate does not exist or if the vehicle is already parked, return false
                    // if the plate exist and is not currently parked, return true
                    if (data.length <= 0){
                        console.log("plate does not exist")
                        resolve({isValid: false, message: "Plate does not exist"})
                        
                    } else if (data[0].vehicle_parked != null){
                        console.log("vehicle is already parked")
                        resolve({isValid: false, message: "Vehicle is already parked"})
                        
                    } else {
                            resolve({isValid: true, message: "The vehicle is ready for the slot allocation"})
                    }      
                }
            })
    })
}