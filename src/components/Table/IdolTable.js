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
                ten: 0,
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
                    let first, ten, hundred, thousand = 0;
                    if (result[0]) {
                        first = result[0].data[result[0].data.length - 1].score;
                    }

                    if (result[1]) {
                        ten = result[1].data[result[1].data.length - 1].score;
                    }

                    if (result[2]) {
                        hundred = result[2].data[result[2].data.length - 1].score;
                    }

                    if (result[3]) {
                        thousand = result[3].data[result[3].data.length - 1].score;
                    }

                    setIdols(current =>
                        current.map(obj => {
                            if (obj.id === i ) {
                                return {...obj, first : first, ten: ten, hundred: hundred, thousand: thousand };
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
                        <th onClick={() => requestSort('id')}>
                            姓名
                        </th>
                        <th onClick={() => requestSort('first')}>
                            1位
                        </th>
                        <th onClick={() => requestSort('ten')}>
                            10位
                        </th>
                        <th onClick={() => requestSort('hundred')}>
                            100位
                        </th>
                        <th onClick={() => requestSort('thousand')}>
                            1000位
                        </th>
                    </tr>
               </thead>
               <tbody>
                    {items.map((idol, index)=> (
                        <tr key={idol.id}>
                            <td>{index + 1}</td>
                            <td>{idol.name}</td>
                            <td>{idol.first.toLocaleString()}</td>
                            <td>{idol.ten.toLocaleString()}</td>
                            <td>{idol.hundred.toLocaleString()}</td>
                            <td>{idol.thousand.toLocaleString()}</td>
                        </tr>
                    ))}
               </tbody>
           </table>
       )
}