import React, { useState, useEffect, useRef ,useContext} from "react";
import { Form, Col, Row, Container, Button, } from "react-bootstrap";
import DataTable from "react-data-table-component";
import instance from "../api/connection";
import jwt_decode from "jwt-decode";
import '../styles/index.css';
import ProgressBar from "@ramonak/react-progress-bar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from "../shared/UserContext.js";
function AddWorker() {
  const { myToken, decoded} = useContext(UserContext);
  const [pending, setPending] = useState(true);
  const effectRan = useRef(false);
  // const myToken = localStorage.getItem('token')
  // const decoded = jwt_decode(myToken);
  const [dataWorker, setDataWorker] = useState([{}]);
  const [dataWorkerInputs, setDataWorkerInputs] = useState([{ name: "", amount: "", status: "" }]);
  // const [myFontColor, setMyFontColor] = useState('red')

  useEffect(() => {
    if (effectRan.current === false) {
      initalData();
    }
    return () => {
      effectRan.current = true;
    };
  });

  const initalData = async () => {
    try {

      const myData = await instance.get(`/workers/getall/${decoded._id}`,{ headers: { "authorization": `${myToken}` } });
      const amountPerWorker = await instance.get(`/totalamount/total/${decoded._id}`,  { headers: { "authorization": `${myToken}` } })

      if (myData.status === 200) {
        const myArr = []
        for (let index = 0; index < myData.data.length; index++) {
          if (amountPerWorker.data[index].for === myData.data[index].name) {
            const myAvg = amountPerWorker.data[index].amount / amountPerWorker.data[index].total * 100
            const RemainStatus = amountPerWorker.data[index].total - amountPerWorker.data[index].amount
            const myFont = <div><FontAwesomeIcon icon={faCircle} style={{color:RemainStatus ? 'red':'green'}} size={"xl"} />  {RemainStatus}</div>
            myArr.push({
              name: myData.data[index].name, amount: myData.data[index].amount + '₪', status: `${amountPerWorker.data[index].amount} From ${amountPerWorker.data[index].total}`,remain:myFont, percentage: <ProgressBar
                maxCompleted={100}
                className="wrapper"
                completed={Math.trunc(myAvg)}
                bgColor={'linear-gradient(90deg, rgba(13,189,31,1) 1%, rgba(80,174,207,1) 42%, rgba(208,185,79,1) 55%, rgba(0,212,255,1) 92%)'}
                animateOnRender />
            })

          }
        }
        setDataWorker(myArr);
        setPending(false);
      }

    } catch (error) { }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,

    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      style: {
        display: "grid",
        backgroundColor: 'transparent !important',
      },
    },
    {
      name: "Remain",
      selector: (row) => row.remain,
      style: {
        display: "grid",

      },
    },
    {
      name: "Percentage",
      selector: (row) => row.percentage,
      sortable: true,
      style: {
        display: "grid",
        backgroundColor: 'transparent !important'
      },
    }
  ];


  const handleWorkerData = (event) => {
    const { name, value } = event.target;
    setDataWorkerInputs({ ...dataWorkerInputs, [name]: value });
  };

  const addData = async () => {

    try {
      const myObj = {
        name: dataWorkerInputs.name,
        amount: dataWorkerInputs.amount + '₪',
        status: `0 From ${dataWorkerInputs.amount}`,
        remain:<div><FontAwesomeIcon icon={faCircle} style={{color:'red'}} size={"xl"} />{dataWorkerInputs.amount}</div>,
        percentage: <ProgressBar maxCompleted={100} className="wrapper" completed={0} bgColor={'linear-gradient(90deg, rgba(13,189,31,1) 1%, rgba(80,174,207,1) 42%, rgba(208,185,79,1) 55%, rgba(0,212,255,1) 92%)'} animateOnRender />
      }
      const data = await instance.post(`/workers/new/${decoded._id}`,dataWorkerInputs, { headers: { "authorization": `${myToken}` } })
      if (data.status === 200) {
        toast.success(`${data.data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        setDataWorker(prevArray => [...prevArray, myObj])
      }
    } catch (error) {

    }

  };

  return (
    <Container className="mt-5">
      <ToastContainer />
      <Row>
        <Col>
          <div>
            <label>Name:</label>

            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleWorkerData}
            />
          </div>
        </Col>
        <Col>
          <label>Amount:</label>
          <Form.Control
            type="text"
            placeholder="Amount"
            name="amount"
            onChange={handleWorkerData}
          />
        </Col>
        <Col sm={3} className="sm-2">
          <label></label>
          <div className="d-grid">
            <Button variant="primary" onClick={addData} style={{ backgroundImage: 'radial-gradient(circle, rgba(153,145,148,1) 35%, rgba(93,94,94,1) 98%)', border: 'none' }}>
              Add
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <DataTable
            columns={columns}
            data={dataWorker}
            pagination
            progressPending={pending}
            defaultSortFieldId={1}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default AddWorker;
