import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, IconButton, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, MenuItem, useTheme, FormLabel, RadioGroup, FormControlLabelDialog, DialogActions, DialogContent, DialogTitle, DialogContentText, FormControlLabel, Dialog } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import Radio from '@mui/material/Radio';
import { useLocation, useNavigate } from 'react-router-dom';
import { addCommercialMarketing, editCommercialMarketing, getCommercialMarketing, viewComerialMarketing } from '../../../redux/slice/Commercialmarketing.slice';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDealers, viewDealer } from '../../../redux/slice/dealer.slice';
import { getUsers } from '../../../redux/slice/users.slice';
import { getRoles } from '../../../redux/slice/roles.slice';
import { addLiasoning } from '../../../redux/slice/liasoning.slice';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';


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
    const { active, completed, className, icon, onClick, error, marketingType, theme } = props;

    const commercialIcons = {
        1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        3: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        4: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        5: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        6: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
    };

    const residentialIcons = {
        1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        3: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        4: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        5: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
    };
    const icons = marketingType === 'Commercial Marketing' ? commercialIcons : residentialIcons;


    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active, error }}
            className={className}
            onClick={onClick}
        >
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
    marketingType: PropTypes.string,
};


const commercialSteps = ['File No', 'Customer Basic Details', 'Customer Price', 'Dealer Details', 'Electricity Bill Details', 'Business Document Details'];
const residentialSteps = ['File No', 'Customer  Details', 'Customer Price', 'Dealer Details', 'System Specification'];

const getValidationSchema = (marketingType) => {
    const commonFields = {
        MarketingType: Yup.string().required('Marketing Type is required'),
        // Date: Yup.date().min(new Date(), 'Not Use Past Date...').required('Date is required'),
        Date: Yup.date()
            .required('Date is required')
            .test('is-today', 'Date must be today', (value) => {
                const today = new Date();
                return value && value.getFullYear() === today.getFullYear() &&
                    value.getMonth() === today.getMonth() &&
                    value.getDate() === today.getDate();
            }),
        PhoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Pincode must be exactly 10 digits').required('Phone Number is required'),
        Address: Yup.string().required('Address is required'),
        City_Village: Yup.string().required('City/Village is required'),
        District_Location: Yup.string().required('District/Location is required'),
        Pincode: Yup.string().matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').required('Pincode is required'),
        Latitude: Yup.number().required('Latitude is required'),
        Dealer: Yup.string().required('Dealer is required'),
        ConsumerName: Yup.string().required('Consumer Name is required'),
        Longitude: Yup.number().required('Longitude is required'),
        ConsumerNumber: Yup.string().required('Consumer Number is required'),
        SystemSizeKw: Yup.number().required('System Size Kw is required'),
    };

    if (marketingType === 'Commercial Marketing') {
        return Yup.object().shape({
            ...commonFields,
            DealerCommission: Yup.number().required('Dealer Commission is required'),
            Amount: Yup.number().required('Amount is required'),
            GST: Yup.number().required('GST is required'),
            TotalAmount: Yup.number().required('Total Amount is required'),
            ConnectionLoad: Yup.string().required('Connection Load is required'),
            ContactPersonName: Yup.string().required('Contact Person Name is required'),
            Tarrif: Yup.string().required('Tarrif is required'),
            AverageMonthlyBill: Yup.number().required('Average Monthly Bill is required'),
            GSTNumber: Yup.string().required('GST Number is required'),
            Phase: Yup.string().required('Phase is required'),
            PanNumber: Yup.string().required('Pan Number is required'),
            MSME_UdyamREGISTRATION: Yup.string().required('MSME/Udyam Registration is required'),
        });
    }

    return Yup.object().shape({
        ...commonFields,
        PrimaryAmount: Yup.number().required('Primary Amount is required'),
        SolarAmount: Yup.number().required('Solar Amount is required'),
        CashAmount: Yup.number().required('Cash Amount is required'),
        SolarModuleMake: Yup.string().required('Solar Module Make is required'),
        DealerPolicy: Yup.string().required('Dealer Policy is required'),
        SolarModuleWp: Yup.number().required('Solar Module Wp is required'),
        SolarModuleNos: Yup.number().required('Solar Module Nos is required'),
        InverterSize: Yup.number().required('Inverter Size is required'),
    });
};

