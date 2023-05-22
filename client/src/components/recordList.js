import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Record = (props) => {
  return (
    <tr>
      <td>{props.record.name}</td>
      <td>{props.record.position}</td>
      <td>{props.record.level}</td>
      <td>
        <Link className="btn btn-link" to={`/edit/${props.record._id}`}>
          Edit
        </Link>{" "}
        |
        <button
          className="btn btn-link"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // This method fetches the records from the database.
  useEffect(() => {
    console.log("before api triggering");
    async function getRecords() {
      console.log("inside api triggering but before await");
      const response = await fetch(`http://localhost:5000/record/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("token"),
        },
      });
      console.log("inside api triggering but after await");

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        // window.alert(message);
        navigate("/login");
      }

      const records = await response.json();
      setRecords(records);
    }

    getRecords();
    console.log("after api triggering");
    return;
  }, [records.length, navigate]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("token"),
      },
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>Record List</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th
              onClick={() => {
                setLoading(!loading);
              }}
            >
              Name
            </th>
            <th>Position</th>
            <th>Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );
}
