import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core/styles";
import {OverlayTrigger, Popover} from 'react-bootstrap'
import Highlight from "react-highlight";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import HighlightCodeDiffs from "../Commits/HighlightCodeDiffs";
import {ClickAwayListener, Tooltip, withStyles} from "@material-ui/core";


const StyledTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 500,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

// Table structure is based on the library from [https://material-ui.com/components/tables/]
export default function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    const [tooltipOpen, tooltipSetOpen] = React.useState(false);

    const handleTooltipClose = () => {
        tooltipSetOpen(false);
    };

    const handleTooltipOpen = () => {
        tooltipSetOpen(true);
    };

    const [commitTooltipOpen, commitTooltipSetOpen] = React.useState(false);
    const handleCommitTooltipClose = () => {
        commitTooltipSetOpen(false);
    };

    const handleCommitTooltipOpen = () => {
        commitTooltipSetOpen(true);
    };

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row">
                    {row.date}
                </TableCell>
                <TableCell>#{row.id} <a href= {row.mrUrl}> {row.title}</a> </TableCell>
                <TableCell align="right">{row.score.toFixed(1)}</TableCell>
                <TableCell align="right"> {row.sum}</TableCell>

                <TableCell align ="right">
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <div>
                            <StyledTooltip
                                placement={"right-start"}
                                onClose={handleTooltipClose}
                                open={tooltipOpen}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={row.diffs.map(item => {
                                    return (
                                    <React.Fragment>
                                        <ul>
                                            <h5>{item.path}</h5>
                                            <h6><Highlight
                                                className="highlighted-text">{HighlightCodeDiffs(item.diff)}</Highlight>
                                            </h6>
                                        </ul>
                                    </React.Fragment>
                                    )
                                })}>
                            <button aria-label="expand row" size="small"
                                    onClick={() => {  setOpen(!open);
                                                      handleTooltipOpen();}}
                                    type="button" order={1} className="btn btn-secondary">View</button>
                            </StyledTooltip>
                        </div>
                    </ClickAwayListener>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Commits
                            </Typography>
                            <Table size="small" aria-label="commits">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Commit Message</TableCell>
                                        <TableCell align="right">Committer</TableCell>
                                        <TableCell align="right">Score</TableCell>
                                        <TableCell align="right">Code Diff</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.commits.map((commitsRow) => (
                                        <TableRow key={commitsRow.commitDate}>
                                            <TableCell component="th" scope="row">
                                                {moment(commitsRow.commitDate).format('LLL')}

                                            </TableCell>

                                            <TableCell>{commitsRow.message}</TableCell>
                                            <TableCell align="right">{commitsRow.author}</TableCell>
                                            <TableCell align="right">{commitsRow.score.toFixed(1)}</TableCell>
                                            <TableCell align="right" >
                                                <ClickAwayListener onClickAway={handleCommitTooltipClose}>
                                                    <div>
                                                        <StyledTooltip
                                                            placement={"right-start"}
                                                            onClose={handleCommitTooltipClose}
                                                            open={commitTooltipOpen}
                                                            disableFocusListener
                                                            disableHoverListener
                                                            disableTouchListener
                                                            title={commitsRow.commitDiffs.map(item => {
                                                                return (
                                                                    <React.Fragment>
                                                                        <ul>
                                                                            <h5>{item.path}</h5>
                                                                            <h6><Highlight
                                                                                className="highlighted-text">{HighlightCodeDiffs(item.diff)}</Highlight>
                                                                            </h6>
                                                                        </ul>
                                                                    </React.Fragment>
                                                                )
                                                            })}>
                                                            <button type="button" className="btn btn-outline-secondary"
                                                                    onClick={() => handleCommitTooltipOpen()}>View</button>
                                                        </StyledTooltip>
                                                    </div>
                                                </ClickAwayListener>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
            fontSize: '12pt',
            backgroundColor: 'lightgrey',

        },
    },
});


//[https://stackoverflow.com/questions/48780494/how-to-pass-value-to-popover-from-renderer]
// const PopOver = ({Diffs}) => {
//     return (
//         <div className="box">
//             <Popover id="popover-basic" placement='right' class="justify-content-end" >
//                  {Diffs.map((item => {
//                      return(
//                          <ul>
//                              <Popover.Title as="h3">{item.path}</Popover.Title>
//                              <Popover.Content><Highlight className="highlighted-text"> {HighlightCodeDiffs(item.diff)} </Highlight>
//                              </Popover.Content>
//                          </ul>
//                      )
//                 }))}
//             </Popover>
//         </div>
//     )
// }
