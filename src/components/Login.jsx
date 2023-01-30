import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import "../styles/App.css";
import React, { useState} from "react";
import { useNavigate } from 'react-router-dom';

import instance from "../api/connection";

export default function Login() {
  const logo = require("../images/todolist.png");
  const navigate = useNavigate();

  const [myLoginData, setMyLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginData = (event) => {
    const { name, value } = event.target;
    setMyLoginData({ ...myLoginData, [name]: value });
  };

  const myLoginFunc = async()=>{
      
      const myData = await instance.post('/login', myLoginData)
      if(myData.status === 200){
        localStorage.setItem('token', myData.data.token); 
        navigate('/home')
      }
  }

  return (
    <div className="Login">
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <img src={logo} alt="logo" width="150px"></img>
                  <h2 className="fw-bold mb-2 text-uppercase ">My Todo List</h2>
                  <p className=" mb-5">Please enter your email and password!</p>
                  <div className="mb-3">
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          name="email"
                          className="form-control-warning"
                          onChange={handleLoginData}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="password"
                          onChange={handleLoginData}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        <p className="small">
                          <a className="text-primary" href="#!">
                            Forgot password?
                          </a>
                        </p>
                      </Form.Group>
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          onClick={myLoginFunc}
                        >
                          Login
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Don't have an account?{" "}
                        <a href="{''}" className="text-primary fw-bold">
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
