// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
// import Tooltip from '@material-ui/core/Tooltip';
//
// const useStyles = makeStyles((theme) => ({
//     button: {
//         margin: theme.spacing(1),
//     },
//     customWidth: {
//         maxWidth: 500,
//     },
//     noMaxWidth: {
//         maxWidth: 'none',
//     },
// }));
//
// const longText = "Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus. " + Praesent non nunc mollis, fermentum neque at, semper arcu."" +
// "Nullam eget est sed sem iaculis gravida eget vitae justo.";
//
// export default function PositionedTooltips() {
//     const classes = useStyles();
//
//     return (
//         <div className={classes.root}>
//             <Tooltip title= {longText} placement="right-start">
//                 <Button>right-start</Button>
//             </Tooltip>
//         </div>
//     );
// }