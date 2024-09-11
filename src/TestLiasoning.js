// import React from 'react';
// import {
//     Button,
//     Grid,
//     Typography,
//     Chip,
// } from '@material-ui/core';

// import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@material-ui/lab';

// const TestLiasoning = () => {
//     return (
//         <div>
//             <Timeline align="alternate">
//                 <TimelineItem>
//                     <TimelineSeparator>
//                         <TimelineDot />
//                         <TimelineConnector />
//                     </TimelineSeparator>
//                     <TimelineContent>Application Submitted</TimelineContent>
//                 </TimelineItem>
//                 {/* Add more TimelineItem components for each step */}
//             </Timeline>
//             <Grid container spacing={2}>
//                 <Grid item>
//                     <Button variant="contained" color="primary">
//                         Application Actions
//                     </Button>
//                 </Grid>
//                 <Grid item>
//                     <Button variant="contained" color="primary">
//                         Download Application Document
//                     </Button>
//                 </Grid>
//             </Grid>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                     <Typography variant="body1">
//                         <strong>PV capacity (AC) to be installed (in kW):</strong> 15
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Application No.:</strong> GUI/RT/RES/10141045
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Consumer No.:</strong> 61918005389
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Installer:</strong> Tvarit Energy LLP
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Feasibility Comment:</strong> -
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Discom:</strong> PGVCL / RAJKOT O&M CIRCLE / RAJKOT RURAL DIVISION / Pardi S/dn
//                     </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <Chip label="Non Subsidy" color="secondary" />
//                     <Typography variant="body1">
//                         <strong>Quotation No.:</strong> 17647605
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Estimated Amount:</strong> 12876
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Estimated Due Date:</strong> 2-Aug-2024
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Payment Status:</strong> Paid
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Modified:</strong> 5-Aug-2024 10:00 PM
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>Submitted:</strong> 23-May-2024 3:33 PM
//                     </Typography>
//                     <Typography variant="body1">
//                         <strong>GEDA Letter:</strong> 23-May-2024 3:33 PM
//                     </Typography>
//                 </Grid>
//             </Grid>
//         </div>
//     );
// };

// export default TestLiasoning;

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================
// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

// import React from 'react';
// import { Box, Typography, Button, Grid } from '@mui/material';

// const ApplicationStatus = () => {
//   return (
//     <Box sx={{ p: 3, bgcolor: '#eaf4fc', borderRadius: 2 }}>
//       <Grid container justifyContent="space-between" alignItems="center">
//         <Grid item>
//           <Typography variant="h6" color="green">
//             Mr. SHAILESHBHAI GOVINDBHAI VASNANI
//           </Typography>
//           <Typography variant="subtitle2" color="textSecondary">
//             (Feasibility Approved)
//           </Typography>
//         </Grid>
//         <Grid item>
//           <Button variant="contained" color="primary" sx={{ mr: 2 }}>
//             Application Actions
//           </Button>
//           <Button variant="contained" color="primary" sx={{ mr: 2 }}>
//             Download Application Document
//           </Button>
//           <Typography variant="h6" color="red" display="inline">
//             Non Subsidy
//           </Typography>
//         </Grid>
//       </Grid>

//       <Box sx={{ mt: 3 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6} md={3}>
//             <Typography variant="body2">
//               <strong>PV capacity (AC) to be installed (in kW):</strong> 15
//             </Typography>
//             <Typography variant="body2">
//               <strong>Application No.:</strong> GUJ/RT/RES/10141045
//             </Typography>
//             <Typography variant="body2">
//               <strong>Consumer No.:</strong> 61918005389
//             </Typography>
//             <Typography variant="body2">
//               <strong>Installer:</strong> Tvarit Energy LLP
//             </Typography>
//             <Typography variant="body2">
//               <strong>Feasibility Comment:</strong> -
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Typography variant="body2">
//               <strong>Discom:</strong> PGVCL / RAJKOT O&M CIRCLE / RAJKOT RURAL DIVISION / Pardi S/dn
//             </Typography>
//             <Typography variant="body2">
//               <strong>Quotation No.:</strong> 17647605
//             </Typography>
//             <Typography variant="body2">
//               <strong>Estimated Amount:</strong> 12876
//             </Typography>
//             <Typography variant="body2">
//               <strong>Estimated Due Date:</strong> 2-Aug-2024
//             </Typography>
//             <Typography variant="body2">
//               <strong>Payment Status:</strong> Paid
//             </Typography>
//           </Grid>
//         </Grid>
//       </Box>

//       <Box sx={{ mt: 3, bgcolor: '#f1f1f1', p: 2, borderRadius: 2 }}>
//         <Grid container justifyContent="space-between" alignItems="center">
//           {['Application Submitted', 'GEDA Letter', 'Document Verified', 'Feasibility Approved', 'CEI Approval', 'Work Starts', 'CEI Inspection', 'Meter Installation'].map((step, index) => (
//             <Grid item key={index}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#ff5733', mb: 1 }} />
//                 <Typography variant="body2">{step}</Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Box sx={{ mt: 2, textAlign: 'right' }}>
//         <Typography variant="body2" color="textSecondary">
//           Modified 5-Aug-2024 10:00 PM
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           Submitted 23-May-2024 3:33 PM
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           GEDA Letter 23-May-2024 3:33 PM
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default ApplicationStatus;





import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Grid, StepConnector, stepConnectorClasses, Stepper, Step, StepLabel, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg,#ff6b39 0%, #ff6b39 120%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg,#ff6b39 0%, #ff6b39 120%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[400] : '#eaeaf0',
        borderRadius: 1,
    },
}));


