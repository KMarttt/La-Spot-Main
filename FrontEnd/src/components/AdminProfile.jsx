import { useState, useEffect, useRef } from "react";
import penIcon from "../assets/pen.png";
import { useAuth } from "../customHooks/AuthContext";
import { useGetFetch } from "../customHooks/useGetFetch";
import { usePutFetch } from "../customHooks/usePutFetch"
import { usePostFetch } from "../customHooks/usePostFetch";
import "../css/AdminProfile.css";
import { LogoutButton } from "./Logoutbutton";


export function AdminProfile({triggerRefreshPage, refreshPage}) {
  const { data: profileData, isPending, error, triggerGet } = useGetFetch();
  const { data: updatedProfileData, isPending: updatingProfile, error: updateError, triggerPut} = usePutFetch();
  const { data: postedPicData, isPending: postingPicData, error: postPicError, triggerPost } = usePostFetch();
  const {auth, setAuth} = useAuth();
  const inputRefs = useRef({})
  const [refreshKey, setRefreshKey] = useState(0);

  // refreshPage
  useEffect(() => {
    triggerGet(`http://localhost:8080/admin-profile/${auth.ID}`)
  }, [refreshKey, refreshPage, auth.ID])

  const [activeTab, setActiveTab] = useState("profile");
  const [editingField, setEditingField] = useState(null);
  const [tempProfile, setTempProfile] = useState(profileData);
  const [errors, setErrors] = useState({});
  const [putProfileData, setPutProfileData] = useState({})

  
  useEffect(() => {
      if (profileData && profileData.length !== 0) {
        setTempProfile(profileData);
      }
    }, [profileData])

  const handleEditClick = (section) => {
    setTempProfile(profileData);
    console.log(profileData)
    setEditingField(section);
  };

  // Will validate the input fields and update the put data (initialization for put fetch)
  const handleSave = () => {
    let newErrors = {}

    const namePattern = /^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$/;
    const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log("this is the email temp profile from the validation regex of: ", tempProfile.email)

    if (editingField === "personal"){
      if (namePattern.test(tempProfile.first_name) === false){
          newErrors["first_name"] = true;
          inputRefs.current["first_name"].placeholder = "Invalid first name format";
          tempProfile["first_name"] = "";
      }
      if (namePattern.test(tempProfile.last_name) === false){
        newErrors["last_name"] = true;
        inputRefs.current["last_name"].placeholder = "Invalid last name format"
        tempProfile["last_name"] = "";
      }
      if (emailPattern.test(tempProfile.email) === false) {
        newErrors["email"] = true;
        inputRefs.current["email"].placeholder = "Invalid email format"
        tempProfile["email"] = "";
      }
    } else if (editingField === "security"){
      const passwordPattern = /^.{8,}$/;
      // Checking if the New and confirm password matches    
      if (tempProfile.newPassword !== tempProfile.confirmPassword) {
        newErrors["confirmPassword"] = true;
        inputRefs.current["confirmPassword"].placeholder = "Password does not match"
        tempProfile["confirmPassword"] = "";
      }
      if (passwordPattern.test(tempProfile.newPassword) === false){
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
        triggerPut(`http://localhost:8080/admin-profile-personal-update`, putProfileData)
      } else if (editingField === "security") {
        triggerPut(`http://localhost:8080/admin-profile-security-update`, putProfileData)
      }
      
    }
  }, [putProfileData])

  useEffect(() => {
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
  }, [updatedProfileData, updateError]);

  // Will handle the cancel from the modal
  const handleCancel = () => {
    setEditingField(null);
    setErrors({});
  }

  // Update temporary profile while editing
  const handleChange = (field, value) => {
    setTempProfile(prevTempProfile => ({ // Use the functional update form
      ...prevTempProfile,
      [field]: value,
    }));
  };

  // Profile Picture Logics

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Generate a preview URL

      setTempProfile(prevTempProfile => ({ // Use the functional update form
        ...prevTempProfile,
        ["profilePic"]: imageUrl, //Store the preview URL
        ["rawProfilePic"]: file,
      }));
    }
  }

  const handleCancelProfilePic = (e) => {
    setTempProfile(prevTempProfile => ({ // Use the functional update form
        ...prevTempProfile,
        ["profilePic"]: undefined, 
        ["rawProfilePic"]: undefined,
      }));
  }

  const handleFileUpload = () => {
    if (!tempProfile.rawProfilePic) return alert("Please select an image first");

    const formdata = new FormData();
    formdata.append("file", tempProfile.rawProfilePic)
    formdata.append("ID", auth.ID);
    formdata.append("accountType", "Admin");

    triggerPost("http://localhost:8080/upload-profile-pic", formdata)

  }

  useEffect(() => {
    if (Object.keys(postedPicData).length !== 0) {
      if(postedPicData.valid) {
        triggerRefreshPage();
      }
    }
  },[postedPicData])
  
  

  return (
    <section className="adminProfile__layout">
      <div className="profile-container">
        <h2 className="profile-title">Account Settings</h2>

        <div className="profile-wrapper">
          <div className="sidebar">
            <button
              onClick={() => setActiveTab("profile")}
              className={
                activeTab === "profile"
                  ? "sidebar-button active"
                  : "sidebar-button"
              }
            >
              My Profile
            </button>
          </div>

          <div className="content-section">
            {activeTab === "profile" ? (
              <div className="profile-sections-box">
                <h2 className="My-profile-title">My Profile</h2>
                <div className="profile-header">

                  <div className="profile-image-container-wrapper">
                    <div className="profile-image-container">  
                      <div className="profile-image-wrapper">
                        <img src={tempProfile?.profilePic ? tempProfile.profilePic : tempProfile.profile_image} 
                          alt="Profile" 
                          className="profile-image" 
                        />
                      </div>
                    </div>


                    <label htmlFor="profile-image-input" className="edit-button">
                      Change Photo
                    </label>
                    <input
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  
                  <div className="profile-info-container">
                    <h2 className="accountFullname">
                      {profileData.first_name} {profileData.last_name}
                    </h2>
                    <p className="accountDisplaytype">Admin</p>
                    <p className="accountDisplayemail">{profileData.email}</p>
                  </div>
                </div>


                <div className="profile-actions">
                  {tempProfile?.rawProfilePic && (
                    <div className="upload-controls">
                      <button /* className="upload-button" */ className="save-button"  onClick={handleFileUpload}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={() => handleCancelProfilePic()}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>


                {/* personal info-box */}
                <div className="personal-infoBox">
                  <h3 className="section-title">Personal Information </h3>
                  <div className="info-content">
                    <p>
                      <strong>First Name:</strong> {profileData.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {profileData.last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profileData.email}
                    </p>
                    <p>
                      <strong>Admin Code:</strong> {profileData.admin_code}
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

                {/* account security */}
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

                {/* Logout */}
                <LogoutButton />
              </div>
            ) : null}
          </div>
        </div>

        {editingField && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="modal-title">
                Edit{" "}
                {editingField === "personal"
                  ? "Personal Information"
                  : editingField === "security"
                  ? "Account Security"
                  : null}
              </h3>
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
                </>
              )}
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
