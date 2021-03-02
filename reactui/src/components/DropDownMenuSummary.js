import React, {Component} from 'react'
import {useState} from 'react'
import Select from 'react-select'
import SummaryScoreTable from "./SummaryScoreTable";
import Navbar_Developers from "./Navbar_Developers";
import './DropDownMenu.css';
import SummaryChartRadios from "./RadioButtonSummaryChart";
import DateRangeSummary from './DateRangeSummary'


function DropDownMenuSummary ({listOfDevelopers}) {

    const devArray = [];

    listOfDevelopers.map(item => {devArray.push({label: item, value: item})})

    const pathArray = window.location.pathname.split('/');

    const[selectedValue, setSelectedValue] = useState(pathArray[4]);
    console.log("selectedval", selectedValue)

    const handleChange = obj => {
        setSelectedValue(obj.label);
        sessionStorage.setItem("CurrentDeveloper", obj.label)
    }

    return (
        <div>
            <div>
                <Navbar_Developers devName = {selectedValue}/>
                <h1 style={{textAlign: 'center'}}>{selectedValue} Summary</h1>

                <br>
                </br>
                <div className="DropDownMenu">
                <Select
                    options={devArray}
                    defaultValue={{label: selectedValue, value: selectedValue}}
                    onChange={handleChange}
                />
                </div>
            </div>
            <div>
                <br>
            </br>
                <DateRangeSummary devName = {selectedValue}/>

            </div>

        </div>
    )
}

export default DropDownMenuSummary;

