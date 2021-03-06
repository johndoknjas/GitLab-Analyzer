import React, { PureComponent } from 'react';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
import axios from "axios";
import * as d3 from "d3-time";
import moment from 'moment'
import './ToolTip.css'
import SummaryChartFunctions from "./SummaryChartFunctions";

//'https://jsfiddle.net/alidingling/90v76x08/']
export default class CommitMRScoreChart extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            codeScore:[{date: null, commitScore: 0, mergeRequestScore: 0, sumOfCommits: 0, commitIds:[],mergeRequestDiffs:[]}],
            parentdata: this.props.devName,
            startTime: this.props.startTime,
            endTime: this.props.endTime,
            DatescoreData:[{data:null,commistScore:0,mergeRequestScore: 0, sumOfCommits: 0}]
        }
    }

    async componentDidMount(){
        const {parentdata} = this.state;
        await this.getDataFromBackend(parentdata, this.props.startTime,  this.props.endTime )
    }

    async getDataFromBackend (username, startTm, endTm) {
        var pathArray = window.location.pathname.split('/');
        var id = pathArray[2];
        var name = username;
        if(sessionStorage.getItem('DeveloperNames' + id) != null && sessionStorage.getItem('Developers' + id) != null) {
            for (var i = 0; i < JSON.parse(sessionStorage.getItem('Developers' + id)).length; i++) {
                if (JSON.stringify(username) === JSON.stringify(JSON.parse(sessionStorage.getItem('Developers' + id))[i])) {
                    name = JSON.parse(sessionStorage.getItem('DeveloperNames' + id))[i]//use name to retrieve data
                }
            }
        }

        const response = await axios.get("/api/v1/projects/" + id + "/MRsAndCommitScoresPerDay/" + username + '/' +
            startTm + '/' +
            endTm + "/either")
        console.log(response);
        const score = await response.data
        console.log("scores");
        console.log(score);
        await this.setState({codeScore : score, parentdata: username, startTime: startTm,
            endTime: endTm})
        await this.applyMultipliers();
        await console.log(this.state.codeScore)
    }

    async applyMultipliers(){
        var scale = JSON.parse(sessionStorage.getItem('languageScale'));
        var newCodeScore = [...this.state.codeScore];
        for(const k in newCodeScore){
            var newCommitScore=0;
            var newMergeScore=0;
            for(const i in newCodeScore[k].commitDiffs){
                var fileExtension = newCodeScore[k].commitDiffs[i].new_path.split(".").pop();
                const extensionIndex = scale.findIndex(scale => scale.extension === fileExtension);
                if(extensionIndex!==-1){
                    var tempCommitScore = scale[extensionIndex].multiplier*newCodeScore[k].commitDiffs[i].diffScore;
                    newCommitScore = newCommitScore+tempCommitScore;
                }else{
                    newCommitScore = newCommitScore+newCodeScore[k].commitDiffs[i].diffScore;
                }
            }
            for(const i in newCodeScore[k].mergeRequestDiffs){
                var fileExtension = newCodeScore[k].mergeRequestDiffs[i].new_path.split(".").pop();
                const extensionIndex = scale.findIndex(scale => scale.extension === fileExtension);
                if(extensionIndex!==-1){
                    var tempCommitScore = scale[extensionIndex].multiplier*newCodeScore[k].mergeRequestDiffs[i].diffScore;
                    newMergeScore = newMergeScore+tempCommitScore;
                }else{
                    newMergeScore = newMergeScore+newCodeScore[k].mergeRequestDiffs[i].diffScore;
                }
            }
            newCodeScore[k].mergeRequestScore=newMergeScore;
            newCodeScore[k].commitScore=newCommitScore;
        }
        var tempDateScore =[]
        for(const k in newCodeScore){
            var dateFound = false; 
            var tempDate = newCodeScore[k].date.split("T")[0];
            console.log(tempDate)
            if(tempDateScore.length===0){
                tempDateScore.push({date:tempDate,commitScore:newCodeScore[k].commitScore,mergeRequestScore:newCodeScore[k].mergeRequestScore, sumOfCommits:newCodeScore[k].sumOfCommits});
                continue;
            }
            for(const i in tempDateScore){
                if (tempDateScore[i].date===tempDate){
                    var tempObj = tempDateScore[i];
                    tempObj.commitScore+=newCodeScore[k].commitScore;
                    tempObj.mergeRequestScore+=newCodeScore[k].mergeRequestScore;
                    dateFound=true;
                    break;
                }
            }
            if(dateFound===false){
                tempDateScore.push({date:tempDate,commitScore:newCodeScore[k].commitScore,mergeRequestScore:newCodeScore[k].mergeRequestScore, sumOfCommits:newCodeScore[k].sumOfCommits});
            }
        }
        console.log(tempDateScore)
        this.setState({
            codeScore:newCodeScore,
            DatescoreData:tempDateScore
        })
    }
     

    async componentDidUpdate(prevProps){
        if(this.props.devName !== prevProps.devName ||
            this.props.startTime !== prevProps.startTime ||
            this.props.endTime !== prevProps.endTime){
            await this.getDataFromBackend(this.props.devName, this.props.startTime,this.props.endTime )
        }
    }

    CustomToolTip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const commitVal = Math.abs(Math.round(payload[0].value * 10)/10.0);
            const mrVal = Math.abs(Math.round(payload[1].value * 10)/10.0);

            return (
                <div className="tooltipBox">
                    <p className="label">Date: {moment(label).format('YYYY-MM-DD')}</p>
                    <p className="label1">{`${'MR Score'}: ${mrVal}`}</p>
                    <p className="label2">{`${'Commit Score'}: ${commitVal}`}</p>
                </div>
            );
        }
        return null;
    };

    render() {
        var tickArr = [];
        var output = this.state.DatescoreData.map(function(item) {
            tickArr.push((new Date(item.date)).getTime())
            return {
                date: (new Date(item.date)).getTime(),
                commitScore: -item.commitScore,
                mergeScore : +(item.mergeRequestScore + item.sumOfCommits),
            };
        });
        console.log("starttime", this.props.startTime)
        const from = Number(new Date(this.props.startTime));
        const to = Number(new Date(this.props.endTime));

        return (
            <div>
                <ResponsiveContainer width = '94%' height = {680} >
                    <BarChart
                        data={output}
                        stackOffset="sign"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5,}}
                        >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 1" />
                        <XAxis
                            domain={[
                                d3.timeDay.ceil(from).getTime(),
                                d3.timeDay.ceil(to).getTime()]}
                            tickFormatter = {SummaryChartFunctions.formatDate}
                            name = 'date'
                            dataKey= "date"
                            type = "number"
                            allowDataOverflow={false}
                            tickSize={10}
                            tickCount={SummaryChartFunctions.getTickCount(to, from)}
                            hide={false}
                            angle={0}
                            interval={"preserveStartEnd"}
                            mirror={false}
                        />
                        <ReferenceLine
                            y={0}
                            stroke="#000000"
                            type='category'
                        />
                        <YAxis
                            tickFormatter = {(value) =>  Math.abs(value)}
                            interval={0}
                            tickSize={10}
                            angle={0}
                            allowDecimal={false}
                        />
                        <Tooltip
                            cursor={false}
                            content={this.CustomToolTip}/>
                        <Legend />
                        <Bar dataKey="commitScore" stackId="a" fill="red" />
                        <Bar dataKey="mergeScore" stackId="a" fill="blue" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

