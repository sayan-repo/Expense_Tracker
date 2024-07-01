import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    //submit
    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const { data } = await axios.post("/user/login", values);
            setLoading(false);
            message.success("login success");
            localStorage.setItem("user", JSON.stringify({ ...data.user, password: "" }));
            navigate("/");
        } catch (error) {
            setLoading(false);
            message.error("Something went wrong");
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
                    <h1>Login Form</h1>
                    <Form.Item label="Email" name="email">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input type="password" />
                    </Form.Item>
                    <div className="d-flex justify-content-between">
                        <Link to="/register">Not Registered? Click here to Register</Link>
                        <button className="btn btn-primary">Login</button>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default Login;