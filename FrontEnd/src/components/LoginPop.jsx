import "../css/LoginPop.css";
import ForgotPassword from "./ForgotPassword";
import { usePostFetch } from "../customHooks/usePostFetch";
import { useAuth } from "../customHooks/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const LoginPop = ({ setIsLoginOpen }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { auth, setAuth } = useAuth(); 
  const navigate = useNavigate();


  // Loging in the data
  const logging = async(formData) => {
    fetch("http://localhost:8080/login", {
      method: "POST",
          headers: {
              "Content-type": "application/json", 
          },
          credentials: 'include',
          body: JSON.stringify(formData)
    }).then (async res => {
      if (!res.ok) {
        const responseData = await res.json();
        console.log("Error message: " + responseData.message)
        throw new Error (responseData.message || "An unknown error has occured")
      }
      return res.json();
    }).then(data => {
      console.log("User has been logged in successfully")
      setIsLoginOpen(false)
      console.log(data);
      setAuth({
        accessToken: data.accessToken,
        ID: data.ID,
        accountType: data.accountType,
      });
      if (data.accountType === "Student" || data.accountType === "Worker") {
        navigate("/userParkingView");
      } else if (data.accountType == "Admin") {
        navigate("/adminParking");
      }
    }).catch(err => {
      console.log(err);
      if (err.message === "Invalid email") {
        setErrors({ email: true})
        emailRef.current.value = "";
        emailRef.current.placeholder = "Invalid email";
      }
      if (err.message === "Incorrect password") {
        setErrors({ password: true})
        passwordRef.current.value = "";
        passwordRef.current.placeholder = "Incorrect password";
      }
    })  
  }

  // Login Form Validation
  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current;
    const password = passwordRef.current;
    let valid = true;

    if (!email.value) {
      setErrors((prev) => ({ ...prev, email: true }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: false }));
      email.placeholder = "Email";
    }

    if (!password.value) {
      setErrors((prev) => ({ ...prev, password: true }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: false }));
      password.placeholder = "Password";
    }

    if (valid) {
      // Proceed with form submission
      let formData = {
        email: email.value.toUpperCase(),
        password: password.value,
      }
      
      console.log("Form sending:", formData);
      logging(formData);
    }
  }
    


  return (
    <div className="login-overlay">
      {/* Forgot Password */}
      {isForgotPassword ? (
        <ForgotPassword goBackToLogin={() => setIsForgotPassword(false)} />
      ) : (
        <div className="login-container">
          {/* Left side: Image */}
          <div className="login-image">
            <img src="/images/LoginImage.png" alt="Parking" />
          </div>

          {/* Right side: Login Form */}
          <div className="login-form">
            {/* Close button */}
            <button className="close-btn" onClick={() => setIsLoginOpen(false)}>
              ✖
            </button>

            {/* Logo and Title */}
            <div className="logo-container">
              <img
                src="/images/LaspotLogo.png"
                alt="logo"
                className="login-logo"
              />
              <h1 className="logo-title">La Spot</h1>
            </div>

            <h2 className="login-title">Login</h2>
            <p className="login-description">
              Enter your email and password to login
            </p>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Email"
                className={`inputField-login ${errors.email ? "error" : ""}`}
                ref={emailRef}
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                className={`inputField-login ${errors.password ? "error" : ""}`}
                ref={passwordRef}
              />
              <a
                href="#"
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(true);
                }}
              >
                Forgot Password?
              </a>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default LoginPop;
