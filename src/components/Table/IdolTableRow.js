import React, { useState, useEffect } from "react";
import axios from 'axios';
import idolMapping from "../../idolMapping.json";
import styled from "styled-components";
import PropTypes from "prop-types";


export default function IdolTableRow(props) {

    return (
        <tr>
            <td>
                {props.idolName}
            </td>
            <td>
                {props.idolFirst}
            </td>
            <td>
                {props.idolHundred}
            </td>
            <td>
                {props.idolThousand}
            </td>
        </tr>
    )

}

IdolTableRow.propTypes = {
    idolName: PropTypes.string,
    idolFirst: PropTypes.string,
    idolHundred: PropTypes.string,
    idolThousand: PropTypes.string,

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


