import "../css/UserParkingView.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ParkingZoneButton } from "./ParkingZoneButton"
import { useGetFetch } from "../customHooks/useGetFetch";
// import areaImage from "../assets/g1__magdalo.png";
import reminderImage from "../assets/reminder-picture.png";
import { useAuth } from "../customHooks/AuthContext";

export function UserParkingView() {

    const {data: zones, isPending: gettingZones, error: errorZones, triggerGet: getZones} = useGetFetch();
    const {data: assignedLot, isPending: searching, error : searchError, triggerGet: getAssignedLot} = useGetFetch();
    const { auth, setAuth } = useAuth();
    
    useEffect(() => {
        getZones("http://localhost:8080/parkingZones")
    }, [])

    useEffect(() => {
      getAssignedLot(`http://localhost:8080/assignedLot/${auth.ID}`)
    }, [])

  if (gettingZones || searching ) return <p>Loading...</p>
    console.log("this is the assgined lot", )

  return (
    <>
      {/* Title and Description */}
      <section className="UserParkingView__section1">
        <div className="ParkingView__container">
          <div className="ParkingView__header">
            <h2 className="ParkingView__Title">Parking Spots</h2>
            {
              assignedLot?.length > 0 && assignedLot?.[0].parking_lot 
              ? <p className="ParkingView__description">Your parking spot is located at <span style={{ fontWeight: '800', color: 'rgb(7, 57, 60)' }}>{assignedLot[0].parking_lot}</span></p>
              : <p className="ParkingView__description">Check and pick a spot!</p>
            }
            
          </div>
        </div>
      </section>
      {/* Cards View Parking */}
      <section className="UserParkingView__section2">
        <div className="ParkingView__container">
          <div className="ParkingView__content">

            {zones.map((zone, index) => {
              return (
                  <Link key={zone.zone} to={`/UserParking/${zone.zone}`}>
                      <ParkingZoneButton zone={zone.zone} vacantNum = {zone.vacantNum} occupiedNum = {zone.occupiedNum} key = {index}/>
                  </Link>
              )
              })}



          </div>
        </div>
      </section>
      {/* Reminder */}
      <section className="UserParkingView__section3">
        <div className="ParkingView__container">
          <div className="ParkingView__reminder">
            <div className="ParkingView__reminder-content">
              <h1 className="reminder-title">Reminder</h1>
              <img
                className="reminder-image"
                src={reminderImage}
                alt="Reminder"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
