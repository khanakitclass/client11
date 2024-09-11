import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText, FormControlLabel, FormLabel, RadioGroup, Radio, Typography, FormGroup, Checkbox } from '@mui/material';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { editCommercialMarketing, getCommercialMarketing, viewComerialMarketing } from '../../../redux/slice/Commercialmarketing.slice';
import { getUsers } from '../../../redux/slice/users.slice';
import { getRoles } from '../../../redux/slice/roles.slice';
import AddIcon from '@mui/icons-material/Add';
import { editLiasoning, getLiasoning } from '../../../redux/slice/liasoning.slice';


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'none',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg,#134670 0%, #2B89D5 120%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
    // Styles for all screen sizes
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        left: 'calc(-50% + 20px)',
        right: 'calc(50% + 20px)',
    },
    // Adjustments for very small screens
    '@media (max-width: 425px)': {
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 15,
            left: 'calc(-50% + 15px)',
            right: 'calc(50% + 15px)',
        },
    },
    // Adjustments for medium to large screens
    '@media (min-width: 426px)': {
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 25,
            left: 'calc(-50% + 25px)',
            right: 'calc(50% + 25px)',
        },
    },

}));


const ColorlibStepIconRoot = styled('div')(({ theme, ownerState, isVerySmallScreen }) => ({
    // backgroundColor: ownerState.completed ? '#ff6b39' : '#ccc',
    backgroundColor: ownerState.completed ? '#134670' : ownerState.filled ? '#134670' : '#ccc',
    zIndex: 1,
    // color: ownerState.completed ? '#fff' : '#000',
    color: (ownerState.completed || ownerState.filled) ? '#fff' : '#000',
    width: isVerySmallScreen ? 30 : 50,
    height: isVerySmallScreen ? 30 : 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    border: ownerState.active ? '2px solid #008cff' : '',
    ...(ownerState.active && {
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, filled, className, icon } = props;
    const isVerySmallScreen = useMediaQuery('(max-width:425px)');

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, filled, active }}
            className={className}
            isVerySmallScreen={isVerySmallScreen}
        >
            <Typography variant={isVerySmallScreen ? "body2" : "h6"} style={{ fontWeight: 'bold', color: completed ? '#fff' : '#000' }}>
                {icon}
            </Typography>
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    filledSteps: PropTypes.array,
};

const steps = ['Application Submitted', 'FQ Status', 'FQ Paid', 'Site Details', 'Net Meter Document Upload', 'Net Meter Document Qurier', 'Net Meter Install', 'Subcidy Claim Process', 'Subcidy Received Status'];

const validationSchemas =
    Yup.object({});

const initialValues = {
    fileNo: '',
    FQPayment: '',
    AmountL: '',
    SerialNumber: '',
    // addmorephotos: [{
    //     SitePhoto: '',
    //     OtherPhoto: '',
    // }],
    CheckBox1: false,
    CheckBox1date: '',
    CheckBox2: false,
    CheckBox2date: '',
    CheckBox3: false,
    CheckBox3date: '',
    CheckBox4: false,
    CheckBox4date: '',
    CheckBox5: false,
    CheckBox5date: '',
    // Query1: '',
    // Query2: '',
    // Query3: '',
    // Query4: '',
    // Query5: '',
    User_id: '',
};

const MobileStepper = ({ steps, activeStep, completedSteps, filledSteps }) => {
    const isVerySmallScreen = useMediaQuery('(max-width:425px)');
    const isMediumScreen = useMediaQuery('(min-width:426px) and (max-width:1024px)');
    const theme = useTheme();


    const renderStep = (label, index) => (
        <Step key={label} completed={completedSteps.includes(index)}>
            <StepLabel
                StepIconComponent={ColorlibStepIcon}
                icon={index + 1}
                StepIconProps={{
                    // filled: filledSteps.includes(index)
                    active: index === activeStep,
                    completed: completedSteps.includes(index),
                    filled: filledSteps.includes(index)
                }}
            >
                {/* <Typography style={{
                    color: completedSteps.includes(index) ? '#6da2cd' :
                        filledSteps.includes(index) ? '#ff6b39' : "white",
                    fontWeight: '600',
                    fontSize: isVerySmallScreen ? '10px' : '12px'
                }}> */}
                <Typography style={{
                    color: completedSteps.includes(index) ? '#6da2cd' :
                        index === activeStep ? theme.palette.mode === 'dark' ? '#fff' : "#000" :
                            filledSteps.includes(index) ? '#6da2cd' : " ",
                    fontWeight: '600',
                    fontSize: isVerySmallScreen ? '10px' : '12px'
                }}>
                    {label}
                </Typography>
            </StepLabel>
        </Step>
    );

    if (isVerySmallScreen) {
        const groupedSteps = [];
        for (let i = 0; i < steps.length; i += 3) {
            groupedSteps.push(steps.slice(i, i + 3));
        }

        return (
            <Box>
                {groupedSteps.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                        <Stepper
                            alternativeLabel
                            activeStep={activeStep - groupIndex * 3}
                            connector={<ColorlibConnector />}
                            sx={{
                                '& .MuiStepLabel-root': { padding: '0 4px' },
                                '& .MuiStepConnector-line': { top: 15 },
                                '& .MuiStepConnector-root': {
                                    left: 'calc(-50% + 15px)',
                                    right: 'calc(50% + 15px)',
                                },
                                '& .MuiStep-root:first-of-type .MuiStepConnector-root': {
                                    left: '50%',
                                },
                                '& .MuiStep-root:last-child .MuiStepConnector-root': {
                                    right: '50%',
                                },
                            }}
                        >
                            {group.map((label, index) => renderStep(label, groupIndex * 3 + index))}
                        </Stepper>
                        {groupIndex < groupedSteps.length - 1 && <Box sx={{ my: 2 }} />}
                    </React.Fragment>
                ))}
            </Box>
        );
    } else if (isMediumScreen) {
        const firstRowSteps = steps.slice(0, 5);
        const secondRowSteps = steps.slice(5);

        return (
            <Box>
                <Stepper alternativeLabel activeStep={activeStep > 4 ? 4 : activeStep} connector={<ColorlibConnector />}>
                    {firstRowSteps.map((label, index) => renderStep(label, index))}
                </Stepper>
                <Box sx={{ my: 1 }} />
                <Stepper alternativeLabel activeStep={activeStep > 5 ? activeStep - 5 : 0} connector={<ColorlibConnector />}>
                    {secondRowSteps.map((label, index) => renderStep(label, index + 5))}
                </Stepper>
            </Box>
        );
    } else {
        return (
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label, index) => renderStep(label, index))}
            </Stepper>
        );
    }
};



