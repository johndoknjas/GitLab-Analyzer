import "../App.css"
import React,{ Component } from "react";
import DropDownMenuMerge from "../components/DropDownMenuMerge";


class MergeRequest extends Component{

    constructor(props){
        super(props);
        this.state={
            developers: []
        };
    }

    async getListOfDevs(){
        var str = window.location.pathname;
        var repNum = str.split("/")[2];
        let url2 = '/getprojectmembers/' + repNum
        const result = await fetch(url2, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        var resp;
        resp = result.json();
        var listOfDevelopers = await resp;
        await sessionStorage.setItem("Developers" + repNum, JSON.stringify(listOfDevelopers));
    }

    async componentDidMount() {
        var str = window.location.pathname;
        var repNum = str.split("/")[2];

        if(sessionStorage.getItem("Developers" + repNum) == null) {
            await this.getListOfDevs()
        }
        await this.setState({developers:JSON.parse(sessionStorage.getItem("Developers" + repNum))})
    }

    render() {

        var strDevelopers = JSON.stringify(this.state.developers);
        var developersArray = JSON.parse(strDevelopers)

        return(
            <div classname='CodeDiff'>
                <DropDownMenuMerge listOfDevelopers = {developersArray}/>

            </div>
        )
    }
}

export default MergeRequest;
