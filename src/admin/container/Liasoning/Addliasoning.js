import React, { useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Grid, StepConnector, stepConnectorClasses, Stepper, Step, StepLabel, useTheme, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, useMediaQuery, Dialog, DialogContent, DialogActions, DialogTitle, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
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
import { getRoles } from '../../../redux/slice/roles.slice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs; // Set the virtual file system

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


const steps = ['Application Submitted', 'FQ Status', 'FQ Paid', 'Site Details', 'Net Meter Document Upload', 'Net Meter Document Qurier', 'Net Meter Install', 'Subcidy Claim Process', 'Subcidy Received Status'];

const ListResidential = () => {
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

    const lis = useSelector(state => state.liasoning.Liasoning);

    const getUnfilledFields = (liasoningData) => {
        const fields = [
            { name: 'fileNo', step: 0, label: 'Application Submitted' },
            { name: 'FQPayment', step: 1, label: 'FQ Status' },
            { name: 'AmountL', step: 2, label: 'FQ Paid' },
            { name: 'SerialNumber', step: 3, label: 'Site Details' },
            { name: 'Query1', step: 4, label: 'Net Meter Document Upload' },
            { name: 'Query2', step: 5, label: 'Net Meter Document Qurier' },
            { name: 'Query3', step: 6, label: 'Net Meter Install' },
            { name: 'Query4', step: 7, label: 'Subcidy Claim Process' },
            { name: 'Query5', step: 8, label: 'Subcidy Received Status' }
        ];

        const unfilledFields = fields.filter(field => !liasoningData[field.name]);
        const firstIncompleteStep = unfilledFields.length > 0 ? unfilledFields[0].step : fields.length;

        return { unfilledFields, firstIncompleteStep };
    };

    const handleEdit = (fillNo) => {
        const liasoningData = lis?.find((v) => v.fillNo === fillNo);
        if (liasoningData) {
            const { unfilledFields, firstIncompleteStep } = getUnfilledFields(liasoningData);
            const completedSteps = getCompletedSteps(liasoningData);
            navigate('/admin/add-liasoning', {
                state: {
                    ...liasoningData,
                    unfilledFields,
                    activeStep: completedSteps,
                    completedSteps: completedSteps
                }
            });
        }
    };

    const Liasoning = useSelector(state => state.comMarketing.Marketing);

    useEffect(() => {
        dispatch(getCommercialMarketing());
        dispatch(getDealers());
        dispatch(getLiasoning());

        const initialSteps = {};
        const initialFilledSteps = {};
        Liasoning.forEach(item => {
            initialSteps[item._id] = item.completedSteps || 0;
            initialFilledSteps[item._id] = item.filledSteps || [];
        });
        setActiveSteps(initialSteps);
        setItemFilledSteps(initialFilledSteps);
    }, []);

    const DealerRegister = useSelector(state => state.dealer.Dealer);




    const getFQButtonText = (fillNo) => {
        const liasoningItem = lis?.find((a) => a.fillNo === fillNo);
        if (liasoningItem) {
            if (!liasoningItem.fileNo) {
                return "Application Pending";
            }

            if (liasoningItem.Query4) {
                return "Subcidy Received Status";
            }

            if (liasoningItem.Query3) {
                return "Subcidy Claim Process";
            }

            if (liasoningItem.Query2) {
                return "Net Meter Install";
            }
            if (liasoningItem.Query1) {
                return "Net Meter Document Qurier";
            }

            if (liasoningItem.SerialNumber) {
                return "Net Meter Document Upload";
            }

            if (liasoningItem.AmountL) {
                return "Site Details";
            }

            if (liasoningItem.FQPayment) {
                return "FQ Paid";
            }

            const submissionDate = new Date(liasoningItem.createdAt);
            const currentDate = new Date();
            const differenceInMinutes = Math.floor((currentDate - submissionDate) / (1000 * 60));

            if (differenceInMinutes <= 1) {
                return "Application Submitted";
            } else {
                return "FQ Status";
            }
        }
        return "Application Pending";
    };

    const getCompletedSteps = (liasoningItem) => {

        if (!liasoningItem) return 0;
        const stepFields = ['fileNo', 'FQPayment', 'AmountL', 'SerialNumber', 'CheckBox1date', 'CheckBox2date', 'CheckBox3date', 'CheckBox4date', 'CheckBox5date'];
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
    }, [lis]);


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


    const [disabledCards, setDisabledCards] = useState({});

    const handleDisableToggle = (id, e) => {
        e.stopPropagation();
        // setDisabledCards(prev => ({
        //     ...prev,
        //     [fillNo]: true
        // }));
        const statusUpdate = {
            status: "Enabled",
            id: id
        };
        dispatch(editLiasoning(statusUpdate));
    };

    const users = useSelector(state => state.users.users);
    const currentUser = sessionStorage.getItem("id");
    const user = users.find(user => user._id === currentUser);

    const isSuperAdmin = user && user.name === 'Super Admin';
    const handleEnableToggle = (id, e) => {
        e.stopPropagation();
        if (isSuperAdmin) { // Check if the user is a super admin
            const statusU = {
                status: "Disabled",
                id: id
            };
            dispatch(editLiasoning(statusU));
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const getLastQuery = (item) => {
        if (item.Query5) return { query: item.Query5, step: 'subcidyReceivedStatus' };
        if (item.Query4) return { query: item.Query4, step: 'subcidyClaimProcess' };
        if (item.Query3) return { query: item.Query3, step: 'netMeterInstall' };
        if (item.Query2) return { query: item.Query2, step: 'netMeterDocumentQurier' };
        if (item.Query1) return { query: item.Query1, step: 'netMeterDocumentUpload' };
        return null;
    };

    var res = Liasoning.filter((v) => {
        const lias = lis?.find((a) => a?.fillNo === v?.fillNo);
        return lias;
    });

    const filteredAndSortedLiasoning = useMemo(() => {
        let result = Liasoning.filter((v) => {
            const searchRegex = new RegExp(searchTerm, 'i');
            const dealerName = DealerRegister.find(a => a._id === v.Dealer)?.ConsumerName || '';
            const liasoningItem = lis?.find((a) => a?.fillNo === v?.fillNo) || {};
            const lastQuery = getLastQuery(liasoningItem);

            return (
                searchRegex.test(v.ConsumerName) ||
                searchRegex.test(v.fillNo) ||
                searchRegex.test(v.PhoneNumber) ||
                searchRegex.test(v.ConsumerNumber) ||
                searchRegex.test(v.Latitude) ||
                searchRegex.test(v.Longitude) ||
                searchRegex.test(v.City_Village) ||
                searchRegex.test(dealerName) ||
                searchRegex.test(`Dealer: ${dealerName}`) ||
                searchRegex.test(liasoningItem.fileNo || '') ||
                searchRegex.test(liasoningItem.fileDate || '') ||
                searchRegex.test(liasoningItem.FQPayment || '') ||
                searchRegex.test(liasoningItem.AmountL || '') ||
                searchRegex.test(liasoningItem.SerialNumber || '') ||
                (lastQuery && searchRegex.test(lastQuery.query))
            );
        });

        if (filterOption !== 'all') {
            result = result.filter((v) => {
                const liasoningItem = lis.find((a) => a.fillNo === v.fillNo) || {};
                const lastQuery = getLastQuery(liasoningItem);
                const submissionDate = new Date(liasoningItem.createdAt);
                const currentDate = new Date();
                const differenceInMinutes = Math.floor((currentDate - submissionDate) / (1000 * 60));
                // alert("sjdhsvdhv")
                switch (filterOption) {
                    case 'applicationSubmitted':
                        return liasoningItem.fileNo && !liasoningItem.FQPayment && differenceInMinutes <= 1;
                    case 'fqStatus':

                        return (liasoningItem.fileNo && !liasoningItem.FQPayment && differenceInMinutes > 1) ||
                            (liasoningItem.fileNo && !liasoningItem.FQPayment);
                    case 'fqPaid':
                        return liasoningItem.FQPayment && !liasoningItem.AmountL;
                    case 'siteDetails':
                        return liasoningItem.AmountL && !liasoningItem.SerialNumber;
                    case 'netMeterDocumentUpload':

                        return liasoningItem.SerialNumber && !liasoningItem.Query1 && !liasoningItem.Query2 && !liasoningItem.Query3 && !liasoningItem.Query4;
                    case 'netMeterDocumentQurier':
                        return liasoningItem.Query1 && !liasoningItem.Query2;
                    case 'netMeterInstall':
                        return liasoningItem.Query2 && !liasoningItem.Query3;
                    case 'subcidyClaimProcess':
                        return liasoningItem.Query3 && !liasoningItem.Query4;
                    case 'subcidyReceivedStatus':
                        return liasoningItem.Query4;
                    default:
                        return true;
                }
            });
        }

        const getStatusPriority = (item) => {
            const li = lis.find((l) => l.fillNo === item.fillNo) || {};
            if (li.fileNo) return 1;
            if (li.FQPayment) return 2;
            if (li.AmountL) return 3;
            if (li.SerialNumber) return 4;
            if (li.Query1) return 5;
            if (li.Query2) return 6;
            if (li.Query3) return 7;
            if (li.Query4) return 8;
            return 0;
        };

        result.sort((a, b) => {
            const getNumericPart = (fillNo) => {
                const match = fillNo.match(/A(\d+)/);
                return match ? parseInt(match[1], 10) : Infinity;
            };

            const aNumeric = getNumericPart(a.fillNo);
            const bNumeric = getNumericPart(b.fillNo);

            if (aNumeric !== bNumeric) {
                return aNumeric - bNumeric;
            }

            const priorityA = getStatusPriority(a);
            const priorityB = getStatusPriority(b);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return a.fillNo.localeCompare(b.fillNo, undefined, { numeric: true, sensitivity: 'base' });
        });
        return result;
    }, [Liasoning, lis, searchTerm, filterOption, DealerRegister]);

    const statusCounts = useMemo(() => {
        const counts = {
            applicationSubmitted: 0,
            fqStatus: 0,
            fqPaid: 0,
            siteDetails: 0,
            netMeterDocumentUpload: 0,
            netMeterDocumentQurier: 0,
            netMeterInstall: 0,
            subcidyClaimProcess: 0,
            subcidyReceivedStatus: 0,
        };

        // Iterate over the filtered and sorted liasoning data

        res.forEach(item => {
            // const liasoningItem = lis.find((a) => a.fillNo === item.fillNo) || {};
            // Determine the status based on the conditions and increment the corresponding count
            const status = getFQButtonText(item.fillNo);
            switch (status) {
                case "Application Pending":
                    counts.applicationSubmitted++;
                    break;
                case "Application Submitted":
                    counts.applicationSubmitted++;
                    break;
                case "FQ Status":
                    counts.fqStatus++;
                    break;
                case "FQ Paid":
                    counts.fqPaid++;
                    break;
                case "Site Details":
                    counts.siteDetails++;
                    break;
                case "Net Meter Document Upload":
                    counts.netMeterDocumentUpload++;
                    break;
                case "Net Meter Document Qurier":
                    counts.netMeterDocumentQurier++;
                    break;
                case "Net Meter Install":
                    counts.netMeterInstall++;
                    break;
                case "Subcidy Claim Process":
                    counts.subcidyClaimProcess++;
                    break;
                case "Subcidy Received Status":
                    counts.subcidyReceivedStatus++;
                    break;
                default:
                    break;
            }
        });

        return counts;
    }, [filteredAndSortedLiasoning, lis]);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const MobileStepper = ({ steps, activeStep, filledSteps }) => {
        const isVerySmallScreen = useMediaQuery('(max-width:425px)');
        const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');

        if (isVerySmallScreen) {
            const firstRowSteps = steps.slice(0, 3);
            const secondRowSteps = steps.slice(3, 6);
            const thirdRowSteps = steps.slice(6);

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
                    {renderStepper(thirdRowSteps, 6)}
                </Box>
            );
        } else if (isMediumScreen) {
            const firstRowSteps = steps.slice(0, 5);
            const secondRowSteps = steps.slice(5);

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
                    {renderStepper(secondRowSteps, 5)}
                </Box>
            );
        }

        return null;
    };

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteliasoning, setDeleteliasoning] = useState(null);

    const handleDelete = (fillno) => {
        const deleteId = lis?.find((a) => a.fillNo === fillno)?._id || ''
        console.log(deleteId);
        setDeleteliasoning(deleteId);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteliasoning) {
            console.log(deleteliasoning);
            dispatch(deleteLiasoning(deleteliasoning));
            setDeleteConfirmOpen(false);
            setDeleteliasoning(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeleteliasoning(null);
    }

    const role = sessionStorage.getItem('role');
    useEffect(() => {
        dispatch(getRoles())
    }, []);

    const roles = useSelector(state => state.roles.roles);
    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    const canAccessPage = hasPermission("Liasoning");
    // console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }



    // pdf view
    const [selectedpdfOptions, setSelectedpdfOptions] = useState({});
    const [openPdfDialog, setOpenPdfDialog] = useState(false);
    const [openPdfDialog2, setOpenPdfDialog2] = useState(false);
    const [openPdfDialog3, setOpenPdfDialog3] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfError, setPdfError] = useState({});
    const [selectedConsumerName, setSelectedConsumerName] = useState('');
    const [selectedConsumerNumber, setSelectedConsumerNumber] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPinCode, setSelectedPinCode] = useState('');
    const [selectedTaluka, setSelectedTaluka] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedSolarModuleMake, setSelectedSolarModuleMake] = useState('');
    const [selectedSolarModuleWp, setselectedSolarModuleWp] = useState('');
    const [selectedInverterSize, setselectedInverterSize] = useState('');
    const totalCapacity = (selectedInverterSize * selectedSolarModuleWp)
    // const totalCapacity = (selectedInverterSize * selectedSolarModuleWp).toString().slice(0, 3);

    const printRef = useRef();
    const printRef2 = useRef();
    const printRef3 = useRef();

    const handleOptionpdfChange = (event, fillNo) => {
        setSelectedpdfOptions(prevOptions => ({
            ...prevOptions,
            [fillNo]: event.target.value
        }));
        setPdfError(prev => ({ ...prev, [fillNo]: '' }));
    };

    const handleClosePdfDialog = () => {
        setOpenPdfDialog(false);
        setOpenPdfDialog2(false);
        setOpenPdfDialog3(false);
        setSelectedPdf(null);
    };


    const generatePrintContent = () => {
        const printContent = document.createElement('div');
        const printContent2 = document.createElement('div');
        const printContent3 = document.createElement('div');
        if (printRef.current) {
            printContent.innerHTML = printRef.current.innerHTML;
        }
        if (printRef2.current) {
            printContent2.innerHTML = printRef2.current.innerHTML;
        }
        if (printRef3.current) {
            printContent3.innerHTML = printRef3.current.innerHTML;
        }
        printContent.style.width = '100%'; // Ensure the container is full width
        printContent.style.boxSizing = 'border-box';
        printContent.style.color = 'black';
        printContent.style.backgroundColor = 'white';
        printContent.style.padding = '20px';
        printContent.style.width = '100%';
        printContent.style.boxSizing = 'border-box';

        printContent2.style.color = 'black';
        printContent2.style.backgroundColor = 'white';
        printContent2.style.padding = '20px';
        printContent2.style.width = '100%';
        printContent2.style.boxSizing = 'border-box';

        printContent3.style.color = 'black';
        printContent3.style.backgroundColor = 'white';
        printContent3.style.padding = '20px';
        printContent3.style.width = '100%';
        printContent3.style.boxSizing = 'border-box';

        const gridItems = printContent.querySelectorAll('.border_grid');
        gridItems.forEach(item => {
            item.style.borderBottom = '1px solid #343131';
            item.style.borderRight = '1px solid #343131';
        });
        const gridItems2 = printContent.querySelectorAll('.border_grid2');
        gridItems2.forEach(item => {
            item.style.borderBottom = '1px solid #343131';
        });

        const gridItems3 = printContent.querySelectorAll('.border_grid3');
        gridItems3.forEach(item => {
            item.style.borderRight = '1px solid #343131';
        });

        // Set all text to black
        const allTextElements = printContent.querySelectorAll('*');
        allTextElements.forEach(element => {
            element.style.color = 'black';
        });
        // Set all text to black
        const allTextElements2 = printContent2.querySelectorAll('*');
        allTextElements2.forEach(element => {
            element.style.color = 'black';
        });
        // Set all text to black
        const allTextElements3 = printContent3.querySelectorAll('*');
        allTextElements3.forEach(element => {
            element.style.color = 'black';
        });

        const tables = printContent.querySelectorAll('table');
        tables.forEach(table => {
            table.style.width = '100%';
            table.style.backgroundColor = 'white';
            table.style.border = '1px solid #343131';
            table.style.borderCollapse = 'collapse';
        });

        const tables2 = printContent2.querySelectorAll('table');
        tables2.forEach(table => {
            table.style.backgroundColor = 'white';
            table.style.border = '1px solid #343131';
            table.style.borderCollapse = 'collapse';
        });

        const tables3 = printContent3.querySelectorAll('table');
        tables3.forEach(table => {
            table.style.backgroundColor = 'white';
            table.style.border = '1px solid #343131';
            table.style.borderCollapse = 'collapse';
        });

        const tableHeaders = printContent.querySelectorAll('td');
        tableHeaders.forEach(header => {
            header.style.backgroundColor = 'white';
            header.style.color = 'black';
            header.style.border = '1px solid #343131';
            header.style.padding = '5px';
        });

        const tableHeaders2 = printContent2.querySelectorAll('td');
        tableHeaders2.forEach(header => {
            header.style.backgroundColor = 'white';
            header.style.color = 'black';
            header.style.border = '1px solid #343131';
            header.style.padding = '5px';
        });

        const tableHeaders3 = printContent3.querySelectorAll('td');
        tableHeaders3.forEach(header => {
            header.style.backgroundColor = 'white';
            header.style.color = 'black';
            header.style.border = '1px solid #343131';
            header.style.padding = '5px';
        });

        const typographyElements = printContent.querySelectorAll('Typography');
        typographyElements.forEach(element => {
            element.style.color = '#343131';
        });
        const typographyElements2 = printContent2.querySelectorAll('Typography');
        typographyElements2.forEach(element => {
            element.style.color = '#343131';
        });
        const typographyElements3 = printContent3.querySelectorAll('Typography');
        typographyElements3.forEach(element => {
            element.style.color = '#343131';
        });

        // Remove any remaining background colors
        const allElements = printContent.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.backgroundColor = 'white';
        });

        return { printContent, printContent2, printContent3 };
    };


    const downloadPDF = (fileName) => {
        const { printContent, printContent2, printContent3 } = generatePrintContent();

        const convertHtmlToPdfMake = (htmlElement) => {
            const parseElement = (element) => {
                if (element.nodeType === Node.TEXT_NODE) {
                    return element.textContent.trim() ? { text: element.textContent.trim() } : null;
                }

                if (element.nodeType === Node.ELEMENT_NODE) {
                    const childContent = Array.from(element.childNodes)
                        .map(parseElement)
                        .filter(Boolean);

                    const style = window.getComputedStyle(element);
                    const alignment = style.textAlign === 'center' ? 'center' :
                        style.textAlign === 'right' ? 'right' : 'left';

                    switch (element.tagName.toLowerCase()) {
                        case 'h1':
                            return { text: element.textContent, fontSize: 24, bold: true, margin: [0, 20, 0, 10], alignment: 'center' };
                        case 'h2':
                            return { text: element.textContent, fontSize: 20, bold: true, margin: [0, 15, 0, 8], alignment: 'center' };
                        case 'h3':
                            return { text: element.textContent, fontSize: 18, bold: true, margin: [0, 12, 0, 6], alignment: 'center' };
                        case 'h4':
                            return { text: element.textContent, fontSize: 16, bold: true, margin: [0, 10, 0, 5], alignment: 'center' };
                        case 'h6':
                            return { text: element.textContent, fontSize: 15, bold: true, alignment: 'center' };

                        case 'span':
                            return { text: element.textContent, fontSize: 14, bold: true, margin: [0, 10, 0, 5] };

                        case 'p':
                            return { text: childContent, margin: [0, 0, 0, 10], alignment, lineHeight: 1.5 };
                        case 'ul':
                            return { ul: childContent.map(child => ({ text: child.text, margin: [0, 3] })), margin: [20, 5, 0, 10] };
                        case 'ol':
                            return { ol: childContent.map(child => ({ text: child.text, margin: [0, 3] })), margin: [20, 5, 0, 10] };
                        case 'li':
                            return { text: element.textContent, margin: [0, 0, 0, 5] };
                        case 'strong':
                        case 'b':
                            return { text: element.textContent, bold: true };
                        case 'em':
                        case 'i':
                            return { text: element.textContent, italics: true };
                        case 'u':
                            return { text: element.textContent, decoration: 'underline' };
                        case 'br':
                            return { text: '\n' };
                        case 'img':
                            return {
                                image: element.src,
                                width: element.width,
                                height: element.height,
                                alignment,
                                margin: [0, 10, 0, 10]
                            };
                        case 'a':
                            return { text: element.textContent, link: element.href, color: 'blue', decoration: 'underline' };
                        case 'table':
                            const tableBody = [];
                            const rows = element.querySelectorAll('tr');
                            rows.forEach((row, rowIndex) => {
                                const cells = Array.from(row.children);
                                const rowData = [];
                                // Ensure we always have 4 cells per row
                                for (let i = 0; i < 4; i++) {
                                    const cell = cells[i] || { textContent: '' };
                                    const cellContent = {
                                        text: cell.textContent.trim(),
                                        margin: [5, 5, 5, 5],
                                        alignment: i === 0 ? 'center' : 'left',
                                        fillColor: shouldHighlight(rowIndex, i) ? '#FFFF00' : null,
                                    };
                                    rowData.push(cellContent);
                                }
                                tableBody.push(rowData);
                            });

                            return {
                                table: {
                                    headerRows: 1,
                                    widths: ['10%', '25%', '32%', '33%'],
                                    body: tableBody,
                                },
                                layout: {
                                    hLineWidth: function (i, node) { return 1; },
                                    vLineWidth: function (i, node) { return 1; },
                                    hLineColor: function (i, node) { return 'black'; },
                                    vLineColor: function (i, node) { return 'black'; },
                                },
                                margin: [0, 10, 0, 10],
                            };

                        default:
                            if (childContent.length === 1 && typeof childContent[0] === 'string') {
                                return { text: childContent[0], alignment };
                            } else if (childContent.length > 0) {
                                return { stack: childContent, alignment };
                            }
                    }
                }

                return null;
            };

            // Helper function to determine if a cell should be highlighted
            const shouldHighlight = (rowIndex, cellIndex) => {
                if (rowIndex === 0) return false; // Header row is not highlighted
                if (cellIndex === 0 || cellIndex === 1) return false; // First two columns are not highlighted
                return true; // All other cells are highlighted
            };

            return parseElement(htmlElement);
        };

        const content1 = convertHtmlToPdfMake(printContent);
        const content2 = convertHtmlToPdfMake(printContent2);
        const content3 = convertHtmlToPdfMake(printContent3);

        const flattenContent = (content) => {
            if (!content) return [];
            if (!Array.isArray(content)) return [content];
            return content.flatMap(item => {
                if (Array.isArray(item)) return flattenContent(item);
                if (typeof item === 'string') return item.trim() !== '' ? item : [];
                if (item && item.text) return item.text.trim() !== '' ? item : [];
                return item ? [item] : [];
            });
        };

        const combinedContent = [
            ...flattenContent(content1),
            ...(flattenContent(content2).length > 0 ? [{ text: '', pageBreak: 'before' }, ...flattenContent(content2)] : []),
            ...(flattenContent(content3).length > 0 ? [{ text: '', pageBreak: 'before' }, ...flattenContent(content3)] : []) // Ensure content3 is included
        ];

        while (combinedContent.length > 0 &&
            (combinedContent[0] === null ||
                combinedContent[0] === undefined ||
                (typeof combinedContent[0] === 'object' && Object.keys(combinedContent[0]).length === 0) ||
                (combinedContent[0].text && combinedContent[0].text.trim() === ''))) {
            combinedContent.shift();
        }

    };



    const docDefinition = {
        content: [
            {
                text: 'Self-Certification for Solar Roof top Installations up to 10KW',
                style: 'header'
            },
            {
                table: {
                    widths: ['100%'],
                    body: [

                        [
                            {
                                text: `This is to certify that the installation of Solar rooftop power plant along with its associated equipment of capacity ${totalCapacity || 'N/A'} KW at ${selectedConsumerName || 'N/A'} has been carried out by us/me and the details of the installation as well as the test results are as under:`,
                                margin: [0, 10, 0, 5]
                            },
                        ]
                    ]
                }
            },

            { text: '1. Details of Consumer:', style: 'header' },
            {
                table: {
                    widths: ['20%', '40%', '40%'],
                    body: [
                        [
                            { text: 'Name:', bold: true },
                            { text: `${selectedConsumerName || 'N/A'}`, fillColor: '#FFFF00' }, // Dynamic data
                            {
                                text: [
                                    `Address: ${selectedAddress || 'N/A'}\n`, // Dynamic data
                                    `PIN Code: ${selectedPinCode || 'N/A'}` // Dynamic data
                                ],
                                fillColor: '#FFFF00'
                            }
                        ],
                        [
                            { text: 'Electricity Connection no.', bold: true },
                            { text: `87602127927`, fillColor: '#FFFF00' }, // Dynamic data
                            {
                                text: [
                                    `TAL: ${selectedTaluka || 'N/A'}\n`, // Dynamic data
                                    `District: ${selectedDistrict || 'N/A'}` // Dynamic data
                                ],
                                fillColor: '#FFFF00'
                            }
                        ],
                        [
                            { text: 'GUVNL Registration no.', bold: true, fillColor: '#CCCCCC' },
                            { text: 'R-GJPG24-014138275', fillColor: '#FFFF00' },
                            { text: `State: ${selectedState || 'N/A'}`, fillColor: '#FFFF00' } // Dynamic data
                        ]
                    ]
                }
            },
            { text: '2. Details of Solar PV cells and Inverter:', style: 'header' },
            {
                table: {
                    widths: ['5%', '25%', '35%', '35%'],
                    body: [
                        [
                            { text: 'No.', bold: true },
                            { text: 'Particular', bold: true },
                            { text: 'Modules', bold: true },
                            { text: 'Inverter', bold: true }
                        ],
                        [
                            { text: '1' },
                            { text: 'Make' },
                            { text: 'WAAREE', fillColor: '#FFFF00' },
                            { text: 'SOFAR', fillColor: '#FFFF00' }
                        ],
                        [
                            { text: '2' },
                            { text: 'Capacity Wp' },
                            { text: '540', fillColor: '#FFFF00' },
                            { text: '4.0 KW', fillColor: '#FFFF00' }
                        ],
                        [
                            { text: '3' },
                            { text: 'No.of Modules Inverter' },
                            { text: '8', fillColor: '#FFFF00' },
                            { text: '1', fillColor: '#FFFF00' }
                        ],
                        [
                            { text: '4' },
                            { text: 'Total Capacity' },
                            { text: '4.32 KW', fillColor: '#FFFF00' },
                            { text: '4.0 KW', fillColor: '#FFFF00' }
                        ],
                        [
                            { text: '5' },
                            { text: 'Voltage(voc)' },
                            { text: '', fillColor: '#FFFF00' },
                            { text: '', fillColor: '#FFFF00' }
                        ],
                        [
                            { text: '6' },
                            { text: 'Sr.No' },
                            { text: 'Attached Separate Sheet', fillColor: '#FFFF00' },
                            { text: 'Attached Separate Sheet', fillColor: '#FFFF00' }
                        ]
                    ]
                }
            },
            { text: '3. Test Results:', style: 'header' },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'Earth Tester Sr no.- 2100091\nEarth Resistance values for all Earth Pits:\n1. 0.45Ω\n2. 0.42Ω\n3. 0.3Ω\n4. Ω', margin: [5, 5, 5, 5] },
                            { text: 'Meggars Sr.no: - 21007029\nInsulation Resistance:\n1. Phase to Phase: 230MΩ\n2. Phase to Earth: 250MΩ', margin: [5, 5, 5, 5] }
                        ],

                    ]
                }
            },
            {
                table: {
                    widths: ['100%'],
                    body: [

                        [
                            {
                                text: 'The work of aforesaid installation has been completed by us on Date 20/08/2024 and it is to hereby declare that\n\n'
                            },
                        ]
                    ]
                }
            },
            {
                table: {
                    widths: ['100%'],
                    body: [

                        [
                            {
                                text:
                                    'a) All PV modules and its supporting structures have enough mechanical strength and it conforms to the Relevant codes/guidelines prescribed in this behalf.\n\n'
                            },
                        ]
                    ]
                }
            },
            {
                table: {
                    widths: ['100%'],
                    body: [

                        [
                            {
                                text:
                                    'b) All cables/wires, protective switchgears as well as Earthlings are of adequate ratings/size and they conform to the requirements of Central Electricity Authority (Measures relating to safety and electrical supply), Regulations 2010 as well as the relevant codes/guidelines prescribed in this behalf.\n\n'
                            },
                        ]
                    ]
                }
            },
            {
                table: {
                    widths: ['100%'],
                    body: [

                        [
                            {
                                text:
                                    'c) The work of aforesaid Installation has been carried out in conformance with the requirements of Central Electricity Authority (Measures relating to safety and electrical supply), Regulations 2010 and the relevant codes/guidelines prescribed in this behalf. The installation is tested by us and is found safe to be energized.', margin: [5, 5, 5, 5]
                            },
                        ]
                    ]
                }
            },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'Date: 22/08/2024', fillColor: '#FFFF00' },
                            { text: 'Date: 22/08/2024', fillColor: '#FFFF00' }
                        ],
                        [
                            { text: 'Name of Electrical Supervisor: Patel Jaykumar', margin: [5, 5, 5, 5] },
                            { text: 'Signature of Licensed Electrical Contractor\nLicense No.- GJ/RJK/C-03901\nValid up to - 11.2.2029', margin: [5, 5, 5, 5] }
                        ],
                        [
                            { text: 'Permit No.- G/GS-E-010185-BEE-2023', margin: [5, 5, 5, 5] },
                            { text: '', margin: [5, 5, 5, 5] } // Empty cell for alignment
                        ]
                    ]
                }
            },
        ],
        styles: {
            header: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            }
        },
        defaultStyle: {
            fontSize: 10
        }
    };

    const docDefinition2 = {
        content: [
            { text: 'Model Agreement', style: 'header', alignment: 'center', margin: [0, 0, 5, 0], decoration: 'underline', decorationStyle: 'solid', decorationColor: 'black', decorationThickness: 2 },
            { text: 'Between', style: 'subheader', alignment: 'center', margin: [0, 20, 5, 20], decoration: 'underline', decorationStyle: 'solid', decorationColor: 'black', decorationThickness: 2 },
            { text: 'Applicant and the registered/empaneled Vendor for installation of rooftop solar system in residential house of the Applicant under simplified procedure of Rooftop Solar Program Ph-II', style: { 'body': true, 'bold': true, fontSize: 13, alignment: 'justify' } },
            { text: 'This agreement is executed on 22 (Day) 8 (Month) 2024 for design, installation, commissioning and five years comprehensive maintenance of rooftop solar system to be installed under simplified procedure of Rooftop Solar Program Ph-II.', style: 'body', fontSize: 12, marginTop: 10 },
            { text: 'Between', style: 'subheader', alignment: 'center' },
            { text: `${selectedConsumerName} having residential electricity connection with consumer number ${selectedConsumerNumber} PGVCL (DISCOM) ${selectedAddress} (hereinafter referred as Applicant)`, style: 'body', fontSize: 12 },
            { text: 'And', style: 'subheader', alignment: 'center' },
            { text: 'TVARIT ENERGY LLP is registered/ empaneled with the PGVCL (hereinafter referred as DISCOM) and is having registered/functional office at 707 North Block – Twin Star, Nr. Nana Mava Ciricle, Rajkot- 360005.  Both Applicant and the Vendor are jointly referred as Parties.', style: 'body', fontSize: 12 },
            { text: 'Whereas', style: 'subheader', alignment: 'center' },
            { text: '- The Applicant intends to install rooftop solar system under simplified procedure of Rooftop Solar Programme Ph-II of the MNRE.', style: 'body', fontSize: 12 },
            { text: '- The Vendor is registered/empaneled vendor with DISCOM for installation of rooftop solar under MNRE Schemes. The Vendor satisfies all the existing regulation pertaining to electrical safety and license in the respective state and it is not debarred or blacklisted from undertaking any such installations by any state/central Government agency.', style: 'body', fontSize: 12 },
            { text: '- Both the parties are mutually agreed and understand their roles and responsibilities and have no liability to any other agency/firm/stakeholder especially to DISCOM and MNRE.', style: 'body', fontSize: 12 },
            { text: '1. GENERAL TERMS:', style: 'header' },
            { text: '1.1. The Applicant hereby represents and warrants that the Applicant has the sole legal capacity to enter into this Agreement and authorize the construction, installation and commissioning of the Rooftop Solar System (“RTS System”) which is inclusive of Balance of System (“BoS”) on the Applicant’s premises (“Applicant Site”). The Vendor reserves its right to verify ownership of the Applicant Site and Applicant covenants to co-operate and provide all information and documentation required by the Vendor for the same.', style: 'body', fontSize: 12 },
            { text: '1.2. Vendor may propose changes to the scope, nature and or schedule of the services being performed under this Agreement. All proposed changes must be mutually agreed between the Parties. If Parties fail to agree on the variation proposed, either Party may terminate this Agreement by serving notice as per Clause 13.', style: 'body', fontSize: 12 },
            { text: '1.3. The Applicant understands and agrees that future changes in load, electricity usage patterns and/or electricity tariffs may affect the economics of the RTS System and these factors have not been and cannot be considered in any analysis or quotation provided by Vendor or its Authorized Persons (defined below).', style: 'body', fontSize: 12 },
            { text: '2.2. RTS System', style: 'header', margin: [0, 10, 0, 0] },
            { text: '2.1 Total capacity of RTS System will be minimum 3.24k Wp.', style: 'body', fontSize: 12 },
            { text: '2.2. The Solar modules, inverters and BoS will confirm to minimum specifications and DCR requirement of MNRE.', style: 'body', fontSize: 12 },
            { text: '2.3. Solar modules of WAAREE make AHNAY BIFACIAL model, 540Wp capacity each and 20.98% efficiency will be procured and installed by the Vendor.', style: 'body', fontSize: 12 },
            { text: '2.4. Solar inverter of SOFAR make SOFAR-3300TL model, 3.3kW rated output capacity will be procured and installed by the Vendor.', style: 'body', fontSize: 12 },
            { text: '2.5. Module mounting structure has to withstand minimum wind load pressure as specified by MNRE', style: 'body', fontSize: 12 },
            { text: '2.6. Other BoS installations shall be as per best industry practice with all safety and protection gears installed by the vendor.', style: 'body', fontSize: 12 },
            { text: '3. PRICE AND PAYMENT TERMS', style: 'header', margin: [0, 30, 0, 0] },
            { text: '3.1. The cost of RTS System will be Rs.154790(to be decided mutually). The Applicant shall pay the total cost to the Vendor as under:', style: 'body', fontSize: 12 },
            { text: '(i) XX% as an advance on confirmation of the order;', style: 'body', fontSize: 12 },
            { text: '(ii) XX% against Proforma Invoice (PI) before dispatch of solar panels, inverters and other BoS items 	to be delivered;', style: 'body', fontSize: 12 },
            { text: '(iii) XX% after installation and commissioning of the RTS System.', style: 'body', fontSize: 12 },
            { text: '3.2. The order value and payment terms are fixed and will not be subject to any adjustment except as approved in writing by Vendor. The payment shall be made only through bankers’ cheque / NEFT / RTGS / online payment portal as intimated by Vendor. No cash payments shall be accepted by Vendor or its Authorized Person.', style: 'body', margin: [0, 10, 0, 0], fontSize: 12 },
            { text: '4. REPRESENTATIONS MADE BY THE APPLICANT:', style: 'header' },
            { text: '4.1. any timeline or schedule shared by Vendor for the provision of services and delivery of the RTS System is only an estimate and Vendor will not be liable for any delay that is not attributable to Vendor;', style: 'body', fontSize: 12 },
            { text: '4.2. all information disclosed by the Applicant to Vendor in connection with the supply of the RTS System (or any part thereof), services and generation estimation (including, without limitation, the load profile and power bill) are true and accurate, and acknowledges that Vendor has relied on the information produced by the Applicant to customize the RTS System layout and BoS design for the purposes of this Agreement;', style: 'body', fontSize: 12 },
            { text: '4.3. all descriptive specifications, illustrations, drawings, data, dimensions, quotation, fact sheets, price lists and any advertising material circulated/published/provided by Vendor are approximate only;', style: 'body', fontSize: 12 },
            { text: '4.4. any drawings, pre-feasibility report, specifications and plans composed by Vendor shall require the Applicant’s approval within 5 (five) days of its receipt by electronic mail to Vendor and if the Applicant does not respond within this period, the drawings, specifications or plans shall be final and deemed to have been approved by the Applicant;', style: 'body', fontSize: 12 },
            { text: '4.5. the Applicant shall not use the RTS System or any part thereof, other than in accordance with the product manufacturer’s specifications, and covenants that any risk arising from misuse or/and misappropriate use shall be to the account of the Applicant alone.', style: 'body', fontSize: 12 },
            { text: '4.6. The Applicant represents, warrants and covenants that:', style: 'body', fontSize: 12 },
            { text: '(i) all electrical and plumbing infrastructure at the Applicant Site are in conformity with applicable laws;', style: 'body', fontSize: 12 },
            { text: '(ii) the Applicant has the legal capacity to permit unfettered access to Vendor and its Authorized Persons for the purposes of execution and performance of this Agreement;', style: 'body', fontSize: 12 },
            { text: '(iii) the Applicant has and will provide requisite power, water and other requisite resources and storage facilities for construction, installation, operation and maintenance of the RTS System;', style: 'body', fontSize: 12 },
            { text: '(iv) the Applicant will provide support for site fabrication of structure, assembly and fitting of module mounting structure at Applicant Site;', style: 'body', fontSize: 12 },
            { text: '(v) the Applicant will ensure that the Applicant Site is shadow free and free of all encumbrances during the lifetime of the RTS System;', style: 'body', fontSize: 12 },
            { text: '(vi) Applicant should ensure that the Applicant regularly cleans and ensures accessibility and safety to the RTS System, as required by Vendor and dusting frequency in the premises.', style: 'body', fontSize: 12 },
            { text: '(vii)	Vendor is entitled to permit geo-tagging of the Applicant Site as a Vendor installation site;', style: 'body', fontSize: 12 },
            { text: '(viii)	Unless otherwise intimated by the Applicant in writing, Vendor is entitled to take photographs, videos and testimonials of the Applicant and the Applicant Site, and to create content which will become the property of Vendor and the same can be freely used by Vendor as part of its promotional and marketing activities across all platforms as it deems fit;', style: 'body', fontSize: 12 },
            { text: '(ix) the Applicant validates the stability of the Applicant Site for the installation of the RTS System.', style: 'body', fontSize: 12 },
            { text: '5. MAINTENANCE:', style: 'header' },
            { text: '5.1. Vendor shall provide five-year free workmanship maintenance. Vendor shall visit the Applicant’s premises at least once every quarter after commissioning of the RTS System for maintenance purposes.', style: 'body', fontSize: 12 },
            { text: '5.2. During such maintenance visit, Vendor shall check all nuts and bolts, fuses, earth resistance and other consumables in respect of the RTS System to ensure that it is in good working condition.', style: 'body', fontSize: 12 },
            { text: '5.3. Cleaning requirement/expectation from the Applicant side – Applicant responsibility, minimum expectation from Applicant that it will be cleaned regularly as per the dusting frequency.', style: 'body', fontSize: 12 },
            { text: '6. ACCESS AND RIGHT OF ENTRY:', style: 'header' },
            { text: '6.1 The Applicant hereby grants permission to Vendor and its authorized personnel, representatives, associates, officers, employees, financing agents, subcontractors (“Authorized Persons”) to enter the Applicant Site for the purposes of:', style: 'body', fontSize: 12 },
            { text: '(a) conducting feasibility study;', style: 'body', fontSize: 12 },
            { text: '(b) storing the RTS System/any part thereof;', style: 'body', fontSize: 12 },
            { text: '(c) installing the RTS System;', style: 'body', fontSize: 12 },
            { text: '(d) inspecting the RTS System;', style: 'body', fontSize: 12 },
            { text: '(e) conducting repairs and maintenance to the RTS System;', style: 'body', fontSize: 12 },
            { text: '(f) removing the RTS System (or any part thereof), if necessary for any reason whatsoever;', style: 'body', fontSize: 12 },
            { text: '(g) Such other matters as necessary to execute and perform its rights and obligations under this Agreement.', style: 'body', fontSize: 12 },
            { text: '6.2. The Applicant shall ensure that third-party consents necessary for the Authorized Persons to access the Applicant Site are obtained prior to commencement of services under this Agreement.', style: 'body', fontSize: 12, margin: [0, 10, 0, 0] },
            { text: '7. WARRANTIES:', style: 'header' },
            { text: '7.1. Product Warranty: The Applicant shall be entitled to manufacturers’ warranty. Any warranty in relation to RTS System supplied to the Applicant by Vendor under this Agreement is limited to the warranty given by the manufacturer of the RTS System (or any part thereof) to Vendor.', style: 'body', fontSize: 12 },
            { text: '7.2. Installation Warranty: Vendor warrants that all installations shall be free from workmanship defects or BOS defects for a period of five years from the date of installation of the RTS System. The warranty is limited to Vendor rectifying the workmanship or BOS defects at Vendor’s expense in respect of those defects reported by the Applicant, in writing. The Applicant is obliged and liable to report such defects within 15 (fifteen) days of occurrence of such defect.', style: 'body', fontSize: 12 },
            { text: '7.3. Subject to manufacturer warranty, Vendor warrants that the solar modules supplied herein shall have tolerance within a five-percentage range (+/-5%). The peak-power point voltage and the peak-power point current of any supplied solar module and/or any module string (series connected modules) shall not vary by more than 5% (five percent) from the respective arithmetic means for all modules and/or for all module strings, as the case may be, provided the RTS System is properly maintained and the Applicant Site is free from shadow at the time of operation of the RTS System. .', style: 'body', fontSize: 12 },
            { text: '7.4. Exceptions for warranty:', style: 'header' },
            { text: '(a) Any attempt by any person other than Vendor or its Authorized Persons to adjust, modify, repair or provide maintenance to the RTS System, shall disentitle the Applicant of the warranty provided by Vendor hereunder.', style: 'body', fontSize: 12 },
            { text: '(b) Vendor shall not be liable for any degeneration or damage to the RTS System due to any action or inaction on the part of the Applicant.', style: 'body', fontSize: 12 },
            { text: '(c) Vendor shall not be bound or liable to remedy any damage, fault, failure or malfunction of the RTS System owing to external causes, including but not limited to accidents, misuse, neglect, if usage and/or storage and/or installation are non-confirming to product instructions, modifications by the Applicant leading to shading or accessibility issues, failure to perform required maintenance, normal wear and tear, Force Majeure Event, or negligence or default attributable to the Applicant.', style: 'body', fontSize: 12 },
            { text: '(d) Vendor shall not be liable to repair or remedy any accessories or parts added to the RTS System that were not originally sourced by Vendor to the Applicant.', style: 'body', fontSize: 12 },
            { text: '8. PERFORMANCE GUARANTEE', style: 'header' },
            { text: '8.1. Vendor guarantees minimum system performance ratio of 75% as per performance ratio test carried out in adherence to IEC 61724 or equivalent BIS for a period of five years..', style: 'body', fontSize: 12 },
            { text: '9. INSURANCE:', style: 'header' },
            { text: '9.1. Vendor may, at its sole discretion, obtain insurance covering risks of loss/damage to the RTS System (any part thereof) during transit from Vendor’s warehouse until delivery to the Applicant Site and until installation and commissioning.', style: 'body', fontSize: 12 },
            { text: '9.2. Thereafter, all risk shall pass on to the Applicant and the Applicant may accordingly procure relevant insurances.', style: 'body', fontSize: 12 },
            { text: '10. CANCELLATION:', style: 'header' },
            { text: '10.1. The Applicant may cancel the order placed on Vendor within 7 (seven) days from the date of remittance of advance money or the date of order acceptance, whichever is earlier (“Order Confirmation”) by serving notice as per Clause 13', style: 'body', fontSize: 12 },
            { text: '10.2. If the Applicant cancels the order after the expiry of 7 (seven) days from the date of Order Form, the Applicant shall be liable to pay Vendor, a cancellation fee of XX% of the total order value plus costs and expenses incurred by Vendor, including, costs for labour, design, return of products, administrative costs, subvention costs.', style: 'body', fontSize: 12 },
            { text: '10.3.	Notwithstanding the aforesaid, the Applicant shall not be entitled to cancel the Order Form after Vendor has dispatched the RTS System (or any part thereof, including BOS) to the Applicant Site. If Applicant chooses to terminate the Order Form after dispatch, the entire amount paid by the Applicant till date, shall be forfeited by Vendor.', style: 'body', fontSize: 12 },
            { text: '11. LIMITATION OF LIABILITY AND INDEMNITY:', style: 'header' },
            { text: '11.1. To the extent that terms implied by law apply to the RTS System and the services rendered under this Agreement, Vendor’s liability for any breach of those terms is limited to:.', style: 'body', fontSize: 12 },
            { text: '(a) repairing or replacing the RTS System/any part thereof, as applicable; or', style: 'body', fontSize: 12 },
            { text: '(b) Refund of the moneys paid by the Applicant to Vendor, if Vendor cannot fulfil the order.', style: 'body', fontSize: 12 },
            { text: '12. SUSPENSION AND TERMINATION:', style: 'header' },
            { text: '12.1. If the Applicant fails to pay any sum due under this Agreement on the due date, Vendor may, in addition to its other rights under this Agreement, suspend its obligations under this Agreement until all outstanding amounts (including interest due) are paid.', style: 'body', fontSize: 12 },
            { text: '13. NOTICES:', style: 'header' },
            { text: 'Any notice or other communication under this Agreement to Vendor and or to the Applicant, shall be in writing, in English language and shall be delivered or sent: (a) by electronic mail and/or (b) by hand delivery or registered post/courier, at the registered address of Applicant/Vendor.', style: 'body', fontSize: 12 },
            { text: '14. FORCE MAJEURE EVENT:', style: 'header' },
            { text: '14.1. Neither Party shall be in default due to any delay or failure to perform its/his/her/their obligations under this Agreement which arises from or is a consequence of occurrence of an event which is beyond the reasonable control of such Party, and which makes performance of its/his/her/their obligations under this Agreement impossible or so impractical as reasonably to be considered impossible in the circumstances, and includes, but is not limited to, war, riot, civil disorder, earthquake, fire, explosion, storm, flood or other adverse weather conditions, pandemic, epidemic, embargo, strikes, lockouts, labour difficulties, other industrial action, acts of government, unavailability of equipment from vendor, changes requested by the Applicant (“Force Majeure Event”).', style: 'body', fontSize: 12, margin: [0, 10, 0, 0] },
            { text: '15. GOVERNING LAW AND DISPUTE RESOLUTION:', style: 'header' },
            { text: '15.1. The interpretation and enforcement of this Agreement shall be governed by the laws of India.', style: 'body', fontSize: 12, margin: [0, 20, 0, 0] },
            { text: '15.2. In the event of any dispute, controversy or difference between the Parties arising out of, or relating to this Agreement (“Dispute”), both Parties shall make an effort to resolve the Dispute in good faith, failing which, any Party to the Dispute shall be entitled to refer the Dispute to arbitration to resolve the Dispute in the manner set out in this Clause. The rights and obligations of the Parties under this Agreement shall remain in full force and effect pending the award in such arbitration proceeding.', style: 'body', fontSize: 12 },
            { text: '15.3. The arbitration proceeding shall be governed by the provisions of the Arbitration and Conciliation Act, 1996 and shall be settled by a sole arbitrator mutually appointed by the Parties.', style: 'body', fontSize: 12 },
            {
                columns: [
                    { text: `${selectedConsumerName}`, style: 'body', fontSize: 12, margin: [0, 50, 0, 10] },
                    { text: 'TVARIT ENERGY LLP', style: 'body', fontSize: 12, alignment: 'right', margin: [0, 50, 0, 10] }
                ]
            },
            { text: 'Witness:', style: 'body', fontSize: 12, margin: [0, 80, 0, 10] },
            { text: '1.', style: 'body', fontSize: 12, margin: [0, 50, 0, 10] },
            { text: '2.', style: 'body', fontSize: 12, margin: [0, 50, 0, 10] },
        ],
        styles: {
            header: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            subheader: {
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
            },
            body: {
                fontSize: 10,
                margin: [0, 2, 0, 2]
            }
        },
        defaultStyle: {
            fontSize: 10
        }
    };

    const docDefinition3 = {
        content: [
            { text: '(On Stamp Paper of Rs.300/-)', style: 'body', alignment: 'center', bold: true, fontSize: 12 },
            { text: 'Inter Connection Agreement (Provisional)', style: 'body', alignment: 'center', bold: true, fontSize: 12 },
            { text: '(Residential Projects Registered at GEDA / National Portal)', style: 'body', alignment: 'center', bold: true, fontSize: 12 },
            { text: 'Project Registered under New RE Policy-2023', style: 'body', alignment: 'center', bold: true, fontSize: 12, margin: [0, 0, 0, 20] },

            { text: `This Provisional Agreement is made and entered into at UPLETA on this (date) ___ day of (month) ___ (year) 2024 between the Consumer, by the name of ${selectedConsumerName} Consumer Number ${selectedConsumerNumber} premises at KHATKI WADA-1 VASILA, MANZIL KOTHA SERI UPLETA, (hereinafter referred to as "Consumer" which expression shall include its permitted assigns and successors) as first party.`, style: 'body', fontSize: 12, margin: [0, 10, 0, 20] },

            { text: 'AND', style: 'subheader', alignment: 'center' },
            { text: 'Paschim Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the "Distribution Company" or "DISCOM" under the Electricity Act 2003 having its Head Office at, Rajkot (hereinafter referred to as "PGVCL" or "Distribution Licensee" or "DISCOM" which expression shall include its permitted assigns and successors) a Party of the Second Part.', style: 'body', fontSize: 12 },

            { text: 'AND WHEREAS', style: 'header', alignment: 'center' },
            { text: `The solar project of ${selectedConsumerName} has been registered on GEDA Portal on dtd. 12th JULY 2024 to set up Photovoltaic (PV) based Solar Power Generating Plant (SPG) of 4 kw (AC) capacity at his/her/its premises in legal possession including any rooftop or terrace MAHAVIR PARK BLOCK-11, RADHE, DHANK MARG, connected with PGVCL\'s grid at 256 Voltage level for his/her/its own use within the same premises.`, style: 'body', fontSize: 12 },

            { text: 'AND WHEREAS', style: 'header', alignment: 'center' },
            { text: 'Government of Gujarat has declared Gujarat Renewable Energy Policy 2023 on 4.10.2023 operative for the control period from date of its notification (4.10.2023) to 30th September 2028. The RE Project installed and commissioned during the operative period shall become eligible for the benefits and incentives declared under the Policy, for the period of 25 years from the date of commissioning or for the life span of the RE Project System whichever is earlier.', style: 'body', fontSize: 12 },

            { text: 'AND WHEREAS', style: 'header', alignment: 'center' },
            { text: 'In order to facilitate commissioning of the solar projects pursuant to notification of New the Gujarat Renewable energy Policy - 2023 effective from 04.10.2023, PGVCL has agreed to sign this agreement on Provisional basis with Consumer in terms of provisions of the Gujarat RE Policy-2023 and its incorporation in the Gujarat Electricity Regulatory Commission (Net Metering Rooftop Solar PV Grid Interactive Systems Regulations) Notification No. 5 of 2016 and its subsequent amendments subject to', style: 'body', fontSize: 12 },

            { text: `M/s “${selectedConsumerName}” the first party under the agreement, hereby acknowledges that the present agreement has been entered into by both the parties, taking into account the notification of new Gujarat RE policy -2023 and on provisional basis as an interim arrangement subject to change as per further regulation/order/decision of the Hon’ble GERC in relation to Gujarat Renewable Energy Policy 2023 and further agree to incorporate requisite modification and amendments in the agreement as per the same, if required. The first party must not dispute the applicability of the GERC order / Regulation and must make necessary modifications in the agreement as per the applicable GERC order and Regulation. The settlement will be done accordingly.`, style: 'body', fontSize: 12, margin: [0, 10, 0, 0] },

            { text: 'AND WHEREAS', style: 'header', alignment: 'center', },
            { text: 'The Distribution Licensee agrees to provide grid connectivity to the Consumer and injection of the electricity generated from his Solar PV System of capacity   4kw (AC) into the power system of Distribution Licensee as per conditions of this agreement and in compliance with the applicable Policy / rules/ Regulations/ Codes (as amended from time to time) by the Consumer which includes-.', style: 'body', fontSize: 12 },
            { text: '1.	Government of Gujarat Renewable Energy Policy 2023.', style: 'body', fontSize: 12 },
            { text: '2.	Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations, 2010.', style: 'body', fontSize: 12 },
            { text: '3.	Central Electricity Authority (Technical Standards for Connectivity to the Grid) Regulations, 2007 as amended from time to time', style: 'body', fontSize: 12 },
            { text: '4.	Central Electricity Authority (Installation and Operation of Meters) Regulation 2006.', style: 'body', fontSize: 12 },
            { text: '5.	Gujarat Electricity Regulatory Commission (Electricity Supply Code & Related Matters) Regulations, 2015,', style: 'body', fontSize: 12 },
            { text: '6.	Gujarat	Electricity Regulatory Commission	Distribution	Code,	2004	and amendments thereto,', style: 'body', fontSize: 12 },
            { text: '7.	Instruction, Directions and Circulars issued by Chief Electrical Inspector from time to time.', style: 'body', fontSize: 12 },
            { text: '8.	CEA	(Technical	Standards	for	connectivity	of	the	Distributed	Generation) Regulations, 2013 as amended from time to time.', style: 'body', fontSize: 12 },
            { text: '9.	Gujarat Electricity Regulatory Commission (Net Metering Rooftop Solar PV Grid Interactive Systems) Regulations, 2016 as amended from time to time.', style: 'body', fontSize: 12 },
            { text: 'Both the parties hereby agree as follows:', style: 'body', fontSize: 12 },
            { text: '1.	Eligibility:', style: 'header' },
            { text: '1.1 Consumer shall own the Solar PV System set up on its own premises or premises in his legal possession.', style: 'body', fontSize: 12 },
            { text: '1.2 Consumer needs to consume electricity in the same premises where Solar PV System is set up.', style: 'body', fontSize: 12 },
            { text: '1.3 Consumer has to meet the standards and conditions as specified in Gujarat Electricity Regulatory Commission Regulations and Central Electricity Authority Regulations and provisions of Government of Gujarat’s Renewable Policy -2023 for being integrated into grid/distribution system.', style: 'body', fontSize: 12 },
            { text: '2. Technical and Interconnection Requirements:', style: 'header' },
            { text: '2.1 Consumer agrees that his Solar PV System and Metering System will conform to the standards and requirements specified in the Policy, Regulations and Supply Code as amended from time to time.', style: 'body', fontSize: 12 },
            { text: '2.2 Consumer agrees that metering system(s) shall be installed at Solar PV System for recording the solar generation.', style: 'body', fontSize: 12 },
            { text: '2.3 Consumer agrees that he has installed or will install, prior to connection of Solar Photovoltaic System to Distribution Licensee’s distribution system, an isolation  (Both automatic and inbuilt within inverter and external manual relays) and agrees for the Distribution Licensee to have access to and operation of this, if required and for repair & maintenance of the distribution system.', style: 'body', fontSize: 12 },
            { text: '2.4 Consumer agrees that in case of a power outage on Discom’s system, solar photovoltaic system will disconnect/isolate automatically and his plant will not inject power into Licensee’s distribution system.', style: 'body', fontSize: 12 },
            { text: '2.5 All the equipment connected to the distribution system shall be compliant with relevant International (IEEE/IEC) or Indian Standards (BIS) and installations of electrical equipment must comply with Central Electricity Authority (Measures of Safety and Electricity Supply) Regulations, 2010 as amended from time to time.', style: 'body', fontSize: 12 },
            { text: '2.6 Consumer agrees that licensee will specify the interface/inter connection point and metering point.', style: 'body', fontSize: 12 },
            { text: '2.7 Consumer and licensee agree to comply with the relevant CEA Regulations in respect of operation and maintenance of the plant, drawing and diagrams, site responsibility schedule, harmonics, synchronization, voltage, frequency, flicker etc.', style: 'body', fontSize: 12 },
            { text: '2.8 In order to fulfill Distribution Licensee’s obligation to maintain a safe and reliable distribution system, Consumer agrees that if it is determined by the Distribution Licensee that Consumer’s Solar Photovoltaic System either causes damage to and/or produces adverse effects affecting other consumers or Distribution Licensee’s assets, Consumer will have to disconnect Solar Photovoltaic System immediately from the distribution system upon direction from the Distribution Licensee and correct the problem to the satisfaction of distribution licensee at his own expense prior to reconnection.', style: 'body', fontSize: 12 },
            { text: '2.9 The consumer shall be solely responsible for any accident to human being/animals whatsoever (fatal/non-fatal/departmental/non-departmental) that may occur due to back feeding from the Solar Photovoltaic System when the grid supply is off if so decided by CEI. The distribution licensee reserves the right to disconnect the consumer’s installation at any time in the event of such exigencies to prevent accident or damage to man and material.', style: 'body', fontSize: 12 },
            { text: '3.	Clearances and Approvals', style: 'header' },
            { text: '3.1 The Consumer shall obtain all the necessary statutory approvals and clearances (environmental and grid connection related) before connecting the photovoltaic system to the distribution system.', style: 'body', fontSize: 12 },
            { text: '4.	Access and Disconnection', style: 'header' },
            { text: '4.1 Distribution Licensee shall have access to metering equipment and disconnecting means of the Solar Photovoltaic System, both automatic and manual, at all times.', style: 'body', fontSize: 12 },
            { text: '4.2 In emergency or outage situation, where there is no access to the disconnecting means, both automatic and manual, such as a switch or breaker, Distribution Licensee may disconnect service to the premises of the Consumer.', style: 'body', fontSize: 12 },
            { text: '5.	Liabilities', style: 'header' },
            { text: '5.1 Consumer shall indemnify Distribution Licensee for damages or adverse effects from his negligence or intentional misconduct in the connection and operation of Solar Photovoltaic System.', style: 'body', fontSize: 12 },
            { text: '5.2 Distribution Licensee shall not be liable for delivery or realization by the Consumer of any fiscal or other incentive provided by the Central/State Government.', style: 'body', fontSize: 12, margin: [0, 0, 0, 20] },
            { text: '5.3 Distribution Licensee may consider the quantum of electricity generation from the Rooftop Solar PV System owned and operated by individual Residential, Group Housing Societies, and Residential Welfare Association consumers under net metering arrangement towards RPO compliance.', style: 'body', fontSize: 12 },
            { text: '6.	Metering', style: 'header' },
            { text: '6.1 Metering arrangement shall be as per Central Electricity Authority (Installation and Operation of Meters) Regulations, 2006 as amended from time to time.', style: 'body', fontSize: 12 },
            { text: '6.2 Bi-directional meter shall be installed of same accuracy class as installed before Setting up of Rooftop Solar PV System.', style: 'body', fontSize: 12 },
            { text: '7.	Commercial Settlement', style: 'header' },
            { text: 'All the commercial settlements under this agreement shall be on provisional basis taking into account the notification of new Gujarat RE policy-2023 and as an interim arrangement subject to change as per further regulation/order/decision of GERC. Gujarat Electricity Regulatory Commission Regulations for Net Metering Rooftop Solar PV Grid Interactive Systems notification no.5 of 2016 and its subsequent amendments.', style: 'body', fontSize: 12 },
            { text: 'The commercial settlement will be as follows:', style: 'body', fontSize: 12 },
            { text: 'For Residential and common facility connections of Group Housing Societies/ Residential Welfare Association consumers.', style: 'body', fontSize: 12 },
            { text: '(i) In case of net import of energy by the consumer from distribution grid during billing cycle, the energy consumed from Distribution Licensee shall be billed as per applicable tariff to respective category of consumers as approved by the Commission from time to time. The energy generated by Rooftop Solar PV System shall be set off against units consumed (not against load/demand) and consumer shall pay demand charges, other charges, penalty etc. as applicable to other consumers.', style: 'body', fontSize: 12 },
            { text: '(ii) In case of net export of energy by the consumer to distribution grid during billing cycle, Distribution Licensee shall purchase surplus power, after giving set off against consumption during the billing period, at Rs. 2.25/Unit for the first 5 years from commissioning of project and thereafter for the remaining term of the project at 75% of the simple average of tariff discovered and contracted under competitive bidding process conducted by GUVNL for non-park based solar projects in the preceding 6-month period, i.e., either April to September or October to March as the case may be, from the commercial operation date (COD) of the project, subject to approval of Hon’ble GERC. Such surplus purchase shall be utilized for meeting RPO of Distribution Licensee. However, fixed / demand charges, other charges, penalty etc. shall be payable as applicable to other consumers.', style: 'body', fontSize: 12 },
            { text: 'Provided that in case the consumer is setting up additional solar rooftop capacity under the scheme over and above solar rooftop capacity set up prior to this scheme, surplus energy of entire solar rooftop capacity shall be purchased by Distribution Company at the rate of Rs. 2.25/Unit for the first 5 years from commissioning of project and thereafter for the remaining term of the project at 75% of the simple average of tariff discovered and contracted under competitive bidding process conducted by GUVNL for non-park based solar projects in the preceding 6- month period, i.e., either April to September or October to March as the case may be, from the commercial operation date (COD) of the project, treating earlier agreement as cancelled. ', style: 'body', fontSize: 12 },
            { text: 'In case of net injection, net amount receivable by consumer in a bill shall be credited in consumers account and will be adjusted against bill amount payable in subsequent months. However, at the end of year, if net amount receivable by consumer is more than Rs. 100/- and consumer requests for payment, the same may be paid. Such payment shall be made only once in a year based on year end position and request of consumer.', style: 'body', fontSize: 12 },
            { text: '8.	Connection Costs:', style: 'header' },
            { text: 'The Consumer shall bear all costs related to setting up of Solar Photovoltaic System including metering and inter-connection. The Consumer agrees to pay the actual cost of modifications and upgrades to the service line, cost of up gradation of transformer to connect photovoltaic system to the grid in case it is required.', style: 'body', fontSize: 12 },
            { text: '9.	Inspection, Test, Calibration and Maintenance prior to connection', style: 'header' },
            { text: 'Before connecting, Consumer shall complete all inspections and tests finalized in consultation with the (Name of the Distribution license) and if required Gujarat Energy Transmission Corporation Limited (GETCO) to which his equipment is connected. Consumer shall make available to PGVCL all drawings, specifications and test records of the project or generating station as the case may be.', style: 'body', fontSize: 12 },
            { text: '10. Records:', style: 'header' },
            { text: 'Each Party shall keep complete and accurate records and all other data required by each of them for the purposes of proper administration of this Agreement and the operation of the Solar PV System.', style: 'body', fontSize: 12 },
            { text: '11. Dispute Resolution', style: 'header' },
            { text: '11.1 All disputes or differences between the Parties arising out of or in connection with this Agreement shall be first tried to be settled through mutual negotiation, promptly, equitably and in good faith.', style: 'body', fontSize: 12 },
            { text: '11.2 In the event that such differences or disputes between the Parties are not settled through mutual negotiations within sixty (60) days or mutually extended period, after such dispute arises, then for', style: 'body', fontSize: 12 },
            { text: '(a) Any dispute in billing pertaining to energy injection and billing amount, would be settled by the Consumer Grievance Redressal Forum and Electricity Ombudsman.', style: 'body', fontSize: 12 },
            { text: '(b) Any other issues pertaining to the Regulations and its interpretation; it shall be decided by the Gujarat Electricity Regulatory Commission following appropriate prescribed procedure.', style: 'body', fontSize: 12 },
            { text: '12. TERMINATION:', style: 'header' },
            { text: '12.1 The Consumer can terminate the agreement at any time by giving Distribution Licensee 90 days prior notice.', style: 'body', fontSize: 12 },
            { text: '12.2 Distribution Licensee has the right to terminate Agreement with 30 days prior written notice, if Consumer commits breach of any of the terms of this Agreement and does not remedy the breach within 30 days of receiving written notice from Distribution Licensee of the breach.', style: 'body', fontSize: 12 },
            { text: '12.3 Consumer shall upon termination of this Agreement, disconnect the Solar Photovoltaic System from Distribution Licensee’s distribution system within one week to the satisfaction of Distribution Licensee.', style: 'body', fontSize: 12 },
            { text: 'Communication:', style: 'header' },
            { text: 'The names of the officials and their addresses, for the purpose of any communication in relation to the matters covered under this Agreement shall be as under:', style: 'body', fontSize: 12, margin: [0, 10, 0, 40] },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'In respect of the PGVCL \n\n\n Chief Engineer \nPaschim Gujarat Vij Company \n Limited', style: 'subheader', alignment: 'center' },
                            { text: 'In respect of the Consumer \n\n\n (                                               )', style: 'subheader', alignment: 'center' },
                        ],

                    ]
                }
            },



            { text: 'IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be executed by their authorized officers, and copies delivered to each Party, as of the day and year herein above stated.', style: 'body', fontSize: 12, margin: [0, 40, 0, 80] },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'FOR AND ON BEHALF OF PGVCL \n\n\n\n\n\n Authorized Signatory \n\n WITNESSES \n\n 1. ________________ \n\n (                           ) \n\n\n\n 2. ________________ \n\n (                           ) ', style: 'subheader' },
                            { text: 'FOR AND ON BEHALF OF THE PROJECT OWNER \n\n\n\n\n Authorized Signatory \n\n WITNESSES \n\n 1. ________________ \n\n (                           ) \n\n\n\n 2. ________________ \n\n (                           ) ', style: 'subheader' },
                        ],

                    ]
                }
            },
        ],
        styles: {
            header: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            subheader: {
                fontSize: 12,
                bold: true,
                margin: [0, 5, 0, 5]
            },
            body: {
                fontSize: 10,
                margin: [0, 2, 0, 2]
            }
        },
        defaultStyle: {
            fontSize: 10
        }
    };

    return (
        <Box m="20px">
            <Header
                title="LIASONING"
                subtitle="Manage your Liasoning here"
            />

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
                        mb: { xs: 2 }, // Add margin bottom in xs
                    }}
                />
                <FormControl size="small" sx={{ display: { xs: 'block', md: 'inline-flex' }, ml: { xs: 0, md: 2 } }}>
                    <Select
                        value={filterOption}
                        onChange={handleFilterChange}
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected === 'all') {
                                return 'All';
                            }
                            return selected.split(/(?=[A-Z])/).join(' ') + ` (${statusCounts[selected]})`; // Add count here
                        }}
                        sx={{
                            minWidth: { xs: '100%', md: '200px' },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#566585',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#566585',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#566585',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        <MenuItem value="all">All ({statusCounts.applicationSubmitted + statusCounts.fqStatus + statusCounts.fqPaid + statusCounts.siteDetails + statusCounts.netMeterDocumentUpload + statusCounts.netMeterDocumentQurier + statusCounts.netMeterInstall + statusCounts.subcidyClaimProcess + statusCounts.subcidyReceivedStatus})</MenuItem>
                        <MenuItem value="applicationSubmitted">Application Submitted ({statusCounts.applicationSubmitted})</MenuItem>
                        <MenuItem value="fqStatus">FQ Status ({statusCounts.fqStatus})</MenuItem>
                        <MenuItem value="fqPaid">FQ Paid ({statusCounts.fqPaid})</MenuItem>
                        <MenuItem value="siteDetails">Site Details ({statusCounts.siteDetails})</MenuItem>
                        <MenuItem value="netMeterDocumentUpload">Net Meter Document Upload ({statusCounts.netMeterDocumentUpload})</MenuItem>
                        <MenuItem value="netMeterDocumentQurier">Net Meter Document Qurier ({statusCounts.netMeterDocumentQurier})</MenuItem>
                        <MenuItem value="netMeterInstall">Net Meter Install ({statusCounts.netMeterInstall})</MenuItem>
                        <MenuItem value="subcidyClaimProcess">Subcidy Claim Process ({statusCounts.subcidyClaimProcess})</MenuItem>
                        <MenuItem value="subcidyReceivedStatus">Subcidy Received Status ({statusCounts.subcidyReceivedStatus})</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={memoizedStyles}></Box>

            {filteredAndSortedLiasoning.length > 0 ? (
                filteredAndSortedLiasoning.map((v) => {
                    // const liasoningItem = lis.find((a) => a.fillNo === v.fillNo) || {};
                    // const lastQuery = getLastQuery(liasoningItem);          
                    const liasoningItem = lis.find((a) => a.fillNo === v.fillNo) || {};
                    const lastQuery = getLastQuery(liasoningItem);
                    const lastUpdateDate = new Date(liasoningItem.updatedAt || v.updatedAt);
                    const formattedLastUpdate = lastUpdateDate.toLocaleString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });

                    // Get the user ID from lis
                    const userId = liasoningItem.User_id || 'N/A';
                    const useraa = users.find(user => user._id === userId);
                    return (
                        liasoningItem.fillNo === v.fillNo && (
                            <Box className="padding_box" sx={{
                                m: 3, ml: 0, mr: 0, p: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#293040' : "#E5F1FD", color: theme.palette.mode === 'dark' ? 'white' : "black", opacity: liasoningItem.status == "Disabled" ? 1 : 0.5,
                                pointerEvents: liasoningItem.status == "Disabled" ? 'auto' : 'none',
                            }} key={v._id}>
                                <Grid container justifyContent="space-between" xs={12} sm={12} md={12} item>
                                    <Grid item>
                                        <Typography variant="h4" color="#6da2cd">
                                            {v.ConsumerName.toUpperCase()}
                                        </Typography>
                                        <Typography variant="subtitle2" color="black">
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 1, bgcolor: '#134670', padding: "8px 15px" }}
                                            >
                                                {getFQButtonText(v.fillNo)}
                                            </Button>
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <FormControl size="small" sx={{ flexGrow: 1, mr: 1 }}>
                                                    <Select
                                                        value={selectedpdfOptions[v.fillNo] || '0'}
                                                        onChange={(event) => handleOptionpdfChange(event, v.fillNo)}
                                                    >
                                                        <MenuItem value="0">Select Option</MenuItem>
                                                        <MenuItem value="Self-Certification">Self Certification</MenuItem>
                                                        <MenuItem value="Model-Agreement">Model Agreement</MenuItem>
                                                        <MenuItem value="Net-Meter-Agreement-Residential">Net Meter Agreement Residential</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {/* <IconButton aria-label="view" onClick={() => {
                                                    handlePdfView(v.fillNo);
                                                    setSelectedConsumerName(v.ConsumerName);
                                                    setSelectedAddress(Liasoning.find(item => item.fillNo === v.fillNo)?.Address || 'Address not available');
                                                    setSelectedPinCode(Liasoning.find(item => item.fillNo === v.fillNo)?.Pincode || 'Pin Code not available');
                                                    setSelectedTaluka(Liasoning.find(item => item.fillNo === v.fillNo)?.City_Village || 'Taluka not available');
                                                    setSelectedDistrict(Liasoning.find(item => item.fillNo === v.fillNo)?.District_Location || 'District not available');
                                                    setSelectedState(Liasoning.find(item => item.fillNo === v.fillNo)?.District_Location || 'State not available');
                                                    setSelectedSolarModuleMake(Liasoning.find(item => item.fillNo === v.fillNo)?.SolarModuleMake || 'Solar Module Make not available');
                                                    setselectedSolarModuleWp(Liasoning.find(item => item.fillNo === v.fillNo)?.SolarModuleWp || 'Solar Module Wp not available');
                                                    setselectedInverterSize(Liasoning.find(item => item.fillNo === v.fillNo)?.InverterSize || 'Inverter Size not available');
                                                }}>
                                                    <RemoveRedEyeIcon />
                                                </IconButton> */}
                                                <IconButton aria-label="view" onClick={() => {
                                                    const option = selectedpdfOptions[v.fillNo] || '0';
                                                    if (option === '0') {
                                                        setPdfError(prev => ({ ...prev, [v.fillNo]: 'Please select a PDF type' })); // Set error message
                                                    } else {
                                                        setPdfError(prev => ({ ...prev, [v.fillNo]: '' })); // Clear error if valid option
                                                        if (option === 'Self-Certification') {
                                                            setOpenPdfDialog(true);
                                                        } else if (option === 'Model-Agreement') {
                                                            setOpenPdfDialog2(true);
                                                        } else if (option === 'Net-Meter-Agreement-Residential') {
                                                            setOpenPdfDialog3(true);
                                                        }
                                                    }
                                                    // Set dynamic data here if needed
                                                    setSelectedConsumerName(v.ConsumerName);
                                                    setSelectedAddress(Liasoning.find(item => item.fillNo === v.fillNo)?.Address || 'Address not available');
                                                    setSelectedConsumerNumber(Liasoning.find(item => item.fillNo === v.fillNo)?.ConsumerNumber || 'Consumer Number not available');
                                                    setSelectedPinCode(Liasoning.find(item => item.fillNo === v.fillNo)?.Pincode || 'Pin Code not available');
                                                    setSelectedTaluka(Liasoning.find(item => item.fillNo === v.fillNo)?.City_Village || 'Taluka not available');
                                                    setSelectedDistrict(Liasoning.find(item => item.fillNo === v.fillNo)?.District_Location || 'District not available');
                                                    setSelectedState(Liasoning.find(item => item.fillNo === v.fillNo)?.District_Location || 'State not available');
                                                    setSelectedSolarModuleMake(Liasoning.find(item => item.fillNo === v.fillNo)?.SolarModuleMake || 'Solar Module Make not available');
                                                    setselectedSolarModuleWp(Liasoning.find(item => item.fillNo === v.fillNo)?.SolarModuleWp || 'Solar Module Wp not available');
                                                    setselectedInverterSize(Liasoning.find(item => item.fillNo === v.fillNo)?.InverterSize || 'Inverter Size not available');
                                                }}>
                                                    <RemoveRedEyeIcon />
                                                </IconButton>
                                            </Box>
                                            {pdfError[v.fillNo] && (
                                                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                                    {pdfError[v.fillNo]}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>


                                    {!isMobile && (
                                        <Grid item>
                                            <Typography sx={{ whiteSpace: 'pre-line', display: 'flex' }}>
                                                <ul>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>File No</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Contact No.</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Consumer Number</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Dealer</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>Application No.</li>
                                                </ul>
                                                <ul>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;{v.fillNo}</li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;{v.PhoneNumber}</li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;{v.ConsumerNumber}</li>
                                                    <li style={{ listStyleType: 'none' }}>: &nbsp;{
                                                        DealerRegister.map((a) => (a._id === v.Dealer ? a.ConsumerName : ''))
                                                    }</li>
                                                    <li style={{ listStyleType: 'none', fontWeight: '600' }}>: &nbsp; {liasoningItem.fileNo || ''}</li>
                                                </ul>
                                            </Typography>
                                        </Grid>
                                    )}

                                    {isMobile ? (
                                        <>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Grid sx={{ textAlign: 'start', marginBottom: 2, marginTop: 1 }}>

                                                    {!isSuperAdmin && (
                                                        <Box sx={{ display: 'inline-block', bgcolor: '#134670', borderRadius: '4px', padding: '5px', marginLeft: '10px' }}>
                                                            <IconButton aria-label="edit" style={{ color: "white", textAlign: 'fle' }} onClick={() => handleEdit(v.fillNo)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                    {/* {!isSuperAdmin && (
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                            <IconButton aria-label="edit" style={{ color: "white" }} onClick={() => handleEdit(v.fillNo)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Box>
                                                    )} */}
                                                    {isSuperAdmin && (
                                                        <>
                                                            <IconButton aria-label="edit" style={{ color: "white" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                                onClick={() => handleEdit(v.fillNo)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" style={{ color: "white" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }} onClick={() => handleDelete(v.fillNo)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    bgcolor: disabledCards[v.fillNo] ? '#888' : '#134670',
                                                                    padding: "0px 10px",
                                                                    pointerEvents: 'auto',
                                                                    display: liasoningItem.status == 'Disabled' && !isSuperAdmin ? 'inline-flex' : 'none',
                                                                }}
                                                                onClick={(e) => liasoningItem.status == "Disabled" ? handleDisableToggle(liasoningItem._id, e) : handleEnableToggle(liasoningItem._id, e)}
                                                            >
                                                                <IconButton style={{ color: "white", fontSize: "15px" }}>
                                                                    {liasoningItem.status}
                                                                </IconButton>
                                                            </Button>
                                                        </>
                                                    )}
                                                </Grid>

                                                <Grid>
                                                    <Typography sx={{ display: 'flex', whiteSpace: 'pre-line' }}>
                                                        <ul style={{ paddingLeft: '0px' }}>
                                                            <li style={{ listStyleType: 'none', fontWeight: '600', paddingLeft: '0px' }}>Last Update</li>
                                                            <li style={{ listStyleType: 'none', fontWeight: '600', paddingLeft: '0px' }}>Updated By</li>
                                                        </ul>
                                                        <ul>
                                                            <li style={{ listStyleType: 'none' }}> : {formattedLastUpdate}</li>
                                                            <li style={{ listStyleType: 'none', textAlign: 'start' }}> : {useraa?.name}</li>
                                                        </ul>
                                                    </Typography>
                                                </Grid>
                                            </Box>

                                            <Grid item>
                                                <Typography sx={{ whiteSpace: 'pre-line', display: 'flex', width: '265px' }}>
                                                    <ul style={{ paddingLeft: '0px' }}>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>File No</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Contact No.</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Consumer Number</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Dealer</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Application No.</li>
                                                    </ul>
                                                    <ul>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.fillNo}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.PhoneNumber}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.ConsumerNumber}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{
                                                            DealerRegister.map((a) => (a._id === v.Dealer ? a.ConsumerName : ''))
                                                        }</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>: &nbsp; {liasoningItem.fileNo || ''}</li>
                                                    </ul>
                                                </Typography>
                                            </Grid>

                                            <Grid>
                                                <Typography sx={{ whiteSpace: 'pre-line', display: 'flex', width: '265px' }}>
                                                    <ul style={{ paddingLeft: '0px' }}>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Latitude</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Longitude</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>City/Village</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Query</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>User</li>
                                                    </ul>
                                                    <ul>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.Latitude}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.Longitude}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.City_Village}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp; {lastQuery ? lastQuery.query : ''}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp; {useraa?.name}</li>
                                                    </ul>
                                                </Typography>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid>
                                                <Typography sx={{ whiteSpace: 'pre-line', display: 'flex', }}>
                                                    <ul>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Latitude</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Longitude</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>City/Village</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>Query</li>
                                                        <li style={{ listStyleType: 'none', fontWeight: '600' }}>User</li>
                                                    </ul>
                                                    <ul>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.Latitude}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.Longitude}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp;{v.City_Village}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp; {lastQuery ? lastQuery.query : ''}</li>
                                                        <li style={{ listStyleType: 'none' }}>: &nbsp; {useraa?.name}</li>
                                                    </ul>
                                                </Typography>
                                            </Grid>

                                            <Box sx={{ textAlign: 'right' }}>
                                                <Grid sx={{ textAlign: 'start', marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}>

                                                    {!isSuperAdmin && (
                                                        <Box sx={{ display: 'inline-block', bgcolor: '#134670', borderRadius: '4px', paddingY: '5px', paddingX: '10px', marginLeft: '10px' }}>
                                                            <IconButton aria-label="edit" style={{ color: "white", textAlign: 'fle' }} onClick={() => handleEdit(v.fillNo)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                    {isSuperAdmin && (
                                                        <>
                                                            <IconButton aria-label="edit" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }}
                                                                onClick={() => handleEdit(v.fillNo)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" style={{ color: "white", backgroundColor: "#134670" }} sx={{ mr: 2, bgcolor: '#134670', padding: "10px" }} onClick={() => handleDelete(v.fillNo)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    bgcolor: disabledCards[v.fillNo] ? '#888' : '#134670',
                                                                    padding: "0px 10px",
                                                                    pointerEvents: 'auto',
                                                                    display: liasoningItem.status === "Disabled" || isSuperAdmin ? 'inline-flex' : 'none',
                                                                }}
                                                                onClick={(e) => liasoningItem.status == "Disabled" ? handleDisableToggle(liasoningItem._id, e) : handleEnableToggle(liasoningItem._id, e)}
                                                                style={{ color: "white", backgroundColor: "#134670" }}
                                                            >

                                                                <IconButton style={{ color: "white", backgroundColor: "#134670", fontSize: "15px" }}>
                                                                    {liasoningItem.status == 'Disabled' ? 'Disabled' : 'Enabled'}
                                                                </IconButton>
                                                            </Button>

                                                        </>
                                                    )}

                                                </Grid>
                                                <Grid>
                                                    <Typography sx={{ display: 'flex', whiteSpace: 'pre-line' }}>
                                                        <ul style={{ paddingLeft: '0px' }}>
                                                            <li style={{ listStyleType: 'none', fontWeight: '600', paddingLeft: '0px' }}>Last Update</li>
                                                            <li style={{ listStyleType: 'none', fontWeight: '600', paddingLeft: '0px' }}>Updated By</li>
                                                        </ul>
                                                        <ul>
                                                            <li style={{ listStyleType: 'none' }}> : {formattedLastUpdate}</li>
                                                            <li style={{ listStyleType: 'none', textAlign: 'start' }}> : {useraa?.name}</li>
                                                        </ul>
                                                    </Typography>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}
                                </Grid>



                                {
                                    isMobile ? (
                                        // <MobileStepper steps={steps}
                                        //     // activeStep={activeStep}
                                        //     activeStep={getCompletedSteps(lis?.find(item => item.fillNo === v.fillNo))}
                                        // />
                                        <MobileStepper
                                            steps={steps}
                                            activeStep={getCompletedSteps(lis?.find(item => item.fillNo === v.fillNo))}
                                            filledSteps={lis?.find((a) => a.fillNo === v.fillNo)?.filledSteps.map(v => parseInt(v)) || []}
                                        />
                                    ) : (
                                        <Stepper
                                            className='round_r'
                                            sx={{ mt: 3 }}
                                            alternativeLabel
                                            // activeStep={activeStep}
                                            activeStep={getCompletedSteps(lis?.find(item => item.fillNo === v.fillNo))}
                                            connector={<ColorlibConnector />}
                                        >
                                            {steps.map((label, index) => (
                                                <Step key={label} completed={
                                                    lis?.find((a) => a.fillNo === v.fillNo)?.filledSteps
                                                        .map((v) => parseInt(v))
                                                        .includes(index)} onClick={() => handleStep(index)}>
                                                    <StepLabel
                                                        StepIconComponent={ColorlibStepIcon}
                                                        StepIconProps={{
                                                            filled: filledSteps.includes(index)
                                                        }}
                                                    >
                                                        <Typography style={{
                                                            color: lis?.find((a) => a.fillNo === v.fillNo)?.filledSteps
                                                                .map((v) => parseInt(v))
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
                                    )
                                }
                            </Box >
                        )
                    )
                })
            ) : (
                <Box>
                    <Typography variant="h5" color="textSecondary" align="center">
                        No Results Found. Please Try a Different Search Term.
                    </Typography>
                </Box>
            )}

            {/* First PDF */}
            <Dialog open={openPdfDialog} onClose={handleClosePdfDialog} fullWidth maxWidth="md">
                <DialogContent>
                    <Box ref={printRef} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
                        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: "700" }}>
                            Self-Certification for Solar Roof top Installations up to 10KW
                        </Typography>

                        <Box variant="body2" paragraph sx={{ fontSize: 14, border: '1px solid rgba(81, 81, 81, 1)', p: 1 }}>
                            This is to certify that the installation of Solar rooftop power plant along with its associated equipment of capacity {totalCapacity || 'N/A'} KW at {selectedConsumerName || 'N/A'} has been carried out by us/me and the details of the installation as well as the test results are as under:
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="span" sx={{ p: 1, fontWeight: '700' }}>1. Details of Consumer:</Typography>
                            <TableContainer>
                                <Table aria-label="consumer details table">
                                    <TableBody sx={{ border: 1, borderColor: 'divider', padding: '8px' }}>
                                        <TableRow>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} >
                                                Name:
                                            </TableCell>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} >
                                                {selectedConsumerName || 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} rowSpan={3}>
                                                <Grid container spacing={0}>
                                                    <Grid variant="br" item xs={6}>
                                                        Address:
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {selectedAddress || 'N/A'}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        PIN Code:
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {selectedPinCode || 'N/A'}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        Taluka:
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {selectedTaluka || 'N/A'}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        District:
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {selectedDistrict || 'N/A'}
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        State:
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {selectedState || 'N/A'}
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} >
                                                Electricity Connection no.:
                                            </TableCell>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} >
                                                87602127927
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} >
                                                GUVNL Registration no.:
                                            </TableCell>
                                            <TableCell sx={{ p: 0, border: 1, borderColor: 'divider', padding: '8px' }} >
                                                R- GJPG24 -014138275
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer >
                        </Box >

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="span" sx={{ p: 1, fontWeight: '700' }}>2. Details of Solar PV cells and Inverter:</Typography>
                            <TableContainer>
                                <Table sx={{ border: 1, borderColor: 'divider' }} aria-label="solar details table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>No.</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Particular</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Modules</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Inverter</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>1</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Make</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>{selectedSolarModuleMake}</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}>SOFAR</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>2</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Capacity Wp</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>{selectedSolarModuleWp}</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}>4.0 KW</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>3</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>No of Modules Inverter</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>{selectedInverterSize}</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}>1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>4</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Total Capacity</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>{totalCapacity || 'N/A'} KW</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}>4.0 KW</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>5</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Voltage(Voc)</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}></TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>6</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider' }}>Isc (A)</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}>Attached Separate Sheet</TableCell>
                                            <TableCell sx={{ p: 1, borderRight: 1, borderColor: 'divider', color: 'red' }}>Attached Separate Sheet</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} sx={{ border: 1, borderColor: 'divider' }}>
                                                <Typography variant="span" sx={{ fontWeight: '700' }}>3.Test Results:</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, fontWeight: 'bold', border: 1, borderColor: 'divider' }}>Earthing</TableCell>
                                            <TableCell sx={{ p: 1, fontWeight: 'bold', border: 1, borderColor: 'divider' }}>Insulation Resistance:</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>Earth Tester Sr no: - 2100091</TableCell>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}> Meggar Sr.no: - 21007029</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                Earth Resistance values for all Earth Pits:-
                                                <Box>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Box sx={{ pr: 1, pt: 1 }}>1. 0.45Ω </Box>
                                                        <Box sx={{ pt: 1 }}>3. 0.3Ω</Box>
                                                    </Box>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Box sx={{ pr: 1, pt: 1 }}>2. 0.42Ω </Box>
                                                        <Box sx={{ pt: 1 }}>4. Ω</Box>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                Insulation Resistance:
                                                <Box>
                                                    <Box sx={{ pt: 1 }}>1. Phase to Phase: 230MΩ</Box>
                                                    <Box sx={{ pt: 1 }}>2. Phase to Earth: 250MΩ</Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>


                            <TableContainer>
                                <Table sx={{ border: 1, borderColor: 'divider' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                The work of aforesaid installation has been completed by us on Date <Box component="span" sx={{ color: 'red' }}>20/08/2024</Box> and it is to hereby declare that
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                a) All PV modules and its supporting structures have enough mechanical strength and it conforms to the Relevant codes/guidelines prescribed in this behalf.
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                b) All cables/wires, protective switchgears as well as Earthlings are of adequate ratings/size and they conform to the requirements of Central Electricity Authority (Measures relating to safety and electrical supply), Regulations 2010 as well as the relevant codes/guidelines prescribed in this behalf.
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                c) The work of aforesaid Installation has been carried out in conformance with the requirements of Central Electricity Authority (Measures relating of safety and electrical supply), Regulations 2010 and the relevant codes/guidelines prescribed in this behalf. The installation is tested by us and is found safe to be energized
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TableContainer >
                                <Table sx={{ border: 1, borderColor: 'divider' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider', width: '50%', p: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
                                                    <Typography sx={{
                                                        borderRight: 1,
                                                        borderColor: 'divider',
                                                        p: 1,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        Date
                                                    </Typography>
                                                    <Box sx={{
                                                        flexGrow: 1,
                                                        color: 'red',
                                                        p: 1,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        22/08/2024
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider', width: '50%', p: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
                                                    <Typography sx={{
                                                        borderRight: 1,
                                                        borderColor: 'divider',
                                                        p: 1,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        Date
                                                    </Typography>
                                                    <Box sx={{
                                                        flexGrow: 1,
                                                        color: 'red',
                                                        p: 1,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        22/08/2024
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                Name of Electrical Supervisor: Patel Jaykumar
                                                <br />
                                                Permit No: - G/GS-E-010185-BEE-2023
                                            </TableCell>
                                            <TableCell sx={{ p: 1, border: 1, borderColor: 'divider' }}>
                                                Signature of Licensed Electrical
                                                <br />
                                                Contractor License No.: GJ/RJK/C-03901
                                                <br />
                                                Valid up to: - 11.2.2029
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box >
                </DialogContent >
                <DialogActions>
                    <Button onClick={() => pdfMake.createPdf(docDefinition).download('solar_installation_details.pdf')} color="primary">
                        Download PDF
                    </Button>
                    <Button onClick={handleClosePdfDialog}>Close</Button>
                </DialogActions>
            </Dialog >

            {/* Second PDF */}
            < Dialog open={openPdfDialog2} onClose={handleClosePdfDialog} fullWidth maxWidth="md" >
                <DialogContent ref={printRef2}>
                    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
                        {/* 1st page */}
                        <Typography variant="h3" align="center" gutterBottom sx={{ textDecoration: 'underline' }}>
                            Model Agreement
                        </Typography>
                        <Typography variant="h4" align="center" gutterBottom sx={{ textDecoration: 'underline' }}>
                            Between
                        </Typography>
                        <Typography sx={{ fontSize: 20, fontWeight: '700' }}>
                            Applicant and the registered/empaneled Vendor for installation of rooftop solar system in residential house of the Applicant under simplified procedure of Rooftop Solar Program Ph-II
                        </Typography>
                        <Typography sx={{ mt: 2, fontSize: 15 }}>
                            This agreement is executed on 22 (Day) 8 (Month) 2024 for design, installation, commissioning and five years comprehensive maintenance of rooftop solar system to be installed under simplified procedure of Rooftop Solar Program Ph-II.
                        </Typography>

                        <Typography variant="h4" align="center" gutterBottom>
                            Between
                        </Typography>
                        <Typography sx={{ fontSize: 15 }}>
                            {selectedConsumerName} having residential electricity connection with consumer number {selectedConsumerNumber} PGVCL (DISCOM)
                            MADHAV,NR. POLICE STATION, JAVAHAR SOC.-2,KOLKI ROAD (hereinafter referred as Applicant)
                        </Typography>

                        <Typography variant="h4" align="center" sx={{ marginTop: 2 }} gutterBottom>
                            And
                        </Typography>
                        <Typography sx={{ fontSize: 15 }}>
                            TVARIT ENERGY LLP is registered/ empaneled with the  PGVCL(hereinafter referred as DISCOM) and is having registered/functional office at 707 North Block – Twin Star, Nr. Nana Mava Ciricle, Rajkot- 360005.  Both Applicant and the Vendor are jointly referred as Parties.
                        </Typography >

                        <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2, }}>
                            Whereas
                        </Typography>
                        <Typography sx={{ fontSize: 15 }}>
                            - The Applicant intends to install rooftop solar system under simplified procedure of Rooftop Solar Programme Ph-II of the MNRE.
                        </Typography >
                        <Typography sx={{ fontSize: 15 }}>
                            - The Vendor is registered/empaneled vendor with DISCOM for installation of rooftop solar under MNRE Schemes. The Vendor satisfies all the existing regulation pertaining to electrical safety and license in the respective state and it is not debarred or blacklisted from undertaking any such installations by any state/central Government agency.
                        </Typography >
                        <Typography sx={{ fontSize: 15 }}>
                            - Both the parties are mutually agreed and understand their roles and responsibilities and have no liability to any other agency/firm/stakeholder especially to DISCOM and MNRE.
                        </Typography >

                        <Typography variant="h4" sx={{ mt: 2 }}>
                            1. GENERAL TERMS:
                        </Typography>
                        <Typography sx={{ mt: 2, fontSize: 15 }}>
                            1.1.	The Applicant hereby represents and warrants that the Applicant has the sole legal capacity to enter into this Agreement and authorize the construction, installation and commissioning of the Rooftop Solar System (“RTS System”) which is inclusive of Balance of System (“BoS”) on the Applicant’s premises (“Applicant Site”). The Vendor reserves its right to verify ownership of the Applicant Site and Applicant covenants to co-operate and provide all information and documentation required by the Vendor for the same.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            1.2.	Vendor may propose changes to the scope, nature and or schedule of the services being performed under this Agreement. All proposed changes must be mutually agreed between the Parties. If Parties fail to agree on the variation proposed, either Party may terminate this Agreement by serving notice as per Clause 13.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            1.3.	The Applicant understands and agrees that future changes in load, electricity usage patterns and/or electricity tariffs may affect the economics of the RTS System and these factors have not been and cannot be considered in any analysis or quotation provided by Vendor or its Authorized Persons (defined below).
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            2. RTS System
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            2.1 Total capacity of RTS System will be minimum 3.24k Wp.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            2.2.	The Solar modules, inverters and BoS will confirm to minimum specifications and DCR requirement of MNRE.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            2.3.	Solar modules of WAAREE make AHNAY BIFACIAL model, 540 Wp capacity each and 20.98% efficiency will be procured and installed by the Vendor.
                        </Typography>

                        {/* 2st page */}
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            2.4.	Solar inverter of SOFAR make SOFAR-3300TL model, 3.3kW rated output capacity will be procured and installed by the Vendor
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            2.5.	Module mounting structure has to withstand minimum wind load pressure as specified by MNRE.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            2.6.	Other BoS installations shall be as per best industry practice with all safety and protection gears installed by the vendor.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            3. PRICE AND PAYMENT TERMS
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            3.1.	The cost of RTS System will be Rs.154790  (to be decided mutually). The Applicant shall pay the total cost to the Vendor as under:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            (i)	XX% as an advance on confirmation of the order;
                            <br />
                            (ii) XX% against Proforma Invoice (PI) before dispatch of solar panels, inverters and other BoS items 	to be delivered;
                            <br />
                            (iii) XX% after installation and commissioning of the RTS System.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            3.2.	The order value and payment terms are fixed and will not be subject to any adjustment except as approved in writing by Vendor. The payment shall be made only through bankers’ cheque
                            / NEFT / RTGS / online payment portal as intimated by Vendor. No cash payments shall be accepted by Vendor or its Authorized Person.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            4. REPRESENTATIONS MADE BY THE APPLICANT:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            The Applicant acknowledges and agrees that:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            4.1.	any timeline or schedule shared by Vendor for the provision of services and delivery of the RTS System is only an estimate and Vendor will not be liable for any delay that is not attributable to Vendor;
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            4.2.	all information disclosed by the Applicant to Vendor in connection with the supply of the RTS System (or any part thereof), services and generation estimation (including, without limitation, the load profile and power bill) are true and accurate, and acknowledges that Vendor has relied on the information produced by the Applicant to customize the RTS System layout and BoS design for the purposes of this Agreement;
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            4.3.	all descriptive specifications, illustrations, drawings, data, dimensions, quotation, fact sheets, price lists and any advertising material circulated/published/provided by Vendor are approximate only;
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            4.4.	any drawings, pre-feasibility report, specifications and plans composed by Vendor shall require the Applicant’s approval within 5 (five) days of its receipt by electronic mail to Vendor and if the Applicant does not respond within this period, the drawings, specifications or plans shall be final and deemed to have been approved by the Applicant;
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            4.5.	the Applicant shall not use the RTS System or any part thereof, other than in accordance with the product manufacturer’s specifications, and covenants that any risk arising from misuse or/and misappropriate use shall be to the account of the Applicant alone.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            4.6.	The Applicant represents, warrants and covenants that:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            (i)	all electrical and plumbing infrastructure at the Applicant Site are in conformity with applicable laws;
                            <br />
                            (ii)	the Applicant has the legal capacity to permit unfettered access to Vendor and its Authorized Persons for the purposes of execution and performance of this Agreement;
                            <br />
                            (iii)	the Applicant has and will provide requisite power, water and other requisite resources and storage facilities for construction, installation, operation and maintenance of the RTS System;
                            <br />
                            (iv)	the Applicant will provide support for site fabrication of structure, assembly and fitting of module mounting structure at Applicant Site;
                            <br />
                            (v)	the Applicant will ensure that the Applicant Site is shadow free and free of all encumbrances during the lifetime of the RTS System;
                            <br />
                            (vi)	Applicant should ensure that the Applicant regularly cleans and ensures accessibility and safety to the RTS System, as required by Vendor and dusting frequency in the premises.
                            <br />
                            (vii)	Vendor is entitled to permit geo-tagging of the Applicant Site as a Vendor installation site;
                            <br />
                            (viii)	Unless otherwise intimated by the Applicant in writing, Vendor is entitled to take photographs, videos and testimonials of the Applicant and the Applicant Site, and to create content which will become the property of Vendor and the same can be freely used by Vendor as part of its promotional and marketing activities across all platforms as it deems fit;
                            <br />
                            (ix)	the Applicant validates the stability of the Applicant Site for the installation of the RTS System.
                        </Typography>


                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            5.	MAINTENANCE:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            5.1.	Vendor shall provide five-year free workmanship maintenance. Vendor shall visit the Applicant’s premises at least once every quarter after commissioning of the RTS System for maintenance purposes.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            5.2.	During such maintenance visit, Vendor shall check all nuts and bolts, fuses, earth resistance and other consumables in respect of the RTS System to ensure that it is in good working condition.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            5.3.	Cleaning requirement/expectation from the Applicant side – Applicant responsibility, minimum expectation from Applicant that it will be cleaned regularly as per the dusting frequency.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            6. ACCESS AND RIGHT OF ENTRY:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            6.1 The Applicant hereby grants permission to Vendor and its authorized personnel, representatives, associates, officers, employees, financing agents, subcontractors (“Authorized Persons”) to enter the Applicant Site for the purposes of:
                            <br />
                            (a)	conducting feasibility study;
                            <br />
                            (b)	storing the RTS System/any part thereof;
                            <br />
                            (c)	installing the RTS System;<br />
                            (d)	inspecting the RTS System;<br />
                            (e)	conducting repairs and maintenance to the RTS System;<br />
                            (f)	removing the RTS System (or any part thereof), if necessary for any reason whatsoever;
                            <br />
                            (g)	Such other matters as necessary to execute and perform its rights and obligations under this Agreement.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            6.2.	The Applicant shall ensure that third-party consents necessary for the Authorized Persons to access the Applicant Site are obtained prior to commencement of services under this Agreement.
                        </Typography>


                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            7.	WARRANTIES:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            7.1.	Product Warranty: The Applicant shall be entitled to manufacturers’ warranty. Any warranty in relation to RTS System supplied to the Applicant by Vendor under this Agreement is limited to the warranty given by the manufacturer of the RTS System (or any part thereof) to Vendor.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            7.2.	Installation Warranty: Vendor warrants that all installations shall be free from workmanship defects or BOS defects for a period of five years from the date of installation of the RTS System. The warranty is limited to Vendor rectifying the workmanship or BOS defects at Vendor’s expense in respect of those defects reported by the Applicant, in writing. The Applicant is obliged and liable to report such defects within 15 (fifteen) days of occurrence of such defect.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            7.3.	Subject to manufacturer warranty, Vendor warrants that the solar modules supplied herein shall have tolerance within a five-percentage range (+/-5%). The peak-power point voltage and the peak-power point current of any supplied solar module and/or any module string (series connected modules) shall not vary by more than 5% (five percent) from the respective arithmetic means for all modules and/or for all module strings, as the case may be, provided the RTS System is properly maintained and the Applicant Site is free from shadow at the time of operation of the RTS System.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            7.4.	Exceptions for warranty:<br />
                            (a)	Any attempt by any person other than Vendor or its Authorized Persons to adjust, modify, repair or provide maintenance to the RTS System, shall disentitle the Applicant of the warranty provided by Vendor hereunder.<br />
                            (b)	Vendor shall not be liable for any degeneration or damage to the RTS System due to any action or inaction on the part of the Applicant.<br />
                            (c)	Vendor shall not be bound or liable to remedy any damage, fault, failure or malfunction of the RTS System owing to external causes, including but not limited to accidents, misuse, neglect, if usage and/or storage and/or installation are non-confirming to product instructions, modifications by the Applicant leading to shading or accessibility issues, failure to perform required maintenance, normal wear and tear, Force Majeure Event, or negligence or default attributable to the Applicant.<br />
                            (d)	Vendor shall not be liable to repair or remedy any accessories or parts added to the RTS System that were not originally sourced by Vendor to the Applicant.<br />
                        </Typography>


                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            8.	PERFORMANCE GUARANTEE
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            8.1.	Vendor guarantees minimum system performance ratio of 75% as per performance ratio test carried out in adherence to IEC 61724 or equivalent BIS for a period of five years.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            9.	INSURANCE:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            9.1.	Vendor may, at its sole discretion, obtain insurance covering risks of loss/damage to the RTS System (any part thereof) during transit from Vendor’s warehouse until delivery to the Applicant Site and until installation and commissioning.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            9.2.	Thereafter, all risk shall pass on to the Applicant and the Applicant may accordingly procure relevant insurances.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            10.	CANCELLATION:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            10.1.	The Applicant may cancel the order placed on Vendor within 7 (seven) days from the date of remittance of advance money or the date of order acceptance, whichever is earlier (“Order Confirmation”) by serving notice as per Clause 13.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            10.2.	If the Applicant cancels the order after the expiry of 7 (seven) days from the date of Order Form, the Applicant shall be liable to pay Vendor, a cancellation fee of XX% of the total order value plus costs and expenses incurred by Vendor, including, costs for labour, design, return of products, administrative costs, subvention costs.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            10.3.	Notwithstanding the aforesaid, the Applicant shall not be entitled to cancel the Order Form after Vendor has dispatched the RTS System (or any part thereof, including BOS) to the Applicant Site. If Applicant chooses to terminate the Order Form after dispatch, the entire amount paid by the Applicant till date, shall be forfeited by Vendor.
                        </Typography>


                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            11.	LIMITATION OF LIABILITY AND INDEMNITY:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            11.1.	To the extent that terms implied by law apply to the RTS System and the services rendered under this Agreement, Vendor’s liability for any breach of those terms is limited to:<br />
                            (a)	repairing or replacing the RTS System/any part thereof, as applicable; or<br />
                            (b)	Refund of the moneys paid by the Applicant to Vendor, if Vendor cannot fulfil the order.

                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            11.2.	If the Applicant cancels the order after the expiry of 7 (seven) days from the date of Order Form, the Applicant shall be liable to pay Vendor, a cancellation fee of XX% of the total order value plus costs and expenses incurred by Vendor, including, costs for labour, design, return of products, administrative costs, subvention costs.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            11.3.	Notwithstanding the aforesaid, the Applicant shall not be entitled to cancel the Order Form after Vendor has dispatched the RTS System (or any part thereof, including BOS) to the Applicant Site. If Applicant chooses to terminate the Order Form after dispatch, the entire amount paid by the Applicant till date, shall be forfeited by Vendor.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            12.	SUSPENSION AND TERMINATION:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            12.1.	If the Applicant fails to pay any sum due under this Agreement on the due date, Vendor may, in addition to its other rights under this Agreement, suspend its obligations under this Agreement until all outstanding amounts (including interest due) are paid.
                        </Typography>

                        <Typography sx={{ fontSize: 15, mt: 1 }} >
                            <Typography variant='h4' sx={{ fontWeight: '600' }}> 13.NOTICES:</Typography>Any notice or other communication under this Agreement to Vendor and or to the Applicant, shall be in writing, in English language and shall be delivered or sent: (a) by electronic mail and/or (b) by hand delivery or registered post/courier, at the registered address of Applicant/Vendor.
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            14.	FORCE MAJEURE EVENT:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            14.1.	Neither Party shall be in default due to any delay or failure to perform its/his/her/their obligations under this Agreement which arises from or is a consequence of occurrence of an event which is beyond the reasonable control of such Party, and which makes performance of its/his/her/their obligations under this Agreement impossible or so impractical as reasonably to be considered impossible in the circumstances, and includes, but is not limited to, war, riot, civil disorder, earthquake, fire, explosion, storm, flood or other adverse weather conditions, pandemic, epidemic, embargo, strikes, lockouts, labour difficulties, other industrial action, acts of government, unavailability of equipment from vendor, changes requested by the Applicant (“Force Majeure Event”).
                        </Typography>


                        <Typography variant="h4" sx={{ mt: 2, fontWeight: '600' }}>
                            15.	GOVERNING LAW AND DISPUTE RESOLUTION:
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            15.1.	The interpretation and enforcement of this Agreement shall be governed by the laws of India
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            15.2.	In the event of any dispute, controversy or difference between the Parties arising out of, or relating to this Agreement (“Dispute”), both Parties shall make an effort to resolve the Dispute in good faith, failing which, any Party to the Dispute shall be entitled to refer the Dispute to arbitration to resolve the Dispute in the manner set out in this Clause. The rights and obligations of the Parties under this Agreement shall remain in full force and effect pending the award in such arbitration proceeding.
                        </Typography>
                        <Typography sx={{ fontSize: 15, mt: 1 }}>
                            15.3.	The arbitration proceeding shall be governed by the provisions of the Arbitration and Conciliation Act, 1996 and shall be settled by a sole arbitrator mutually appointed by the Parties.
                        </Typography>

                        <Box sx={{ marginTop: '100px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'inline-block' }}>
                                    {selectedConsumerName}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'normal' }}>
                                    TVARIT ENERGY LLP
                                </Typography>
                            </Box>

                            <Typography variant="h5" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                Witness
                            </Typography>
                            <Typography sx={{ fontSize: '15px', marginBottom: '20px' }}>1.</Typography>
                            <Typography sx={{ fontSize: '15px', marginBottom: '20px' }}>2.</Typography>
                        </Box>
                    </Box>
                </DialogContent >
                <DialogActions>
                    <Button onClick={() => pdfMake.createPdf(docDefinition2).download('Model-Agreement.pdf')} color="primary">Download PDF</Button>
                    <Button onClick={handleClosePdfDialog}>Close</Button>
                </DialogActions>
            </Dialog >

            {/* Third PDF */}
            < Dialog open={openPdfDialog3} onClose={handleClosePdfDialog} fullWidth maxWidth="md" >
                <DialogContent >
                    <Box ref={printRef3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
                        {/* {/ 1ND PAGE ....................... /} */}
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                mb: 0 // Set bottom margin to 0
                            }}
                        >
                            (On Stamp Paper of Rs.300/-)
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                mb: 0 // Set bottom margin to 0
                            }}
                        >
                            Inter Connection Agreement (Provisional)
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                mb: 0 // Set bottom margin to 0
                            }}
                        >
                            (Residential Projects Registered at GEDA / National Portal)
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                mb: 0 // Set bottom margin to 0
                            }}
                        >
                            Project Registered under New RE Policy-2023
                        </Typography>

                        <Box sx={{ ml: 2, mr: 2, mb: 2 }}>
                            <Typography sx={{ textIndent: '20px', fontSize: 15, textAlign: 'justify', lineHeight: '1.5' }}>
                                This Provisional Agreement is made and entered into at UPLETA on this (date) ____ day of (month) ____ (year) 2024 between the Consumer, by the name of  {selectedConsumerName} Consumer Number {selectedConsumerNumber} premises at
                                KHATKI WADA-1 VASILA, MANZIL KOTHA SERI UPLETA, (hereinafter referred to as "Consumer" which expression shall include its permitted assigns and successors) as first party
                            </Typography>
                        </Box>

                        <Box sx={{ ml: 2, mr: 2, mb: 2 }}>
                            <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, mb: 2 }}>
                                AND
                            </Typography>
                            <Typography sx={{ fontSize: 15, textAlign: 'justify', lineHeight: '1.5' }}>
                                Paschim Gujarat Vij Company Limited, a Company registered under the Companies Act 1956/2013 and functioning as the "Distribution Company" or "DISCOM" under the Electricity Act 2003 having its Head Office at, Rajkot (hereinafter referred to as "PGVCL" or "Distribution Licensee" or "DISCOM" which expression shall include its permitted assigns and successors) a Party of the Second Part.
                            </Typography>
                        </Box>

                        <Box marginBottom={2} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                AND WHEREAS
                            </Typography>
                        </Box>
                        <Box marginBottom={2} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                                The solar project of {selectedConsumerName} has been registered on GEDA Portal on dtd. 12<sup>th</sup> JULY 2024  to set up Photovoltaic (PV) based Solar Power Generating Plant (SPG) of
                                4 kw (AC) capacity at his/her/its premises in legal possession including any rooftop or terrace
                                MAHAVIR PARK BLOCK-11, RADHE, DHANK MARG, connected with PGVCL's grid at 256 Voltage level for his/her/its own use within the same premises.
                            </Typography>
                        </Box>

                        <Box marginBottom={2} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                AND WHEREAS
                            </Typography>
                        </Box>
                        <Box marginBottom={2} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                                Government of Gujarat has declared Gujarat Renewable Energy Policy 2023 on 4.10.2023 operative for the control period from date of its notification (4.10.2023) to 30<sup>th</sup> September 2028. The RE Project installed and commissioned during the operative period shall become eligible for the benefits and incentives declared under the Policy, for the period of 25 years from the date of commissioning or for the life span of the RE Project System whichever is earlier.
                            </Typography>
                        </Box>

                        {/* {/ 2ND PAGE ....................... /} */}

                        <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                AND WHEREAS
                            </Typography>
                            <Typography variant="body1" sx={{ mt: '10px', textAlign: 'justify', lineHeight: '23px' }}>

                                In order to facilitate commissioning of the solar projects pursuant to notification of New the Gujarat Renewable energy Policy - 2023 effective from 04.10.2023, PGVCL has agreed to sign this agreement on Provisional basis with Consumer in terms of provisions of the Gujarat RE Policy-2023 and its incorporation in the Gujarat Electricity Regulatory Commission (Net Metering Rooftop Solar PV Grid Interactive Systems Regulations) Notification No. 5 of 2016 and its subsequent amendments subject to
                            </Typography>
                        </Box>

                        <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                                M/s “{selectedConsumerName}” the first party under the agreement, hereby acknowledges that the present agreement has been entered into by both the parties, taking in to account the notification of new Gujarat RE policy -2023 and on provisional basis as an interim arrangement subject to change as per further regulation/order/decision of the Hon’ble GERC in relation to Gujarat Renewable Energy Policy 2023 and further agree to incorporate requisite modification and amendments in the agreement as per the same, if required. The first party must not dispute the applicability of the GERC order / Regulation and must make necessary modifications in the agreement as per the applicable GERC order and Regulation. The settlement will be done accordingly.
                            </Typography>
                        </Box>

                        <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                AND WHEREAS
                            </Typography>
                            <Typography variant="body1" sx={{ mt: '10px', textAlign: 'justify', lineHeight: '23px' }}>
                                The Distribution Licensee agrees to provide grid connectivity to the Consumer and injection of the electricity generated from his Solar PV System of capacity
                                4 kw (AC) into the power system of Distribution Licensee as per conditions of this agreement and in compliance with the applicable Policy / rules/ Regulations/ Codes (as amended from time to time) by the Consumer which includes-
                            </Typography>
                        </Box>

                        <Box marginBottom={3} style={{ marginLeft: '40px', marginRight: '20px' }}>
                            <Typography variant="body1" sx={{ mt: '20px' }}>
                                1. Government of Gujarat Renewable Energy Policy 2023.
                            </Typography>
                            <Typography variant="body1" sx={{ mt: '20px' }}>
                                2. Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations, 2010.
                            </Typography>
                            <Typography variant="body1" sx={{ mt: '20px' }}>
                                3. Central Electricity Authority (Technical Standards for Connectivity to the Grid) Regulations, 2007 as amended from time to time.
                            </Typography>
                            <Typography variant="body1" sx={{ mt: '20px' }}>
                                4. Central Electricity Authority (Installation and Operation of Meters) Regulation 2006.
                            </Typography>
                            <Typography variant="body1" sx={{ mt: '20px' }}>
                                5. Gujarat Electricity Regulatory Commission (Electricity Supply Code & Related Matters) Regulations, 2015.
                            </Typography>

                        </Box>


                        {/* {/ 3RD PAGE ....................... /} */}

                        <Box marginBottom={3} style={{ marginLeft: '40px', marginRight: '20px', textAlign: 'justify', lineHeight: '23px' }}>
                            <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                6. Gujarat Electricity Regulatory Commission Distribution Code, 2004 and amendments thereto,
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                7. Instruction, Directions and Circulars issued by Chief Electrical Inspector from time to time.
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '23px' }}>
                                8. CEA (Technical Standards for connectivity of the Distributed Generation) Regulations, 2013 as amended from time to time.

                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '23px' }}>
                                9. Gujarat Electricity Regulatory Commission (Net Metering Rooftop Solar PV Grid Interactive Systems) Regulations, 2016 as amended from time to time.

                            </Typography>
                        </Box>

                        <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="body1">
                                Both the parties hereby agree as follows:
                            </Typography>
                        </Box>

                        <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px' }}>
                                1. Eligibility
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                1.1 Consumer shall own the Solar PV System set up on its own premises or premises in his legal possession.
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px' }}>

                                1.2 Consumer needs to consume electricity in the same premises where Solar PV System is set up.
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '23px' }}>
                                1.3 Consumer has to meet the standards and conditions as specified in Gujarat Electricity Regulatory Commission Regulations and Central Electricity Authority Regulations and provisions of Government of Gujarat’s Renewable Policy -2023 for being integrated into grid/distribution system.
                            </Typography>
                        </Box>

                        <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px' }}>
                                2. Technical and Interconnection Requirements
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '23px' }}>
                                2.1 Consumer agrees that his Solar PV System and Metering System will conform to the standards and requirements specified in the Policy, Regulations and Supply Code as amended from time to time.
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                2.2 Consumer agrees that metering system(s) shall be installed at Solar PV System for recording the solar generation.<br />
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '23px' }}>
                                2.3 Consumer agrees that he has installed or will install, prior to connection of Solar Photovoltaic System to Distribution Licensee’s distribution system, an isolation device.
                            </Typography>
                        </Box>
                        {/* {/ 4TH PAGE .......................... /} */}


                        <Box sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1" sx={{ mb: '20px', marginLeft: '20px' }}>
                                    (Both automatic and inbuilt within inverter and external manual relays) and agrees for the Distribution Licensee to have access to and operation of this, if required and for repair & maintenance of the distribution system.
                                </Typography>
                                <Typography variant="body1">
                                    2.4 Consumer agrees that in case of a power outage on Discom’s system, solar photovoltaic system will disconnect/isolate automatically and his plant will not inject power into Licensee’s distribution system.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    2.5 All the equipment connected to the distribution system shall be compliant with relevant International (IEEE/IEC) or Indian Standards (BIS) and installations of electrical equipment must comply with Central Electricity Authority (Measures of Safety and Electricity Supply) Regulations, 2010 as amended from time to time.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    2.6 Consumer agrees that licensee will specify the interface/inter connection point and metering point.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    2.7 Consumer and licensee agree to comply with the relevant CEA Regulations in respect of operation and maintenance of the plant, drawing and diagrams, site responsibility schedule, harmonics, synchronization, voltage, frequency, flicker etc.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    2.8 In order to fulfill Distribution Licensee’s obligation to maintain a safe and reliable distribution system, Consumer agrees that if it is determined by the Distribution Licensee that Consumer’s Solar Photovoltaic System either causes damage to and/or produces adverse effects affecting other consumers or Distribution Licensee’s assets, Consumer will have to disconnect Solar Photovoltaic System immediately from the distribution system upon direction from the Distribution Licensee and correct the problem to the satisfaction of distribution licensee at his own expense prior to reconnection.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    2.9 The consumer shall be solely responsible for any accident to human being/animals whatsoever (fatal/non-fatal/departmental/non-departmental) that may occur due to back feeding from the Solar Photovoltaic System when the grid supply is off if so decided by CEI. The distribution licensee reserves the right to disconnect the consumer’s installation at any time in the event of such exigencies to prevent accident or damage to man and material.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginLeft: '20px' }}>
                                    3. Clearances and Approvals
                                </Typography>
                            </Box>
                        </Box>

                        {/* {/ 5TH PAGE .......................... /} */}

                        <Box sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    3.1 The Consumer shall obtain all the necessary statutory approvals and clearances (environmental and grid connection related) before connecting the photovoltaic system to the distribution system.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px' }}>
                                    4. Access and Disconnection
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    4.1 Distribution Licensee shall have access to metering equipment and disconnecting means of the Solar Photovoltaic System, both automatic and manual, at all times.
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    4.2 In emergency or outage situation, where there is no access to the disconnecting means, both automatic and manual, such as a switch or breaker, Distribution Licensee may disconnect service to the premises of the Consumer.

                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px' }}>
                                    5. Liabilities
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    5.1 Consumer shall indemnify Distribution Licensee for damages or adverse effects from his negligence or intentional misconduct in the connection and operation of Solar Photovoltaic System.<br />
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    5.2 Distribution Licensee shall not be liable for delivery or realization by the Consumer of any fiscal or other incentive provided by the Central/State Government.<br />
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    5.3 Distribution Licensee may consider the quantum of electricity generation from the Rooftop Solar PV System owned and operated by individual Residential, Group Housing Societies, and Residential Welfare Association consumers under net metering arrangement towards RPO compliance.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px' }}>
                                    6. Metering:
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    6.1 Metering arrangement shall be as per Central Electricity Authority (Installation and Operation of Meters) Regulations, 2006 as amended from time to time.<br />
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    6.2 Bi-directional meter shall be installed of same accuracy class as installed before Setting up of Rooftop Solar PV System.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px' }}>
                                    7. Commercial Settlement
                                </Typography>
                                <Typography variant="body1">
                                    All the commercial settlements under this agreement shall be on provisional basis.
                                </Typography>
                            </Box>
                        </Box>


                        {/* {/ 6TH PAGE .......................... /} */}
                        <Box sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1">
                                    taking into account the notification of new Gujarat RE policy-2023 and as an interim arrangement subject to change as per further regulation/order/decision of GERC. Gujarat Electricity Regulatory Commission Regulations for Net Metering Rooftop Solar PV Grid Interactive Systems notification no. 5 of 2016 and its subsequent amendments.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1" sx={{ marginBottom: '30px' }}>
                                    The commercial settlement will be as follows:
                                </Typography>
                                <Typography variant="body1" sx={{ marginLeft: '30px' }}>
                                    For Residential and common facility connections of Group Housing Societies/ Residential Welfare Association consumers.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    (i) In case of net import of energy by the consumer from distribution grid during billing cycle, the energy consumed from Distribution Licensee shall be billed as per applicable tariff to respective category of consumers as approved by the Commission from time to time. The energy generated by Rooftop Solar PV System shall be set off against units consumed (not against load/demand) and consumer shall pay demand charges, other charges, penalty etc. as applicable to other consumers.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    (ii) In case of net export of energy by the consumer to distribution grid during billing cycle, Distribution Licensee shall purchase surplus power, after giving set off against consumption during the billing period, at Rs. 2.25/Unit for the first 5 years from commissioning of project and thereafter for the remaining term of the project at 75% of the simple average of tariff discovered and contracted under competitive bidding process conducted by GUVNL for non-park based solar projects in the preceding 6-month period, i.e., either April to September or October to March as the case may be, from the commercial operation date (COD) of the project, subject to approval of Hon’ble GERC. Such surplus purchase shall be utilized for meeting RPO of Distribution Licensee. However, fixed / demand charges, other charges, penalty etc. shall be payable as applicable to other consumers.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    Provided that in case the consumer is setting up additional solar rooftop capacity under the scheme over and above solar rooftop capacity set up prior to this scheme, surplus energy of entire solar rooftop capacity shall be purchased by Distribution Company at the rate of Rs. 2.25/Unit for the first 5 years from commissioning of project and thereafter for the remaining term of the project at 75% of the
                                    simple average of tariff discovered and contracted under competitive bidding process conducted by GUVNL for non-park based solar projects in the preceding 6-month period, i.e., either April to September or October to March as the case may be, from the commercial operation date (COD) of the project, treating earlier agreement as cancelled.
                                </Typography>
                            </Box>
                        </Box>
                        {/* {/ 7TH PAGE .......................... /} */}
                        <Box sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    In case of net injection, net amount receivable by consumer in a bill shall be credited in consumers account and will be adjusted against bill amount payable in subsequent months. However, at the end of year, if net amount receivable by consumer is more than Rs. 100/- and consumer requests for payment, the same may be paid. Such payment shall be made only once in a year based on year end position and request of consumer.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                    8. Connection Costs:
                                </Typography>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    The Consumer shall bear all costs related to setting up of Solar Photovoltaic System including metering and inter-connection. The Consumer agrees to pay the actual cost of modifications and upgrades to the service line, cost of up gradation of transformer to connect photovoltaic system to the grid in case it is required.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                    9. Inspection, Test, Calibration and Maintenance prior to connection
                                </Typography>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    Before connecting, Consumer shall complete all inspections and tests finalized in consultation with the (Name of the Distribution license) and if required Gujarat Energy Transmission Corporation Limited (GETCO) to which his equipment is connected. Consumer shall make available to PGVCL all drawings, specifications and test records of the project or generating station as the case may be.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                    10. Records:
                                </Typography>
                                <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                                    Each Party shall keep complete and accurate records and all other data required by each of them for the purposes of proper administration of this Agreement and the operation of the Solar PV System.
                                </Typography>
                            </Box>
                        </Box>

                        {/* {/ 8TH PAGE .......................... /} */}
                        <Box sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                    11. Dispute Resolution:
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    11.1 All disputes or differences between the Parties arising out of or in connection with this Agreement shall first be tried to be settled through mutual negotiation, promptly, equitably and in good faith.
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    11.2 In the event that such differences or disputes between the Parties are not settled through mutual negotiations within sixty (60) days or mutually extended period, after such dispute arises, then for
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    (a) Any dispute in billing pertaining to energy injection and billing amount, would be settled by the Consumer Grievance Redressal Forum and Electricity Ombudsman.
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    (b) Any other issues pertaining to the Regulations and its interpretation; it shall be decided by the Gujarat Electricity Regulatory Commission following appropriate prescribed procedure.
                                </Typography>
                            </Box>

                            <Box marginBottom={3} style={{ marginLeft: '20px', marginRight: '20px' }}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                    12. Termination
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    12.1 The Consumer can terminate the agreement at any time by giving Distribution Licensee 90 days prior notice.<br />
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    12.2 Distribution Licensee has the right to terminate Agreement with 30 days prior written notice, if Consumer commits breach of any of the terms of this Agreement and does not remedy the breach within 30 days of receiving written notice from Distribution Licensee of the breach.<br />
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    12.3 Consumer shall upon termination of this Agreement, disconnect the Solar Photovoltaic System from Distribution Licensee’s distribution system within one week to the satisfaction of Distribution Licensee.
                                </Typography>
                            </Box>
                        </Box>

                        {/* {/ 9TH PAGE .......................... /} */}
                        <Box sx={{ textAlign: 'justify', lineHeight: '23px' }}>
                            <Box marginBottom={3}>
                                <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                    Communication:
                                </Typography>
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    The names of the officials and their addresses, for the purpose of any communication in relation to the matters covered under this Agreement shall be as under:
                                </Typography>
                            </Box>

                            <Grid container spacing={2} style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <Grid item xs={6}>
                                    <Box border={1} borderColor="grey.500" padding={2} style={{ height: '100%' }}>
                                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                            In respect of the PGVCL
                                        </Typography>
                                        <Typography variant="body1">
                                            Chief Engineer<br />
                                            Paschim Gujarat Vij Company<br />
                                            L i m i t e d
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box border={1} borderColor="grey.500" padding={2} style={{ height: '100%' }}>
                                        <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '30px' }}>
                                            In respect of the Consumer
                                        </Typography>
                                        <Typography variant="body1">
                                            ( &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp; ) <br />

                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box marginBottom={3}>
                                <Typography variant="body1">
                                    IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be executed by their authorized officers, and copies delivered to each Party, as of the day and year herein above stated.
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box border={1} borderColor="grey.500" padding={2} style={{ height: '100%' }}>
                                        <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '50px' }}>
                                            FOR AND ON BEHALF OF PGVCL
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                            Authorized Signatory
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                            WITNESSES
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '40px' }}>
                                            1. ______________<br />
                                            ( &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp; ) <br />
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '40px' }}>
                                            2. ______________<br />
                                            ( &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp; ) <br />
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box border={1} borderColor="grey.500" padding={2} style={{ height: '100%' }}>
                                        <Typography variant="span" style={{ fontWeight: 'bold', marginBottom: '30px' }}>
                                            FOR AND ON BEHALF OF THE PROJECT OWNER
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                            ______________<br />
                                            Authorized Signatory
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                            WITNESSES
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '40px' }}>
                                            1. ______________<br />
                                            ( &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp; ) <br />
                                        </Typography>
                                        <Typography variant="body1" style={{ marginBottom: '40px' }}>
                                            2. ______________<br />
                                            ( &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp; ) <br />
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </DialogContent >
                <DialogActions>
                    <Button onClick={() => pdfMake.createPdf(docDefinition3).download('Net-Meter-Agreement-Residential.pdf')} color="primary">Download PDF</Button>
                    <Button onClick={handleClosePdfDialog}>Close</Button>
                </DialogActions>
            </Dialog >

            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this Liasoing?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>

        </Box >
    );
};

export default ListResidential;