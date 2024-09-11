import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, useFormikContext, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import Radio from '@mui/material/Radio';
import { useLocation, useParams } from 'react-router-dom';
import { addCommercialMarketing, editCommercialMarketing, getCommercialMarketing, viewComerialMarketing } from '../../../redux/slice/Commercialmarketing.slice';
import { useState } from 'react';
import { useEffect } from 'react';
import { addRasidentialMarketing, editRasidentialMarketing, getRasidentialMarketing, viewRasidentialMarketing } from '../../../redux/slice/Residentialmarketing.slice';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg,#222222 0%, #FFFFFF 120%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg,#222222 0%, #FFFFFF 120%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
    }),
    ...(ownerState.error && {
        border: '2px solid red',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className, icon, onClick, theme, error } = props;

    const icons = {
        1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        3: <img src="/assets/images/icons/Customer Price.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        4: <img src="/assets/images/icons/Dealer Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        5: <img src="/assets/images/icons/System Specification.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        // 6: <img src="/assets/images/icons/Business Document Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
    };


    return (
        // <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
        //     {icons[String(icon)]}
        // </ColorlibStepIconRoot>
        <ColorlibStepIconRoot ownerState={{ completed, active, error }} className={className} onClick={onClick}>
            {icons[String(icon)]}
        </ColorlibStepIconRoot>
    );
}


ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    error: PropTypes.bool,
};

const steps = ['File No', 'Customer Details', 'Customer Price', 'Dealer Details', 'System Spcification'];

const validationSchemas =
    Yup.object({
        // fillNo: Yup.string().required('File No. is required'),
        consumerName: Yup.string().required('Contact Person Name is required'),
        marketingType: Yup.string().required('Marketing Type is required'),
        phoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone Number is required'),
        consumerNumber: Yup.number().required('Consumer Number is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City/Village is required'),
        district: Yup.string().required('District/Location is required'),
        pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
        latitude: Yup.number().min(-90).max(90).required('Latitude is required'),
        longitude: Yup.string().required('Longitude is required'),
        primaryAccount: Yup.string().required('Primary Amount is required'),
        date: Yup.date().required('Date is required'),
        solarAmount: Yup.number().positive('Solar Amount must be positive').required('Solar Amount is required'),
        cashAmount: Yup.number().positive('Cash Amount must be positive').required('Cash Amount is required'),
        dealerPolicy: Yup.string().required('Dealer Policy is required'),
        solarModuleMake: Yup.string().required('Solar Module Make is required'),
        solarModulWp: Yup.string().required('Solar Module Wp is required'),
        solarModuleNos: Yup.string().required('Solar Module Nos is required'),
        systmSizeKw: Yup.string().required('System Size Kw is required'),
        inventrySize: Yup.string().required('Inverter Size is required')
    });

const initialValues = {
    // fillNo: '',
    marketingType: '',
    date: '',
    consumerName: '',
    phoneNumber: '',
    consumerNumber: '',
    address: '',
    city: '',
    district: '',
    pincode: '',
    latitude: '',
    longitude: '',
    primaryAccount: '',
    solarAmount: '',
    cashAmount: '',
    // dealer: '',
    dealerPolicy: '',
    solarModuleMake: '',
    solarModulWp: '',
    solarModuleNos: '',
    systmSizeKw: '',
    inventrySize: '',
};