const initialValues = {
    // fillNo: '',
    MarketingType: '',
    Date: '',
    ConsumerName: '',
    ContactPersonName: '',
    PhoneNumber: '',
    Address: '',
    City_Village: '',
    District_Location: '',
    Pincode: '',
    Latitude: '',
    Amount: '',
    GST: '',
    TotalAmount: '',
    Dealer: '',
    DealerCommission: '',
    ConsumerNumber: '',
    ConnectionLoad: '',
    Tarrif: '',
    AverageMonthlyBill: '',
    GSTNumber: '',
    PanNumber: '',
    MSME_UdyamREGISTRATION: '',
    PrimaryAmount: '',
    SolarAmount: '',
    CashAmount: '',
    Phase: '',
    SolarModuleMake: '',
    SolarModuleWp: '',
    SolarModuleNos: '',
    SystemSizeKw: '',
    InverterSize: '',
    DealerPolicy: '',
    adharCard: '',
    lightBill: '',
    veraBill: ''
};


export default function Marketing() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [marketingType, setMarketingType] = React.useState('');
    const [dealarData, setDealarData] = useState('');
    const [fileNo, setFileNo] = useState('');
    const [dealer, setDealar] = useState([]);
    const [validationSchema, setValidationSchema] = useState(getValidationSchema(marketingType));
    const downloadRef = React.useRef(null);
    const imgUrl = 'https://solar-backend-teal.vercel.app';


    const dispatch = useDispatch();
    // const { state, dealerset } = useLocation();
    const location = useLocation();
    const { id, dealerset } = location.state || {};

    // console.log(id);
    // const id = state?._id;
    useEffect(() => {
        dispatch(getCommercialMarketing());
        dispatch(getUsers());
        dispatch(getRoles());
        dispatch(getDealers());
    }, [dispatch]);

    React.useEffect(() => {
        if (id) {
            dispatch(viewComerialMarketing(id)).then((response) => {
                if (response.payload && response.payload.CommercialMarket) {
                    const MarketingData = response.payload.CommercialMarket;
                    setValues(MarketingData);
                    setMarketingType(MarketingData.MarketingType);
                    // console.log("MarketingData.MarketingType>>>>>>", MarketingData.MarketingType);
                }
            });
        }
    }, [id, dispatch]);

    const CommercialMarket = useSelector(state => state.comMarketing?.Marketing);

    const allUsers = useSelector(state => state.users.users);
    const allRoles = useSelector(state => state.roles.roles);
    const DealerRegister = useSelector(state => state.dealer.Dealer);

    useEffect(() => {
        if (allUsers.length && allRoles.length) {
            const dealerRole = allRoles.find(role => role.roleName === 'Dealer');
            if (dealerRole) {
                const filteredDealers = allUsers.filter(user => user.role === dealerRole._id);
                setDealar(filteredDealers);
            }
        }
    }, [allUsers, allRoles]);

    useEffect(() => {
        if (!id) {
            if (CommercialMarket && CommercialMarket.length === 0) {
                setFileNo('A001');
            } else if (CommercialMarket && CommercialMarket.length > 0) {
                let n = CommercialMarket.length;
                let lastFillNo = CommercialMarket[n - 1]?.fillNo;

                if (lastFillNo) {
                    const prefix = lastFillNo.charAt(0);
                    let sequenceNumber = parseInt(lastFillNo.substr(1));
                    if (sequenceNumber < 999) {
                        sequenceNumber++;
                    } else {
                        const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
                        sequenceNumber = 1;
                        setFileNo(`${nextPrefix}001`);
                    }
                    setFileNo(`${prefix}${sequenceNumber.toString().padStart(3, '0')}`);
                } else {
                    setFileNo('A001');
                }
            }
        } else {
            if (Array.isArray(CommercialMarket)) {
                const updateFillNo = CommercialMarket.find(item => item._id === id);
                if (updateFillNo) {
                    setFileNo(updateFillNo.fillNo);
                }
            }
        }
    }, [CommercialMarket, id]);

    useEffect(() => {
        // const id = localStorage.getItem("id");
        if (dealerset) {
            dispatch(viewDealer(dealerset)).then((response) => {
                if (response.payload) {
                    const data = response.payload;
                    setDealarData({
                        ...data,
                        adharCard: data.adharCard && data.adharCard[0] ? `${imgUrl}/${data.adharCard[0]}` : '',
                        lightBill: data.lightBill && data.lightBill[0] ? `${imgUrl}/${data.lightBill[0]}` : '',
                        veraBill: data.veraBill && data.veraBill[0] ? `${imgUrl}/${data.veraBill[0]}` : '',
                    });
                    console.log(data);

                    setValues(data)
                    setMarketingType(data.MarketingType)
                    console.log(data.MarketingType);

                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [dispatch, CommercialMarket]);

    const handleNext = (values, actions) => {
        setTouchedSteps((prevTouchedSteps) => {
            const newTouchedSteps = [...prevTouchedSteps];
            newTouchedSteps[activeStep] = true;
            return newTouchedSteps;
        });


        actions.validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                if (!isLastStep) {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                } else {
                    const commonFields = {
                        fillNo: fileNo,
                        MarketingType: values.MarketingType,
                        Date: values.Date,
                        PhoneNumber: values.PhoneNumber,
                        Address: values.Address,
                        City_Village: values.City_Village,
                        District_Location: values.District_Location,
                        Pincode: values.Pincode,
                        Latitude: values.Latitude,
                        Dealer: values.Dealer,
                        ConsumerName: values.ConsumerName,
                        Longitude: values.Longitude,
                        ConsumerNumber: values.ConsumerNumber,
                        adharCard: values.adharCard,
                        lightBill: values.lightBill,
                        veraBill: values.veraBill,
                        SystemSizeKw: values.SystemSizeKw,
                    };

                    let submissionValues;

                    if (values.MarketingType === 'Commercial Marketing') {
                        submissionValues = {
                            ...commonFields,
                            Amount: values.Amount,
                            GST: values.GST,
                            DealerCommission: values.DealerCommission,
                            TotalAmount: values.TotalAmount,
                            ConnectionLoad: values.ConnectionLoad,
                            ContactPersonName: values.ContactPersonName,
                            Tarrif: values.Tarrif,
                            AverageMonthlyBill: values.AverageMonthlyBill,
                            GSTNumber: values.GSTNumber,
                            Phase: values.Phase,
                            PanNumber: values.PanNumber,
                            MSME_UdyamREGISTRATION: values.MSME_UdyamREGISTRATION,
                        };
                    } else if (values.MarketingType === 'Residential Marketing') {
                        submissionValues = {
                            ...commonFields,
                            PrimaryAmount: values.PrimaryAmount,
                            SolarAmount: values.SolarAmount,
                            CashAmount: values.CashAmount,
                            SolarModuleMake: values.SolarModuleMake,
                            DealerPolicy: values.DealerPolicy,
                            SolarModuleWp: values.SolarModuleWp,
                            SolarModuleNos: values.SolarModuleNos,
                            InverterSize: values.InverterSize,
                        };
                    }
                    if (id) {
                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;

                        dispatch(editCommercialMarketing({ id: values._id, submissionValues })).then(() => {
                            dispatch(getCommercialMarketing());
                        });
                    } else {
                        dispatch(addLiasoning(submissionValues))
                        dispatch(addCommercialMarketing(submissionValues)).then(() => {
                            dispatch(getCommercialMarketing());
                            sessionStorage.removeItem("id");
                        });
                    }

                    actions.resetForm();
                    setActiveStep(0);
                }
            } else {
                setStepsWithErrors((prevStepsWithErrors) => {
                    const newStepsWithErrors = [...prevStepsWithErrors];
                    newStepsWithErrors[activeStep] = true;
                    return newStepsWithErrors;
                });
                alert('Please fix the errors in the form before submitting');
            }
            actions.setSubmitting(false);
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => {
        setActiveStep(step);
    };
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();

    const { handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm, setFieldError } = useFormik({
        initialValues,
        // validationSchema: validationSchema,
        validationSchema: getValidationSchema(marketingType),
        onSubmit: handleNext,
    });

    useEffect(() => {
        setFieldValue('validationSchema', getValidationSchema(marketingType));
    }, [marketingType]);


    const steps = values?.MarketingType === 'Commercial Marketing' ? commercialSteps : residentialSteps;
    const isLastStep = activeStep === steps.length - 1;



    const [openView, setOpenView] = React.useState(false);
    const [viewImage, setViewImage] = useState(null);

    const handleView = (imageType) => {
        let imageUrl;
        const baseUrl = {imgUrl};

        if (imageType === 'adharCard') {
            imageUrl = values.adharCard instanceof File ? URL.createObjectURL(values.adharCard) :
                (values.adharCard ? `${baseUrl}${values.adharCard}` : dealarData.adharCard);
        } else if (imageType === 'lightBill') {
            imageUrl = values.lightBill instanceof File ? URL.createObjectURL(values.lightBill) :
                (values.lightBill ? `${baseUrl}${values.lightBill}` : dealarData.lightBill);
        } else if (imageType === 'veraBill') {
            imageUrl = values.veraBill instanceof File ? URL.createObjectURL(values.veraBill) :
                (values.veraBill ? `${baseUrl}${values.veraBill}` : dealarData.veraBill);
        }
        setViewImage(imageUrl);
        setOpenView(true);
    }

    const handleCloseView = () => {
        setOpenView(false);
    };
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // const handleDownload = async () => {
    //     if (viewImage) {
    //         try {
    //             console.log("Downloading image from:", viewImage);
    //             const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(viewImage)}`;
    //             const response = await fetch(proxyUrl);

    //             if (response.ok) {
    //                 const blob = await response.blob();
    //                 const url = URL.createObjectURL(blob);
    //                 const link = document.createElement('a');
    //                 link.href = url;
    //                 link.download = 'downloaded-image.png';
    //                 document.body.appendChild(link);
    //                 link.click();
    //                 document.body.removeChild(link);
    //                 URL.revokeObjectURL(url);
    //             } else {
    //                 console.error('Failed to download image');
    //             }
    //         } catch (error) {
    //             console.error('Error in download process:', error);
    //         }
    //     } else {
    //         console.log("No image available");
    //     }
    // };


    // const handleDownload = async () => {
    //     if (viewImage) {
    //         try {
    //             let response;
    //             if (id) {
    //                 const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(viewImage)}`;
    //                 response = await fetch(proxyUrl);
    //             } else {
    //                 response = await fetch(viewImage);
    //             }

    //             if (response.ok) {
    //                 const blob = await response.blob();
    //                 const url = URL.createObjectURL(blob);
    //                 const link = document.createElement('a');
    //                 link.href = url;
    //                 link.download = 'downloaded-image.png';
    //                 document.body.appendChild(link);
    //                 link.click();
    //                 document.body.removeChild(link);
    //                 URL.revokeObjectURL(url);
    //             } else {
    //                 console.error('Failed to download image');
    //             }
    //         } catch (error) {
    //             console.error('Error in download process:', error);
    //         }
    //     } else {
    //         console.log("No image available");
    //     }
    // };


    const handleDownload = async () => {
        console.log(viewImage);

        if (viewImage) {
            try {
                let imageUrl;
                if (id) {
                    console.log(viewImage);
                    if (viewImage.includes("4000")) {
                        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(viewImage)}`;
                        imageUrl = proxyUrl;
                    } else {
                        imageUrl = viewImage;
                    }
                } else {
                    imageUrl = viewImage;
                }

                const response = await fetch(imageUrl);

                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'downloaded-image.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.error('Failed to download image');
                }
            } catch (error) {
                console.error('Error in download process:', error);
            }
        } else {
            console.log("No image available");
        }
    };


    const navigate = useNavigate()
    const role = sessionStorage.getItem('role');
    useEffect(() => {
        dispatch(getRoles())
    }, []);


    const roles = useSelector(state => state.roles.roles);
    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    const canAccessPage = hasPermission("Marketing");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }



    return (
        <Box m="20px">
            {id ? (
                <Header
                    title="Update Marketing Details"
                    subtitle="Update your Marketing Detail"
                />
            ) : (
                <Header
                    title="Add Marketing Details"
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
                                        error={index === 0 && touched.MarketingType && errors.MarketingType}
                                        marketingType={values.MarketingType}
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
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="File No :"
                                        value={fileNo}
                                        // onChange={demofile}
                                        name="fillNo"
                                        sx={{
                                            gridColumn: "span 2",

                                        }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                                <TextField
                                    margin="dense"
                                    id="MarketingType"
                                    name="MarketingType"
                                    label="Marketing Type :"
                                    select
                                    fullWidth
                                    variant="filled"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setMarketingType(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    value={values?.MarketingType}
                                    error={touched.MarketingType && Boolean(errors.MarketingType)}
                                    helperText={touched.MarketingType && errors.MarketingType}
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
                                        id="Date"
                                        label="Date :"
                                        type="date"
                                        variant="filled"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.Date}
                                        name="Date"
                                        error={!!touched.Date && !!errors.Date}
                                        helperText={touched.Date && errors.Date}
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

                    {marketingType === 'Commercial Marketing' && (
                        <>
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
                                                label="Consumer Name as per Light bill :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.ConsumerName}
                                                name="ConsumerName"
                                                error={!!touched.ConsumerName && !!errors.ConsumerName}
                                                helperText={touched.ConsumerName && errors.ConsumerName}
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
                                                label="Contact Person Name : "
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.ContactPersonName}
                                                name="ContactPersonName"
                                                error={!!touched.ContactPersonName && !!errors.ContactPersonName}
                                                helperText={touched.ContactPersonName && errors.ContactPersonName}
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
                                                value={values.PhoneNumber}
                                                name="PhoneNumber"
                                                error={!!touched.PhoneNumber && !!errors.PhoneNumber}
                                                helperText={touched.PhoneNumber && errors.PhoneNumber}
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
                                                id="Address"
                                                label="Address :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Address}
                                                name="Address"
                                                error={!!touched.Address && !!errors.Address}
                                                helperText={touched.Address && errors.Address}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="City_Village"
                                                label="City/Village :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.City_Village}
                                                name="City_Village"
                                                error={!!touched.City_Village && !!errors.City_Village}
                                                helperText={touched.City_Village && errors.City_Village}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="District_Location"
                                                label="District/Location :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.District_Location}
                                                name="District_Location"
                                                error={!!touched.District_Location && !!errors.District_Location}
                                                helperText={touched.District_Location && errors.District_Location}
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
                                                id="Pincode"
                                                label="Pincode :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Pincode}
                                                name="Pincode"
                                                error={!!touched.Pincode && !!errors.Pincode}
                                                helperText={touched.Pincode && errors.Pincode}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="Latitude"
                                                label="Latitude :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Latitude}
                                                name="Latitude"
                                                error={!!touched.Latitude && !!errors.Latitude}
                                                helperText={touched.Latitude && errors.Latitude}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="Longitude"
                                                label="Longitude :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Longitude}
                                                name="Longitude"
                                                error={!!touched.Longitude && !!errors.Longitude}
                                                helperText={touched.Longitude && errors.Longitude}
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
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Upload AdharCard
                                                <input
                                                    type="file"
                                                    hidden
                                                    id="adharCard"
                                                    name="adharCard"
                                                    onChange={(event) => {
                                                        setFieldValue("adharCard", event.currentTarget.files[0]);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </Button>
                                            {values.adharCard && (
                                                <img
                                                    src={typeof values.adharCard === 'string'
                                                        ? `${imgUrl}/${values.adharCard}`
                                                        : (values.adharCard instanceof File ? URL.createObjectURL(values.adharCard) : '')}
                                                    alt="avatar"
                                                    width="50"
                                                    height="50"
                                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                                />
                                            )}
                                            <IconButton aria-label="edit" onClick={() => handleView('adharCard')}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Upload LightBill
                                                <input
                                                    type="file"
                                                    hidden
                                                    id="lightBill"
                                                    name="lightBill"
                                                    onChange={(event) => {
                                                        setFieldValue("lightBill", event.currentTarget.files[0]);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </Button>
                                            {values.lightBill && (
                                                <img
                                                    src={typeof values.lightBill === 'string'
                                                        ? `${imgUrl}/${values.lightBill}`
                                                        : (values.lightBill instanceof File ? URL.createObjectURL(values.lightBill) : '')}
                                                    alt="avatar"
                                                    width="50"
                                                    height="50"
                                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                                />
                                            )}
                                            <IconButton aria-label="edit" onClick={() => handleView('lightBill')}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Upload VeraBill
                                                <input
                                                    type="file"
                                                    hidden
                                                    id="veraBill"
                                                    name="veraBill"
                                                    onChange={(event) => {
                                                        setFieldValue("veraBill", event.currentTarget.files[0]);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </Button>
                                            {values.veraBill && (
                                                <img
                                                    src={typeof values.veraBill === 'string'
                                                        ? `${imgUrl}/${values.veraBill}`
                                                        : (values.veraBill instanceof File ? URL.createObjectURL(values.veraBill) : '')}
                                                    alt="avatar"
                                                    width="50"
                                                    height="50"
                                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                                />
                                            )}
                                            <IconButton aria-label="edit" onClick={() => handleView('veraBill')}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </div>
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
                                                label="Amount :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Amount}
                                                name="Amount"
                                                error={!!touched.Amount && !!errors.Amount}
                                                helperText={touched.Amount && errors.Amount}
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
                                                label="GST :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.GST}
                                                name="GST"
                                                error={!!touched.GST && !!errors.GST}
                                                helperText={touched.GST && errors.GST}
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
                                                label="Total Amount :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.TotalAmount}
                                                name="TotalAmount"
                                                error={!!touched.TotalAmount && !!errors.TotalAmount}
                                                helperText={touched.TotalAmount && errors.TotalAmount}
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
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>

                                            <TextField
                                                margin="dense"
                                                id="Dealer"
                                                name="role"
                                                label="Dealer :"
                                                select
                                                fullWidth
                                                variant="filled"
                                                // onChange={handleChange}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    setFieldValue('Dealer', event.target.value);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.Dealer}
                                                error={touched.Dealer && Boolean(errors.Dealer)}
                                                helperText={touched.Dealer && errors.Dealer}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            >
                                                {
                                                    DealerRegister.map((v) => (
                                                        <MenuItem value={v._id}>{v.ConsumerName}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Dealer Commission :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.DealerCommission}
                                                name="DealerCommission"
                                                error={!!touched.DealerCommission && !!errors.DealerCommission}
                                                helperText={touched.DealerCommission && errors.DealerCommission}
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
                                        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                        }}
                                    >
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Consumer Number :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.ConsumerNumber}
                                                name="ConsumerNumber"
                                                error={!!touched.ConsumerNumber && !!errors.ConsumerNumber}
                                                helperText={touched.ConsumerNumber && errors.ConsumerNumber}
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
                                                label="Connection Load :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.ConnectionLoad}
                                                name="ConnectionLoad"
                                                error={!!touched.ConnectionLoad && !!errors.ConnectionLoad}
                                                helperText={touched.ConnectionLoad && errors.ConnectionLoad}
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
                                                label="Tarrif :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Tarrif}
                                                name="Tarrif"
                                                error={!!touched.Tarrif && !!errors.Tarrif}
                                                helperText={touched.Tarrif && errors.Tarrif}
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
                                                label="Average Monthly Bill :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.AverageMonthlyBill}
                                                name="AverageMonthlyBill"
                                                error={!!touched.AverageMonthlyBill && !!errors.AverageMonthlyBill}
                                                helperText={touched.AverageMonthlyBill && errors.AverageMonthlyBill}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label" sx={{
                                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                '&.Mui-focused': {
                                                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                },
                                            }}>Phase :</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="Phase"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Phase}
                                            >
                                                <FormControlLabel value="1" control={<Radio
                                                    sx={{
                                                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                        '&.Mui-checked': {
                                                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                        },
                                                    }}
                                                />} label="1" />
                                                <FormControlLabel value="3" control={<Radio
                                                    sx={{
                                                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                        '&.Mui-checked': {
                                                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                                                        },
                                                    }}
                                                />} label="3" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </>
                            )}
                            {activeStep === 5 && (
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
                                                label="GST Number :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.GSTNumber}
                                                name="GSTNumber"
                                                error={!!touched.GSTNumber && !!errors.GSTNumber}
                                                helperText={touched.GSTNumber && errors.GSTNumber}
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
                                                label="Pan Number:"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.PanNumber}
                                                name="PanNumber"
                                                error={!!touched.PanNumber && !!errors.PanNumber}
                                                helperText={touched.PanNumber && errors.PanNumber}
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
                                                label="MSME/udyam REGISTRATION :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.MSME_UdyamREGISTRATION}
                                                name="MSME_UdyamREGISTRATION"
                                                error={!!touched.MSME_UdyamREGISTRATION && !!errors.MSME_UdyamREGISTRATION}
                                                helperText={touched.MSME_UdyamREGISTRATION && errors.MSME_UdyamREGISTRATION}
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
                                                label="System Size Kw :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.SystemSizeKw}
                                                name="SystemSizeKw"
                                                error={!!touched.SystemSizeKw && !!errors.SystemSizeKw}
                                                helperText={touched.SystemSizeKw && errors.SystemSizeKw}
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
                        </>
                    )}

                    {marketingType === 'Residential Marketing' && (
                        <>
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
                                                value={values.ConsumerName}
                                                name="ConsumerName"
                                                error={!!touched.ConsumerName && !!errors.ConsumerName}
                                                helperText={touched.ConsumerName && errors.ConsumerName}
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
                                                value={values.PhoneNumber}
                                                name="PhoneNumber"
                                                error={!!touched.PhoneNumber && !!errors.PhoneNumber}
                                                helperText={touched.PhoneNumber && errors.PhoneNumber}
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
                                                label="Consumer Number : "
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.ConsumerNumber}
                                                name="ConsumerNumber"
                                                error={!!touched.ConsumerNumber && !!errors.ConsumerNumber}
                                                helperText={touched.ConsumerNumber && errors.ConsumerNumber}
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
                                                id="Address"
                                                label="Address :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Address}
                                                name="Address"
                                                error={!!touched.Address && !!errors.Address}
                                                helperText={touched.Address && errors.Address}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="City_Village"
                                                label="City/Village :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.City_Village}
                                                name="City_Village"
                                                error={!!touched.City_Village && !!errors.City_Village}
                                                helperText={touched.City_Village && errors.City_Village}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="District_Location"
                                                label="District/Location :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.District_Location}
                                                name="District_Location"
                                                error={!!touched.District_Location && !!errors.District_Location}
                                                helperText={touched.District_Location && errors.District_Location}
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
                                                id="Pincode"
                                                label="Pincode :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Pincode}
                                                name="Pincode"
                                                error={!!touched.Pincode && !!errors.Pincode}
                                                helperText={touched.Pincode && errors.Pincode}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="Latitude"
                                                label="Latitude :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Latitude}
                                                name="Latitude"
                                                error={!!touched.Latitude && !!errors.Latitude}
                                                helperText={touched.Latitude && errors.Latitude}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                id="Longitude"
                                                label="Longitude :"
                                                multiline
                                                defaultValue=""
                                                variant="filled"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.Longitude}
                                                name="Longitude"
                                                error={!!touched.Longitude && !!errors.Longitude}
                                                helperText={touched.Longitude && errors.Longitude}
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
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Upload AdharCard
                                                <input
                                                    type="file"
                                                    hidden
                                                    id="adharCard"
                                                    name="adharCard"
                                                    onChange={(event) => {
                                                        setFieldValue("adharCard", event.currentTarget.files[0]);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </Button>
                                            {values.adharCard && (
                                                <img
                                                    src={typeof values.adharCard === 'string'
                                                        ? ` ${imgUrl}/${values.adharCard}`
                                                        : (values.adharCard instanceof File ? URL.createObjectURL(values.adharCard) : '')}
                                                    alt="avatar"
                                                    width="50"
                                                    height="50"
                                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                                />
                                            )}
                                            <IconButton aria-label="edit" onClick={() => handleView('adharCard')}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Upload LightBill
                                                <input
                                                    type="file"
                                                    hidden
                                                    id="lightBill"
                                                    name="lightBill"
                                                    onChange={(event) => {
                                                        setFieldValue("lightBill", event.currentTarget.files[0]);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </Button>
                                            {values.lightBill && (
                                                <img
                                                    src={typeof values.lightBill === 'string'
                                                        ? ` ${imgUrl}/${values.lightBill}`
                                                        : (values.lightBill instanceof File ? URL.createObjectURL(values.lightBill) : '')}
                                                    alt="avatar"
                                                    width="50"
                                                    height="50"
                                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                                />
                                            )}
                                            <IconButton aria-label="edit" onClick={() => handleView('lightBill')}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Upload VeraBill
                                                <input
                                                    type="file"
                                                    hidden
                                                    id="veraBill"
                                                    name="veraBill"
                                                    onChange={(event) => {
                                                        setFieldValue("veraBill", event.currentTarget.files[0]);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </Button>
                                            {values.veraBill && (
                                                <img
                                                    src={typeof values.veraBill === 'string'
                                                        ? ` ${imgUrl}/${values.veraBill}`
                                                        : (values.veraBill instanceof File ? URL.createObjectURL(values.veraBill) : '')}
                                                    alt="avatar"
                                                    width="50"
                                                    height="50"
                                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                                />
                                            )}
                                            <IconButton aria-label="edit" onClick={() => handleView('veraBill')}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </div>
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
                                                label="Primary Amount :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.PrimaryAmount}
                                                name="PrimaryAmount"
                                                error={!!touched.PrimaryAmount && !!errors.PrimaryAmount}
                                                helperText={touched.PrimaryAmount && errors.PrimaryAmount}
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
                                                value={values.SolarAmount}
                                                name="SolarAmount"
                                                error={!!touched.SolarAmount && !!errors.SolarAmount}
                                                helperText={touched.SolarAmount && errors.SolarAmount}
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
                                                value={values.CashAmount}
                                                name="CashAmount"
                                                error={!!touched.CashAmount && !!errors.CashAmount}
                                                helperText={touched.CashAmount && errors.CashAmount}
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
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>

                                            <TextField
                                                margin="dense"
                                                id="Dealer"
                                                name="Dealer"
                                                label="Dealer :"
                                                select
                                                fullWidth
                                                variant="filled"
                                                // onChange={handleChange}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    setFieldValue('Dealer', event.target.value);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.Dealer}
                                                error={touched.Dealer && Boolean(errors.Dealer)}
                                                helperText={touched.Dealer && errors.Dealer}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            >
                                                {
                                                    DealerRegister.map((v) => (
                                                        <MenuItem value={v._id}>{v.ConsumerName}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Dealer Policy :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.DealerPolicy}
                                                name="DealerPolicy"
                                                error={!!touched.DealerPolicy && !!errors.DealerPolicy}
                                                helperText={touched.DealerPolicy && errors.DealerPolicy}
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
                                                label="Solar Module Make :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.SolarModuleMake}
                                                name="SolarModuleMake"
                                                error={!!touched.SolarModuleMake && !!errors.SolarModuleMake}
                                                helperText={touched.SolarModuleMake && errors.SolarModuleMake}
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
                                                label="Solar Module Wp :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.SolarModuleWp}
                                                name="SolarModuleWp"
                                                error={!!touched.SolarModuleWp && !!errors.SolarModuleWp}
                                                helperText={touched.SolarModuleWp && errors.SolarModuleWp}
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
                                                label="Solar Module Nos :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.SolarModuleNos}
                                                name="SolarModuleNos"
                                                error={!!touched.SolarModuleNos && !!errors.SolarModuleNos}
                                                helperText={touched.SolarModuleNos && errors.SolarModuleNos}
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
                                        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                        }}
                                    >
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="System Size Kw :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.SystemSizeKw}
                                                name="SystemSizeKw"
                                                error={!!touched.SystemSizeKw && !!errors.SystemSizeKw}
                                                helperText={touched.SystemSizeKw && errors.SystemSizeKw}
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
                                                label="Inverter Size :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.InverterSize}
                                                name="InverterSize"
                                                error={!!touched.InverterSize && !!errors.InverterSize}
                                                helperText={touched.InverterSize && errors.InverterSize}
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
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => {
                                    validateForm().then((errors) => {
                                        if (Object.keys(errors).length === 0 || isLastStep) {
                                            handleSubmit();
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
                            </Button>
                        </Stack>
                    </FormControl>

                    <Dialog
                        fullScreen={fullScreen}
                        open={openView}
                        onClose={handleCloseView}
                        aria-labelledby="responsive-dialog-title"
                        maxWidth={"sm"}
                        fullWidth
                    >
                        <DialogTitle id="responsive-dialog-title" style={{ backgroundColor: theme.palette.background.purple, textAlign: 'right' }}>
                            <Button
                                onClick={handleDownload}
                                style={{ color: theme.palette.text.primary }}
                                startIcon={<DownloadIcon />}
                                disabled={!viewImage}
                            >
                                Download
                            </Button>
                        </DialogTitle>
                        {/* <DialogContent style={{ backgroundColor: theme.palette.background.purple, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            {viewImage ? (
                                <div  style={{ maxWidth: '100%', maxHeight: '80vh' }} >
                                    <img
                                        src={viewImage}
                                        alt="Uploaded Image"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        ref={downloadRef}
                                    />
                                </div>
                            ) : (
                                <p>No image to display</p>
                            )}
                        </DialogContent> */}
                        <DialogContent style={{ backgroundColor: theme.palette.background.purple, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            {viewImage ? (
                                <div style={{ maxWidth: '100%', maxHeight: '80vh' }} >
                                    <img
                                        src={viewImage}
                                        alt="Uploaded Image"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        ref={downloadRef}
                                    />
                                </div>
                            ) : (
                                <p>No image to display</p>
                            )}
                        </DialogContent>
                        <DialogActions style={{ backgroundColor: theme.palette.background.purple }}>
                            <Button autoFocus onClick={handleCloseView} style={{ color: theme.palette.text.primary }}>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </form>

        </Box >
    );
}



