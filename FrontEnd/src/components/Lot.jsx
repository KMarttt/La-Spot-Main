import "../css/UserParking.css";

export function Lot({lotID, status, vehiclePlate, vehicleType, statusFilter, vehicleFilter}) {
    
    if (statusFilter !== "all"){
        if (statusFilter === "vacant" && status !== "vacant") {
            return null
        } 
        if (statusFilter === "occupied" && status !== "occupied") {
            return null
        }
    }

    if (vehicleFilter !== "all"){
        if (vehicleFilter === "Car" && vehicleType !== "Car"){
            return null
        }
        if (vehicleFilter === "Motorcycle" && vehicleType !== "Motorcycle"){
            return null
        }
    }

    return(
        <>
            <div
                className="slot"
            >
                <p className="slot-label">A{lotID}</p>
                <div
                    className="indicator"
                    style={{ backgroundColor: status == "occupied" ? "red" : "green" }}
                ></div>
            </div>
        </>
    )
}