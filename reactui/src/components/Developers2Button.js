import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class Developers2Button extends Component{
    constructor(props){
        super(props);
        this.state={
            data: [],
            developerNames: [],
            submitted: false
        };
    }

    async componentDidMount() {
       await this.getDataFromBackend();
    }

    async getDataFromBackend(){
        var str = window.location.pathname;
        var repNum = str.split("/")[2];
        let url2 = '/getprojectmembers/' + repNum
        await fetch(url2, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((result)=> {
            result.json().then((resp) => {
                this.setState({data:resp , developerNames:JSON.parse(JSON.stringify(resp))})
                sessionStorage.setItem("Developers", JSON.stringify(this.state.data))
            })
        })
    }

    sentBackNamesOfDevelopers() {
        var arr = [];
       // arr.push(sessionStorage.getItem("DeveloperNames"))
        console.log(this.state.developerNames)

        const result = fetch("http://localhost:8090/api/v1/testnames", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.developerNames),
        })
    }

    handleChange = (item) => (event) => {
        event.preventDefault();
        var tempDevNames = this.state.developerNames;
        var tempDevUsernames = JSON.parse(JSON.stringify(this.state.data));

        for(var i = 0; i < tempDevUsernames.length; i++){
            if(tempDevUsernames[i] === item){
                if(event.target.value != "") {
                    tempDevNames[i] = event.target.value;
                }else{
                    tempDevNames[i] = item;
                }
            }
        }
        this.setState({davelopernames: tempDevNames})
        //sessionStorage.setItem("DeveloperNames", tempDevNames)

    }

    render(){
        var data = JSON.stringify(this.state.data);
        var DataArray = JSON.parse(data)

        return(

            <ul>
                <header></header>
                {DataArray.map(item => {
                    return <li>
                        <a href= {"Developers/" + item }target= "_blank">
                            <Button className="Footer" to={item.url}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sessionStorage.setItem("CurrentDeveloper", item)
                                        this.sentBackNamesOfDevelopers()

                                        //window.location.href=  window.location.pathname + '/' + item + "/summary";
                                    }}>
                                <span >{item}</span>
                            </Button>
                        </a>
                        <input className="TextBox"
                               type="text"
                               placeholder= {item + '\'s name'}
                               onChange={this.handleChange(item)}  />
                    </li>;
                })}
            </ul>
        );

    }
}

export default Developers2Button;
