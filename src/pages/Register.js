import React,{ useEffect, useState, userEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const Register = () => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false);
    
    //from submit
    const submitHandler = async (values) => {
       try{
         setLoading(true)
         await axios.post("/user/register",values);
         message.success("Registration Successful");
         setLoading(false);
         navigate("/login");
       } catch (error) {
         setLoading(false);
         message.error("Registration was Unsuccessful");
       }
    };
    //prevent
    useEffect(() => {
        if(localStorage.getItem("user")){
            navigate("/");
        }
    }, [navigate]);
    return (
        <>
            <div className="register-page">
                {loading && <LoadingScreen />}
                <Form layout="vertical" onFinish={submitHandler}>
                    <h1>Register Form</h1>
                    <Form.Item label="Name" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input type="password" />
                    </Form.Item>
                    <div className="d-flex justify-content-between">
                        <Link to="/login">Already Registered? Click here to login</Link>
                        <button className="btn btn-primary">Register</button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default Register;