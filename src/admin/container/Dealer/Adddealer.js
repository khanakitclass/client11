import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, useFormikContext, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import { getRoles } from '../../../redux/slice/roles.slice';
import { addDelear, editDealer, viewDealer } from '../../../redux/slice/dealer.slice';
import html2canvas from 'html2canvas';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';


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
}));

function ColorlibStepIcon(props) {
    const { active, completed, className, icon, onClick, theme } = props;

    const icons = {
        1: <img src="/assets/images/icons/basicw.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        2: <img src="/assets/images/icons/variant.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
        // 3: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
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
};

const steps = ['Basic Details', 'Variant'];

const validationSchemas =
    Yup.object({
        ConsumerName: Yup.string().required("Please enter user name"),
        MarketingType: Yup.string().required('Marketing Type is required'),
        Location: Yup.string().required("Please enter Location"),
        PhoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required("Please enter mobile number"),
        amount: Yup.number().positive("Amount must be a positive"),
        adharCard: Yup.mixed()
            .required("Please select an image")
            .test("fileSize", "The file is too large", (value) => {
                if (value && value.size) {
                    return value.size <= 2 * 1024 * 1024; // 2MB
                }
                return true;
            })
            .test("fileType", "Unsupported File Format", (value) => {
                if (value && value.type) {
                    return ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(value.type);
                }
                return true;
            }),
        lightBill: Yup.mixed()
            .required("Please select an image")
            .test("fileSize", "The file is too large", (value) => {
                if (value && value.size) {
                    return value.size <= 2 * 1024 * 1024; // 2MB
                }
                return true;
            })
            .test("fileType", "Unsupported File Format", (value) => {
                if (value && value.type) {
                    return ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(value.type);
                }
                return true;
            }),
        veraBill: Yup.mixed()
            .required("Please select an image")
            .test("fileSize", "The file is too large", (value) => {
                if (value && value.size) {
                    return value.size <= 2 * 1024 * 1024; // 2MB
                }
                return true;
            })
            .test("fileType", "Unsupported File Format", (value) => {
                if (value && value.type) {
                    return ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(value.type);
                }
                return true;
            }),
    });


const initialValues = {
    ConsumerName: '',
    PhoneNumber: '',
    MarketingType: '',
    Location: '',
    amount: '',
    adharCard: '',
    lightBill: '',
    veraBill: ''
};

export default function AddDealer() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const imgUrl = 'https://solar-backend-teal.vercel.app';

    const dispatch = useDispatch();
    const { state } = useLocation();

    const id = state?._id;

    React.useEffect(() => {
        if (id) {
            dispatch(viewDealer(id)).then((response) => {
                if (response.payload) {
                    const DealerData = response.payload;
                    // console.log("DealerData>>>>>>>", DealerData);

                    setValues({
                        ...DealerData,
                        adharCard: Array.isArray(DealerData.adharCard) ? DealerData.adharCard[0] : DealerData.adharCard,
                        lightBill: Array.isArray(DealerData.lightBill) ? DealerData.lightBill[0] : DealerData.lightBill,
                        veraBill: Array.isArray(DealerData.veraBill) ? DealerData.veraBill[0] : DealerData.veraBill
                    });

                } else {
                    console.error("Unexpected response structure:", response);
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [id, dispatch]);

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
                    if (id) {

                        // delete submissionValues.isActive;
                        // delete submissionValues.createdAt;
                        // delete submissionValues.updatedAt;

                        delete values.isActive;
                        delete values.createdAt;
                        delete values.updatedAt;
                        console.log("id>>>>>>", id);
                        console.log("submissionValues>>>>>>", values);
                        dispatch(editDealer({ id: values._id, ...values }));
                    } else {
                        console.log("values>>>>>>", values);
                        dispatch(addDelear(values));
                    }

                    actions.resetForm();
                    setActiveStep(0)
                } else {
                    alert('Please fix the errors in the form before submitting');
                }
                actions.setSubmitting(false);
            });
        }
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


    const [openView, setOpenView] = React.useState(false);
    const [viewImage, setViewImage] = React.useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const downloadRef = React.useRef(null);


    const handleView = (imageType) => {
        let imageUrl;
        const baseUrl = imgUrl;

        if (imageType === 'adharCard') {
            imageUrl = values.adharCard instanceof File ? URL.createObjectURL(values.adharCard) :
                (values.adharCard ? `${baseUrl}${values.adharCard}` : '');
        } else if (imageType === 'lightBill') {
            imageUrl = values.lightBill instanceof File ? URL.createObjectURL(values.lightBill) :
                (values.lightBill ? `${baseUrl}${values.lightBill}` : '');
        } else if (imageType === 'veraBill') {
            imageUrl = values.veraBill instanceof File ? URL.createObjectURL(values.veraBill) :
                (values.veraBill ? `${baseUrl}${values.veraBill}` : '');
        }

        console.log("Image URL in handleView:", imageUrl);
        setViewImage(imageUrl);
        setOpenView(true);
    }
    const handleCloseView = () => {
        setOpenView(false);
    };


    const handleDownload = async () => {
        if (viewImage) {
            try {
                let response;
                if (id) {
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(viewImage)}`;
                    response = await fetch(proxyUrl);
                } else {
                    response = await fetch(viewImage);
                }

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

    const canAccessPage = hasPermission("Dealer Entry");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }


    return (
        <Box m="20px">
            {id ? (
                <Header
                    title="Update Dealer"
                    subtitle="Update your Dealer here"
                />
            ) : (
                <Header
                    title="Add Dealer"
                    subtitle="Manage your Dealer here"
                />
            )}

            <form onSubmit={handleSubmit}>
                <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={(props) => (
                                    <ColorlibStepIcon {...props} theme={theme} icon={index + 1} onClick={() => handleStep(index)} />
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
                                        label="Name :"
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
                                        label="Mobile No:"
                                        name='PhoneNumber'
                                        value={values.PhoneNumber}
                                        onChange={handleChange}
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
                                        label="Amount :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.amount}
                                        name="amount"
                                        error={!!touched.amount && !!errors.amount}
                                        helperText={touched.amount && errors.amount}
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
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Location :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.Location}
                                        name="Location"
                                        error={!!touched.Location && !!errors.Location}
                                        helperText={touched.Location && errors.Location}
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
                                    id="MarketingType"
                                    name="MarketingType"
                                    label="Marketing Type :"
                                    select
                                    fullWidth
                                    variant="filled"
                                    onChange={handleChange}
                                    // onChange={(e) => {
                                    //     handleChange(e);
                                    //     setMarketingType(e.target.value);
                                    // }}
                                    onBlur={handleBlur}
                                    value={values.MarketingType}
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

                            </Box>
                        </>
                    )}
                    {activeStep === 1 && (
                        <>
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
                                            src={typeof values.lightBill === 'string' ? `${imgUrl}/${values.lightBill}` : URL.createObjectURL(values.lightBill)}
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
                                            src={typeof values.veraBill === 'string' ? `${imgUrl}/${values.veraBill}` : URL.createObjectURL(values.veraBill)}
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

        </Box>
    );
}

