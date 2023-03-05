import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import instance from "../api/connection.js";
import jwt_decode from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { validation, validationChecks } from "../shared/validation";
import classnames from "vest/classnames";
import {toastWarning,toastSuccess} from '../shared/toastWarning';
// import {myData} from "../shared/state";
import { UserContext } from "../shared/UserContext.js";
function Home() {
  // console.log(myData)
  const { firstName, lastName , myToken, decoded} = useContext(UserContext);

  // const myToken = localStorage.getItem("token")
  // const decoded = jwt_decode(myToken)
  const date = new Date();
  const today = date.toISOString().split("T")[0];
  const [allWorkers, setAllWorkers] = useState([{}]);
  const effectRan = useRef(false);
  const [formstate, setFormstate] = useState({});
  const [formstateCheck, setFormstateCheck] = useState({});
  const res = validation.get();
  const resCheck = validationChecks.get();
  // const [myToken, setMyToken] = useState(null);
  // const [decoded, setDecoded] = useState(null);

  const cn = classnames(res, {
    invalid: "form-control is-invalid",
    valid: "form-control is-valid",
  });

  const cnCheck = classnames(resCheck, {
    invalid: "form-control is-invalid",
    valid: "form-control is-valid",
  });


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

    const nextState = { ...formstate, [name]: value };
    const result = validation(nextState, [name]);
    setFormstate(nextState);

  };

  const clearState = (currentState) => {
    if(currentState === "Cash"){
      setMyCashData({ ...initialStateCash })
      validation.reset()
    }else if(currentState === "Credit"){
      setMyCreditData({ ...initialStateCredit })
      
    }else{
      setMyChecksData({ ...initialStateCheck });
      validationChecks.reset()
    }
  };

  const saveDataCash = async () => {
    const isEmptyField = Object.values(myCashData).some(v => v === '');
    const isEmpty = Object.values(myCashData).every(x => x === null || x === '');
    if(isEmpty){
        toastWarning('Please fill the data before you saving')
    }
    else if(isEmptyField){
      toastWarning('At least one of the fields is empty')
    }
    if (!isEmptyField) {
      const validateValue = await instance.get(`/totalamount/total/${decoded._id}`, { headers: { "authorization": `${myToken}` } });
      const myValue = validateValue.data.find((key) => key.for === myCashData.for);
      if (myValue.amount + parseInt(myCashData.amount) <= myValue.total) {
        const myDataCash = await instance.post(`/cashData/mycashdata/${decoded._id}`, myCashData, { headers: { "authorization": `${myToken}` } });
        if (myDataCash.status === 200) {
          toastSuccess(`${myDataCash.data}`)
          clearState("Cash");
        }
      } else {
        toastWarning('Pay attention, You trying to paid more than necessary')
        clearState("Cash");
      }
    }
  }

  const saveDataCheck = async () => {

    const validateValueCheck = await instance.get(`/totalamount/total/${decoded._id}`);
    const myValue = validateValueCheck.data.find((key) => key.for === myChecksData.for);

    if (myValue.amount + parseInt(myChecksData.amount) <= myValue.total) {
      const myDataCheck = await instance.post(`/check/newcheck/${decoded._id}`, myChecksData);

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

  const saveDataCredit = async () => {
    const validateValue = await instance.get(`/totalamount/total/${decoded._id}`);
    const myValue = validateValue.data.find((key) => key.for === myCreditData.for);

    if (myValue.amount + parseInt(myCreditData.amount) <= myValue.total) {
      const saveCard = await instance.post(`/credit/newcredit/${decoded._id}`, myCreditData);
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

    const nextState = { ...formstateCheck, [name]: value };
    const result = validationChecks(nextState, [name]);
    setFormstateCheck(nextState);

  };


  const handleCreditData = (event) => {
    const { name, value } = event.target;
    setMyCreditData({ ...myCreditData, [name]: value });

    const nextState = { ...formstate, [name]: value };
    const result = validation(nextState, [name]);
    setFormstate(nextState);

  };


  useEffect(() => {
    if (effectRan.current === false) {
      console.log('in use effect home')
        getAllWorkets();
        checkToken();
    }
    return () => {
      effectRan.current = true;
    };
  });

  const getAllWorkets = async () => {
    try {
      const data = await instance.get(`/workers/getall/${decoded._id}`, { headers: { "authorization": `${myToken}` } });
      if (data.status === 200) {
        setAllWorkers(data.data);
      }
    } catch (error) { }
  };
  const checkToken = ()=>{
    console.log('in check token')
    // const myToken = localStorage.getItem("token")
    // setMyToken(myToken);
    // const decoded = jwt_decode(myToken)
    // setDecoded(decoded)
    // console.log(decoded)
  }
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
              {/* Welcome {decoded.first_name} {decoded.last_name} */}
              Welcome, {firstName} {lastName}!
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
              className={cn('date') ? cn('date') : 'form-control'}
              name="date"
              max={today}
              value={myCashData.date}
              onChange={handleDataCash}
            // onBlur={()=>handleChange('date',myCashData.date)}
            ></input>
            <small style={{ color: 'red' }}>{res.getErrors("date")}</small>
            <ToastContainer />
          </div>

          <div className="mt-3">
            <label>Amount</label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              // onBlur={()=>handleChange('amount',myCashData.amount)}
              className={cn('amount') ? cn('amount') : 'form-control'}
              value={myCashData.amount}
              onChange={handleDataCash}
            />
            <small style={{ color: 'red' }}>{res.getErrors("amount")}</small>
          </div>

          <div className="mt-3">
            <label>For:</label>
            <Form.Select
              aria-label="Default select example"
              // onBlur={()=>handleChange('for',myCashData.for)}
              className={cn('for') ? cn('for') : 'form-control'}
              onChange={handleDataCash}
              name="for"
              value={myCashData.for}
            >
              <option value="">Open this select menu</option>
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
              className={cnCheck('date') ? cnCheck('date') : 'form-control'}
              max={today}
              name="date"
              value={myChecksData.date}
              onChange={handleDataCheck}

            ></input>
            <small style={{ color: 'red' }}>{resCheck.getErrors("date")}</small>
          </div>

          <div className="mt-3">
            <label>Date of the check:</label>
            <input
              type="date"
              className={cnCheck('dateOfCheck') ? cnCheck('dateOfCheck') : 'form-control'}
              name="dateOfCheck"
              value={myChecksData.dateOfCheck}
              onChange={handleDataCheck}
            ></input>
            <small style={{ color: 'red' }}>{resCheck.getErrors("dateOfCheck")}</small>
          </div>
          <div className="mt-3">
            <label>Number of the check:</label>
            <Form.Control
              type="text"
              placeholder="Number of the check"
              name="checkNum"
              value={myChecksData.checkNum}
              className={cnCheck('checkNum') ? cnCheck('checkNum') : 'form-control'}
              onChange={handleDataCheck}
            />
            <small style={{ color: 'red' }}>{resCheck.getErrors("checkNum")}</small>
          </div>

          <div className="mt-3">
            <label>Amount: </label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              value={myChecksData.amount}
              className={cnCheck('amount') ? cnCheck('amount') : 'form-control'}
              onChange={handleDataCheck}
            />
            <small style={{ color: 'red' }}>{resCheck.getErrors("amount")}</small>
          </div>

          <div className="mt-3">
            <label>For:</label>
            <Form.Select
              aria-label="Default select example"
              name="for"
              className={cnCheck('for') ? cnCheck('for') : 'form-control'}
              value={myChecksData.for}
              onChange={handleDataCheck}
            >
              <option value="">Open this select menu</option>
              {allWorkers.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
            </Form.Select>
            <small style={{ color: 'red' }}>{resCheck.getErrors("for")}</small>
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
