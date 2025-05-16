// import "../css/test.css"


export function ParkingZoneButton({zone, vacantNum, occupiedNum}) {
    return( 
        <>
            <button className ="parking-area" >
                <img src={`/images/parkingzone${zone}.png`} alt={`parkingzone${zone}`}></img>
                <h3 className="area-name"> {zone} </h3>
                <div className="slot-summary">
                    <div>
                        <span className="availability-title"> Available Spots: </span>
                        <span className="available-counter">{vacantNum}</span>
                    </div>
                    <div>
                        <span className="occupied-title">Occupied Spots:</span>
                        <span className="occupied-counter">{occupiedNum}</span>
                    </div>
                </div>
            </button>
        </>
    )
}