import "./App.css";

import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import { useAuth } from "./customHooks/AuthContext";

import { Layout } from "./components/Layout"

import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { MainPage } from "./pages/MainPage";

import { AdminAccounts } from "./pages/AdminAccounts";
import { AdminParking } from "./pages/AdminParking";
import { AdminHistory } from "./pages/AdminHistory";
import { AdminProfile } from "./pages/AdminProfile";

import { UserParkingView } from "./pages/UserParkingView";
import { UserParking } from "./pages/UserParking";
import { UserProfile } from "./pages/UserProfile";

function App() {
  const { auth, setAuth } = useAuth(); 
  const isLoggedin = Boolean(auth?.accessToken);
  const accountType = auth?.accountType;


  return (
    <>
        <Router>
          <Routes>
            <Route element = {<Layout/>}>
            
              {/* Unauthorized Route */}
              {!isLoggedin && 
                (
                  <>
                    <Route path = "/" element={<MainPage />} />
                  </>
                )
              } 
              
              {/* Protected Route */}
              <Route element={<ProtectedRoutes/>}>
                { accountType!= "Admin" ? 
                  (
                    <>
                      <Route path = "/userParkingView" element ={<UserParkingView />} />
                      <Route path="/userParking/:zone" element={<UserParking />} />
                      <Route path = "/userProfile" element ={<UserProfile />} />  

                      {/* Route Fallback */}
                      <Route path = "/" element={<Navigate to="/userParkingView" />} />
                      <Route path = "/adminParking" element={<Navigate to="/" />} />
                      <Route path = "/adminAccounts" element={<Navigate to="/" />} />
                      <Route path = "/adminHistory" element={<Navigate to="/" />} />
                      <Route path = "/adminProfile" element={<Navigate to="/" />} />
                    </>
                  ) : (
                    <>
                      <Route path = "/adminParking" element={<AdminParking />} />
                      <Route path = "/adminAccounts" element={<AdminAccounts />} />
                      <Route path = "/adminHistory" element={<AdminHistory />} />
                      <Route path = "/adminProfile" element={<AdminProfile />} />

                      {/* Route Fallback */}
                      <Route path = "/" element={<Navigate to="/adminParking" />} />
                      <Route path = "/userParkingView" element ={<Navigate to="/" />} />
                      <Route path="/userParking/:zone" element={<Navigate to="/" />} />
                      <Route path = "/userProfile" element ={<Navigate to="/" />} />
                    </>
                  )
                }  
              </Route>
            </Route>
          </Routes>
        </Router>
    </>
  );
}

export default App;
