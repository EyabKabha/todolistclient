import React, { useState, useEffect, useRef ,useContext} from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import CustomLoader from "./CustomLoader";
import instance from "../api/connection";
import jwt_decode from "jwt-decode";
import { UserContext } from "../shared/UserContext.js";
function Reports() {
  const { myToken, decoded} = useContext(UserContext);
  // const myToken = localStorage.getItem("token");
  // const decoded = jwt_decode(myToken);
  const [pending, setPending] = useState(true);
  const [myCurrentTable, setMyCurrentTable] = useState(0);
  const [myTableData, setMyTableData] = useState([{}]);
  const [MyTotalPayments, setMyTotalPayments] = useState([{}]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchData = async () => {
        const mytotal = await instance.get(`/total/all/${decoded._id}`, { headers: { "authorization": `${myToken}` } });
        setMyTotalPayments(mytotal.data);
      }
      fetchData();
      myData();
    }
    return () => {
      effectRan.current = true;
    };
  });

  const myData = async (e, segmentIndex = 0) => {
    try {
      const myCurrentUser = decoded._id;
      if (data[segmentIndex].title === "Card") {
        setPending(true);
        const credit_data = await instance.get(`/credit/getcredit/${myCurrentUser}`,{ headers: { "authorization": `${myToken}` } })
        if(credit_data.status === 200){
          setPending(false);
          setMyTableData(credit_data.data);
          setMyCurrentTable(segmentIndex);
        }
      } else if (data[segmentIndex].title === "Checks") {
        setPending(true);
        const check_data = await instance.get(`/check/all/${myCurrentUser}`,{ headers: { "authorization": `${myToken}` } });
        if (check_data.status === 200) {
          setPending(false);
          setMyCurrentTable(segmentIndex);
          setMyTableData(check_data.data);
        }
      } else {
        setPending(true);
        setMyCurrentTable(segmentIndex);
        const my_data = await instance.get(`/cashData/cashdata/${myCurrentUser}`,{ headers: { "authorization": `${myToken}` } });
        setPending(false);
        setMyTableData(my_data.data);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const data = [
    { title: "Card", value: 40, color: "#00d4ff" },
    { title: "Checks", value: 40, color: "#f44f4f" },
    { title: "Cash", value: 40, color: "#5e5d5e" },
  ];

  const myCashCol = [
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "For", selector: (row) => row.for, sortable: true },
  ];

  const myChecksCol = [
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "For", selector: (row) => row.for, sortable: true },
    {
      name: "Check Number ",
      selector: (row) => row.numberofcheck,
      sortable: true,
    },
    { name: "Check Date ", selector: (row) => row.dateofcheck, sortable: true },
  ];

  const myCreditCol = [
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "Payments", selector: (row) => row.payments, sortable: true },
    { name: "For", selector: (row) => row.for, sortable: true },
  ];

  return (
    <Row style={{ marginLeft: "15px" }}>
      <Col sm={4} md={2} style={{ marginTop: "25px", height: "250px" }}>
        <PieChart
          style={{ marginTop: "15px" }}
          onClick={myData}
          animate={true}
          lineWidth={25}
          data={data}
        />
        <div
          style={{
            display: "table",
            borderSpacing: "30px",
            marginLeft: "15px",
          }}
        >
          <div style={{ display: "table-cell" }}>
            <div
              style={{
                height: "20px",
                width: "20px",
                borderRadius: "30px",
                backgroundColor: "#5e5d5e",
                marginLeft: "20px",
              }}
            ></div>
            {MyTotalPayments[0].totalcash}₪
            <div style={{ marginLeft: "10px" }}>Cash</div>
          </div>
          <div style={{ display: "table-cell" }}>
            <div
              style={{
                height: "20px",
                width: "20px",
                borderRadius: "30px",
                backgroundColor: "#f44f4f",
                marginLeft: "20px",
                verticalAlign: "center",
              }}
            ></div>
            {MyTotalPayments[0].totalchecks}₪<div>Checks</div>
          </div>
          <div style={{ display: "table-cell" }}>
            <div
              style={{
                height: "20px",
                width: "20px",
                borderRadius: "30px",
                backgroundColor: "#00d4ff",
                marginLeft: "20px",
              }}
            ></div>
            {MyTotalPayments[0].totalcredit}₪<div>Credit Card</div>
          </div>
        </div>
      </Col>

      <Col sm={1} style={{ marginTop: "100px" }}></Col>
      <Col sm={8} md={8} style={{ marginTop: "35px" }}>
        {myCurrentTable === 0 ? (
          <h1>Credit Card </h1>
        ) : myCurrentTable === 1 ? (
          <h1>Checks </h1>
        ) : (
          <h1>Cash </h1>
        )}

        <DataTable
          columns={
            myCurrentTable === 0
              ? myCreditCol
              : myCurrentTable === 1
              ? myChecksCol
              : myCashCol
          }
          data={myTableData}
          pagination
          progressPending={pending}
          progressComponent={<CustomLoader />}
          defaultSortFieldId={1}
        />
      </Col>
    </Row>
  );
}
export default Reports;
