import React,{useState,useEffect} from 'react';
import {Form,Input,message} from 'antd';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import "../styles/RegisterPage.css";
import axiosInstance from '../utils/axiosInstance';
const API_URL = process.env.REACT_APP_API_URL;


const Register=()=>{

    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    // form submit
    const submitHandler=async(values)=>{
        try{
            setLoading(true);
            console.log(values);
            await axios.post(`${API_URL}/api/v1/users/register`,values);
            message.success("Registration Successful");
            setLoading(false);
            navigate('/login');
        }catch(error){
            setLoading(false);
            message.error(error.response?.data?.message || "Something went wrong");
        }
    };


    //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

    
    return (
        <>
          <div className="register-page ">
            {loading && <Spinner />}
            <Form
              className="register-form"
              layout="vertical"
              onFinish={submitHandler}
            >
              <h2>Register Form</h2>
              <Form.Item label="Name" name="name">
                <Input type="text" required />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input type="email" required />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input type="password" required />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Link to="/login">Already Registered? login here!</Link>
                <button className="btn ">Register</button>
              </div>
            </Form>
          </div>
        </>
    );
}

export default Register;
