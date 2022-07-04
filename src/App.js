import logo from './logo.svg';
import './App.css';
import IdolTable from "./components/Table/IdolTable";
import React, { Component } from "react"

function App() {
  return (
    <div className="table_container">
        <h1>Sortable table with React</h1>
        <IdolTable />
    </div>
  );
}

export default App;
