import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Grid, StepConnector, stepConnectorClasses, Stepper, Step, StepLabel, useTheme, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, useMediaQuery, Dialog, DialogContent, DialogActions } from '@mui/material';
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
        filteredAndSortedLiasoning.forEach(item => {
            const liasoningItem = lis.find((a) => a.fillNo === item.fillNo) || {};
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
                        <MenuItem value="all">All</MenuItem>
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



                                {isMobile ? (
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
                                )}
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