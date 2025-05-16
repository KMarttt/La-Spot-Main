import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Header3.css";
import { useGetFetch } from "../customHooks/useGetFetch";
import { useAuth } from "../customHooks/AuthContext";

export function Header3({ refreshPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const { data, isPending, error, triggerGet } = useGetFetch();
  const { auth, setAuth } = useAuth();
    
  // Will fetch the profile picture
    useEffect(() => {
      triggerGet(`http://localhost:8080/get-profile-pic/${auth.ID}/${auth.accountType}`)
    }, [refreshPage])
  {
    /* Scroll effect */
  }

  useEffect(() => {
    const handleScroll = () => {
      let opacity = Math.max(0.5, 1 - window.scrollY / 200);
      setBgOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!data || data.length === 0) {
    return <p> "Fetching data"</p>
  }

  return (
    <>
      {/* HEADER 2 */}
      <header
        className="header"
        id="header"
        style={{ backgroundColor: `rgba(240, 237, 238, ${bgOpacity})` }}
      >
        <nav className="nav container">
          <a href="#" className="nav__logo">
            <img src="/images/LaspotLogo.png" alt="logo image" />
            La Spot
          </a>

          <div
            className={`nav__menu ${menuOpen ? "show-menu" : ""}`}
            id="nav-menu"
          >
            <ul className="nav__list">
              <li className="nav__item">
                <Link
                  to = "/adminParking"
                  className="nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  Parking Overview
                </Link>
              </li>

              <li className="nav__item">
                <Link
                  to = "/adminAccounts"
                  className="nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  Accounts
                </Link>
              </li>

              <li className="nav__item">
                <Link
                  to = "/adminHistory"
                  className="nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  History
                </Link>
              </li>
            </ul>

            {/* PROFILE IMAGE */}
            <div className="nav__profile">
              <Link to = "/adminProfile">
                <img
                  src={data.profile_image}
                  alt="User Profile"
                  className="profile__image"
                />
              </Link>
            </div>

            {/* CLOSE BUTTON */}
            <div
              className="nav__close"
              id="nav-close"
              onClick={() => setMenuOpen(false)}
            >
              <i className="ri-close-line"></i>
            </div>
          </div>

          {/* TOGGLE BUTTON FOR RESIZED MEDIA */}
          <div
            className="nav__toggle"
            id="nav-toggle"
            onClick={() => setMenuOpen(true)}
          >
            <i className="ri-apps-2-line"></i>
          </div>
        </nav>
      </header>
    </>
  );
}