export default function Liasoning() {
    const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [filterData, setFilterData] = React.useState([]);
    const [dealer, setDealar] = React.useState([]);

    const dispatch = useDispatch();
    const { state } = useLocation();
    const liasoningData = state;
    const [filledSteps, setFilledSteps] = useState(liasoningData.filledSteps || []);
    const isMobile = useMediaQuery('(max-width:1024px)');
    const location = useLocation();
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(liasoningData.filledSteps.map((v) => parseInt(v)) || []);

    useEffect(() => {
        if (location.state) {
            if (location.state.completedSteps) {
                setActiveStep(location.state.completedSteps);
                // setCompletedSteps(Array.from({ length: location.state.completedSteps }, (_, i) => i));
            }
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(viewComerialMarketing(liasoningData._id));
        dispatch(getCommercialMarketing());
        dispatch(getRoles());
        dispatch(getUsers());
        dispatch(getLiasoning());
        setValues(liasoningData);
        setFilledSteps(liasoningData.filledSteps);
    }, [dispatch, liasoningData._id]);



    const CommercialMarketData = useSelector(state => state.comMarketing.Marketing);
    const allUsers = useSelector(state => state.users.users);
    const allRoles = useSelector(state => state.roles.roles);
    const lis = useSelector(state => state.liasoning.Liasoning);

    useEffect(() => {
        if (allUsers.length && allRoles.length) {
            const dealerRole = allRoles.find(role => role.roleName === 'Dealer');
            if (dealerRole) {
                const filteredDealers = allUsers.filter(user => user.role === dealerRole._id);
                setDealar(filteredDealers);
            }
        }
    }, [allUsers, allRoles]);

    const isLastStep = activeStep === steps.length - 1;

    const isStepFilled = (step) => {
        const stepFields = {
            0: ['fileNo', 'fileDate'],
            1: ['FQPayment'],
            2: ['AmountL', 'AmountDate'],
            3: ['SerialNumber', 'SerialNumberDate',
                //  'addmorephotos[0].SitePhoto', 'addmorephotos[0].OtherPhoto'
            ],
            4: ['CheckBox1', 'CheckBox1date'],
            5: ['CheckBox2', 'CheckBox2date'],
            6: ['CheckBox3', 'CheckBox3date'],
            7: ['CheckBox4', 'CheckBox4date'],
            8: ['CheckBox5', 'CheckBox5date'],
        };

        if (!stepFields[step]) return false;
        // return completedSteps.includes(step) || step < Math.max(...completedSteps, 0);
        return stepFields[step].every(field => values[field]);
    };

    const handleNext = (values, actions) => {
        setTouchedSteps((prevTouchedSteps) => {
            const newTouchedSteps = [...prevTouchedSteps];
            newTouchedSteps[activeStep] = true;
            return newTouchedSteps;
        });
        if (isStepFilled(activeStep)) {
            setFilledSteps(prev => [...new Set([...prev, activeStep.toString()])]);
            setCompletedSteps(prev => [...new Set([...prev, activeStep])]);
        } if (!isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            actions.validateForm().then((errors) => {
                if (Object.keys(errors).length === 0) {
                    const submissionValues = {
                        ...values,
                        filterData,
                        filledSteps
                    };
                    if (liasoningData._id) {
                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;
                        dispatch(editLiasoning({ id: liasoningData._id, ...submissionValues }));
                        // setFilledSteps([]);
                    }
                    actions.resetForm();
                    setActiveStep(0);
                    setValues(initialValues);
                } else {
                    console.log("Form validation errors:", errors);
                    setStepsWithErrors((prevStepsWithErrors) => {
                        const newStepsWithErrors = [...prevStepsWithErrors];
                        newStepsWithErrors[activeStep] = true;
                        return newStepsWithErrors;
                    });
                    alert('Please fix the errors in the form before submitting');
                }
                actions.setSubmitting(false);
                handleSubmit();
            })
        }
    };

    const navigate = useNavigate();
    const handleSubmit = () => {
        setFilledSteps(prev => [...new Set([...prev, activeStep])]);
        validationSchemas.validate(values, { abortEarly: false })
            .then(() => {
                const user_id = sessionStorage.getItem('id');
                const submissionValues = {
                    ...values,
                    filledSteps: [...filledSteps, activeStep],
                    User_id: user_id,
                    // addmorephotos: values.addmorephotos.map(photo => ({
                    //     SitePhoto: photo.SitePhoto instanceof File ? photo.SitePhoto.name : photo.SitePhoto,
                    //     OtherPhoto: photo.OtherPhoto instanceof File ? photo.OtherPhoto.name : photo.OtherPhoto
                    // }))
                };
                if (liasoningData._id) {
                    dispatch(editLiasoning({ id: liasoningData._id, ...submissionValues }));
                } else {
                    // Handle new submission if needed
                }
                setActiveStep(0);
                navigate('/admin/liasoning');
            })
            .catch((validationErrors) => {
                console.log("Form validation errors:", validationErrors);
                alert("Please fill in all required fields before submitting.");
            });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => {
        setActiveStep(step);
    };

    React.useEffect(() => {
        if (liasoningData._id) {
            dispatch(viewComerialMarketing(liasoningData._id)).then((response) => {
                if (response.payload && response.payload.CommercialMarket) {
                    const MarketingData = response.payload.CommercialMarket;
                    setValues(MarketingData);
                    setFilledSteps(MarketingData.filledSteps || []);
                }
            });
        }
    }, [liasoningData._id, dispatch]);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();

    const { handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm, setFieldError } = useFormik({
        initialValues,
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        if (values.fileNo) {
            setFieldValue('fileDate', currentDate);
        }
        if (values.AmountL) {
            setFieldValue('AmountDate', currentDate);
        }
        if (values.SerialNumber) {
            setFieldValue('SerialNumberDate', currentDate);
        }
    }, [values.fileNo, values.AmountL, values.SerialNumber, setFieldValue]);

    const handleCheckBoxChange = (event) => {
        const { name, checked } = event.target;
        setFieldValue(name, checked);

        if (checked) {
            setFieldValue(`${name}date`, new Date().toISOString().split('T')[0]);
        } else {
            setFieldValue(`${name}date`, '');
        }
    };

    const [addPhotos, setAddPhotos] = useState(initialValues.addmorephotos);

    const handleAddRow = () => {
        setAddPhotos([...addPhotos, { SitePhoto: null, OtherPhoto: null }]);
    };

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
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }

    return (
        <Box m="20px">
            {liasoningData._id ? (
                <Header
                    title="Update Liasoning"
                    subtitle="Update your Liasoning here"
                />
            ) : (
                <Header
                    title="ADD Liasoning"
                    subtitle="Add your Liasoning here"
                />
            )}
            <form onSubmit={handleSubmit}>
                <Stack sx={{ width: '100%', marginTop: '30px', backgroundcolor: "#ff6b39" }} spacing={4}>
                    {/* {isMobile ? (
                        <MobileStepper steps={steps} activeStep={activeStep} />
                    ) : (
                        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={completedSteps.includes(index)} onClick={() => handleStep(index)}>
                                    {console.log(completedSteps)}
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}
                                        StepIconProps={{
                                            filled: filledSteps.includes(index)
                                        }}
                                    >
                                        {console.log(filledSteps)}
                                        <Typography style={{
                                            color: completedSteps.includes(index) ? '#6da2cd' :
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


                    {isMobile ? (
                        <MobileStepper
                            steps={steps}
                            activeStep={activeStep}
                            completedSteps={completedSteps}
                            filledSteps={filledSteps}
                        />
                    ) : (
                        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={completedSteps.includes(index)} onClick={() => handleStep(index)}>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}
                                        StepIconProps={{
                                            filled: filledSteps.includes(index)
                                        }}
                                    >
                                        <Typography style={{
                                            color: completedSteps.includes(index) ? '#6da2cd' :
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

                    {activeStep === 0 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="fileNo"
                                        label="Application No :"
                                        value={values.fileNo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!touched.fileNo && !!errors.fileNo}
                                        helperText={touched.fileNo && errors.fileNo}
                                        sx={{
                                            gridColumn: 'span 2',
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        disabled
                                        id="fileDate"
                                        label="Date :"
                                        type="date"
                                        variant="filled"
                                        value={values.fileDate}
                                        name="fileDate"
                                        InputLabelProps={{
                                            shrink: true,
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>
                        </>
                    )}
                    {activeStep === 1 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="FQPayment"
                                        label="FQ Payment :"
                                        value={values.FQPayment}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!touched.FQPayment && !!errors.FQPayment}
                                        helperText={touched.FQPayment && errors.FQPayment}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>
                        </>
                    )}
                    {activeStep === 2 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        name="AmountL"
                                        label="Amount :"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.AmountL}
                                        error={!!touched.AmountL && !!errors.AmountL}
                                        helperText={touched.AmountL && errors.AmountL}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        disabled
                                        id="AmountDate"
                                        label="Date :"
                                        type="date"
                                        variant="filled"
                                        value={values.AmountDate}
                                        name="AmountDate"
                                        InputLabelProps={{
                                            shrink: true,
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}

                                    />
                                </FormControl>
                            </Box>
                        </>
                    )}
                    {activeStep === 3 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="SerialNumber"
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Panel and inverter serial number :"
                                        name="SerialNumber"
                                        onChange={handleChange}
                                        value={values.SerialNumber}
                                        onBlur={handleBlur}
                                        error={!!touched.SerialNumber && !!errors.SerialNumber}
                                        helperText={touched.SerialNumber && errors.SerialNumber}
                                        sx={{
                                            gridColumn: 'span 2',
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="SerialNumberDate"
                                        disabled
                                        fullWidth
                                        variant="filled"
                                        type="date"
                                        label="Date :"
                                        value={values.SerialNumberDate}
                                        name="SerialNumberDate"
                                        sx={{
                                            gridColumn: 'span 2',
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>

                            {/* {addPhotos.map((photos, index) => (
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                    }}
                                    key={index}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            site photo
                                            <input
                                                type="file"
                                                hidden
                                                id="SitePhoto"
                                                name={`addmorephotos.${index}.SitePhoto`}
                                                onChange={e => {
                                                    const file = e.currentTarget.files[0];
                                                    setFieldValue(`addmorephotos[${index}].SitePhoto`, file || null); // Set to null if no file
                                                }}
                                                onBlur={handleBlur}
                                            />
                                        </Button>
                                        {values.addmorephotos && values.addmorephotos[index] && values.addmorephotos[index].SitePhoto && (
                                            <img
                                                src={
                                                    typeof values.addmorephotos[index].SitePhoto === 'string'
                                                        ? `http://localhost:4000/${values.addmorephotos[index].SitePhoto}`
                                                        : values.addmorephotos[index].SitePhoto instanceof File
                                                            ? URL.createObjectURL(values.addmorephotos[index].SitePhoto)
                                                            : ''
                                                }
                                                alt="Site Photo"
                                                width="50"
                                                height="50"
                                                style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            other photo
                                            <input
                                                type="file"
                                                hidden
                                                id="OtherPhoto"
                                               
                                                name={`addmorephotos.${index}.OtherPhoto`}
                                                // onChange={e => setFieldValue(`addmorephotos[${index}].OtherPhoto`, e.currentTarget.files[0])}
                                                onChange={e => {
                                                    const file = e.currentTarget.files[0];
                                                    setFieldValue(`addmorephotos[${index}].OtherPhoto`, file || null); // Set to null if no file
                                                }}
                                                onBlur={handleBlur}
                                            />
                                        </Button>
                                        {values.addmorephotos && values.addmorephotos[index] && values.addmorephotos[index].OtherPhoto && (
                                            <img
                                                src={
                                                    typeof values.addmorephotos[index].OtherPhoto === 'string'
                                                        ? `http://localhost:4000/${values.addmorephotos[index].OtherPhoto}`
                                                        : values.addmorephotos[index].OtherPhoto instanceof File
                                                            ? URL.createObjectURL(values.addmorephotos[index].OtherPhoto)
                                                            : ''
                                                }
                                                alt="Other Photo"
                                                width="50"
                                                height="50"
                                                style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                            />
                                        )}
                                    </div>
                                </Box>
                            ))} */}



                            <Box display="flex" justifyContent="flex-end" m={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddRow}
                                >
                                    Add More Photos
                                </Button>
                            </Box>


                        </>
                    )}
                    {activeStep === 4 && (
                        <>
                            <FormGroup>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    width="50%"
                                >
                                    <FormControlLabel
                                        control={<Checkbox
                                            name="CheckBox1"
                                            checked={values.CheckBox1}
                                            onChange={handleCheckBoxChange}
                                            sx={{
                                                color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                '&.Mui-checked': {
                                                    color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                },
                                            }}
                                        />}
                                        label="Done"
                                        sx={{ gridColumn: 'span 1' }}
                                    />
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%' }}>
                                        <TextField
                                            id="CheckBox1date"
                                            fullWidth
                                            disabled
                                            variant="filled"
                                            type="date"
                                            label="Date :"
                                            name="CheckBox1date"
                                            value={values.CheckBox1date}
                                            InputLabelProps={{
                                                shrink: true,
                                                style: {
                                                    color: theme => theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    mt={2}
                                    display="flex"
                                    gap="30px"
                                    width="50%"

                                    gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                    }}
                                >
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%', marginLeft: '75px' }}>
                                        <TextField
                                            id="Query1"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="filled"
                                            type="text"
                                            label="Query :"
                                            name="Query1"
                                            onChange={handleChange}
                                            value={values.Query1}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                            </FormGroup>
                        </>
                    )}
                    {activeStep === 5 && (
                        <>
                            <FormGroup>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    width="50%"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="CheckBox2"
                                                checked={values.CheckBox2}
                                                onChange={handleCheckBoxChange}
                                                sx={{
                                                    color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    '&.Mui-checked': {
                                                        color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Done"
                                        sx={{ gridColumn: 'span 1' }}
                                    />
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%' }}>
                                        <TextField
                                            id="CheckBox2date"
                                            fullWidth
                                            variant="filled"
                                            type="date"
                                            label="Date :"
                                            name="CheckBox2date"
                                            value={values.CheckBox2date}
                                            disabled
                                            InputLabelProps={{
                                                shrink: true,
                                                style: {
                                                    color: theme => theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    mt={2}
                                    display="flex"
                                    gap="30px"
                                    width="50%"
                                    gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                    }}>
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%', marginLeft: '75px' }}>
                                        <TextField
                                            id="Query2"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            multiline
                                            rows={4}
                                            label="Query :"
                                            name='Query2'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.Query2}
                                            error={!!touched.Query2 && !!errors.Query2}
                                            helperText={touched.Query2 && errors.Query2}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                            </FormGroup>
                        </>
                    )}
                    {activeStep === 6 && (
                        <>
                            <FormGroup>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    width="50%"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="CheckBox3"
                                                checked={values.CheckBox3}
                                                onChange={handleCheckBoxChange}
                                                sx={{
                                                    color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    '&.Mui-checked': {
                                                        color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Done"
                                        sx={{ gridColumn: 'span 1' }}
                                    />
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%' }}>
                                        <TextField
                                            id="CheckBox3date"
                                            fullWidth
                                            variant="filled"
                                            type="date"
                                            label="Date :"
                                            name="CheckBox3date"
                                            value={values.CheckBox3date}
                                            disabled
                                            InputLabelProps={{
                                                shrink: true,
                                                style: {
                                                    color: theme => theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    mt={2}
                                    display="flex"
                                    gap="30px"
                                    width="50%"
                                    gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                    }}>
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%', marginLeft: '75px' }}>
                                        <TextField
                                            id="Query3"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            multiline
                                            rows={4}
                                            label="Query :"
                                            name='Query3'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.Query3}
                                            error={!!touched.Query3 && !!errors.Query3}
                                            helperText={touched.Query3 && errors.Query3}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                            </FormGroup>
                        </>
                    )}
                    {activeStep === 7 && (
                        <>
                            <FormGroup>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    width="50%"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="CheckBox4"
                                                checked={values.CheckBox4}
                                                onChange={handleCheckBoxChange}
                                                sx={{
                                                    color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    '&.Mui-checked': {
                                                        color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Done"
                                        sx={{ gridColumn: 'span 1' }}
                                    />
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%' }}>
                                        <TextField
                                            id="CheckBox4date"
                                            fullWidth
                                            variant="filled"
                                            type="date"
                                            label="Date :"
                                            name="CheckBox4date"
                                            value={values.CheckBox4date}
                                            disabled
                                            InputLabelProps={{
                                                shrink: true,
                                                style: {
                                                    color: theme => theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    mt={2}
                                    display="flex"
                                    gap="30px"
                                    width="50%"
                                    gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                    }}>
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%', marginLeft: '75px' }}>
                                        <TextField
                                            id="Query4"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            multiline
                                            rows={4}
                                            label="Query :"
                                            name='Query4'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.Query4}
                                            error={!!touched.Query4 && !!errors.Query4}
                                            helperText={touched.Query4 && errors.Query4}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                            </FormGroup>
                        </>
                    )}
                    {activeStep === 8 && (
                        <>
                            <FormGroup>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    width="50%"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="CheckBox5"
                                                checked={values.CheckBox5}
                                                onChange={handleCheckBoxChange}
                                                sx={{
                                                    color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    '&.Mui-checked': {
                                                        color: theme => theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Done"
                                        sx={{ gridColumn: 'span 1' }}
                                    />
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%' }}>
                                        <TextField
                                            id="CheckBox5date"
                                            fullWidth
                                            variant="filled"
                                            type="date"
                                            label="Date :"
                                            name="CheckBox5date"
                                            value={values.CheckBox5date}
                                            disabled
                                            InputLabelProps={{
                                                shrink: true,
                                                style: {
                                                    color: theme => theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    mt={2}
                                    display="flex"
                                    gap="30px"
                                    width="50%"
                                    gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                    }}>
                                    <FormControl variant="filled" sx={{ gridColumn: 'span 1', width: '100%', marginLeft: '75px' }}>
                                        <TextField
                                            id="Query5"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            multiline
                                            rows={4}
                                            label="Query :"
                                            name='Query5'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.Query5}
                                            error={!!touched.Query5 && !!errors.Query5}
                                            helperText={touched.Query5 && errors.Query5}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                            </FormGroup>
                        </>
                    )}

                    <FormControl >
                        <Stack direction="row" spacing={2} sx={{ m: 1, minWidth: 120 }}>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => {
                                    handleNext(values, {
                                        setFieldError,
                                        validateForm,
                                        setSubmitting: () => { },
                                        resetForm: () => { }
                                    });
                                }}
                            >
                                {isLastStep ? (liasoningData._id ? 'Update' : 'Submit') : 'Next'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </Stack>
                    </FormControl>
                </Stack>
            </form>
        </Box >
    );
}   