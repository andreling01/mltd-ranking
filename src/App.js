import './App.css';
import IdolTable from "./components/Table/IdolTable";
import React from "react"

function App() {
  return (
    <div className="table_container">
        <h1 className="text-center">灭了同担五周年排行榜</h1>
        <h3 className="text-center">由于matsurihi.me有访问限制，初次读取大约需要20-30秒</h3>
        <h3 className="text-center">点击表格列的标题可按该列排序</h3>
        <h4 className="text-center">括号内为过去24h的增速</h4>
        <h4 className="text-center">数据读取自<a href="https://api.matsurihi.me/">api.matsurihi.me</a></h4>

        <IdolTable />
    </div>
  );
}

export default App;
