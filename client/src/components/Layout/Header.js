import { message } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/HeaderStyles.css";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";

const Header = () => {
  const [loginUser, setLoginUser] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user) {
        setLoginUser(user.name);
      }
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout Successful");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">
          {/* Brand Name */}
          <Link className="navbar-brand" to="/">
            Expense Tracker
          </Link>

          {/* Mobile Menu Toggler */}
          <button className="menu-toggler" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>

          {/* Navbar Links */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li className="nav-item">
              <h6 className="nav-link">
                <UserOutlined /> {loginUser}
              </h6>
            </li>
            <li className="nav-item">
              <button className="btn custom-logout-btn" onClick={logoutHandler}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
