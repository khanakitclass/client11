import { getPurchase } from '../../../redux/slice/Purchase.slice';
import Header from '../../../components/Header';
import React, { useEffect, useState, useMemo, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Grid, Table, TableBody, TaleCell, TableContainer, TableHead, TableRow, Paper, StepConnector, stepConnectorClasses, Stepper, Step, StepLabel, useTheme, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, useMediaQuery, Dialog, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { tokens } from '../../../theme';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getProducts } from '../../../redux/slice/products.slice';
import { getVendors } from '../../../redux/slice/vendors.slice';
import { getWarehouses } from '../../../redux/slice/warehouses.slice';
import { getRoles } from '../../../redux/slice/roles.slice';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import PrintIcon from '@mui/icons-material/Print';
import { getTerms } from '../../../redux/slice/Terms.slice';
import { getUsers } from '../../../redux/slice/users.slice';
import { useNavigate } from 'react-router-dom';
import { deletestore, getstore } from '../../../redux/slice/store.slice';
import VisibilityIcon from '@mui/icons-material/Visibility';


// const ColorlibConnector = styled(StepConnector)(({ theme }) => {
//     const isVerySmallScreen = useMediaQuery('(max-width:425px)');
//     const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

//     return {
//         [`&.${stepConnectorClasses.alternativeLabel}`]: {
//             top: isVerySmallScreen ? 12 : (isMediumScreen ? 15 : 25),
//             left: isVerySmallScreen ? 'calc(-50% + 12px)' : (isMediumScreen ? 'calc(-50% + 15px)' : 'calc(-50% + 25px)'),
//             right: isVerySmallScreen ? 'calc(50% + 12px)' : (isMediumScreen ? 'calc(50% + 15px)' : 'calc(50% + 25px)'),
//         },
//         [`&.${stepConnectorClasses.active}`]: {
//             [`& .${stepConnectorClasses.line}`]: {
//                 backgroundImage: 'linear-gradient( 95deg,#134670 0%, #2B89D5 120%)',
//             },
//         },
//         [`&.${stepConnectorClasses.completed}`]: {
//             [`& .${stepConnectorClasses.line}`]: {
//                 backgroundImage: 'linear-gradient( 95deg,#134670 0%, #2B89D5 120%)',
//             },
//         },
//         [`& .${stepConnectorClasses.line}`]: {
//             height: isVerySmallScreen ? 2 : 3,
//             border: 0,
//             backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#b9b9b9',
//             borderRadius: 1,
//         },
//     };
// });

// const ColorlibStepIconRoot = styled('div')(({ theme, ownerState, isMobile, isVerySmallScreen }) => ({
//     backgroundColor: ownerState.completed ? '#134670' : '#fff',
//     zIndex: 1,
//     color: ownerState.completed ? '#fff' : '#000',
//     width: isVerySmallScreen ? 30 : (isMobile ? 30 : 50),
//     height: isVerySmallScreen ? 30 : (isMobile ? 30 : 50),
//     display: 'flex',
//     borderRadius: '50%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...(ownerState.active && {
//         boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//     }),
// }));

// function ColorlibStepIcon(props) {
//     const { active, completed, className, icon } = props;
//     const isVerySmallScreen = useMediaQuery('(max-width:425px)');
//     const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

//     const stepNumber = String(icon);

//     return (
//         <ColorlibStepIconRoot
//             ownerState={{ completed, active }}
//             className={className}
//             isMobile={isVerySmallScreen || isMediumScreen}
//             isVerySmallScreen={isVerySmallScreen}
//         >
//             <Typography
//                 variant={isVerySmallScreen ? "body2" : (isMediumScreen ? "body2" : "h4")}
//                 style={{ fontWeight: 'bold', color: completed ? '#fff' : '#000' }}
//             >
//                 {stepNumber}
//             </Typography>
//         </ColorlibStepIconRoot>
//     );
// }


// ColorlibStepIcon.propTypes = {
//     active: PropTypes.bool,
//     className: PropTypes.string,
//     completed: PropTypes.bool,
//     icon: PropTypes.node,
//     onClick: PropTypes.func,
// };


