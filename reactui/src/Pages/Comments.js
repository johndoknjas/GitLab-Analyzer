import "../App.css"
import React,{ Component } from "react";
import ProjectService from "../Service/ProjectService";
import CommentTable from "../components/CommentTable";

function Comments(){

    return(

        <div className='Commits'>
        <CommentTable/>
        </div>


    )

}
export default Comments;
