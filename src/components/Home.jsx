import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import instance from "../api/connection.js";
import jwt_decode from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function Home() {
  const myToken = localStorage.getItem("token");
  const decoded = jwt_decode(myToken);
  const date = new Date();
  const today = date.toISOString().split("T")[0];
  const [allWorkers, setAllWorkers] = useState([{}]);
  const effectRan = useRef(false);

  const initialStateCash = {
    date: "",
    amount: "",
    for: "",
  };

  const initialStateCheck = {
    date: "",
    dateOfCheck: "",
    checkNum: "",
    amount: "",
    for: "",
  };

  const initialStateCredit = {
    date: "",
    amount: "",
    payments: "",
    for: "",
  };

  const [myCashData, setMyCashData] = useState(initialStateCash);
  const [myChecksData, setMyChecksData] = useState(initialStateCheck);
  const [myCreditData, setMyCreditData] = useState(initialStateCredit);

  const handleDataCash = (event) => {
    const { name, value } = event.target;
    setMyCashData({ ...myCashData, [name]: value });
  };

  const clearState = (currentState) => {
    currentState === "Cash"
      ? setMyCashData({ ...initialStateCash })
      : currentState === "Credit"
      ? setMyCreditData({ ...initialStateCredit })
      : setMyChecksData({ ...initialStateCheck });
  };

  const saveDataCash = async () => {
    const validateValue = await instance.get( `/totalamount/total/${decoded._id}`);

    const myValue = validateValue.data.find((key) => key.for === myCashData.for);

    if (myValue.amount + parseInt(myCashData.amount) <= myValue.total) {
      const myDataCash = await instance.post(`/cashData/mycashdata/${decoded._id}`,myCashData);

      if (myDataCash.status === 200) {
        toast.success(`${myDataCash.data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        clearState("Cash");
      }
    } else {
      toast.warn(`Pay attention, You trying to paid more than necessary`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      clearState("Cash");
    }
  };

  const saveDataCheck = async () => {

    const validateValueCheck = await instance.get(`/totalamount/total/${decoded._id}`);
    const myValue = validateValueCheck.data.find((key) => key.for === myChecksData.for);

    if (myValue.amount + parseInt(myChecksData.amount) <= myValue.total) {
      const myDataCheck = await instance.post(`/check/newcheck/${decoded._id}`,myChecksData);

      if (myDataCheck.status === 200) {
        toast.success(`${myDataCheck.data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        clearState("Check");
      } 
    }else {
      toast.warn(`Pay attention, You trying to paid more than necessary`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      clearState("Cash");
    }
  };

  const saveDataCredit = async () => {
    const validateValue = await instance.get(`/totalamount/total/${decoded._id}`);
    const myValue = validateValue.data.find((key) => key.for === myCreditData.for);
    
    if (myValue.amount + parseInt(myCreditData.amount) <= myValue.total) {
      const saveCard = await instance.post( `/credit/newcredit/${decoded._id}`, myCreditData);
      if (saveCard.status === 200) {
        toast.success(`${saveCard.data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        clearState("Credit");
      }
    } else {
      toast.warning(`Pay attention, You trying to paid more than necessary`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      clearState("Credit");
    }
  };


  const handleDataCheck = (event) => {
    const { name, value } = event.target;
    setMyChecksData({ ...myChecksData, [name]: value });
  };


  const handleCreditData = (event) => {
    const { name, value } = event.target;
    setMyCreditData({ ...myCreditData, [name]: value });
  };


  useEffect(() => {
    if (effectRan.current === false) {
      getAllWorkets();
    }
    return () => {
      effectRan.current = true;
    };
  });

  const getAllWorkets = async () => {
    try {
      const data = await instance.get(`/workers/getall/${decoded._id}`);
      if (data.status === 200) {
        setAllWorkers(data.data);
      }
    } catch (error) {}
  };

  return (
    <div>
      <Row>
        <Col sm={2}>
          <ToastContainer />
          <div>
            <h5
              style={{
                marginLeft: "55px",
                marginTop: "25px",
                Color: "GrayText",
              }}
            >
              Welcome {decoded.first_name} {decoded.last_name}
            </h5>
          </div>
        </Col>
      </Row>
      <Row md style={{ marginTop: "15px", justifyContent: "space-evenly" }}>
        <Col sm={3} className="mt-3">
          <div className="mt-2">
            <h4 style={{ fontFamily: "OCR A Std, monospace" }}>Cash:</h4>
          </div>

          <div className="mt-3">
            <label>Date:</label>
            <input
              type="date"
              className="form-control"
              name="date"
              max={today}
              value={myCashData.date}
              onChange={handleDataCash}
            ></input>
            <ToastContainer />
          </div>

          <div className="mt-3">
            <label>Amount</label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              value={myCashData.amount}
              onChange={handleDataCash}
            />
          </div>

          <div className="mt-3">
            <label>For:</label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleDataCash}
              name="for"
              value={myCashData.for}
            >
              <option>Open this select menu</option>
              {allWorkers.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
            </Form.Select>
          </div>

          <div className="mt-3 d-grid">
            <Button
              variant="primary"
              onClick={saveDataCash}
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(153,145,148,1) 35%, rgba(93,94,94,1) 98%)",
                border: "none",
              }}
            >
              Save
            </Button>
          </div>
        </Col>

        <Col sm={3} className="mt-3">
          <h4 style={{ fontFamily: "OCR A Std, monospace" }}>Checks:</h4>
          <div className="mt-3">
            <label>Date of payment:</label>
            <input
              type="date"
              className="form-control"
              max={today}
              name="date"
              value={myChecksData.date}
              onChange={handleDataCheck}
            ></input>
          </div>

          <div className="mt-3">
            <label>Date of the check:</label>
            <input
              type="date"
              className="form-control"
              name="dateOfCheck"
              value={myChecksData.dateOfCheck}
              onChange={handleDataCheck}
            ></input>
          </div>
          <div className="mt-3">
            <label>Number of the check:</label>
            <Form.Control
              type="text"
              placeholder="Number of the check"
              name="checkNum"
              value={myChecksData.checkNum}
              onChange={handleDataCheck}
            />
          </div>

          <div className="mt-3">
            <label>Amount: </label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              value={myChecksData.amount}
              onChange={handleDataCheck}
            />
          </div>

          <div className="mt-3">
            <label>For:</label>
            <Form.Select
              aria-label="Default select example"
              name="for"
              value={myChecksData.for}
              onChange={handleDataCheck}
            >
              <option>Open this select menu</option>
              {allWorkers.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
            </Form.Select>
          </div>

          <div className="mt-3 d-grid">
            <Button
              variant="primary"
              onClick={saveDataCheck}
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(153,145,148,1) 35%, rgba(93,94,94,1) 98%)",
                border: "none",
              }}
            >
              Save
            </Button>
          </div>
        </Col>
        <Col sm={3} className="mt-3">
          <h4 style={{ fontFamily: "OCR A Std, monospace" }}>Creidt Card:</h4>

          <div className="mt-3">
            <label>Date of the payment:</label>
            <input
              type="date"
              className="form-control"
              max={today}
              name="date"
              value={myCreditData.date}
              onChange={handleCreditData}
            ></input>
          </div>

          <div className="mt-3">
            <label>Amount: </label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              value={myCreditData.amount}
              onChange={handleCreditData}
            />
          </div>

          <div className="mt-3">
            <label>Payments: </label>
            <Form.Control
              type="text"
              placeholder="Payments"
              name="payments"
              value={myCreditData.payments}
              onChange={handleCreditData}
            />
          </div>
          <div className="mt-3">
            <label>For:</label>
            <Form.Select
              aria-label="Default select example"
              name="for"
              value={myCreditData.for}
              onChange={handleCreditData}
            >
              <option >Open this select menu</option>
              {allWorkers.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
            </Form.Select>
          </div>

          <div className="mt-3 d-grid">
            <Button
              variant="primary"
              onClick={saveDataCredit}
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(153,145,148,1) 35%, rgba(93,94,94,1) 98%)",
                border: "none",
              }}
            >
              Save
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
