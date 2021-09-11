import MaterialTable from "material-table";
import {useEffect, useState } from "react";
import styles from "./MakeAnotherTable.module.css";

const MakeAnotherTable = (props) => {
  const [tableData, setTableData] = useState();
  const url = "http://localhost:3000/users";
  //fetch all data from db
  const getData = async () => {
    try {
      const response = await fetch(`${url}`);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      //console.log(data);
      setTableData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //add new row data to db
  const addData = async (newData) => {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newData),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  };

  //update data on db
  const updateData = async (newData, id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Unable to Update Data!");
      }

      const data = response.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  //delete data from db
  const deleteData = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Unable to delete data. Please try again!!1");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "name",
      field: "name",
      validate: (rowData) =>
        rowData.name === "" || rowData.name === undefined ? "Required" : true,
    },
    {
      title: "username",
      field: "username",
      validate: (rowData) =>
        rowData.username === "" || rowData.username === undefined
          ? "Required"
          : true,
    },
    {
      title: "email",
      field: "email",
      validate: (rowData) =>
        rowData.email === "" || rowData.email === undefined ? "Required" : true,
    },
    {
      title: "phone",
      field: "phone",
      validate: (rowData) =>
        rowData.phone === "" || rowData.phone === undefined ? "Required" : true,
    },
    {
      title: "website",
      field: "website",
      validate: (rowData) =>
        rowData.website === "" || rowData.website === undefined
          ? "Required"
          : true,
    },
  ];

  return (
    <div className={styles.container}>
      <MaterialTable
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              addData(newData)
                .then((data) => {
                  getData();
                  resolve();
                })
                .catch((err) => err);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              updateData(newData, oldData.id)
                .then((data) => {
                  //console.log(data);
                  getData();
                  resolve();
                })
                .catch((err) => err);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              deleteData(oldData.id)
                .then((data) => {
                  //console.log(data);
                  getData();
                  resolve();
                })
                .catch((err) => err);
            }),
        }}
        columns={columns}
        data={tableData}
        title="User Details"
        options={{
          showFirstLastPageButtons: false,
          addRowPosition: "first",
          actionsColumnIndex: -1,
          rowStyle:{
            backgroundColor: "#334551",
            color: "#ffffff",
          },
          headerStyle: {
            background: "#424242",
            'fontWeight':'bolder',
            color : '#ffffff',
            textTransform: "uppercase"
          },
          padding:'dense'
        }}

        style={{
          background: "cornflowerblue",
          color: "#ffffff",
        }}
      />
    </div>
  );
};

export default MakeAnotherTable;
