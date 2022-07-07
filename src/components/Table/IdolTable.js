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
                firstVelocity: 0,
                ten: 0,
                tenVelocity: 0,
                hundred: 0,
                hundredVelocity: 0,
                thousand: 0,
                thousandVelocity: 0
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

            return { items: sortedItems, requestSort, sortConfig };
        }

        const { items, requestSort, sortConfig } = useSortableData(idols);

        const getClassNamesFor = (name) => {
            if (!sortConfig) {
                return;
            }
            return sortConfig.key === name ? sortConfig.direction : undefined;
        };


        useEffect(() => {
            let baseUrl = "https://api.matsurihi.me/mltd/v1/events/241/rankings/logs/idolPoint/"
            let query = "/1,10,100,1000";
            async function fetchData(id) {
                let request = baseUrl + id + query;
                const response = await axios.get(request).catch((error) => {console.log(error);});
                await sleep(200);
                return response.data;
            };

            async function fetchAll() {
                for (let i = 1; i <= 52; i++) {
                    const result = await fetchData(i);
                    let first, firstVelocity, ten, tenVelocity, hundred, hundredVelocity, thousand, thousandVelocity = 0;
                    if (result[0]) {
                        first = result[0].data[result[0].data.length - 1].score;
                        if (result[0].data.length > 48) {
                            firstVelocity = result[0].data[result[0].data.length - 1].score - result[0].data[result[0].data.length - 49].score;
                        } else {
                            firstVelocity = result[0].data[result[0].data.length - 1].score;
                        }
                    }

                    if (result[1]) {
                        ten = result[1].data[result[1].data.length - 1].score;
                        if (result[1].data.length > 48) {
                            tenVelocity = result[1].data[result[1].data.length - 1].score - result[1].data[result[1].data.length - 49].score;
                        } else {
                            tenVelocity = result[1].data[result[1].data.length - 1].score;
                        }
                    }

                    if (result[2]) {
                        hundred = result[2].data[result[2].data.length - 1].score;
                        if (result[2].data.length > 48) {
                            hundredVelocity = result[2].data[result[2].data.length - 1].score - result[2].data[result[2].data.length - 49].score;
                        } else {
                            hundredVelocity = result[2].data[result[2].data.length - 1].score;
                        }
                    }

                    if (result[3]) {
                        thousand = result[3].data[result[3].data.length - 1].score;
                        if (result[3].data.length > 48) {
                            thousandVelocity = result[3].data[result[3].data.length - 1].score - result[3].data[result[3].data.length - 49].score;
                        } else {
                            thousandVelocity = result[3].data[result[3].data.length - 1].score;
                        }
                    }

                    setIdols(current =>
                        current.map(obj => {
                            if (obj.id === i ) {
                                return {...obj, first : first, firstVelocity: firstVelocity,
                                ten: ten, tenVelocity: tenVelocity, hundred: hundred, hundredVelocity: hundredVelocity,
                                thousand: thousand, thousandVelocity: thousandVelocity };
                            }
                            return obj;
                        }),
                    );
                }
            }

            fetchAll();
        },[]);



       return (
           <table className="table">
               <caption>数据读取自<a href="https://api.matsurihi.me/">api.matsurihi.me</a></caption>
               <thead>
                    <tr>
                        <th>
                            顺位
                        </th>
                        <th onClick={() => requestSort('id')} className={getClassNamesFor('id')}>
                            姓名
                        </th>
                        <th onClick={() => requestSort('first')} className={getClassNamesFor('first')}>
                            1位
                        </th>
                        <th onClick={() => requestSort('ten')} className={getClassNamesFor('ten')}>
                            10位
                        </th>
                        <th onClick={() => requestSort('hundred')} className={getClassNamesFor('hundred')}>
                            100位
                        </th>
                        <th onClick={() => requestSort('thousand')} className={getClassNamesFor('thousand')}>
                            1000位
                        </th>
                    </tr>
               </thead>
               <tbody>
                    {items.map((idol, index)=> (
                        <tr key={idol.id}>
                            <td>{index + 1}</td>
                            <td>{idol.name}</td>
                            <td>
                                <span>
                                    {idol.first.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.firstVelocity.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span>
                                    {idol.ten.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.tenVelocity.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span>
                                    {idol.hundred.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.hundredVelocity.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span>
                                    {idol.thousand.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.thousandVelocity.toLocaleString()})
                                </span>
                            </td>
                        </tr>
                    ))}
               </tbody>
           </table>
       )
}