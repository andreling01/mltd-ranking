import { useState } from "react";
import idolData from "../../idol.json"
import TableBody from "./TableBody";
import TableHead from "./TableHead";

const Table = () => {
 const [tableData, setTableData] = useState(idolData);
// const [idolData, setIdolData] = useState(idolData);

 const columns = [
  { label: "名字", accessor: "full_name" },
  { label: "1位", accessor: "first" },
//  { label: "100位", accessor: "hundred" },
//  { label: "1000位", accessor: "thousand" },
 ];

 return (
  <>
   <table className="table">
    <TableHead columns={columns} />
    <TableBody columns={columns} tableData={tableData} />
   </table>
  </>
 );
};

export default Table;