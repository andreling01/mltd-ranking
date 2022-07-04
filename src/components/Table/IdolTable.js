import React, { useState, useEffect } from "react"
import idolMapping from "../../idolMapping.json"
import axios from 'axios';
import styled from "styled-components"
import IdolTableRow from "./IdolTableRow"

export default function IdolTable(props) {


    useEffect(() => {
        const results = [];
        for (let i = 1; i <= 52; i++) {
            const fn = async () => {
                let baseUrl = "https://api.matsurihi.me/mltd/v1/events/241/rankings/logs/idolPoint/" + i;
                let request = baseUrl + "/1,100,1000";
                let res = await axios.get(request, {});
                results.push(res);
            }
            fn();
        }

//        Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
//            (data) => {
//              console.log(data);
//
////              const responseOne = data[0];
////              const responseHundred = data[1];
////              const responseThousand = data[2];
////              idols[i] = Object.assign({}, newIdol)
////              idols[i].id = i;
////              idols[i].first = responseOne.data[0].data[responseOne.data[0].data.length - 1].score;
////              idols[i].hundred = responseHundred.data[0].data[responseHundred.data[0].data.length - 1].score;
////              idols[i].thousand = responseThousand.data[0].data[responseThousand.data[0].data.length - 1].score;
//            },
//        );

    },[]);


       return (
            "template"
//           <table className="table">
//             <TableHeader />
//               <tbody>
////               {(() => {
////                   const tableRows = [];
////                   for (let i = 1; i <= 52; i++) {
//////                     tableRows.push(<IdolTableRow idol={idols[i]} />);
////                        tableRows.push(idols[i]);
////                   }
////                   return tableRows;
////               })()}
//               </tbody>
//           </table>
       )
}

const TableHeader = () =>
  <thead>
   <tr>
    <th>名字</th>
    <th>1位</th>
    <th>100位</th>
    <th>1000位</th>
    </tr>
  </thead>