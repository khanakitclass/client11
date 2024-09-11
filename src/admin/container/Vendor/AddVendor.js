import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, MenuItem, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Country, State, City } from 'country-state-city';
import { addVendor, editVendor, viewVendor } from '../../../redux/slice/vendors.slice';
import { getRoles } from '../../../redux/slice/roles.slice';

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
        1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        3: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        4: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        5: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,

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

const steps = ['Vendor Details', 'Contact Person Details', 'Business Document Details', 'Vendor Type', 'Bank Details'];

const validationSchemas =
    Yup.object({
        // fillNo: Yup.string().required('File No. is required'),
        businessName: Yup.string().required('Business Name is required'),
        officeAddress: Yup.string().required('Office Address is required'),
        pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
        city: Yup.string().required('City is required'),
        gstNumber: Yup.number().required('gstNumber is required'),
        district: Yup.string().required('district is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        companyEmailId: Yup.string().email("Enter a valid email").required("Please enter user email"),
        contactPersonalDetails: Yup.array().of(
            Yup.object({
                contactPersonName: Yup.string().required('Contact Person Name is required'),
                designation: Yup.string().required('Designation is required'),
                department: Yup.string().required('Department is required'),
                contactNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone Number is required'),
                emailId: Yup.string().email("Enter a valid email").required("Please enter user email"),
            })
        ),
        registrationType: Yup.string().required('Registration Type is required'),
        vendorType: Yup.string().required('Vendor Type is required'),
        // government: Yup.string().required('Government is required'),
        // supplier: Yup.string().required('Supplier is required'),
        // transportar: Yup.string().required('Transportar is required'),
        // bank: Yup.string().required('Bank is required'),
        bankDetails: Yup.array().of(
            Yup.object({
                bankName: Yup.string().required('Bank Name is required'),
                branchName: Yup.string().required('Branch Name is required'),
                accountNumber: Yup.string().required('Account Number is required'),
                IFSCCode: Yup.string().required('IFSC Code is required'),
                accountType: Yup.string()
                    .required("Account Type is required")
                    .oneOf(["Current", "Saving", "CashCredit"], "Invalid Account Type")
            })
        )
    });

const initialValues = {
    // fillNo: '',
    businessName: '',
    officeAddress: '',
    pincode: '',
    district: '',
    city: '',
    state: '',
    country: '',
    companyEmailId: '',
    gstNumber: '',
    contactPersonalDetails: [{
        contactPersonName: '',
        designation: '',
        department: '',
        emailId: '',
        contactNumber: '',
    }],
    registrationType: '',
    vendorType: '',
    // government: '',
    // supplier: '',
    // transportar: '',
    // bank: '',
    bankDetails: [{
        bankName: '',
        branchName: '',
        accountNumber: '',
        accountType: '',
        IFSCCode: ''
    }]
};

export default function AddVendor() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [contactPerson, setContactPerson] = useState(initialValues.contactPersonalDetails);
    const [bankData, setBankData] = useState(initialValues.bankDetails);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    // const [selectedCountry, setSelectedCountry] = useState('');
    // const [selectedState, setSelectedState] = useState('');
    // const [selectedDistrict, setSelectedDistrict] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { state } = useLocation();

    const id = state?._id;
    // useEffect(() => {
    //     dispatch(getRasidentialMarketing());
    // }, []);

    const isLastStep = activeStep === steps.length - 1;

    const handleNext = (values, actions) => {

        setTouchedSteps((prevTouchedSteps) => {
            const newTouchedSteps = [...prevTouchedSteps];
            newTouchedSteps[activeStep] = true;
            return newTouchedSteps;
        });
        if (!isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            actions.validateForm().then((errors) => {
                if (Object.keys(errors).length === 0) {

                    const submissionValues = {
                        ...values,
                        contactPersonalDetails: values.contactPersonalDetails,
                        bankDetails: values.bankDetails
                    };

                    if (id) {
                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;

                        dispatch(editVendor({ id: values._id, ...submissionValues, navigate }));
                    } else {
                        dispatch(addVendor({ data: submissionValues, navigate }));
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
            dispatch(viewVendor(id)).then((response) => {
                if (response.payload) {
                    const vendorData = response.payload;
                    setValues({
                        ...vendorData,
                        contactPersonalDetails: [...vendorData.contactPersonalDetails],
                        bankDetails: [...vendorData.bankDetails]
                    });
                    setContactPerson([...vendorData.contactPersonalDetails]);
                    setBankData([...vendorData.bankDetails]);
                    setStates(State.getStatesOfCountry(vendorData.country));
                    setDistricts(City.getCitiesOfState(vendorData.country, vendorData.state));
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [id, dispatch]);

    const handleAddRow = () => {
        setContactPerson([...contactPerson, {
            contactPersonName: '',
            designation: '',
            department: '',
            emailId: '',
            contactNumber: ''
        }]);
    };
    const handleAddBank = () => {
        setBankData([...bankData, {
            bankName: '',
            accountNumber: '',
            accountType: '',
            branchName: '',
            IFSCCode: ''
        }])
    }
    React.useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        handleChange(e);
        setStates(State.getStatesOfCountry(countryId));
        setDistricts([]);
    };

    const handleStateChange = (e) => {
        const stateId = e.target.value;
        handleChange(e);
        setDistricts(City.getCitiesOfState(values.country, stateId));
    };


    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();

    const { handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm, setFieldError } = useFormik({
        initialValues: { ...initialValues, contactPersonalDetails: contactPerson, bankDetails: bankData },
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });


    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

    const roles = useSelector(state => state.roles.roles);
    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    const canAccessPage = hasPermission("Vendors");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }

    return (
        <Box m="20px">
            {id ? (
                <Header
                    title="Update Vendor"
                    subtitle="Update your Vendor Detail"
                />
            ) : (
                <Header
                    title="Add Vendor"
                    subtitle="Add your Vendor Detail"
                />
            )}

            <form onSubmit={handleSubmit} >
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
                                        label="Business Name :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.businessName}
                                        name="businessName"
                                        error={!!touched.businessName && !!errors.businessName}
                                        helperText={touched.businessName && errors.businessName}
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
                                        multiline
                                        variant="filled"
                                        type="text"
                                        label="Office Address : "
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.officeAddress}
                                        name="officeAddress"
                                        error={!!touched.officeAddress && !!errors.officeAddress}
                                        helperText={touched.officeAddress && errors.officeAddress}
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
                                        label="Pincode :"
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
                                        {countries.map((country) => (
                                            <MenuItem key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
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
                                        {states.map((state) => (
                                            <MenuItem key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="District  :"
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
                                    >
                                        {districts.map((district) => (
                                            <MenuItem key={district.name} value={district.name}>
                                                {district.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                                        label="City :"
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
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="email"
                                        label="Company Email Id :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.companyEmailId}
                                        name="companyEmailId"
                                        error={!!touched.companyEmailId && !!errors.companyEmailId}
                                        helperText={touched.companyEmailId && errors.companyEmailId}
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
                            {contactPerson && contactPerson.length > 0 && contactPerson.map((person, index) => (
                                <Box
                                    key={index}
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
                                            label="Contact Person Name :"
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue(`contactPersonalDetails[${index}].contactPersonName`, e.target.value)}
                                            value={values.contactPersonalDetails?.[index]?.contactPersonName || ''}
                                            name={`contactPersonalDetails.${index}.contactPersonName`}
                                            error={!!touched.contactPersonalDetails?.[index]?.contactPersonName && !!errors.contactPersonalDetails?.[index]?.contactPersonName}
                                            helperText={touched.contactPersonalDetails?.[index]?.contactPersonName && errors.contactPersonalDetails?.[index]?.contactPersonName}
                                            // onChange={handleChange}
                                            // value={values.contactPersonName}
                                            // name="contactPersonName"
                                            // error={!!touched.contactPersonName && !!errors.contactPersonName}
                                            // helperText={touched.contactPersonName && errors.contactPersonName}
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
                                            label="Designation : "
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue(`contactPersonalDetails[${index}].designation`, e.target.value)}
                                            value={values.contactPersonalDetails?.[index]?.designation || ''}
                                            name={`contactPersonalDetails.${index}.designation`}
                                            error={!!touched.contactPersonalDetails?.[index]?.designation && !!errors.contactPersonalDetails?.[index]?.designation}
                                            helperText={touched.contactPersonalDetails?.[index]?.designation && errors.contactPersonalDetails?.[index]?.designation}
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
                                            label="Department :"
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue(`contactPersonalDetails[${index}].department`, e.target.value)}
                                            value={values.contactPersonalDetails?.[index]?.department || ''}
                                            name={`contactPersonalDetails.${index}.department`}
                                            error={!!touched.contactPersonalDetails?.[index]?.department && !!errors.contactPersonalDetails?.[index]?.department}
                                            helperText={touched.contactPersonalDetails?.[index]?.department && errors.contactPersonalDetails?.[index]?.department}
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
                                            id="contactNumber"
                                            label="Contact Number :"
                                            variant="filled"
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue(`contactPersonalDetails[${index}].contactNumber`, e.target.value)}
                                            value={values.contactPersonalDetails?.[index]?.contactNumber || ''}
                                            name={`contactPersonalDetails.${index}.contactNumber`}
                                            error={!!touched.contactPersonalDetails?.[index]?.contactNumber && !!errors.contactPersonalDetails?.[index]?.contactNumber}
                                            helperText={touched.contactPersonalDetails?.[index]?.contactNumber && errors.contactPersonalDetails?.[index]?.contactNumber}
                                            // onChange={handleChange}
                                            // value={values.contactNumber}
                                            // name="contactNumber"
                                            // error={!!touched.contactNumber && !!errors.contactNumber}
                                            // helperText={touched.contactNumber && errors.contactNumber}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                        <TextField
                                            id="emailId"
                                            label="Email Id :"
                                            variant="filled"
                                            onBlur={handleBlur}
                                            // onChange={handleChange}
                                            // value={values.emailId}
                                            // name="emailId"
                                            // error={!!touched.emailId && !!errors.emailId}
                                            // helperText={touched.emailId && errors.emailId}
                                            onChange={e => setFieldValue(`contactPersonalDetails[${index}].emailId`, e.target.value)}
                                            value={values.contactPersonalDetails?.[index]?.emailId || ''}
                                            name={`contactPersonalDetails.${index}.emailId`}
                                            error={!!touched.contactPersonalDetails?.[index]?.emailId && !!errors.contactPersonalDetails?.[index]?.emailId}
                                            helperText={touched.contactPersonalDetails?.[index]?.emailId && errors.contactPersonalDetails?.[index]?.emailId}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                            ))}
                            <Box display="flex" justifyContent="flex-end" m={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddRow}
                                >
                                    Add Contact Person
                                </Button>
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
                                <TextField
                                    margin="dense"
                                    id="registrationType"
                                    name="registrationType"
                                    label="Registration Type :"
                                    select
                                    fullWidth
                                    variant="filled"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.registrationType}
                                    error={touched.registrationType && Boolean(errors.registrationType)}
                                    helperText={touched.registrationType && errors.registrationType}
                                    InputLabelProps={{
                                        style: {
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                >
                                    <MenuItem value="Registered">Registered</MenuItem>
                                    <MenuItem value="UnRegistered">UnRegistered</MenuItem>
                                </TextField>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Gst Number :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.gstNumber}
                                        name="gstNumber"
                                        error={!!touched.gstNumber && !!errors.gstNumber}
                                        helperText={touched.gstNumber && errors.gstNumber}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        disabled={values.registrationType === "UnRegistered"}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Pan Number :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.panNumber}
                                        name="panNumber"
                                        error={!!touched.panNumber && !!errors.panNumber}
                                        helperText={touched.panNumber && errors.panNumber}
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
                                        label="MSME/Udyam Registration :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.UdyamRegistration}
                                        name="UdyamRegistration"
                                        error={!!touched.UdyamRegistration && !!errors.UdyamRegistration}
                                        helperText={touched.UdyamRegistration && errors.UdyamRegistration}
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
                                        label="Government :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.government}
                                        name="government"
                                        error={!!touched.government && !!errors.government}
                                        helperText={touched.government && errors.government}
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
                                        label="Supplier :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.supplier}
                                        name="supplier"
                                        error={!!touched.supplier && !!errors.supplier}
                                        helperText={touched.supplier && errors.supplier}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl> */}



                                <TextField
                                    margin="dense"
                                    id="vendorType"
                                    name="vendorType"
                                    label="Vendor Type :"
                                    select
                                    fullWidth
                                    variant="filled"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.vendorType}
                                    error={touched.vendorType && Boolean(errors.vendorType)}
                                    helperText={touched.vendorType && errors.vendorType}
                                    InputLabelProps={{
                                        style: {
                                            color: theme.palette.text.primary
                                        }
                                    }}
                                >
                                    <MenuItem value="Government">Government</MenuItem>
                                    <MenuItem value="Supplier">Supplier</MenuItem>
                                    <MenuItem value="Transportar">Transportar</MenuItem>
                                    <MenuItem value="Bank">Bank</MenuItem>
                                </TextField>
                            </Box>
                            {/* <Box
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
                                        label="Transportar :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.transportar}
                                        name="transportar"
                                        error={!!touched.transportar && !!errors.transportar}
                                        helperText={touched.transportar && errors.transportar}
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
                                        label="Bank :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.bank}
                                        name="bank"
                                        error={!!touched.bank && !!errors.bank}
                                        helperText={touched.bank && errors.bank}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box> */}
                        </>
                    )}
                    {activeStep === 4 && (
                        <>
                            {bankData && bankData.length > 0 && bankData.map((bank, index) => (
                                <Box
                                    key={index}
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
                                            label="Bank Name :"
                                            onBlur={handleBlur}
                                            // onChange={handleChange}
                                            // value={bank.bankName || ''}
                                            // name="bankName"
                                            // error={!!touched.bankDetails.bankName && !!errors.bankDetails.bankName}
                                            // helperText={touched.bankDetails.bankName && errors.bankDetails.bankName}
                                            onChange={e => setFieldValue(`bankDetails[${index}].bankName`, e.target.value)}
                                            value={values.bankDetails?.[index]?.bankName || ''}
                                            name={`bankDetails.${index}.bankName`}
                                            error={!!touched.bankDetails?.[index]?.bankName && !!errors.bankDetails?.[index]?.bankName}
                                            helperText={touched.bankDetails?.[index]?.bankName && errors.bankDetails?.[index]?.bankName}
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
                                            label="Branch Name:"
                                            onBlur={handleBlur}
                                            // onChange={handleChange}
                                            // value={bank.branchName || ''}
                                            // name="branchName"
                                            // error={!!touched.bankDetails.branchName && !!errors.bankDetails.branchName}
                                            // helperText={touched.bankDetails.branchName && errors.bankDetails.branchName}
                                            name={`bankDetails.${index}.branchName`}
                                            onChange={e => setFieldValue(`bankDetails[${index}].branchName`, e.target.value)}
                                            value={values.bankDetails?.[index]?.branchName || ''}
                                            error={!!touched.bankDetails?.[index]?.branchName && !!errors.bankDetails?.[index]?.branchName}
                                            helperText={touched.bankDetails?.[index]?.branchName && errors.bankDetails?.[index]?.branchName}
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
                                            label="Account Number:"
                                            onBlur={handleBlur}
                                            // onChange={handleChange}
                                            // value={bank.accountNumber || ''}
                                            onChange={e => setFieldValue(`bankDetails[${index}].accountNumber`, e.target.value)}
                                            value={values.bankDetails?.[index]?.accountNumber || ''}
                                            name={`bankDetails.${index}.accountNumber`}
                                            error={!!touched.bankDetails?.[index]?.accountNumber && !!errors.bankDetails?.[index]?.accountNumber}
                                            helperText={touched.bankDetails?.[index]?.accountNumber && errors.bankDetails?.[index]?.accountNumber}
                                            // name="accountNumber"
                                            // error={!!touched.bankDetails.accountNumber && !!errors.bankDetails.accountNumber}
                                            // helperText={touched.bankDetails.accountNumber && errors.bankDetails.accountNumber}
                                            sx={{ gridColumn: "span 2" }}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <TextField
                                        margin="dense"
                                        id="accountType"
                                        label="Account Type :"
                                        select
                                        fullWidth
                                        variant="filled"
                                        onBlur={handleBlur}
                                        name={`bankDetails.${index}.accountType`}
                                        onChange={e => setFieldValue(`bankDetails[${index}].accountType`, e.target.value)}
                                        value={values.bankDetails?.[index]?.accountType || ''}
                                        error={!!touched.bankDetails?.[index]?.accountType && !!errors.bankDetails?.[index]?.accountType}
                                        helperText={touched.bankDetails?.[index]?.accountType && errors.bankDetails?.[index]?.accountType}
                                        // name="accountType"
                                        // error={touched.bankDetails.accountType && Boolean(errors.bankDetails.accountType)}
                                        // helperText={touched.bankDetails.accountType && errors.bankDetails.accountType}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    >
                                        <MenuItem value="Current">Current</MenuItem>
                                        <MenuItem value="Saving">Saving</MenuItem>
                                        <MenuItem value="CashCredit">CashCredit</MenuItem>
                                    </TextField>
                                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="IFSC Code :"
                                            onBlur={handleBlur}
                                            // onChange={handleChange}
                                            // value={bank.IFSCCode || ''}
                                            name={`bankDetails.${index}.IFSCCode`}
                                            onChange={e => setFieldValue(`bankDetails[${index}].IFSCCode`, e.target.value)}
                                            value={values.bankDetails?.[index]?.IFSCCode || ''}
                                            error={!!touched.bankDetails?.[index]?.IFSCCode && !!errors.bankDetails?.[index]?.IFSCCode}
                                            helperText={touched.bankDetails?.[index]?.IFSCCode && errors.bankDetails?.[index]?.IFSCCode}
                                            // name="IFSCCode"
                                            // error={!!touched.IFSCCode && !!errors.bankDetails.IFSCCode}
                                            // helperText={touched.bankDetails.IFSCCode && errors.bankDetails.IFSCCode}
                                            sx={{ gridColumn: "span 2" }}
                                            InputLabelProps={{
                                                style: {
                                                    color: theme.palette.text.primary
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                            ))}
                            <Box display="flex" justifyContent="flex-end" m={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddBank}
                                >
                                    Add Bank Details
                                </Button>
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
                                        handleNext(values, {
                                            setFieldError,
                                            validateForm,
                                            setSubmitting: () => { },
                                            resetForm: () => { }
                                        });
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

