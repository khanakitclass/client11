// // //////////////////////////////////////////////////////
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, useFormikContext, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { Country, State, City } from 'country-state-city';
import { getRoles } from '../../../redux/slice/roles.slice';
import { addDelear, editDealer, viewDealer } from '../../../redux/slice/dealer.slice';
import { addWarehouse, editWarehouse, getWarehouses, viewWerehouse } from '../../../redux/slice/warehouses.slice';
let country_state_district = require('@coffeebeanslabs/country_state_district');


// let country_state_district = require('@coffeebeanslabs/country_state_district');
// console.log("selected state", State, Country, City)
let countries = country_state_district.getAllCountries();
let districts = country_state_district.getDistrictsByStateId();
let states = country_state_district.getAllStates();
// console.log("districts", districts)
// console.log("states", states)


// console.log("countriesfffff", countries)




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
        border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
    }),
    ...(ownerState.error && {
        border: '2px solid red',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className, icon, onClick, theme, error } = props;

    const icons = {
        1: <img src="/assets/images/icons/basicw.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        2: <img src="/assets/images/icons/variant.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        // 3: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
    };

    return (
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

const steps = ['Basic Details', 'Contact'];

const validationSchemas =
    Yup.object({
        wareHouseName: Yup.string().required("Please enter Were House name"),
        contactPersonName: Yup.string().required("Please enter contact person name"),
        pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
        email: Yup.string().email("Enter a valid email").required("Please enter user email"),
        contactNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required("Please enter mobile number"),
        address: Yup.string().required("Please enter user address"),
        city: Yup.string().required('Please select a City'),
        state: Yup.string().required('Please select a state'),
        country: Yup.string().required('Please select a Country')
    });


const initialValues = {
    wareHouseCode: '',
    wareHouseName: '',
    email: '',
    contactPersonName: '',
    contactNumber: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: ''
};

export default function AddWarehouse() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [marketingType, setMarketingType] = React.useState()
    const [countries, setCountries] = React.useState([]);
    const [states, setStates] = React.useState([]);
    console.log(states);

    // const [district, setDistrict] = React.useState([]);
    const [wereHouseNo, setWereHouseNo] = React.useState('');
    const [stepErrors, setStepErrors] = React.useState([false, false, false]);

    const [district, setDistrict] = React.useState([]);

    const dispatch = useDispatch();
    const { state } = useLocation();
    // const { id } = useParams();
    // console.log("state>>>>>>>>>",state);

    const id = state?._id;

    React.useEffect(() => {
        const allCountries = country_state_district.getAllCountries();
        setCountries(allCountries);
    }, []);


    React.useEffect(() => {
        dispatch(getWarehouses());
    }, []);

    const WereHouseData = useSelector(state => state.warehouses.warehouses);

    React.useEffect(() => {
        if (!id) {
            if (!WereHouseData || WereHouseData.length === 0) {
                setWereHouseNo('WH-001');
            } else if (WereHouseData && WereHouseData.length > 0) {
                let n = WereHouseData.length;
                let lastFillNo = WereHouseData[n - 1].wareHouseCode;

                let prefix = lastFillNo.slice(0, 2); // "WH"
                let sequenceNumber = parseInt(lastFillNo.slice(3)); // Extracting the number after "WH-"

                // Increase the sequence number
                if (sequenceNumber < 999) {
                    sequenceNumber++;
                } else {
                    sequenceNumber = 1;
                }
                setWereHouseNo(`${prefix}-${sequenceNumber.toString().padStart(3, '0')}`);
            }
        } else {
            if (Array.isArray(WereHouseData)) {
                const updateFillNo = WereHouseData.find(item => item._id === id);
                console.log(WereHouseData);

                if (updateFillNo) {
                    setWereHouseNo(updateFillNo.wareHouseCode);
                }
            }
        }
    }, [WereHouseData, id]);






    // React.useEffect(() => {
    //     if (id) {
    //         dispatch(viewWerehouse(id)).then((response) => {
    //             if (response.payload) {
    //                 const WereHouse = response.payload;

    //                 setValues(WereHouse);

    //                 setStates(State.getStatesOfCountry(WereHouse.country));
    //                 setDistrict(City.getCitiesOfState(WereHouse.country, WereHouse.state));

    //             } else {
    //                 console.error("Unexpected response structure:", response);
    //             }
    //         }).catch(error => {
    //             console.error("Error fetching data:", error);
    //         });
    //     }
    // }, [id, dispatch]);

    const isLastStep = activeStep === steps.length - 1;

    const handleNext = (values, actions) => {
        setTouchedSteps((prevTouchedSteps) => {
            const newTouchedSteps = [...prevTouchedSteps];
            newTouchedSteps[activeStep] = true;
            return newTouchedSteps;
        });

        actions.validateForm().then((errors) => {
            const currentStepHasErrors = Object.keys(errors).length > 0;
            setStepErrors((prevStepErrors) => {
                const newStepErrors = [...prevStepErrors];
                newStepErrors[activeStep] = currentStepHasErrors;
                return newStepErrors;
            });

            if (!currentStepHasErrors) {
                if (!isLastStep) {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                } else {
                    // Handle final submission
                    if (id) {
                        dispatch(editWarehouse({ _id: id, ...values }));
                    } else {
                        dispatch(addWarehouse(values));
                    }
                    actions.resetForm();
                    setActiveStep(0);
                }
            } else {
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

    const { handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm } = useFormik({
        initialValues,
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });

    // React.useEffect(() => {
    //     setCountries(Country.getAllCountries());
    // }, []);






    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        handleChange(e);

        const countryStates = country_state_district.getStatesByCountryId(countryId);
        setStates(countryStates);
        setDistrict([]);
        setFieldValue('country', countryId);
        setFieldValue('state', '');
        setFieldValue('district', '');
    };

    const handleStateChange = (e) => {
        const stateId = e.target.value;
        handleChange(e);

        const stateDistricts = country_state_district.getDistrictsByStateId(stateId);
        setDistrict(stateDistricts);

        setFieldValue('state', stateId);
        setFieldValue('district', '');
    };

    React.useEffect(() => {
        if (id) {
            dispatch(viewWerehouse(id)).then((response) => {
                if (response.payload) {
                    const WereHouse = response.payload;

                    setValues(WereHouse);

                    const countryStates = country_state_district.getStatesByCountryId(WereHouse.country);
                    setStates(countryStates);

                    const stateDistricts = country_state_district.getDistrictsByStateId(WereHouse.state);
                    setDistrict(stateDistricts);

                } else {
                    console.error("Unexpected response structure:", response);
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [id, dispatch]);


    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

    const navigate = useNavigate()

    const roles = useSelector(state => state.roles.roles);
    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    const canAccessPage = hasPermission("Warehouses");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }


    return (
        <Box m="20px">
            {id ? (
                <Header
                    title="Update WereHouse"
                    subtitle="Update your Warehouse here"
                />
            ) : (
                <Header
                    title="Add WareHouse"
                    subtitle="Manager Your Warehouse here"
                />
            )}

            {/* <Header 
        title="Add Product Details "
        subtitle="Add your product here"
      /> */}

            <form onSubmit={handleSubmit}>
                <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel
                                    StepIconComponent={(props) => (
                                        <ColorlibStepIcon {...props} theme={theme} icon={index + 1} error={stepErrors[index]} />
                                    )}
                                >
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
                                        label="Ware House Code :"
                                        value={wereHouseNo}
                                        name="wareHouseCode"
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
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Ware House Name :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.wareHouseName}
                                        name="wareHouseName"
                                        error={touched.wareHouseName && errors.wareHouseName}
                                        helperText={touched.wareHouseName && errors.wareHouseName}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        FormHelperTextProps={{
                                            style: {
                                                color: theme.palette.error.main,
                                            },
                                        }}
                                    />
                                </FormControl>

                            </Box>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <TextField
                                    margin="dense"
                                    id="email"
                                    name="email"
                                    label="Enter user email:"
                                    type="email"
                                    fullWidth
                                    variant="filled"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    InputLabelProps={{
                                        style: {
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                />
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Mobile No:"
                                        name="contactNumber"
                                        value={values.contactNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.contactNumber && Boolean(errors.contactNumber)}
                                        helperText={touched.contactNumber && errors.contactNumber}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary,
                                            },
                                        }}
                                    />
                                </FormControl>

                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Contact Person Name :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.contactPersonName}
                                        name="contactPersonName"
                                        error={!!touched.contactPersonName && !!errors.contactPersonName}
                                        helperText={touched.contactPersonName && errors.contactPersonName}
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
                    {activeStep === 1 && (
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
                                        label="Address :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.address}
                                        name="address"
                                        error={!!touched.address && !!errors.address}
                                        helperText={touched.address && errors.address}
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
                                        label="Pincode:"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.pincode}
                                        name="pincode"
                                        error={!!touched.pincode && !!errors.pincode}
                                        helperText={touched.pincode && errors.pincode}
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
                                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }} >
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="Country :"
                                        onBlur={handleBlur}
                                        onChange={handleCountryChange}
                                        value={values.country}
                                        name="country"
                                        error={!!touched.country && !!errors.country}
                                        helperText={touched.country && errors.country}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl> */}

                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }} >
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="Country :"
                                        onBlur={handleBlur}
                                        onChange={handleCountryChange}
                                        value={values.country}
                                        name="country"
                                        error={!!touched.country && !!errors.country}
                                        helperText={touched.country && errors.country}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {countries?.map((country) => (
                                            <MenuItem key={country.id} value={country.id}>
                                                {country.name}
                                                {console.log("final test", country)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>

                                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }} >
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="Country :"
                                        onBlur={handleBlur}
                                        onChange={handleCountryChange}
                                        value={values.country}
                                        name="country"
                                        error={!!touched.country && !!errors.country}
                                        helperText={touched.country && errors.country}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country.id} value={country.id}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl> */}






                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="State :"
                                        onBlur={handleBlur}
                                        onChange={handleStateChange}
                                        value={values.state}
                                        name="state"
                                        error={!!touched.state && !!errors.state}
                                        helperText={touched.state && errors.state}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {states?.map((state) => (
                                            <MenuItem key={state.id} value={state.id}>
                                                {state.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>



                                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="State :"
                                        onBlur={handleBlur}
                                        onChange={handleStateChange}
                                        value={values.state}
                                        name="state"
                                        error={!!touched.state && !!errors.state}
                                        helperText={touched.state && errors.state}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {states.map((state) => (
                                            <MenuItem key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl> */}


                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="District :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.district}
                                        name="district"
                                        error={!!touched.district && !!errors.district}
                                        helperText={touched.district && errors.district}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                        disabled={!values.state}
                                    >
                                        {district?.map((dist) => (
                                            <MenuItem key={dist.id} value={dist.id}>
                                                {dist.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>

                                {/* 
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="District :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.district}
                                        name="district"
                                        error={!!touched.district && !!errors.district}
                                        helperText={touched.district && errors.district}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            },
                                        }}
                                        disabled={!values.state} // Disable if no state is selected
                                    >
                                        {district.map((city) => (
                                            <MenuItem key={city.name} value={city.name}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl> */}



                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="City:"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.city}
                                        name="city"
                                        error={!!touched.city && !!errors.city}
                                        helperText={touched.city && errors.city}
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
                </Stack>
            </form>

        </Box>
    );
}



