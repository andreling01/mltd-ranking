import React, { useState, useEffect, useMemo } from "react"
import idolMapping from "../../idolMapping.json"
import axios from 'axios';

export default function IdolTable(props) {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

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

        const useSortableData = (items, config = null) => {
            const [sortConfig, setSortConfig] = useState(config);

            const sortedItems = useMemo(() => {
                let sortableItems = [...items];
                if (sortConfig !== null) {
                    sortableItems.sort((a, b) => {
                        if (a[sortConfig.key] < b[sortConfig.key]) {
                            return sortConfig.direction === 'ascending' ? -1 : 1;
                        }
                        if (a[sortConfig.key] > b[sortConfig.key]) {
                            return sortConfig.direction === 'ascending' ? 1 : -1;
                        }
                        return 0;
                    });
                }
                return sortableItems;
            }, [items, sortConfig]);

            const requestSort = key => {
                let direction = 'ascending';
                if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
                direction = 'descending';
                }
                setSortConfig({ key, direction });
            }

            return { items: sortedItems, requestSort };
        }

        const { items, requestSort } = useSortableData(idols);


        useEffect(() => {
            let baseUrl = "https://api.matsurihi.me/mltd/v1/events/241/rankings/logs/idolPoint/"
            let query = "/1,100,1000";
            let results = [];
            async function fetchData(id) {
                let request = baseUrl + id + query;
                axios.get(request).then((result) => {
                    results.push(result);
                }).catch((error) => {console.log(error);});
                await sleep(250);
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
               <caption>数据读取自<a href="https://api.matsurihi.me/">api.matsurihi.me</a></caption>
               <thead>
                    <tr>
                        <th>
                            顺位
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('id')}>
                                名字
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('first')}>
                               1位
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('hundred')}>
                               100位
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('thousand')}>
                               1000位
                            </button>
                        </th>
                    </tr>
               </thead>
               <tbody>
                    {items.map((idol, index)=> (
                        <tr key={idol.id}>
                            <td>{index + 1}</td>
                            <td>{idol.name}</td>
                            <td>{idol.first}</td>
                            <td>{idol.hundred}</td>
                            <td>{idol.thousand}</td>
                        </tr>
                    ))}
               </tbody>
           </table>
       )
}