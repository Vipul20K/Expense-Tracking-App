import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/LoginPage.css";


const Login = () => {
  const img =
    "https://akriviahcm.com/blog/wp-content/uploads/2024/05/10-Features-to-Look-for-in-Expense-Management-System.jpg";

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("api/v1/users/login", values);
      setLoading(false);
      message.success("Login Successful");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );

      // Only store token if it exists
      if (data.token) {
        localStorage.setItem("jwt_token", data.token); // Store JWT token after successful login
      }

      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("something went wrong");
    }
  };

  //  //prevent for login user
  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  return (
    <>
      <div className="login-page">
        {loading && <Spinner />}
        <div className="row container align-items-center">
          <h1 className="text-center">Expense Management System</h1>

          <div className="col-md-7 col-12 d-flex justify-content-center align-items-center">
            <img src={img} alt="login-img" className="img-fluid" />
          </div>

          <div className="col-md-4 col-12 login-form">
            <Form layout="vertical" onFinish={submitHandler}>
              <h1>Login Form</h1>

              <Form.Item label="Email" name="email">
                <Input type="email" required />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input type="password" required />
              </Form.Item>

              <div className="d-flex justify-content-between">
                <Link to="/register">Not a user? Click Here to Register!</Link>
                <button className="btn">Login</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
