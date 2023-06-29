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
                firstVelocityPerDay: 0,
                ten: 0,
                tenVelocityPerDay: 0,
                hundred: 0,
                hundredVelocityPerDay: 0,
                hundredVelocityPerHour: 0,
                hundredVelocityPerHalfHour: 0,
                thousand: 0,
                thousandVelocityPerDay: 0,
                thousandVelocityPerHour: 0,
                thousandVelocityPerHalfHour: 0
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
            let score = 0, velocityPerDay = 0, velocityPerHalfHour = 0, velocityPerHour = 0;
            console.log(result);
            if (result) {
                let scoreArray = result.data;
                if (scoreArray.length > 0) {
                    score = scoreArray[scoreArray.length - 1].score;

                    if (scoreArray.length > 48) {
                        velocityPerDay = score - scoreArray[scoreArray.length - 49].score;
                    } else {
                        velocityPerDay = score;
                    }

                    if (scoreArray.length > 1) {
                        velocityPerHalfHour = score - scoreArray[scoreArray.length - 2].score;
                    } else {
                        velocityPerHalfHour = score;
                    }

                    if (scoreArray.length > 2) {
                        velocityPerHour = score - scoreArray[scoreArray.length - 3].score;
                    } else {
                        velocityPerHour = score;
                    }
                }
            }

            return  [score, velocityPerDay, velocityPerHalfHour, velocityPerHour];
        }

        useEffect(() => {
            let baseUrl = "https://api.matsurihi.me/api/mltd/v2/events/290/rankings/idolPoint/"
            let query = "/logs/1,10,100,1000";
            async function fetchData(id) {
                let request = baseUrl + id + query;
                const response = await axios.get(request).catch((error) => {console.log(error);});
                return response.data;
            };

            async function fetchAll() {
                for (let i = 1; i <= 52; i++) {
                    const result = await fetchData(i);
                    let first, firstVelocityPerDay, ten, tenVelocityPerDay,
                    hundred,hundredVelocityPerDay, hundredVelocityPerHalfHour, hundredVelocityPerHour,
                    thousand, thousandVelocityPerDay, thousandVelocityPerHalfHour, thousandVelocityPerHour;

                    [first, firstVelocityPerDay] = parseScoreData(result[0]);

                    [ten, tenVelocityPerDay] = parseScoreData(result[1]);

                    [hundred, hundredVelocityPerDay, hundredVelocityPerHalfHour, hundredVelocityPerHour] = parseScoreData(result[2]);

                    [thousand, thousandVelocityPerDay, thousandVelocityPerHalfHour, thousandVelocityPerHour] = parseScoreData(result[3]);

                    setIdols(current =>
                        current.map(obj => {
                            if (obj.id === i ) {
                                return {...obj,
                                    first : first,
                                    firstVelocityPerDay: firstVelocityPerDay,
                                    ten: ten,
                                    tenVelocityPerDay: tenVelocityPerDay,
                                    hundred: hundred,
                                    hundredVelocityPerDay: hundredVelocityPerDay,
                                    hundredVelocityPerHalfHour: hundredVelocityPerHalfHour,
                                    hundredVelocityPerHour: hundredVelocityPerHour,
                                    thousand: thousand,
                                    thousandVelocityPerDay: thousandVelocityPerDay,
                                    thousandVelocityPerHalfHour: thousandVelocityPerHalfHour,
                                    thousandVelocityPerHour: thousandVelocityPerHour
                                };
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
                        <th onClick={() => requestSort('hundredVelocityPerHalfHour')} className={getClassNamesFor('hundredVelocityPerHalfHour')}>
                            -30m
                        </th>
                        <th onClick={() => requestSort('hundredVelocityPerHour')} className={getClassNamesFor('hundredVelocityPerHour')}>
                            -1h
                        </th>
                        <th onClick={() => requestSort('thousand')} className={getClassNamesFor('thousand')}>
                            1000位
                        </th>
                        <th onClick={() => requestSort('thousandVelocityPerHalfHour')} className={getClassNamesFor('thousandVelocityPerHalfHour')}>
                            -30m
                        </th>
                        <th onClick={() => requestSort('thousandVelocityPerHour')} className={getClassNamesFor('thousandVelocityPerHour')}>
                            -1h
                        </th>
                    </tr>
               </thead>
               <tbody>
                    {items.map((idol, index)=> (
                        <tr key={idol.id}>
                            <td className="right-border">
                                <span className="big-font">
                                    {index + 1}
                                </span>
                            </td>
                            <td className="right-border name-column">
                                <span className="big-font">
                                    {idol.name}
                                </span>
                            </td>
                            <td className="right-border">
                                <span className="emphasis-font">
                                    {idol.first.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font velocity-font">
                                    (+{idol.firstVelocityPerDay.toLocaleString()})
                                </span>
                            </td>
                            <td className="right-border">
                                <span className="emphasis-font">
                                    {idol.ten.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font velocity-font">
                                    (+{idol.tenVelocityPerDay.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="emphasis-font">
                                    {idol.hundred.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font velocity-font">
                                    (+{idol.hundredVelocityPerDay.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="velocity-font">
                                    (+{idol.hundredVelocityPerHalfHour.toLocaleString()})
                                </span>
                            </td>
                            <td className="right-border">
                                <span className="velocity-font">
                                    (+{idol.hundredVelocityPerHour.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="emphasis-font">
                                    {idol.thousand.toLocaleString()}
                                </span>
                                <br />
                                <span className="small-font velocity-font">
                                    (+{idol.thousandVelocityPerDay.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="velocity-font">
                                    (+{idol.thousandVelocityPerHalfHour.toLocaleString()})
                                </span>
                            </td>
                            <td>
                                <span className="velocity-font">
                                    (+{idol.thousandVelocityPerHour.toLocaleString()})
                                </span>
                            </td>
                        </tr>
                    ))}
               </tbody>
           </table>
       )
}