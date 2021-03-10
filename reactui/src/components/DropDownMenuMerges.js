import React, {Component} from 'react'
import {useState} from 'react'
import Select from 'react-select'
import Navbar_Developers from "./Navbar_Developers";
import './DropDownMenu.css';
import MergeListTable from "./MergeRequest/MergeListTable";

function DropDownMenuMerge ({listOfDevelopers}) {

    const devArray = [];
    listOfDevelopers.map(item => {
        devArray.push({label: item, value: item})
    })

    const pathArray = window.location.pathname.split('/');

    const [selectedValue, setSelectedValue] = useState(
        pathArray[4]
    );

    const handleChange = obj => {
        setSelectedValue(obj.label);
        sessionStorage.setItem("CurrentDeveloper", obj.label);
    }

    return (

        <div classname='CodeDiff'>
            <Navbar_Developers devName = {sessionStorage.getItem("CurrentDeveloper")}/>
            <br>
            </br>
            <div className="DropDownMenu">

            <Select
                options={devArray}
                defaultValue={{ label: selectedValue, value: selectedValue }}
                onChange={handleChange}/>
            </div>
            <br>
            </br>
            <h1 style={{textAlign: 'center'}}>Merge Requests</h1>
            <br></br>

            <MergeListTable  devName = {selectedValue}/>
        </div>
    )


}

export default DropDownMenuMerge;