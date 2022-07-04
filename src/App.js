import './App.css';
import IdolTable from "./components/Table/IdolTable";
import React from "react"

function App() {
  return (
    <div className="table_container">
        <h1 className="text-cetner">灭了同担五周年排行榜</h1>
        <h3 className="text-cetner">由于matsurihi.me有访问限制，初次读取大约需要20-30秒</h3>
        <h3 className="text-cetner">点击表格列的标题可按该列排序</h3>
        <IdolTable />
    </div>
  );
}

export default App;
