import React, { useState, useEffect, useMemo } from "react"
import idolMapping from "../../idolMapping.json"
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5,
                    retryDelay: axiosRetry.exponentialDelay,
                    retryCondition: (error) => {
                      return error.response.status === 429
                    }});

export default function IdolTable(props) {

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

        const parseScoreData = (result) => {
            let score, velocity = 0;
            if (result) {
                let scoreArray = result.data;
                score = scoreArray[scoreArray.length - 1].score;
                if (scoreArray.length > 48) {
                    velocity = score - scoreArray[scoreArray.length - 49].score;
                } else {
                    velocity = score;
                }
            }

            return  [score, velocity];
        }

        useEffect(() => {
            let baseUrl = "https://api.matsurihi.me/mltd/v1/events/241/rankings/logs/idolPoint/"
            let query = "/1,10,100,1000";
            async function fetchData(id) {
                let request = baseUrl + id + query;
                const response = await axios.get(request).catch((error) => {console.log(error);});
                return response.data;
            };

            async function fetchAll() {
                for (let i = 1; i <= 52; i++) {
                    const result = await fetchData(i);
                    let first, firstVelocity, ten, tenVelocity, hundred, hundredVelocity, thousand, thousandVelocity = 0;

                    [first, firstVelocity] = parseScoreData(result[0]);

                    [ten, tenVelocity] = parseScoreData(result[1]);

                    [hundred, hundredVelocity] = parseScoreData(result[2]);

                    [thousand, thousandVelocity] = parseScoreData(result[3]);

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
                            <td>
                                <span className="big-font">
                                    {index + 1}
                                </span>
                            </td>
                            <td>
                                <span className="big-font">
                                    {idol.name}
                                </span>
                            </td>
                            <td>
                                <span className="emphasis-font">
                                    {idol.first.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.firstVelocity.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="emphasis-font">
                                    {idol.ten.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.tenVelocity.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="emphasis-font">
                                    {idol.hundred.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font">
                                    (+{idol.hundredVelocity.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="emphasis-font">
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