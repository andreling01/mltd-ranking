import React, { useState, useEffect } from "react";
import axios from 'axios';
import idolMapping from "../../idolMapping.json";
import styled from "styled-components";
import PropTypes from "prop-types";


export default function IdolTableRow(props) {
    const [first, setFirst] = useState(0);
    const [hundred, setHundred] = useState(0);
    const [thousand, setThousand] = useState(0);

    useEffect(() => {
        let baseUrl = "https://api.matsurihi.me/mltd/v1/events/241/rankings/logs/idolPoint/" + props.id;
        let requestOne = baseUrl + "/1";
        let requestHundred = baseUrl + "/100";
        let requestThousand = baseUrl + "/1000";

        let endpoints = [requestOne, requestHundred, requestThousand];

        axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
          (data) => {
            console.log(data);
            const responseOne = data[0];
            const responseHundred = data[1];
            const responseThousand = data[2];

            setFirst(responseOne.data[0].data[responseOne.data[0].data.length - 1].score);
            setHundred(responseHundred.data[0].data[responseHundred.data[0].data.length - 1].score);
            setThousand(responseThousand.data[0].data[responseThousand.data[0].data.length - 1].score);
          },
        );
    },[]);


    return (
        <tr>
            <td>
                {idolMapping[props.idol.id]}
            </td>
            <td>
                {props.idol.first}
            </td>
            <td>
                {props.idol.hundred}
            </td>
            <td>
                {props.idol.thousand}
            </td>
        </tr>
    )

}

IdolTableRow.propTypes = {
    idol:PropTypes.shape.isRequired,
};


const Tr = styled.div`
  display: flex;
  flex-direction: row;
`
const TdPosName = styled.div`
  padding: .5em;
  border-bottom: solid #360037 1px;
`

const TdNumber = styled.div`
  box-sizing: content-box;
  padding: .5em;
  width: 2em;
  border: solid #360037 1px;
  border-top: 0;
  border-right: 0;
`


