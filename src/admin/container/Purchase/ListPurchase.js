import React, { useEffect, useState, useMemo, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, StepConnector, stepConnectorClasses, Stepper, Step, StepLabel, useTheme, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, useMediaQuery, Dialog, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import { getCommercialMarketing } from '../../../redux/slice/Commercialmarketing.slice';
import { getUsers } from '../../../redux/slice/users.slice';
import { useDispatch, useSelector } from 'react-redux';
import { getDealers } from '../../../redux/slice/dealer.slice';
import { deleteLiasoning, editLiasoning, getLiasoning } from '../../../redux/slice/liasoning.slice';
import Header from '../../../components/Header';
import { tokens } from '../../../theme';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { deletePurchase, getPurchase } from '../../../redux/slice/Purchase.slice';
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

const ColorlibConnector = styled(StepConnector)(({ theme }) => {
    const isVerySmallScreen = useMediaQuery('(max-width:425px)');
    const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

    return {
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: isVerySmallScreen ? 12 : (isMediumScreen ? 15 : 25),
            left: isVerySmallScreen ? 'calc(-50% + 12px)' : (isMediumScreen ? 'calc(-50% + 15px)' : 'calc(-50% + 25px)'),
            right: isVerySmallScreen ? 'calc(50% + 12px)' : (isMediumScreen ? 'calc(50% + 15px)' : 'calc(50% + 25px)'),
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage: 'linear-gradient( 95deg,#134670 0%, #2B89D5 120%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage: 'linear-gradient( 95deg,#134670 0%, #2B89D5 120%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: isVerySmallScreen ? 2 : 3,
            border: 0,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#b9b9b9',
            borderRadius: 1,
        },
    };
});

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState, isMobile, isVerySmallScreen }) => ({
    backgroundColor: ownerState.completed ? '#134670' : '#fff',
    zIndex: 1,
    color: ownerState.completed ? '#fff' : '#000',
    width: isVerySmallScreen ? 30 : (isMobile ? 30 : 50),
    height: isVerySmallScreen ? 30 : (isMobile ? 30 : 50),
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className, icon } = props;
    const isVerySmallScreen = useMediaQuery('(max-width:425px)');
    const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

    const stepNumber = String(icon);

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active }}
            className={className}
            isMobile={isVerySmallScreen || isMediumScreen}
            isVerySmallScreen={isVerySmallScreen}
        >
            <Typography
                variant={isVerySmallScreen ? "body2" : (isMediumScreen ? "body2" : "h4")}
                style={{ fontWeight: 'bold', color: completed ? '#fff' : '#000' }}
            >
                {stepNumber}
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



const steps = ['Purchase Order(PO) Generate', 'Partially Payment', 'Payment to Vendor', 'Partially Material', 'Material Recieved at Store'];

