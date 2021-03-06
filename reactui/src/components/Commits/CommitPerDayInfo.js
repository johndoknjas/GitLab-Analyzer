import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import './TableStyle.css'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CommitService from "./CommitService";

function CommitPerDayInfo(props) {

    const [open, setOpen] = React.useState(
        false
    );

    CommitService.initializeStorageForExcludedFiles()

    var numberOfFilesExcluded = CommitService.calculateNumberOfExcludedFilesInCommit(props.commit.diffs, props.commit.id)
    var numberOfFilesInCommit = CommitService.calculateNumberOfFilesInCommit(props.commit.diffs)
    console.log(props.commit)

    return (
        <React.Fragment>
            <TableRow className="commitTable">
                <TableCell component="th" scope="row">
                    {moment(props.commit.committed_date).format('lll').substring(12,21)}
                </TableCell>
                <TableCell>
                {props.commit.title.length > 10 ? props.commit.title.substring(0,10) + "..." :
                    props.commit.title.substring(0,10)}
                </TableCell>
                {CommitService.adjustTheColorOfScore(numberOfFilesExcluded,numberOfFilesInCommit,props.commit.commitScore )}

                <TableCell align="right">
                    <IconButton aria-label="expand row" size="small"
                                onClick={() => setOpen(!open)}>
                                {<MoreHorizIcon />}
                    </IconButton>
                </TableCell>

                <TableCell align ="right">
                    <button style={{
                            backgroundColor: 'lightblue',
                            color: 'black',
                            borderRadius: '0%'
                            }}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                {props.resetSingleCommitScore()}
                                {props.handler(props.commit.id)}
                            }}>
                        DIFF
                    </button>
                </TableCell>
            </TableRow>

            <TableRow
                style={{backgroundColor:"rgb(242, 242, 242)"}}>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}>
                    <Collapse
                        in={open}
                        timeout="auto"
                        unmountOnExit>
                        <Box>
                            <Table size="small" aria-label="commits">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="left">
                                            Full Message
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{wordWrap: "break-word",
                                            maxWidth:"250px"}}>
                                            {props.commit.title}
                                        </TableCell>
                                        <TableCell style={{wordWrap: "break-word",
                                            maxWidth:"250px"}}>
                                            {props.commit.message}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default CommitPerDayInfo;