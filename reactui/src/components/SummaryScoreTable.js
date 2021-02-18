// class CodeDiffTable extends Component{
import {Table} from "react-bootstrap";
import React, {Component} from "react";
import axios from "axios";


function SummaryScoreTable(){
//     TODO: Do not delete, will be used once the API is set
//      constructor(props) {
//          super(props);
//          this.state = {
//              scoreSummary:[]
//          }
//      }

//      componentDidMount() {
//          const path1 = window.location.pathname;
//          const id = path1.split("/")[1];
//          const developer = path1.split("/")[3];
//
//          //TODO: This mapping request can't be used for here, the all score should be sent altogether
//          //for commit, MR, word...
//          axios.get("http://localhost:8080/api/v1/projects/" +id+ "/totalCommitScore/"+developer)
//              .then(response => {
//                 const scoreSummary = response.data
//                 this.setState({scoreSummary})
//              })
//      }

//Fake data until getting the data from backend
const scoreSummary = [
   {commitScore:3, scoreMR: 204, wordCountComment: 100, numCommentPerDay: 1},
   {commitScore:2, scoreMR: 12, wordCountComment: 200, numCommentPerDay: 0.5},
];


//    render () {
    return (
        <div className="CodeDiffTable">
            <Table striped bordered hover>
                <tbody>
                <tr>
                    <td>Commit</td>
                    <td>Merge Request</td>
                    <td>Word Count for Comments</td>
                    <td>Average # of Comments per Day</td>
                </tr>
                {
                    scoreSummary.map((item, index)=>
                        <tr key ={index}>
                            <td>{item.commitScore}</td>
                            <td>{item.scoreMR}</td>
                            <td>{item.wordCountComment}</td>
                            <td>{item.numCommentPerDay}</td>
                            </tr>
                    )}
                </tbody>
            </Table>

        </div>
    );
//    }
}

export default SummaryScoreTable;
