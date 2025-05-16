import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDeleteFetch } from "../customHooks/useDeleteFetch";
import { useAuth } from "../customHooks/AuthContext";
import "../css/LogoutButton.css";

export function LogoutButton({ onLogoutClick }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const {auth, setAuth} = useAuth();
  const navigate = useNavigate()
  const {data: logoutData, isPending, error, triggerDelete } = useDeleteFetch(); 
  
  useEffect(() => {
    if (logoutData.status === 204) {
      setAuth(null);
      navigate("/")
    }
  })
  
  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    triggerDelete("http://localhost:8080/logout");
  };
  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className="logout__buttons">
        <button className="btn btn-logout" onClick={handleLogoutClick}>
          <div className="button-text">Logout</div>
        </button>
      </div>

      {showConfirm && (
        <div className="popup">
          <div className="popup-content">
            <p className="popMessage">Are you sure you want to logout?</p>
            <button className="btn btn-confirm" onClick={handleConfirm}>
              Logout
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
