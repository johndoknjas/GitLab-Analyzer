import React, {useState} from 'react'
import Select from 'react-select'
import Navbar_Developers from "../NavBars_Menu/Navbar_Developers";
import CustomizedRadios from "../Comment/RadioButtonComment";
import CommentTable from "../Comment/CommentTable";
import './DropDownMenu.css';

function DropDownMenuComments ({listOfDevelopers}) {

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

        <div>
            <Navbar_Developers devName = {selectedValue}/>
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
            <h1 style={{textAlign:'center'}}>Comment Contribution</h1>
            <br></br>
            <h4 style={{textAlign:'center'}}>Top 10 comments </h4>

            {/*<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>*/}
            {/*    <CustomizedRadios/>*/}
            {/*</div>*/}
            <br></br>

            <CommentTable devName = {selectedValue}/>

        </div>
    )
}

export default DropDownMenuComments;