const ListPurchase = () => {
    const isMobile = useMediaQuery('(max-width:1024px)');


    const [activeStep, setActiveStep] = React.useState(0);

    const [activeSteps, setActiveSteps] = React.useState({});
    const [filledSteps, setFilledSteps] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [itemFilledSteps, setItemFilledSteps] = useState({});

    const handleStep = (itemId, step) => {
        setActiveSteps((prev) => {
            const newSteps = { ...prev, [itemId]: step };
            for (let i = 0; i < step; i++) {
                newSteps[itemId] = i + 1;
            }
            return newSteps;
        });
    };

    const pur = useSelector(state => state.purchase.purchase);


    const getUnfilledFields = (purchaseData) => {
        const fields = [
            { name: 'SrNo', step: 0, label: 'Purchase Order(PO) Generate' },
            { name: '', step: 1, label: 'Partially Payment' },
            { name: '', step: 2, label: 'Payment to Vendor' },
            { name: '', step: 3, label: 'Partially Material' },
            { name: '', step: 4, label: 'Material Recieved at Store' },
        ];

        const unfilledFields = fields.filter(field => !purchaseData[field.name]);
        const firstIncompleteStep = unfilledFields.length > 0 ? unfilledFields[0].step : fields.length;

        return { unfilledFields, firstIncompleteStep };
    };

    // const handleEdit = (id) => {
    //     const purchaseData = purchase?.find((v) => v._id === id);
    //     if (purchaseData) {
    //         const { unfilledFields } = getUnfilledFields(purchaseData);
    //         const completedSteps = getCompletedSteps(purchaseData);
    //         navigate('/admin/add-purchase', {
    //             state: {
    //                 ...purchaseData,
    //                 unfilledFields,
    //                 activeStep: completedSteps,
    //                 completedSteps: completedSteps
    //             }
    //         });
    //     }
    //     // navigate('/admin/add-purchase');

    // };

    const handleEdit = (id) => {
        const purchaseData = purchase?.find((v) => v._id === id);
        if (purchaseData) {
            const { unfilledFields, firstIncompleteStep } = getUnfilledFields(purchaseData);
            navigate('/admin/add-purchase', {
                state: {
                    ...purchaseData,
                    unfilledFields,
                    activeStep: firstIncompleteStep,
                    completedSteps: getCompletedSteps(purchaseData)
                }
            });
        }
    };


    // const getUnfilledFields = (purchaseData) => {
    //     const fields = [
    //         { name: 'SrNo', step: 0, label: 'Purchase Order(PO) Generate' },
    //         { name: 'partiallyPayment', step: 1, label: 'Partially Payment' },
    //         { name: 'paymentToVendor', step: 2, label: 'Payment to Vendor' },
    //         { name: 'partiallyMaterial', step: 3, label: 'Partially Material' },
    //         { name: 'materialReceivedAtStore', step: 4, label: 'Material Received at Store' },
    //     ];

    //     const unfilledFields = fields.filter(field => !purchaseData[field.name]);
    //     const firstIncompleteStep = unfilledFields.length > 0 ? unfilledFields[0].step : fields.length;

    //     return { unfilledFields, firstIncompleteStep };
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

    useEffect(() => {
        setActiveSteps({ ...activeSteps });
    }, []);


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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



    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    useEffect(() => {
        dispatch(getPurchase());
        dispatch(getProducts());

        const initialSteps = {};
        const initialFilledSteps = {};
        purchase.forEach(item => {
            initialSteps[item._id] = item.completedSteps || 0;
            initialFilledSteps[item._id] = item.filledSteps || [];
        });
        setActiveSteps(initialSteps);
        setItemFilledSteps(initialFilledSteps);
    }, [dispatch]);

    const MobileStepper = ({ steps, activeStep, filledSteps }) => {
        const isVerySmallScreen = useMediaQuery('(max-width:425px)');
        const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

        if (isVerySmallScreen) {
            const firstRowSteps = steps.slice(0, 3);
            const secondRowSteps = steps.slice(3, 5);

            const renderStepper = (stepArray, startIndex) => (
                <Stepper alternativeLabel activeStep={activeStep - startIndex} connector={<ColorlibConnector />}>
                    {stepArray.map((label, index) => {
                        const stepIndex = startIndex + index;
                        const isCompleted = filledSteps.includes(stepIndex);
                        const isActive = stepIndex === activeStep;
                        return (
                            <Step key={label} completed={isCompleted}>
                                <StepLabel
                                    StepIconComponent={ColorlibStepIcon}
                                    icon={stepIndex + 1}
                                    StepIconProps={{
                                        active: isActive,
                                        completed: isCompleted
                                    }}
                                >
                                    <Typography
                                        style={{
                                            color: isCompleted ? theme.palette.mode === 'dark' ? '#6da2cd' : "#6da2cd" :
                                                isActive ? theme.palette.mode === 'dark' ? '#fff' : "#000" : '',
                                            fontWeight: '600',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            );

            return (
                <Box>
                    {renderStepper(firstRowSteps, 0)}
                    <Box sx={{ my: 1 }} />
                    {renderStepper(secondRowSteps, 3)}
                    <Box sx={{ my: 1 }} />
                </Box>
            );
        } else if (isMediumScreen) {
            const firstRowSteps = steps.slice(0, 5);

            const renderStepper = (stepArray, startIndex) => (
                <Stepper alternativeLabel activeStep={activeStep - startIndex} connector={<ColorlibConnector />}>
                    {stepArray.map((label, index) => {
                        const stepIndex = startIndex + index;
                        const isCompleted = filledSteps.includes(stepIndex);
                        const isActive = stepIndex === activeStep;
                        return (
                            <Step key={label} completed={isCompleted}>
                                <StepLabel
                                    StepIconComponent={ColorlibStepIcon}
                                    icon={stepIndex + 1}
                                    StepIconProps={{
                                        active: isActive,
                                        completed: isCompleted
                                    }}
                                >
                                    <Typography
                                        style={{
                                            color: isCompleted ? theme.palette.mode === 'dark' ? '#6da2cd' : "#6da2cd" :
                                                isActive ? theme.palette.mode === 'dark' ? '#fff' : "#000" : '',
                                            fontWeight: '600',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            );

            return (
                <Box>
                    {renderStepper(firstRowSteps, 0)}
                    <Box sx={{ my: 1 }} />
                </Box>
            );
        }

        return null;
    };

    const handleAddMarketing = () => {
        navigate('/admin/add-purchase');
    }

    const purchase = useSelector(state => state.purchase.purchase);

    useEffect(() => {
        dispatch(getPurchase());
        dispatch(getVendors());
        dispatch(getWarehouses());
        dispatch(getTerms());
    }, [])

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteliasoning, setDeleteliasoning] = useState(null);
    const [deleteMarketing, setDeleteMarketing] = useState(null);

    const handleDelete = (id) => {
        setDeleteMarketing(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteMarketing) {
            dispatch(deletePurchase(deleteMarketing)).then(() => {
                dispatch(getPurchase());
            });
            setDeleteConfirmOpen(false);
            setDeleteMarketing(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeleteMarketing(null);
    }

    const productData = useSelector(state => state.products.products.products);
    const vendors = useSelector(state => state.vendors.vendors);
    const terms = useSelector(state => state.Terms.Terms);
    const warehouses = useSelector(state => state.warehouses.warehouses);


    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

    const roles = useSelector(state => state.roles.roles);

    useEffect(() => {
        if (roles.length > 0) {
            const userRole = roles.find((v) => v._id === role);
            const canAccessPage = userRole?.permissions.includes("Purchase");

            if (!canAccessPage) {
                console.log("Access denied: You do not have permission to access this page.");
                navigate('/admin/dashboard');
            }
        }
    }, [roles, role, navigate]);


    const filteredPurchases = purchase.filter(v =>
        v.SrNo.toString().includes(searchTerm) ||
        v.multipledata?.some(data =>
            productData?.find(a => a._id === data.productName)?.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productData?.find(a => a._id === data.productName)?.Desacription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productData?.find(a => a._id === data.productName)?.HSNcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendors?.find(vendor => vendor._id === data.vendor)?.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouses?.find(warehouse => warehouse._id === data.werehouse)?.wareHouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.unitPrice.toString().includes(searchTerm) ||
            data.Qty.toString().includes(searchTerm) ||
            data.gst.toString().includes(searchTerm) ||
            data.total.toString().includes(searchTerm) ||
            data.gstAmount.toString().includes(searchTerm)
        ) ||
        v.taxableAmount.toString().includes(searchTerm) ||
        v.totalGstAmount.toString().includes(searchTerm) ||
        v.amountTotal.toString().includes(searchTerm)
    );

    const getCurrentDate = () => {
        return format(new Date(), 'dd-MM-yyyy');
    };

    const formatCurrency = (value) => {
        if (typeof value === 'number') {
            return value.toFixed(2);
        }
        return '0.00';
    };

    const orderDetails = {
        billTo: {
            companyName: 'Tvarit Energy LLP.',
            address: '707 - Twin Star, North Block, Near Nana Mava Circle, 150 Ft Ring Road, Rajkot, Gujarat - 360005',
            gst: '24AAWFT9397E1ZX',
            contactNumber: '+91 97445 71483',
            email: 'info@tvaritenergy.in',
            website: 'www.tvaritenergy.in',
        },
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const printRef = useRef();

    const handlePrint = (id) => {
        const purchaseData = purchase?.find((v) => v._id === id);
        setSelectedPurchase(purchaseData);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPurchase(null);
    };

    const handleConfirmPrint = () => {
        // Implement your print logic here
        console.log("Printing purchase:", selectedPurchase);
        handleCloseDialog();
    };

    // const calculateGST = () => (orderDetails.subTotal * orderDetails.gst) / 100;
    // const calculateTotal = () => orderDetails.subTotal + calculateGST();


    const generatePrintContent = () => {
        const printContent = document.createElement('div');
        printContent.innerHTML = printRef.current.innerHTML;
        printContent.style.color = '#1A2B4F';
        printContent.style.backgroundColor = 'white';
        printContent.style.padding = '20px';
        printContent.style.width = '100%'; // Ensure full width
        printContent.style.boxSizing = 'border-box'; // Include padding in width calculation

        const purchaseOrderElement = printContent.querySelector('.purchase-order-title');
        if (purchaseOrderElement) {
            purchaseOrderElement.style.color = '#1A2B4F';
        }

        const logoElement = printContent.querySelector('.pdf-logo');
        if (logoElement) {
            logoElement.src = '../../assets/images/logo/logo.svg';
        }

        const tables = printContent.querySelectorAll('table');
        tables.forEach(table => {
            table.style.backgroundColor = 'white';
        });

        const tableHeaders = printContent.querySelectorAll('td');
        tableHeaders.forEach(header => {
            header.style.backgroundColor = 'white';
            header.style.color = '#1A2B4F';
        });

        const typographyElements = printContent.querySelectorAll('Typography');
        typographyElements.forEach(element => {
            element.style.color = '#1A2B4F';
        });

        return printContent;
    };


    // const downloadPDF = () => {
    //     const originalColor = document.body.style.color;
    //     document.body.style.color = 'black';

    //     html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'a4');
    //         const imgWidth = 210 - 20;
    //         const pageHeight = pdf.internal.pageSize.height;
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //         let heightLeft = imgHeight;

    //         let position = 10;

    //         pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    //         heightLeft -= pageHeight;

    //         while (heightLeft >= 0) {
    //             position = heightLeft - imgHeight;
    //             pdf.addPage();
    //             pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    //             heightLeft -= pageHeight;
    //         }

    //         pdf.setTextColor(0, 0, 0);
    //         pdf.setFontSize(16);
    //         pdf.setTextColor(31, 47, 88);
    //         pdf.setFont(undefined, "bold");
    //         const textWidth = pdf.getTextWidth('PURCHASE ORDER');
    //         const xPosition = 210 - 25 - textWidth;
    //         pdf.text('PURCHASE ORDER', xPosition, 20, { charSpace: 1 });
    //         pdf.setLineWidth(2);


    //         pdf.save('purchase_order.pdf');

    //         // Restore original text color
    //         document.body.style.color = originalColor;
    //     });
    // };


    const downloadPDF = () => {
        const printContent = generatePrintContent();
        document.body.appendChild(printContent);

        html2canvas(printContent, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: true,
            onclone: (clonedDoc) => {
                clonedDoc.body.style.width = '210mm'; // A4 width
                clonedDoc.body.style.height = '297mm'; // A4 height
                const logoElement = printContent.querySelector('.pdf-logo');
                if (logoElement) {
                    logoElement.src = '../../assets/images/logo/logo.svg';
                }
            }
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210 - 20;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('purchase_order.pdf');
        }).catch(err => {
            console.error('Error generating PDF:', err);
        }).finally(() => {
            // Always remove the temporary element from the actual document
            if (document.body.contains(printContent)) {
                document.body.removeChild(printContent);
            }
        });
    };



    return (
        <Box m="20px">
            <Header
                title="PURCHASE"
                subtitle="Manage Your Purchase Here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMarketing}>
                    Add purchase
                </Button>
            </Box>

            <Box
                sx={{ display: { xs: "block", md: "flex" }, justifyContent: "space-between", marginTop: "20px" }}
            >
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: { xs: '100%', md: '300px' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#566585',
                            },
                            '&:hover fieldset': {
                                borderColor: '#566585',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#566585',
                                borderWidth: '2px',
                            },
                        },
                        mb: { xs: 2 },
                    }}
                />
            </Box>

            <Box sx={memoizedStyles}></Box>

            {filteredPurchases?.length > 0 ? (
                filteredPurchases.map((v) => {
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
                                                        warehouses?.find((vi) => vi._id === v.werehouse)?.wareHouseName
                                                    }
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                </li>
                                                <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                </li>
                                            </ul>
                                        </Typography>
                                    </Grid>
                                )}

                                {isMobile ? (
                                    <>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Grid sx={{ textAlign: 'start', marginBottom: 2, marginTop: 1 }}>
                                                <IconButton aria-label="edit" style={{ color: "white" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handleEdit(v._id)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="delete" style={{ color: "white" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }} onClick={() => handleDelete(v._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
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
                                                </ul>
                                                <ul>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                        {v.dateAdded ? format(new Date(v.dateAdded), 'yyyy-MM-dd') : 'N/A'}
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
                                                            warehouses?.find((vi) => vi._id === v.werehouse)?.wareHouseName
                                                        }
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    </li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;
                                                    </li>
                                                </ul>
                                            </Typography>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Grid sx={{ textAlign: 'start', marginBottom: 2 }}>
                                                <IconButton aria-label="print" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handlePrint(v._id)}>
                                                    <PrintIcon />
                                                </IconButton>
                                                <IconButton aria-label="edit" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                    onClick={() => handleEdit(v._id)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="delete" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }} onClick={() => handleDelete(v._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Box>
                                    </>
                                )}
                            </Grid>

                            {isMobile ? (
                                <MobileStepper
                                    steps={steps}
                                    activeStep={getCompletedSteps(pur?.find(item => item._id === v._id))}
                                    filledSteps={pur?.find((a) => a._id === v._id)?.filledSteps?.map(v => parseInt(v)) || []}
                                />
                            ) : (
                                <Stepper
                                    className='round_r'
                                    sx={{ mt: 3 }}
                                    alternativeLabel
                                    // activeStep={activeStep}
                                    activeStep={getCompletedSteps(pur?.find(item => item._id === v._id))}
                                    connector={<ColorlibConnector />}
                                >
                                    {steps.map((label, index) => (
                                        <Step key={label} completed={
                                            pur?.find((a) => a._id === v._id)?.filledSteps
                                                ?.map((v) => parseInt(v))
                                                .includes(index)} onClick={() => handleStep(index)}>
                                            <StepLabel
                                                StepIconComponent={ColorlibStepIcon}
                                                StepIconProps={{
                                                    filled: filledSteps.includes(index)
                                                }}
                                            >
                                                <Typography style={{
                                                    color: pur?.find((a) => a._id === v._id)?.filledSteps
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
                            )}
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


            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogContent>
                    <Box sx={{ padding: 2 }} ref={printRef}>
                        <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 4 }}>
                            <Grid item>
                                <Box
                                    component="img"
                                    className='pdf-logo'
                                    src={(theme.palette.mode === "dark" ? '../../assets/images/logo/dark-logo.png' : '../../assets/images/logo/logo.svg')}
                                    alt="Tvarit Energy LLP Logo"
                                    sx={{ width: 150 }}
                                />
                            </Grid>
                            <Grid item>
                                <Box sx={{ borderBottom: '2px solid #FB9822', marginBottom: 2 }}>
                                    <Typography
                                        variant="h5"
                                        className="purchase-order-title"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '25px',
                                            letterSpacing: '5px',
                                            textAlign: 'right',
                                            color: theme.palette.mode === "dark" ? 'white' : '#1F2F58',
                                            position: 'relative',
                                            paddingBottom: '4px'
                                        }}
                                    >

                                        PURCHASE ORDER
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <Grid item xs={6}>
                                <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '3px' }}>BILL TO</Typography>
                                </Box>
                                <Grid container direction="column" spacing={1} sx={{ marginTop: '10px' }}>
                                    <Grid item container>
                                        <Grid item xs={4}><Typography sx={{ fontWeight: '700' }}>Company Name</Typography></Grid>
                                        <Grid item xs={1}><Typography sx={{ fontWeight: '700' }}>:</Typography></Grid>
                                        <Grid item xs={7}><Typography sx={{ fontWeight: '700' }}>{orderDetails.billTo.companyName}</Typography></Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Address</Typography></Grid>
                                        <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                        <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{orderDetails.billTo.address}</Typography></Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>GST No</Typography></Grid>
                                        <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                        <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{orderDetails.billTo.gst}</Typography></Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact No</Typography></Grid>
                                        <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                        <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{orderDetails.billTo.contactNumber}</Typography></Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Email</Typography></Grid>
                                        <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                        <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{orderDetails.billTo.email}</Typography></Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Website</Typography></Grid>
                                        <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                        <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{orderDetails.billTo.website}</Typography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                {/* <Typography>Date: {orderDetails.date}</Typography>
                                <Typography>PO #: {orderDetails.poNumber}</Typography> */}

                                <Grid item container>
                                    <Grid item xs={4} sx={{ textAlign: 'right' }}><Typography sx={{ fontWeight: '600' }}>Date&nbsp;&nbsp;:&nbsp;&nbsp;</Typography></Grid>
                                    <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{format(new Date(), 'dd-MM-yyyy')}</Typography></Grid>
                                </Grid>

                                <Grid item container>
                                    <Grid item xs={4} sx={{ textAlign: 'right' }}><Typography sx={{ fontWeight: '600' }}>PO #&nbsp;&nbsp;:&nbsp;&nbsp;</Typography></Grid>
                                    <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}> {selectedPurchase?.SrNo || 'N/A'}</Typography></Grid>
                                </Grid>


                                {/* <Typography>Date:  {selectedPurchase?.dateAdded ? format(new Date(selectedPurchase.dateAdded), 'dd-MM-yyyy') : 'N/A'}</Typography>
                                <Typography>PO #: {selectedPurchase?.SrNo || 'N/A'}</Typography> */}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '3px' }}>VENDOR</Typography>
                                </Box>

                                <Box sx={{ marginTop: '10px', wordSpacing: '2px' }}>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Company Name</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{vendors?.find((vendor) => vendor._id === selectedPurchase?.vendor)?.businessName || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Address</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{vendors?.find((vendor) => vendor._id === selectedPurchase?.vendor)?.officeAddress || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact Person</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{vendors?.find((vendor) => vendor._id === selectedPurchase?.vendor)?.contactPersonalDetails[0].contactPersonName || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact No</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{vendors?.find((vendor) => vendor._id === selectedPurchase?.vendor)?.contactPersonalDetails[0].contactNumber || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        {/* {vendors?.find((vendor) => vendor._id === selectedPurchase?.vendor)?.contactPersonalDetails.map((contact, index) => (
                                            <React.Fragment key={index}>
                                                <Grid item container>
                                                    <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact Person {index + 1}</Typography></Grid>
                                                    <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                                    <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{contact.contactPersonName || 'N/A'}</Typography></Grid>
                                                </Grid>
                                                <Grid item container>
                                                    <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact No {index + 1}</Typography></Grid>
                                                    <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                                    <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{contact.contactNumber || 'N/A'}</Typography></Grid>
                                                </Grid>
                                            </React.Fragment>
                                        ))} */}
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '3px' }}>SHIP TO</Typography>
                                </Box>
                                <Box sx={{ marginTop: '10px', wordSpacing: '2px' }} >
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Company Name</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{warehouses?.find((w) => w._id === selectedPurchase?.werehouse)?.wareHouseName || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Address</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{warehouses?.find((w) => w._id === selectedPurchase?.werehouse)?.address || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact Person</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{warehouses?.find((w) => w._id === selectedPurchase?.werehouse)?.contactPersonName || 'N/A'}</Typography></Grid>
                                        </Grid>
                                        <Grid item container>
                                            <Grid item xs={4}><Typography sx={{ fontWeight: '600' }}>Contact No</Typography></Grid>
                                            <Grid item xs={1}><Typography sx={{ fontWeight: '600' }}>:</Typography></Grid>
                                            <Grid item xs={7}><Typography sx={{ fontWeight: '600' }}>{warehouses?.find((w) => w._id === selectedPurchase?.werehouse)?.contactNumber || 'N/A'}</Typography></Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>

                        <TableContainer sx={{ marginTop: 2 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#293754' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>SR. NO.</TableCell>
                                        <TableCell sx={{ color: 'white' }}>PRODUCT NAME</TableCell>
                                        <TableCell sx={{ color: 'white' }}>DESCRIPTION</TableCell>
                                        <TableCell sx={{ color: 'white' }}>HSN CODE</TableCell>
                                        <TableCell sx={{ color: 'white' }}>QTY.</TableCell>
                                        <TableCell sx={{ color: 'white' }}>UNIT PRICE</TableCell>
                                        <TableCell sx={{ color: 'white' }}>TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedPurchase?.multipledata?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: '600' }}>{index + 1}</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>{productData?.find((p) => p._id === item.productName)?.productName || 'N/A'}</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>{productData?.find((p) => p._id === item.productName)?.Desacription || 'N/A'}</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>{productData?.find((p) => p._id === item.productName)?.HSNcode || 'N/A'}</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>{item.Qty}</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>Rs. {item.unitPrice}</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>Rs. {item.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ marginBottom: '10px', fontWeight: '700' }}>Comment or Special Instructions:</Typography>
                                <Grid container>
                                    {selectedPurchase?.terms && selectedPurchase.terms.length > 0 ? (
                                        selectedPurchase.terms.map((term, index) => (
                                            // <Grid item xs={12} key={index}>
                                            //     <Typography variant="body2">
                                            //         <strong>{index + 1} .</strong> {terms?.find((t) => t._id === term)?.name || 'N/A'}
                                            //     </Typography>
                                            // </Grid>
                                            <Grid item xs={12} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ marginRight: '8px', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                                                    <span style={{ fontSize: '20px', lineHeight: '0' }}>•</span>
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: '600' }}>
                                                    {terms?.find((t) => t._id === term)?.name || 'N/A'}
                                                    {terms?.find((t) => t._id === term)?.description ?
                                                        ` - ${terms.find((t) => t._id === term).description}`
                                                        : ''}
                                                </Typography>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{ fontWeight: '600' }}><strong>-</strong></Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TableContainer>
                                    <Table sx={{ '& td, & th': { border: '1px solid #1A2B4F' } }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: '600' }}><strong>Taxable Amount :</strong></TableCell>
                                                <TableCell align="right" sx={{ fontWeight: '600' }}>Rs. {formatCurrency(selectedPurchase?.taxableAmount)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: '600' }}><strong>Total GST Amount :</strong></TableCell>
                                                <TableCell align="right" sx={{ fontWeight: '600' }}>Rs. {formatCurrency(selectedPurchase?.totalGstAmount)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: '700' }}><strong>TOTAL :</strong></TableCell>
                                                <TableCell align="right" sx={{ fontWeight: '700' }}><strong>Rs. {formatCurrency(selectedPurchase?.amountTotal)}</strong></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="flex-end" style={{ paddingTop: '150px' }}>
                            <Grid item>
                                <Typography variant="body1" sx={{ fontWeight: '600' }}>Company Stamp & Sign</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={downloadPDF} color="primary">Download PDF</Button>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this Purchase?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>

        </Box >


    );
};

export default ListPurchase;