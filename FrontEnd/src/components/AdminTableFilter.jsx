import { useState } from "react";
import "../css/AdminTableFilter.css";

export function AdminTableFilter({ columnFilters, setColumnFilters }) {
  const [vehicleType, setVehicleType] = useState("");

  const user_id =
    (columnFilters ?? []).find((filter) => filter.id == "user_id")?.value || "";
  
    const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev
        .filter((f) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  const handleSelectVehicleType = (type) => {
    setVehicleType(type);

    setColumnFilters((prev) => {
      // Check if there are any active filters for the vehicle type
      const hasFilter = prev.find(
        (filter) => filter.id === "vehicle_type"
      )?.value;
      // If there is a filter for vehicle type, update it
      if (hasFilter) {
        return prev.map((filter) => {
          if (filter.id === "vehicle_type") {
            return { ...filter, value: type };
          } else {
            return filter;
          }
        });
      } else {
        // If there is no filter for vehicle type, then create one
        if (!hasFilter) {
          return prev.concat({
            id: "vehicle_type",
            value: [type],
          });
        }
      }
    });
  };

  const clearVehicleFilter = () => {
    setVehicleType("");
    setColumnFilters((prev) => {
      // Check if there are any active filters for the vehicle type
      const hasFilter = prev.find(
        (filter) => filter.id === "vehicle_type"
      )?.value;
      // If there is a filter for vehicle type, update it
      if (hasFilter) {
        return prev.map((filter) => {
          if (filter.id === "vehicle_type") {
            return { ...filter, value: [] };
          } else {
            return filter;
          }
        });
      }
      return prev;
    });
  };

  return (
    <>
      <div className="filter__controls">
        <div>
          <input
            type="text"
            value={user_id}
            onChange={(e) => onFilterChange("user_id", e.target.value)}
            className="filter-input"
            placeholder="Search by User ID"
          />
        </div>

        <div className="filter">
          <button
            className={`filter-btn1 ${vehicleType === "" ? "active" : ""}`}
            onClick={clearVehicleFilter}
          >
            Show All
          </button>
          <button
            className={`filter-btn2 ${
              vehicleType === "Motorcycle" ? "active" : ""
            }`}
            onClick={() => handleSelectVehicleType("Motorcycle")}
          >
            Motorcycle
          </button>
          <button
            className={`filter-btn3 ${vehicleType === "Car" ? "active" : ""}`}
            onClick={() => handleSelectVehicleType("Car")}
          >
            Car
          </button>
        </div>
      </div>
    </>
  );
}