// const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
//     zIndex: 1,
//     color: '#fff',
//     width: 50,
//     height: 50,
//     display: 'flex',
//     borderRadius: '50%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...(ownerState.active && {
//         border: theme.palette.mode === 'dark' ? '2px solid #ff6b39' : '2px solid #ff6b39',
//         boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//     }),
//     // ...(ownerState.completed && {
//     //     border: theme.palette.mode === 'dark' ? '2px solid #ff6b39' : '2px solid #ff6b39',
//     // }),
//     ...(ownerState.completed && {
//         backgroundColor: '#ff6b39',
//         border: 'none',
//     }),
// }));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ccc',
    zIndex: 1,
    color: ownerState.completed ? '#fff' : '#000',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        // border: theme.palette.mode === 'dark' ? '2px solid #ff6b39' : '2px solid #ff6b39',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundColor: '#ff6b39',
        border: 'none',
    }),
}));



// function ColorlibStepIcon(props) {
//     const { active, completed, className, icon, onClick, theme } = props;

//     const icons = {
//         1: <img src="/assets/images/icons/basicw.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         2: <img src="/assets/images/icons/variant.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         3: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         4: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         5: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         6: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         7: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//         8: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
//     };

//     return (
//         <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
//             {icons[String(icon)]}
//         </ColorlibStepIconRoot>
//     );
// }

function ColorlibStepIcon(props) {
    const { active, completed, className, icon, onClick } = props;

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                {icon}
            </Typography>
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
    onClick: PropTypes.func,
};


const steps = ['Application Submitted', 'GEDA Letter', 'Document Verified', 'Feasibility Approved', 'CEI Approval', 'Work Starts', 'CEI Inspection', 'Meter Installation'];

const ApplicationStatus = () => {

    const [activeStep, setActiveStep] = React.useState(0);

    const handleStep = (step) => {
        setActiveStep(step);
    };

    const theme = useTheme();


    return (
        <Box sx={{ m: 3, ml: 0, p: 3, borderRadius: 2, bgcolor: '#e5f1fd' }}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" color="green">
                        Mr. SHAILESHBHAI GOVINDBHAI VASNANI
                    </Typography>
                    <Typography variant="subtitle2" color="black">
                        (Feasibility Approved)
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" sx={{ mr: 2, bgcolor: '#2b89d5' }}>
                        Application Actions
                    </Button>
                    <Button variant="contained" sx={{ mr: 2, bgcolor: '#2b89d5' }}>
                        Download Application Document
                    </Button>
                    <Typography variant="h6" color="red" display="inline">
                        Non Subsidy
                    </Typography>
                </Grid>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Typography color="black">
                        Modified 5-Aug-2024 10:00 PM
                    </Typography>
                    <Typography color="black">
                        Submitted 23-May-2024 3:33 PM
                    </Typography>
                    <Typography color="black">
                        GEDA Letter 23-May-2024 3:33 PM
                    </Typography>
                </Box>
            </Grid>

            {/* <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography color="black">
                            PV capacity (AC) to be installed (in kW):    15
                        </Typography>
                        <Typography color="black">
                            Application No.:     GUJ/RT/RES/10141045
                        </Typography>
                        <Typography color="black">
                            Consumer No.:    61918005389
                        </Typography>
                        <Typography color="black">
                            Installer:   Tvarit Energy LLP
                        </Typography>
                        <Typography color="black">
                            Feasibility Comment:     -
                        </Typography>
                        <Typography color="black">
                            Discom:  PGVCL / RAJKOT O&M CIRCLE / RAJKOT RURAL DIVISION / Pardi S/dn
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography color="black">
                            Quotation No.:   17647605
                        </Typography>
                        <Typography color="black">
                            Estimated Amount:    12876
                        </Typography>
                        <Typography color="black">
                            Estimated Due Date:  2-Aug-2024
                        </Typography>
                        <Typography color="black">
                            Payment Status:  Paid
                        </Typography>
                    </Grid>
                </Grid>
            </Box> */}


            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong   >PV capacity (AC) to be installed (in kW):</strong> 15
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Application No.:</strong> GUJ/RT/RES/10141045
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Consumer No.:</strong> 61918005389
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Installer:</strong> Tvarit Energy LLP
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Feasibility Comment:</strong> -
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Discom:</strong> PGVCL / RAJKOT O&M CIRCLE / RAJKOT RURAL DIVISION / Pardi S/dn
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Quotation No.:</strong> 17647605
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Estimated Amount:</strong> 12876
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Estimated Due Date:</strong> 2-Aug-2024
                        </Typography>
                        <Typography color="black" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Payment Status:</strong> Paid
                        </Typography>
                    </Grid>
                </Grid>
            </Box>


            {/* <Box sx={{ mt: 3, p: 2, borderRadius: 2 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    {['Application Submitted', 'GEDA Letter', 'Document Verified', 'Feasibility Approved', 'CEI Approval', 'Work Starts', 'CEI Inspection', 'Meter Installation'].map((step, index) => (
                        <Grid item key={index}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#ff5733', mb: 1 }} />
                                <Typography variant="body2" color="black">{step}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box> */}


            {/* <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={(props) => (
                            <ColorlibStepIcon {...props} theme={theme} icon={index + 1} onClick={() => handleStep(index)} />
                        )}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper> */}

            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={(props) => (
                            <ColorlibStepIcon {...props} icon={index + 1} onClick={() => handleStep(index)} />
                        )}
                        >
                            <Typography style={{ color: activeStep > index ? 'green' : 'black', fontWeight: '600' }}>
                                {label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>


        </Box >
    );
};

export default ApplicationStatus;
