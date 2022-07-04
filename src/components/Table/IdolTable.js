import React, { useState, useEffect } from "react"
import idolMapping from "../../idolMapping.json"
import axios from 'axios';
import styled from "styled-components"
import IdolTableRow from "./IdolTableRow"

export default function IdolTable(props) {

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        const results = [];
        const initialIdolState = [];

        for (let i = 1; i <= 52; i++) {
            const newIdol = {
                id: i,
                name: idolMapping[i],
                first: 0,
                hundred: 0,
                thousand: 0
            };
            initialIdolState.push(newIdol);
        }

        const [idols, setIdols] = useState(initialIdolState);

    useEffect(() => {
        let baseUrl = "https://api.matsurihi.me/mltd/v1/events/241/rankings/logs/idolPoint/"
        let query = "/1,100,1000";
        let results = [];
        async function fetchData(id) {
            let request = baseUrl + id + query;
            axios.get(request).then((result) => {
                results.push(result);
            }).catch((error) => {console.log(error);});
            await sleep(200);
        };

        async function fetchAll() {
          for (let i = 1; i <= 52; i++) {
            await fetchData(i);
          }
        }


        async function build() {
            await fetchAll();
            for (let i = 0; i < 52; i++) {
                let first,hundred, thousand = 0;
                if (results[i].data[0]) {
                    first = results[i].data[0].data[results[i].data[0].data.length - 1].score;
                }

                if (results[i].data[1]) {
                    hundred = results[i].data[1].data[results[i].data[1].data.length - 1].score;
                }

                if (results[i].data[2]) {
                    thousand = results[i].data[2].data[results[i].data[2].data.length - 1].score;
                }

                setIdols(current =>
                  current.map(obj => {
                    if (obj.id === i + 1) {
                      return {...obj, first : first, hundred: hundred, thousand: thousand };
                    }

                    return obj;
                  }),
                );
            }

            console.log(idols);
        }

        build();
    },[]);



       return (
           <table className="table">
             <TableHeader />
               <tbody>
               {(() => {
                   const tableRows = [];
                   for (let i = 0; i < 52; i++) {
                     tableRows.push(<IdolTableRow idolName={idols[i].name} idolFirst={idols[i].first}
                        idolHundred={idols[i].hundred} idolThousand={idols[i].thousand}/>);
                   }
                   return tableRows;
               })()}
               </tbody>
           </table>
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