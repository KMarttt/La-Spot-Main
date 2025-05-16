import "../css/AdminParking.css";
import { useGetFetch } from "../customHooks/useGetFetch.js";
import { TableBodyParkingAdmin } from "./TableBodyParkingAdmin.jsx";
import { useState, useEffect } from "react";

export function AdminParking() {
  const [selectedZone, setSelectedZone] = useState("ICTC");
  const [show, setShow] = useState("showAll");
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: lots, isPending, error, triggerGet } = useGetFetch();

  // Will GET the parking data
  useEffect(() => {
    triggerGet(`http://localhost:8080/parkingOverviewAdmin/${selectedZone}`);
  }, [selectedZone, refreshKey]);

  // Use these variables for the Parking Status
  const numAvailable = lots.filter(
    (lot) => lot.parking_status === "vacant"
  ).length;
  const numOccupied = lots.filter(
    (lot) => lot.parking_status === "occupied"
  ).length;

  // Will re-render the component
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      {/* TOP CONTENT */}
      <section className="parkingOverview section" id="parkingOverview">
        <div className="parkingOverview__container">
          <div className="parkingOverview__content">
            <h1 className="parkingOverview__title">Parking Overview</h1>
            <p className="description">
              View the real-time summary of of all parking spots accross
              different locations in DLSU-D.
            </p>
          </div>
        </div>
      </section>
      {/* TABLES */}
      <section className="parkingLayout">
        <div className="parkingLayout__container">
          <div className="locationTable__container">
            <div className="locationTable__content">
              <h1 className="locationTable__title">Parking Spots</h1>
              <p className="locationTable__divider">Gate 1</p>
              {/* BUTTONS */}
              <button
                className={`locationButton ${
                  selectedZone === "ICTC" ? "active" : ""
                }`}
                onClick={() => setSelectedZone("ICTC")}
              >
                ICTC Building
              </button>
              <button
                className={`locationButton ${
                  selectedZone === "Magdalo" ? "active" : ""
                }`}
                onClick={() => setSelectedZone("Magdalo")}
              >
                Magdalo
              </button>
              <button
                className={`locationButton ${
                  selectedZone === "ADG" ? "active" : ""
                }`}
                onClick={() => setSelectedZone("ADG")}
              >
                Ayuntamiento
              </button>
            </div>
          </div>
          
          <div className="parkingTable__container">
            <div className="parkingTable__content">
              <h1 className="parkingTable__title">{selectedZone} Parking</h1>
              <div className="adminParking__controls">
                {/* Filter Buttons */}
                <div className="adminParking__filterButtons">
                  <button
                    type="button"
                    onClick={() => setShow("showAll")}
                    className={`adminBtn1 ${
                      show === "showAll" ? "active" : ""
                    }`}
                  >
                    Show All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShow("student")}
                    className={`adminBtn2 ${
                      show === "student" ? "active" : ""
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setShow("worker")}
                    className={`adminBtn3 ${show === "worker" ? "active" : ""}`}
                  >
                    Worker
                  </button>
                </div>
                {/* Capacity */}
                <div className="adminParking__capacity">
                  <div className="spot-row">
                    <p className="spot-label">Available Spots:</p>
                    <span className="spot-number available">
                      {numAvailable}
                    </span>
                  </div>
                  <div className="spot-row">
                    <p className="spot-label">Occupied Spots:</p>
                    <span className="spot-number occupied">{numOccupied}</span>
                  </div>
                </div>
              </div>

              <table className="__table__">
                <thead>
                  <tr>
                    <th>Spot</th>
                    <th>Car Plate</th>
                    <th>ID Number</th>
                    <th>Account Type</th>
                    <th>Vehicle Type</th>
                    <th>Time In</th>
                    <th>Time Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {isPending && (
                    <tr>
                      <td>Loading...</td>
                    </tr>
                  )}
                  {error && (
                    <tr>
                      <td>{error.message}</td>
                    </tr>
                  )}
                  {lots &&
                    lots.map((lot, index) => {
                      return (
                        <TableBodyParkingAdmin
                          {...lot}
                          key={index}
                          visible={show}
                          onRefresh={handleRefresh}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
