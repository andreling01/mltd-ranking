import logo from './logo.svg';
import './App.css';
import IdolTable from "./components/Table/IdolTable";
import React, { Component } from "react"

function App() {
  return (
    <div className="table_container">
        <h1>灭了同担五周年排行榜</h1>
        <h3>由于matsurihi.me有访问限制，初次读取大约需要10-20秒</h3>
        <h3>点击表格列的标题可按该列排序</h3>
        <IdolTable />
    </div>
  );
}

export default App;
