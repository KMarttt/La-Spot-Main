// Import necessary modules and assets
import React, { useState, useEffect, useRef } from "react";
import penIcon from "../assets/pen.png";
import "../css/UserProfile.css";
import { LogoutButton } from "./Logoutbutton";
import { useAuth } from "../customHooks/AuthContext";
import { useGetFetch } from "../customHooks/useGetFetch";
import { usePutFetch } from "../customHooks/usePutFetch"
import { UserProfileHistoryTable } from "./UserProfileHistoryTable";

// Main functional component
export function UserProfile() {
  const { data: profileData, isPending, error, triggerGet } = useGetFetch();
  const { data: updatedProfileData, isPending: updatingProfile, error: updateError, triggerPut} = usePutFetch();
  const inputRefs = useRef({})


  const {auth, setAuth, loading} = useAuth();
  console.log("Auth object:", auth);

  // State to track which tab is currently active (profile or history)
  const [activeTab, setActiveTab] = useState("profile");

  // State to track which section is being edited
  const [editingField, setEditingField] = useState(null);

  // Temporary profile data used while editing
  const [tempProfile, setTempProfile] = useState({});

  const [errors, setErrors] = useState({});
  const [putProfileData, setPutProfileData] = useState({})
  const [refreshKey, setRefreshKey] = useState(0);


  console.log("please work initial mount")
  // console.log("profile id", auth?.ID)
  useEffect(() => {
    console.log("is it loading: ", loading)
    console.log(auth.ID);
    // if (loading) return; 
    // if (!loading && auth.ID) {
      triggerGet(`http://localhost:8080/profile/${auth.ID}`)
    // }
  }, [refreshKey, auth.ID, loading])


  useEffect(() => {
    if (profileData && profileData.length !== 0) {
      setTempProfile(profileData[0]);
    }
  }, [profileData])


  // Function to start editing a specific section
  const handleEditClick = (section) => {
    // setTempProfile(profileData[0]);

    // Ensures that the input fields for security are cleared and preped for user inputs 
    if (section === "security") {
      setTempProfile({...profileData[0], currentPassword: "", newPassword: "", confirmPassword: "", })
    } else {
      setTempProfile(profileData[0]); // copy current profile to temp state
    }

    setEditingField(section); // set which field is being edited
  };

  // Function to validate input and initialize put data
  const handleSave = () => {
    const namePattern = /^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$/;
    const schoolEmailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@dlsud\.edu\.ph$/;
    const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let newErrors = {}

    // Validating personal information
    if (editingField === "personal"){
      if (namePattern.test(tempProfile.first_name) === false){
          newErrors["first_name"] = true;
          inputRefs.current["first_name"].placeholder = "Invalid first name format";
          // inputRefs.current["first_name"].classList.add("invalid-input");
          tempProfile["first_name"] = "";
      }
      if (namePattern.test(tempProfile.last_name) === false){
        newErrors["last_name"] = true;
        inputRefs.current["last_name"].placeholder = "Invalid last name format"
        tempProfile["last_name"] = "";
      }
      if (auth.accountType === "Student") {
        if (schoolEmailPattern.test(tempProfile.email) === false){
          newErrors["email"] = true;
          inputRefs.current["email"].placeholder = "Invalid school email format"
          tempProfile["email"] = "";
        }
      } else if (auth.accountType === "Worker") {
        if (emailPattern.test(tempProfile.email) === false) {
          newErrors["email"] = true;
          inputRefs.current["email"].placeholder = "Invalid email format"
          tempProfile["email"] = "";
        }
      } 
    } else if (editingField === "security"){
      const passwordPattern = /^.{8,}$/;
      // Checking if the New and confirm password matches    
      if (tempProfile.newPassword !== tempProfile.confirmPassword) {
        newErrors["confirmPassword"] = true;
        inputRefs.current["confirmPassword"].placeholder = "Password does not match"
        tempProfile["confirmPassword"] = "";
      } else if (passwordPattern.test(tempProfile.newPassword) === false){
        newErrors["newPassword"] = true;
        inputRefs.current["newPassword"].placeholder = "Password must be at least 8 characters long"
        tempProfile["newPassword"] = "";
      } 
    };

    // If there's an error, display it
    if (Object.keys(newErrors).length !== 0 ) {
      setErrors(newErrors)
      console.log("Error state", newErrors)
    } else {
      // if no errors, update the profile data
      
      // PUT data initialization
      if (editingField === "personal"){
        setPutProfileData({
          "first_name": tempProfile.first_name,
          "last_name": tempProfile.last_name,
          "email": tempProfile.email.toUpperCase(),
          "ID": auth.ID,
        })
      } else if (editingField === "security") {
        console.log("Security:", tempProfile.currentPassword)
        setPutProfileData({
          "currentPassword": tempProfile.currentPassword,
          "password": tempProfile.newPassword,
          "ID": auth.ID,
        })
      }
    }
  };

  useEffect(() => {
    
    if (Object.keys(putProfileData).length !== 0) {
      console.log("please work put, please")
      console.log("editing field to be sent:", editingField);
      console.log("put data to be sent:", putProfileData);
      if (editingField === "personal") {
        triggerPut(`http://localhost:8080/profile-personal-update`, putProfileData)
      } else if (editingField === "security") {
        triggerPut(`http://localhost:8080/profile-security-update`, putProfileData)
      }
      
    }
  }, [putProfileData])

  useEffect(() => {
    // console.log("update profile data:" + updatedProfileData);
    // console.log("update error: " +updateError[0].message)

    if (updateError){
      console.error("Profile update error:", updateError);
      console.log("inputRefs.current:", inputRefs.current);
      console.log("editingField:", editingField);
      let newErrors = {};

      if (updateError.errorField === "email"){
        console.log("the email already exist okay, so stop!", updateError.message)
        newErrors["email"] = true;
        console.log(tempProfile["email"]);
        inputRefs.current["email"].placeholder = updateError.message
        tempProfile["email"] = "";
      }

      // 
      if (updateError.errorField==="currentPassword"){
        newErrors["currentPassword"] = true;
        inputRefs.current["currentPassword"].placeholder = updateError.message
        tempProfile["currentPassword"] = "";
      }

      // If there's an error: do some css stuff to show the error
      if (Object.keys(newErrors).length !== 0 ) {
        setErrors(newErrors)
        console.log("Error state", newErrors)
      }

    } else if (updatedProfileData && updatedProfileData.isValid === true) {
      console.log("profile updated successfully");
      setRefreshKey(prevKey => prevKey + 1);
      setEditingField(null); // close modal
    }

  }, [updatedProfileData, updateError])

  const handleCancel = () => {
    setEditingField(null);
    setErrors({});
  }

  // Update temporary profile while editing
  const handleChange = (field, value) => {
    // setTempProfile({ ...tempProfile, [field]: value });
    setTempProfile(prevTempProfile => ({ // Use the functional update form
    ...prevTempProfile,
    [field]: value,
  }));
  };


  if (!profileData || profileData.length === 0) {
    return <p> "Fetching data"</p>
  }

  return (
    <section className="userProfile__layout">
      <div className="profile-container">
        <h2 className="userAccount__title">Account Settings</h2>

        <div className="profile-wrapper">
          {/* Sidebar for switching tabs */}
          <div className="sidebar">
            <button
              onClick={() => setActiveTab("profile")}
              className={
                activeTab === "profile"
                  ? "sidebar-button active"
                  : "sidebar-button"
              }
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={
                activeTab === "history"
                  ? "sidebar-button active"
                  : "sidebar-button"
              }
            >
              History
            </button>
          </div>

          {/* Main content */}
          <div className="content-section">
            {activeTab === "profile" ? (
              <div className="profile-sections-box">
                {/* Display profile info */}
                <h2 className="My-profile-title">My Profile {auth.accountType}{auth.ID}</h2>
                <div className="profile-header">
                  <div className="profile-image-container">
                    <img src={"./images/userProfile.jpg"} alt="Profile" />
                  </div>
                  <div className="profile-info-container">
                    <h2 className="accountFullname">
                      {profileData[0].first_name} {profileData[0].last_name}
                    </h2>
                      <p className="accountDisplaytype">{profileData[0].account_type}</p>
                      <p className="accountDisplayemail">{profileData[0].email}</p>
                      
                  </div>
                </div>

                {/* Personal Information section */}
                <div className="personal-infoBox">
                  <h3 className="section-title">Personal Information </h3>
                  <div className="info-content">
                    <p>
                      <strong>First Name:</strong> {profileData[0].first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {profileData[0].last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profileData[0].email}
                    </p>
                    <p>
                      <strong>Student Number:</strong> {profileData[0].user_id}
                    </p>
                  </div>
                  <div className="edit-button-container">
                    <button
                      onClick={() => handleEditClick("personal")}
                      className="edit-button"
                    >
                      Edit <img src={penIcon} alt="Edit" className="pen-icon" />
                    </button>
                  </div>
                </div>

                {/* Account Security section */}
                <div className="account-securityBox">
                  <h3 className="content-title">Account Security</h3>
                  <div className="security-content">
                    <p>
                      <strong>Password:</strong> **********
                    </p>
                  </div>
                  <div className="edit-button-container">
                    <button
                      onClick={() => handleEditClick("security")}
                      className="edit-button"
                    >
                      Edit <img src={penIcon} alt="Edit" className="pen-icon" />
                    </button>
                  </div>
                </div>

                {/* Vehicle Info section */}
                <div className="vehicle-infoBox">
                  <h3 className="content-title">Vehicle Information</h3>
                  <div className="vehicle-content">
                    <p>
                      <strong>Type of Vehicle:</strong> {profileData[0].vehicle_type}
                    </p>
                    <p>
                      <strong>Plate Number:</strong> {profileData[0].vehicle_plate}
                    </p>
                  </div>
                  {/* <div className="edit-button-container">
                    <button
                      onClick={() => handleEditClick("vehicle")}
                      className="edit-button"
                    >
                      Edit <img src={penIcon} alt="Edit" className="pen-icon" />
                    </button>
                  </div> */}
                </div>
                {/* Logout Button */}
                <LogoutButton />
              </div>
            ) : (
              // History tab content
              <div>
                <div className="parking-history-box">
                  <h2 className="content-title-table">History</h2>

                  <UserProfileHistoryTable/>

                  {/* Loop through history array and render each record */}
                  {/* <table className="__table__">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time In</th> 
                        <th>Time Out</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>                     
                      {parkingHistory.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.date}</td>
                          <td>{entry.timeIn}</td>
                          <td>{entry.timeOut}</td>
                          <td>{entry.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal Popup */}
        {editingField && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="modal-title">
                Edit{" "}
                {editingField === "personal"
                  ? "Personal Information"
                  : editingField === "security"
                  ? "Account Security"
                  : "Vehicle Information"}
              </h3>

              {/* Edit Personal Information */}
              {editingField === "personal" && (
                <>
                  <label>
                    First Name:
                    <input
                      type="text"
                      value={tempProfile.first_name}
                      ref={(el) => (inputRefs.current)["first_name"] = el}
                      className={errors["first_name"] ? "invalid-input" : ""}
                      onChange={(e) => handleChange("first_name", e.target.value) }
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      value={tempProfile.last_name}
                      ref={(el) => (inputRefs.current)["last_name"] = el}
                      className={errors["last_name"] ? "invalid-input" : ""}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={tempProfile.email}
                      ref={(el) => (inputRefs.current)["email"] = el}
                      className={errors["email"] ? "invalid-input" : ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </label>
                  {/* <label>
                    Student Number:
                    <input
                      type="text"
                      value={tempProfile.user_id}
                      onChange={(e) =>
                        handleChange("studentNumber", e.target.value)
                      }
                    />
                  </label> */}
                </>
              )}

              {/* Edit Security Info */}
              {editingField === "security" && (
                <>
                  <label>
                    Current Password:
                    <input
                      type="password"
                      value={tempProfile.currentPassword}
                      ref={(el) => (inputRefs.current)["currentPassword"] = el}
                      className={errors["currentPassword"] ? "invalid-input" : ""}
                      onChange={(e) => handleChange("currentPassword", e.target.value)}
                    />
                  </label>
                  <label>
                    New Password:
                    <input
                      type="password"
                      value={tempProfile.newPassword}
                      ref={(el) => (inputRefs.current)["newPassword"] = el}
                      className={errors["newPassword"] ? "invalid-input" : ""}
                      onChange={(e) => handleChange("newPassword", e.target.value)}
                    />
                  </label>
                  <label>
                    Confirm Password:
                    <input
                      type="password"
                      value={tempProfile.confirmPassword}
                      ref={(el) => (inputRefs.current)["confirmPassword"] = el}
                      className={errors["confirmPassword"] ? "invalid-input" : ""}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    />
                  </label>
                </>
              )}

              {/* Edit Vehicle Info
              {editingField === "vehicle" && (
                <>
                  <label>
                    Type of Vehicle:
                    <input
                      type="text"
                      value={tempProfile.vehicle_type}
                      onChange={(e) =>
                        handleChange("vehicleType", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Plate Number:
                    <input
                      type="text"
                      value={tempProfile.vehicle_plate}
                      onChange={(e) =>
                        handleChange("plateNumber", e.target.value)
                      }
                    />
                  </label>
                </>
              )} */}

              {/* Buttons to save or cancel editing */}
              <button onClick={handleSave} className="save-button">
                Save
              </button>
              <button
                onClick={() => handleCancel()}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
