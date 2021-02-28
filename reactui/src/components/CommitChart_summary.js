import React, { PureComponent } from 'react';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import axios from "axios";
import * as d3 from "d3-time";
import moment from 'moment'
import ProjectService from "../Service/ProjectService";

//'https://jsfiddle.net/alidingling/90v76x08/']
export default class CommitChart_summary extends PureComponent {

    constructor() {
        super();
        this.state = {
            frequency:[]
        }
    }

    componentDidMount(){
        var pathArray = window.location.pathname.split('/');
        var id = pathArray[2];
        var developer = pathArray[4];

        //request ref: http://localhost:8090/api/v1/projects/6/numCommitsMerge/user2/2021-01-01/2021-02-23
        axios.get("/api/v1/projects/" + id + "/numCommitsMerge/" + developer + "/2021-01-01/2021-02-23")
            .then(response => {
                const nums = response.data
                this.setState({frequency : nums})
                console.log(this.state.frequency)
            }).catch((error) => {
            console.error(error);
        });

    }
//        ProjectService.getCodeScore(this.id, this.developer).then((response) => {
//            this.setState({date: response.data.date, code: response.data.commitScore, comment: 0
//        });

    render() {
        var output = this.state.codeScore.map(function(item) {
            return {
                date: (new Date(item.date)).getTime(), //item.date,
                commitScore: item.commitScore,
                mergeScore: item.mergeRequestScore
            };
        });
        console.log(output);
        const from = Number(new Date('2021-01-15'));
        const to = Number(new Date('2021-02-23'));

        return (
            <div>
                <ResponsiveContainer width = '100%' height = {500} >
                    <BarChart
                        data={output}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5,}}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey= "date"
                               type ="number"
                               name = 'date'
                               domain={[
                                   d3.timeDay.floor(from).getTime(),
                                   d3.timeDay.ceil(to).getTime()
                               ]}
                               tickFormatter = {(unixTime) => moment(unixTime).format('YYYY-MM-DD')}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="commitScore" stackId="a" fill="orange" />
                        <Bar dataKey="mergeScore" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}