// const steps = ['Purchase Order(PO) Generate', 'Partially Payment', 'Payment to Vendor', 'Partially Material', 'Material Recieved at Store'];

function PendingPo() {

    const isMobile = useMediaQuery('(max-width:1024px)');
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const vendors = useSelector(state => state.vendors.vendors);
    const userId = sessionStorage.getItem("id");
    const users = useSelector(state => state.users.users)?.find(user => user?._id == userId);

    const userRole = users?.role;

    const warehouses = useSelector(state => state.warehouses.warehouses)?.find(warehouse => warehouse?.email == users?.email);

    const dispatch = useDispatch();
    // const purchase = useSelector(state => state.purchase.purchase)?.filter(purchase => purchase.werehouse == warehouses?._id);
    const purchase = useSelector(state => {
        // Fetch all purchases if user is superadmin, otherwise filter by warehouse
        return userRole === '66c808446c54d2c10e16d367' ? state.purchase.purchase : state.purchase.purchase?.filter(purchase => purchase.werehouse == warehouses?._id);
    });
    const store = useSelector(state => state.store.Store)



    const memoizedStyles = useMemo(() => ({
        "& .MuiDataGrid-root": {
            border: "none",
        },
        "& .MuiDataGrid-cell": {
            fontSize: "14px  !important"
        },
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
        },
        "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
            fontSize: "13px !important",
        },
        "& .MuiDataGrid-cellContent": {
            fontSize: "14px !important"
        },
        "& .css-6hy2kr-MuiDataGrid-root": {
            fontSize: "14px !important"
        },
        "& .css-1v3msgo-MuiTypography-root-MuiDialogContentText-root": {
            fontSize: "14px !important"
        }
    }), [colors]);

    useEffect(() => {
        dispatch(getPurchase());
        dispatch(getUsers());
        dispatch(getVendors());
        dispatch(getWarehouses());
        dispatch(getstore())
    }, [dispatch]);




    // const MobileStepper = ({ steps, activeStep, filledSteps }) => {
    //     const isVerySmallScreen = useMediaQuery('(max-width:425px)');
    //     const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

    //     if (isVerySmallScreen) {
    //         const firstRowSteps = steps.slice(0, 3);
    //         const secondRowSteps = steps.slice(3, 5);

    //         const renderStepper = (stepArray, startIndex) => (
    //             <Stepper alternativeLabel activeStep={activeStep - startIndex} connector={<ColorlibConnector />}>
    //                 {stepArray.map((label, index) => {
    //                     const stepIndex = startIndex + index;
    //                     const isCompleted = filledSteps.includes(stepIndex);
    //                     const isActive = stepIndex === activeStep;
    //                     return (
    //                         <Step key={label} completed={isCompleted}>
    //                             <StepLabel
    //                                 StepIconComponent={ColorlibStepIcon}
    //                                 icon={stepIndex + 1}
    //                                 StepIconProps={{
    //                                     active: isActive,
    //                                     completed: isCompleted
    //                                 }}
    //                             >
    //                                 <Typography
    //                                     style={{
    //                                         color: isCompleted ? theme.palette.mode === 'dark' ? '#6da2cd' : "#6da2cd" :
    //                                             isActive ? theme.palette.mode === 'dark' ? '#fff' : "#000" : '',
    //                                         fontWeight: '600',
    //                                         fontSize: '12px'
    //                                     }}
    //                                 >
    //                                     {label}
    //                                 </Typography>
    //                             </StepLabel>
    //                         </Step>
    //                     );
    //                 })}
    //             </Stepper>
    //         );

    //         return (
    //             <Box>
    //                 {renderStepper(firstRowSteps, 0)}
    //                 <Box sx={{ my: 1 }} />
    //                 {renderStepper(secondRowSteps, 3)}
    //                 <Box sx={{ my: 1 }} />
    //             </Box>
    //         );
    //     } else if (isMediumScreen) {
    //         const firstRowSteps = steps.slice(0, 5);

    //         const renderStepper = (stepArray, startIndex) => (
    //             <Stepper alternativeLabel activeStep={activeStep - startIndex} connector={<ColorlibConnector />}>
    //                 {stepArray.map((label, index) => {
    //                     const stepIndex = startIndex + index;
    //                     const isCompleted = filledSteps.includes(stepIndex);
    //                     const isActive = stepIndex === activeStep;
    //                     return (
    //                         <Step key={label} completed={isCompleted}>
    //                             <StepLabel
    //                                 StepIconComponent={ColorlibStepIcon}
    //                                 icon={stepIndex + 1}
    //                                 StepIconProps={{
    //                                     active: isActive,
    //                                     completed: isCompleted
    //                                 }}
    //                             >
    //                                 <Typography
    //                                     style={{
    //                                         color: isCompleted ? theme.palette.mode === 'dark' ? '#6da2cd' : "#6da2cd" :
    //                                             isActive ? theme.palette.mode === 'dark' ? '#fff' : "#000" : '',
    //                                         fontWeight: '600',
    //                                         fontSize: '12px'
    //                                     }}
    //                                 >
    //                                     {label}
    //                                 </Typography>
    //                             </StepLabel>
    //                         </Step>
    //                     );
    //                 })}
    //             </Stepper>
    //         );

    //         return (
    //             <Box>
    //                 {renderStepper(firstRowSteps, 0)}
    //                 <Box sx={{ my: 1 }} />
    //             </Box>
    //         );
    //     }

    //     return null;
    // };


    const getCompletedSteps = (liasoningItem) => {

        if (!liasoningItem) return 0;
        const stepFields = ['SrNo', '', '', '', ''];
        let completedSteps = 0;
        for (const field of stepFields) {
            if (liasoningItem[field]) {
                completedSteps++;
            } else {
                break;
            }
        }
        return completedSteps;
    };


    const handleStep = (itemId, step) => {
        setActiveSteps((prev) => {
            const newSteps = { ...prev, [itemId]: step };
            for (let i = 0; i < step; i++) {
                newSteps[itemId] = i + 1;
            }
            return newSteps;
        });
    };
    const [activeSteps, setActiveSteps] = React.useState({});
    const [itemFilledSteps, setItemFilledSteps] = useState({});
    const [filledSteps, setFilledSteps] = useState([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate()

    // const [deleteStoreId, setDeleteStoreId] = useState(null);

    // const confirmDelete = () => {
    //     if (deleteStoreId) {
    //         dispatch(deletestore(deleteStoreId)).then(() => {
    //             dispatch(getstore());
    //         });
    //         setDeleteConfirmOpen(false);
    //         setDeleteStoreId(null);
    //     }
    // }

    // const handleDelete = (itemId) => {
    //     setDeleteStoreId(store.find(s => s.purchase === itemId)?._id);
    //     setDeleteConfirmOpen(true);
    // };


    const getCurrentDate = () => {
        return format(new Date(), 'dd-MM-yyyy');
    };

    useEffect(() => {
        setActiveSteps({ ...activeSteps });
    }, []);

    useEffect(() => {
        const initialSteps = {};
        const initialFilledSteps = {};
        purchase.forEach(item => {
            initialSteps[item._id] = item.completedSteps || 0;
            initialFilledSteps[item._id] = item.filledSteps || [];
        });
        setActiveSteps(initialSteps);
        setItemFilledSteps(initialFilledSteps);
    }, [dispatch]);


    const handleEdit = (itemId) => {
        navigate('/admin/add-store', { state: itemId });
    };
    // const handleEdit = (itemId) => {
    //     navigate('/admin/add-store', { state: { id: itemId, isEdit: true, status: 'Complete' } });
    // };


    const [dialogOpen, setDialogOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [isImage, setIsImage] = useState(false);

    // Function to handle dialog open
    const handleOpenDialog = (url, isImage) => {
        setFileUrl(url);
        setIsImage(isImage);
        setDialogOpen(true);
    };

    // Function to handle dialog close
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box m="20px">
            <Header
                title="PENDING PO"
                subtitle="Manage Your Pending PO Here"
            />

            <Box sx={memoizedStyles}></Box>

            {purchase.length > 0 ? (
                purchase.map((v) => {
                    return (
                        <Box className="padding_box" sx={{
                            m: 3, ml: 0, mr: 0, p: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#293040' : "#E5F1FD", color: theme.palette.mode === 'dark' ? 'white' : "black",
                        }} key={v._id}>
                            <Grid container justifyContent="space-between" xs={12} sm={12} md={12} item>
                                {!isMobile && (
                                    <Grid item>
                                        <Typography sx={{ whiteSpace: 'pre-line', display: 'flex' }}>
                                            <ul>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Date</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Purchase Order Number</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>PO Value</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Vendor</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Ship To</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Payment Against PO</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Material Recived Against PO</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>Recieve Qty</li>
                                                <li style={{ listStyleType: 'none', fontWeight: '600' }}>store upload File</li>
                                            </ul>
                                            <ul>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {getCurrentDate()}
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;{v.SrNo}</li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {v.amountTotal}
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        vendors?.find((vendor) => vendor._id === v.vendor)?.businessName
                                                    }
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        warehouses?.wareHouseName
                                                    }
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                </li>
                                                {/* <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.recieveQty
                                                    }
                                                </li> */}
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.filter((s) => s.purchase === v._id)
                                                            .flatMap(s => s.multipleQty.map(m => m.recieveQty))
                                                            .join(', ')
                                                    }
                                                </li>
                                                {/* <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.storeuploadFile
                                                    }
                                                </li> */}
                                                {/* <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.storeuploadFile ? (
                                                            store.find((store) => store.purchase === v._id)?.storeuploadFile.endsWith('.pdf') ? (
                                                                <iframe src={`http://localhost:4000/${store.find((store) => store.purchase === v._id)?.storeuploadFile}`} width="100" height="100" title="PDF Viewer" />
                                                            ) : (
                                                                <img style={{ width: '50px', height: '50px', objectFit: 'cover', objectPosition: 'center center' }} src={`http://localhost:4000/${store.find((store) => store.purchase === v._id)?.storeuploadFile}`} alt="avatar" />
                                                            )
                                                        ) : 'No file available'
                                                    }
                                                </li> */}
                                                <li style={{ listStyleType: 'none' }}>&nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.storeuploadFile ? (
                                                            <span onClick={() => handleOpenDialog(`http://localhost:4000/${store.find((store) => store.purchase === v._id)?.storeuploadFile}`, !store.find((store) => store.purchase === v._id)?.storeuploadFile.endsWith('.pdf'))} style={{ cursor: 'pointer' }}>
                                                                <VisibilityIcon />
                                                            </span>
                                                        ) : 'No file available'
                                                    }
                                                </li>
                                            </ul>
                                        </Typography>
                                    </Grid>
                                )}

                                {isMobile ? (
                                    <>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Grid sx={{ textAlign: 'start', marginBottom: 2, marginTop: 1, display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ backgroundColor: '#134670', padding: '5px', borderRadius: '4px' }}>
                                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                                        {v.status}
                                                    </Typography>
                                                </Box>
                                                <IconButton aria-label="edit" style={{ color: "white" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handleEdit(v._id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                {/* <IconButton aria-label="delete" style={{ color: "white" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handleDelete(v._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton> */}
                                            </Grid>
                                        </Box>

                                        <Grid item>
                                            <Typography sx={{ whiteSpace: 'pre-line', display: 'flex' }}>
                                                <ul>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Date</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Purchase Order Number</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>PO Value</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Vendor</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Ship To</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Payment Against PO</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Material Recived Against PO</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Recieve Qty</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>store upload File</li>
                                                </ul>
                                                <ul>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                        {getCurrentDate()}
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;{v.SrNo}</li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                        {v.amountTotal}
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                        {
                                                            vendors?.find((vendor) => vendor._id === v.vendor)?.businessName
                                                        }
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                        {
                                                            warehouses?.wareHouseName
                                                        }
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    </li>
                                                    {/* <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.recieveQty
                                                    }
                                                </li> */}
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                        {
                                                            store?.filter((s) => s.purchase === v._id)
                                                                .flatMap(s => s.multipleQty.map(m => m.recieveQty))
                                                                .join(', ')
                                                        }
                                                    </li>
                                                    {/* <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.storeuploadFile
                                                    }
                                                </li> */}
                                                    {/* <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    {
                                                        store?.find((store) => store.purchase === v._id)?.storeuploadFile ? (
                                                            store.find((store) => store.purchase === v._id)?.storeuploadFile.endsWith('.pdf') ? (
                                                                <iframe src={`http://localhost:4000/${store.find((store) => store.purchase === v._id)?.storeuploadFile}`} width="100" height="100" title="PDF Viewer" />
                                                            ) : (
                                                                <img style={{ width: '50px', height: '50px', objectFit: 'cover', objectPosition: 'center center' }} src={`http://localhost:4000/${store.find((store) => store.purchase === v._id)?.storeuploadFile}`} alt="avatar" />
                                                            )
                                                        ) : 'No file available'
                                                    }
                                                </li> */}
                                                    <li style={{ listStyleType: 'none' }}>&nbsp;
                                                        {
                                                            store?.find((store) => store.purchase === v._id)?.storeuploadFile ? (
                                                                <span onClick={() => handleOpenDialog(`http://localhost:4000/${store.find((store) => store.purchase === v._id)?.storeuploadFile}`, !store.find((store) => store.purchase === v._id)?.storeuploadFile.endsWith('.pdf'))} style={{ cursor: 'pointer' }}>
                                                                    <VisibilityIcon />
                                                                </span>
                                                            ) : 'No file available'
                                                        }
                                                    </li>
                                                </ul>
                                            </Typography>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Grid sx={{ textAlign: 'start', marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ backgroundColor: '#134670', mr: 2, padding: '8px 12px', borderRadius: '4px' }}>
                                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                                        {v.status}
                                                    </Typography>
                                                </Box>
                                                <IconButton aria-label="edit" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handleEdit(v._id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                {/* <IconButton aria-label="delete" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handleDelete(v._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton> */}
                                            </Grid>
                                        </Box>
                                    </>
                                )}
                            </Grid>

                            {/* {isMobile ? (
                                <MobileStepper
                                    steps={steps}
                                    activeStep={getCompletedSteps(purchase?.find(item => item._id === v._id))}
                                    filledSteps={purchase?.find((a) => a._id === v._id)?.filledSteps?.map(v => parseInt(v)) || []}
                                />
                            ) : (
                                <Stepper
                                    className='round_r'
                                    sx={{ mt: 3 }}
                                    alternativeLabel
                                    // activeStep={activeStep}
                                    activeStep={getCompletedSteps(purchase?.find(item => item._id === v._id))}
                                    connector={<ColorlibConnector />}
                                >
                                    {steps.map((label, index) => (
                                        <Step key={label} completed={
                                            purchase?.find((a) => a._id === v._id)?.filledSteps
                                                ?.map((v) => parseInt(v))
                                                .includes(index)} onClick={() => handleStep(index)}>
                                            <StepLabel
                                                StepIconComponent={ColorlibStepIcon}
                                                StepIconProps={{
                                                    filled: filledSteps.includes(index)
                                                }}
                                            >
                                                <Typography style={{
                                                    color: purchase?.find((a) => a._id === v._id)?.filledSteps
                                                        ?.map((v) => parseInt(v))
                                                        .includes(index) ? theme.palette.mode === 'dark' ? '#6da2cd' : "#165e99" :
                                                        filledSteps.includes(index) ? '#ff6b39' : theme.palette.text.primary,
                                                    fontWeight: '600'
                                                }}>
                                                    {label}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            )} */}
                        </Box >

                    )
                })
            ) : (
                <Box>
                    <Typography variant="h5" color="textSecondary" align="center">
                        No Results Found. Please Try a Different Search Term.
                    </Typography>
                </Box>
            )}

            {/* <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    <iframe src={fileUrl} width="500px" height="600px" title="PDF Viewer" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog> */}

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isImage ? (
                        <img src={fileUrl} alt="Preview" style={{ width: '500px', height: '600px', objectFit: 'contain' }} />
                    ) : (
                        <iframe src={fileUrl} width="500px" height="600px" title="PDF Viewer" />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogContent>
                    Are you sure you want to delete this store?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog> */}

        </Box >


    );
}

export default PendingPo;
