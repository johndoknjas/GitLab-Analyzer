import React, {Component, PureComponent} from 'react';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import axios from "axios";
import * as d3 from "d3-time";
import moment from "moment";


export default class CommentChart extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            commentScore: [],
            parentdata: this.props.devName,
            startTime: this.props.startTime,
            endTime: this.props.endTime
        }
    }

    componentDidMount(){
        const {parentdata} = this.state;
        this.getDataFromBackend(parentdata, this.props.startTime,  this.props.endTime )
    }

    getDataFromBackend (username, startTm, endTm) {
        var pathArray = window.location.pathname.split('/');
        var id = pathArray[2];

        //response ref: http://localhost:8090/api/v1/projects/6/allUserNotes/arahilin/2021-01-01/2021-02-22
        axios.get("/api/v1/projects/" + id + "/allUserNotes/"+ username + '/' +
            startTm + '/' +
            endTm)
            .then(response => {
                const commentInfo = response.data
                this.setState({commentScore: commentInfo})//{date: commentInfo.created_at, wordCount: commentInfo.wordCount }})
                console.log(this.state.commentScore)
            }).catch((error) => {
            console.error(error);
        });
    }

    componentDidUpdate(prevProps){
        if(this.props.devName !== prevProps.devName){
            this.setState({parentdata: this.props.devName});
            this.getDataFromBackend(this.props.devName, this.props.startTime,this.props.endTime )
        }
        if(this.props.startTime !== prevProps.startTime){
            this.setState({startTime: this.props.startTime});
            this.getDataFromBackend(this.props.devName, this.props.startTime,this.props.endTime )
        }
        if(this.props.endTime !== prevProps.endTime){
            this.setState({endTime: this.props.endTime});
            this.getDataFromBackend(this.props.devName, this.props.startTime,this.props.endTime)
        }
    }

    render() {
        const output = this.state.commentScore.map(function(item) {
            return {
                date: (new Date(item.created_at)).getTime(),
                wordCount: item.wordCount
            };
        });
        console.log(output);
        const from = Number(new Date( this.props.startTime));
        const to = Number(new Date(this.props.endTime));
//floor
        return (
            <div>
                <ResponsiveContainer width = '100%' height = {500} >
                    <BarChart
                        data={output}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5,}}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey= "date"
                               type = "number"
                               name = 'date'
                               domain={[
                                   d3.timeDay.ceil(from).getTime(),
                                   d3.timeDay.ceil(to).getTime()
                               ]}
                               tickFormatter = {(unixTime) => moment(unixTime).format('YYYY-MM-DD')}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="wordCount" stackId="a" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}