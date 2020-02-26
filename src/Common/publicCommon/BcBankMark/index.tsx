import React from 'react'
import './style.scss'
import { imgSrc } from "Common/config/index";

interface IProps {
    logo:string,
    name:string
}
export default (props:IProps) => {
    return (
        <div className="bank-box">
            <div>
                <img src={imgSrc + props.logo} alt=""/>
            </div>
            {props.name}
        </div>
    )
}