export default function AddResidential() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [marketingType, setMarketingType] = React.useState('');
    const [fileNo, setFileNo] = useState('');

    const dispatch = useDispatch();
    const { state } = useLocation();

    const id = state?._id;
    useEffect(() => {
        dispatch(getRasidentialMarketing());
    }, []);

    const RasidentialMarketData = useSelector(state => state.resMarketing.Residential.Residential);

    useEffect(() => {
        if (!id) {
            if (Array.isArray(RasidentialMarketData) && RasidentialMarketData.length === 0) {
                setFileNo('A001');
            } else if (Array.isArray(RasidentialMarketData) && RasidentialMarketData.length > 0) {
                let n = RasidentialMarketData.length;
                let lastFillNo = RasidentialMarketData[n - 1]?.fillNo;

                if (lastFillNo) {
                    const prefix = lastFillNo.charAt(0);
                    let sequenceNumber = parseInt(lastFillNo.substr(1), 10);
                    if (sequenceNumber < 100) {
                        sequenceNumber++;
                    } else {
                        const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
                        sequenceNumber = 1;
                        setFileNo(`${nextPrefix}001`);
                        return;
                    }
                    setFileNo(`${prefix}${sequenceNumber.toString().padStart(3, '0')}`);
                } else {
                    console.error("Invalid lastFillNo:", lastFillNo);
                }
            } else {
                console.error("RasidentialMarketData is not an array or is undefined");
            }
        } else {
            if (Array.isArray(RasidentialMarketData)) {
                const updateFill = RasidentialMarketData.find(item => item._id === id);
                if (updateFill) {
                    setFileNo(updateFill.fillNo);
                }
            }
        }
    }, [RasidentialMarketData, id]);
    // const getCommercialMarketName = (CommercialMarketId) => {
    //     const CommercialMarket = CommercialMarketData.find(com => com._id === CommercialMarketId);
    //     return CommercialMarket ? CommercialMarket.CommercialMarketName : "";
    // }

    const isLastStep = activeStep === steps.length - 1;


    // const handleNext = (values, actions) => {
    //     console.log("handleNext started");
    //     setTouchedSteps((prevTouchedSteps) => {
    //         const newTouchedSteps = [...prevTouchedSteps];
    //         newTouchedSteps[activeStep] = true;
    //         return newTouchedSteps;
    //     });

    //     actions.validateForm().then((errors) => {
    //         if (Object.keys(errors).length === 0) {
    //             if (!isLastStep) {
    //                 console.log("Moving to next step");
    //                 setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //             } else {
    //                 console.log("Submitting form");
    //                 const submissionValues = {
    //                     ...values,
    //                     fillNo: fileNo,
    //                 };
    //                 if (id) {
    //                     console.log("Updating existing record");
    //                     delete submissionValues.isActive;
    //                     delete submissionValues.createdAt;
    //                     delete submissionValues.updatedAt;
    //                     dispatch(editRasidentialMarketing({ id: values._id, ...submissionValues }));
    //                 } else {
    //                     console.log("Adding new record");
    //                     dispatch(addRasidentialMarketing(submissionValues));
    //                 }
    //                 actions.resetForm();
    //                 setActiveStep(0);
    //             }
    //         } else {
    //             console.log("Form validation errors:", errors);
    //             setStepsWithErrors((prevStepsWithErrors) => {
    //                 const newStepsWithErrors = [...prevStepsWithErrors];
    //                 newStepsWithErrors[activeStep] = true;
    //                 return newStepsWithErrors;
    //             });
    //             alert('Please fix the errors in the form before proceeding');
    //         }
    //         setValues('')
    //         actions.setSubmitting(false);
    //     });
    // };
    const handleNext = (values, actions) => {
        console.log("@@@@@@@@@@@");
        setTouchedSteps((prevTouchedSteps) => {
            const newTouchedSteps = [...prevTouchedSteps];
            newTouchedSteps[activeStep] = true;
            return newTouchedSteps;
        });

        // if (activeStep === 0 && !values.MarketingType) {
        //     actions.setFieldError('MarketingType', 'Please select a Marketing Type');
        //     return;
        // }

        if (!isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            actions.validateForm().then((errors) => {
                if (Object.keys(errors).length === 0) {

                    const submissionValues = {
                        ...values,
                        fillNo: fileNo,
                        // mainCommercialMarketName: getCommercialMarketName(values.mainCommercialMarketName),
                    };

                    if (id) {

                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;

                        dispatch(editRasidentialMarketing({ id: values._id, ...submissionValues }));
                        setValues('');
                    } else {
                        dispatch(addRasidentialMarketing(submissionValues));
                    }

                    actions.resetForm();
                    setActiveStep(0);
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
            })
        }

    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => {
        setActiveStep(step);
    };
    React.useEffect(() => {
        if (id) {
            dispatch(viewRasidentialMarketing(id)).then((response) => {

                if (response.payload && response.payload.Residential) {
                    const marketingData = response.payload.Residential;
                    // setValues({ ...marketingData, _id: id });
                    // setValues(prevValues => ({
                    //     ...prevValues,
                    //     ...marketingData
                    // }));
                    setValues(marketingData);

                } else {
                    console.error("Unexpected response structure:", response);
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [id, dispatch]);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();

    const { handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm, setFieldError } = useFormik({
        initialValues,
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });

    return (
        <Box m="20px">
            {id ? (
                <Header
                    title="Update Residential Market"
                    subtitle="Update your Marketing Detail"
                />
            ) : (
                <Header
                    title="Add Residential Market"
                    subtitle="Manager Your Marketing Detail here"
                />
            )}

            <form onSubmit={handleSubmit}>
                <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={(props) => (
                                    <ColorlibStepIcon
                                        {...props}
                                        theme={theme}
                                        icon={index + 1}
                                        onClick={() => handleStep(index)}
                                        error={index === 0 && touched.marketingType && errors.marketingType}
                                    />
                                )}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === 0 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="File No :"
                                        value={fileNo}
                                        name="fillNo"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        sx={{
                                            gridColumn: "span 2",
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl> */}
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="File No :"
                                        value={fileNo}
                                        name="fillNo"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        sx={{
                                            gridColumn: "span 2",
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary,
                                            },
                                        }}
                                    />
                                </FormControl>
                                <TextField
                                    margin="dense"
                                    id="marketingType"
                                    name="marketingType"
                                    label="Marketing Type :"
                                    select
                                    fullWidth
                                    variant="filled"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setMarketingType(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    value={values.marketingType}
                                    error={touched.marketingType && Boolean(errors.marketingType)}
                                    helperText={touched.marketingType && errors.marketingType}
                                    InputLabelProps={{
                                        style: {
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                >
                                    <MenuItem value="Commercial Marketing">Commercial Marketing</MenuItem>
                                    <MenuItem value="Residential Marketing">Residential Marketing</MenuItem>
                                </TextField>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="date"
                                        label="Date :"
                                        type="date"
                                        rows={4}
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.date}
                                        name="date"
                                        error={!!touched.date && !!errors.date}
                                        helperText={touched.date && errors.date}
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
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Consumer Name :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.consumerName}
                                        name="consumerName"
                                        error={!!touched.consumerName && !!errors.consumerName}
                                        helperText={touched.consumerName && errors.consumerName}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Phone Number : "
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phoneNumber}
                                        name="phoneNumber"
                                        error={!!touched.phoneNumber && !!errors.phoneNumber}
                                        helperText={touched.phoneNumber && errors.phoneNumber}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Consumer Number :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.consumerNumber}
                                        name="consumerNumber"
                                        error={!!touched.consumerNumber && !!errors.consumerNumber}
                                        helperText={touched.consumerNumber && errors.consumerNumber}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>

                            </Box>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="address"
                                        label="Address :"
                                        multiline
                                        defaultValue=""
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.address}
                                        name="address"
                                        error={!!touched.address && !!errors.address}
                                        helperText={touched.address && errors.address}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="city"
                                        label="City/Village :"
                                        multiline
                                        defaultValue=""
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.city}
                                        name="city"
                                        error={!!touched.city && !!errors.city}
                                        helperText={touched.city && errors.city}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="district"
                                        label="District/Location :"
                                        multiline
                                        defaultValue=""
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.district}
                                        name="district"
                                        error={!!touched.district && !!errors.district}
                                        helperText={touched.district && errors.district}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="pincode"
                                        label="Pincode :"
                                        multiline
                                        defaultValue=""
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.pincode}
                                        name="pincode"
                                        error={!!touched.pincode && !!errors.pincode}
                                        helperText={touched.pincode && errors.pincode}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="latitude"
                                        label="Latitude :"
                                        multiline
                                        defaultValue=""
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.latitude}
                                        name="latitude"
                                        error={!!touched.latitude && !!errors.latitude}
                                        helperText={touched.latitude && errors.latitude}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="longitude"
                                        label="longitude :"
                                        multiline
                                        defaultValue=""
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.longitude}
                                        name="longitude"
                                        error={!!touched.longitude && !!errors.longitude}
                                        helperText={touched.longitude && errors.longitude}
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
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Primary Account :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.primaryAccount}
                                        name="primaryAccount"
                                        error={!!touched.primaryAccount && !!errors.primaryAccount}
                                        helperText={touched.primaryAccount && errors.primaryAccount}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Solar Amount :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.solarAmount}
                                        name="solarAmount"
                                        error={!!touched.solarAmount && !!errors.solarAmount}
                                        helperText={touched.solarAmount && errors.solarAmount}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Cash Amount :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.cashAmount}
                                        name="cashAmount"
                                        error={!!touched.cashAmount && !!errors.cashAmount}
                                        helperText={touched.cashAmount && errors.cashAmount}
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
                    {activeStep === 3 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="dealer :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.dealer}
                                                name="dealer"
                                                error={!!touched.dealer && !!errors.dealer}
                                                helperText={touched.dealer && errors.dealer}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl> */}
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Dealer Policy :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.dealerPolicy}
                                        name="dealerPolicy"
                                        error={!!touched.dealerPolicy && !!errors.dealerPolicy}
                                        helperText={touched.dealerPolicy && errors.dealerPolicy}
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
                    {activeStep === 4 && (
                        <>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Solar Module Make:"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.solarModuleMake}
                                        name="solarModuleMake"
                                        error={!!touched.solarModuleMake && !!errors.solarModuleMake}
                                        helperText={touched.solarModuleMake && errors.solarModuleMake}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Solar Module Wp:"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.solarModulWp}
                                        name="solarModulWp"
                                        error={!!touched.solarModulWp && !!errors.solarModulWp}
                                        helperText={touched.solarModulWp && errors.solarModulWp}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Solar Module Nos:"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.solarModuleNos}
                                        name="solarModuleNos"
                                        error={!!touched.solarModuleNos && !!errors.solarModuleNos}
                                        helperText={touched.solarModuleNos && errors.solarModuleNos}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Systm Size Kw :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.systmSizeKw}
                                        name="systmSizeKw"
                                        error={!!touched.systmSizeKw && !!errors.systmSizeKw}
                                        helperText={touched.systmSizeKw && errors.systmSizeKw}
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
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Inventry Size :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.inventrySize}
                                        name="inventrySize"
                                        error={!!touched.inventrySize && !!errors.inventrySize}
                                        helperText={touched.inventrySize && errors.inventrySize}
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


                    <FormControl>
                        <Stack direction="row" spacing={2} sx={{ m: 1, minWidth: 120 }}>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            {/* <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => {
                                    if (activeStep === 0 && !values.marketingType) {
                                        setFieldError('MarketingType', 'Please select a Marketing Type');
                                        return;
                                    }
                                    validateForm().then((errors) => {
                                        if (Object.keys(errors).length === 0 || isLastStep) {
                                            handleNext(values, {
                                                setFieldError,
                                                validateForm,
                                                setSubmitting: () => { },
                                                resetForm: () => { }
                                            });
                                        } else {
                                            setTouchedSteps((prevTouchedSteps) => {
                                                const newTouchedSteps = [...prevTouchedSteps];
                                                newTouchedSteps[activeStep] = true;
                                                return newTouchedSteps;
                                            });
                                            setActiveStep((prevActiveStep) => prevActiveStep + 1);
                                        }
                                    });
                                }}
                            >
                                {isLastStep ? id ? 'Update' : 'Submit' : 'Next'}
                            </Button> */}
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => {
                                    if (activeStep === 0 && !values.marketingType) {
                                        setFieldError('marketingType', 'Please select a Marketing Type');
                                        return;
                                    }
                                    handleNext(values, {
                                        setFieldError,
                                        validateForm,
                                        setSubmitting: () => { },
                                        resetForm: () => { }
                                    });
                                }}
                            >
                                {isLastStep ? (id ? 'Update' : 'Submit') : 'Next'}
                            </Button>
                        </Stack>
                    </FormControl>
                </Stack>
            </form>
        </Box >
    );
}

