import { useTheme } from '@emotion/react';
import { Box, Button, FormControl, Grid, IconButton, Stack, Step, StepConnector, stepConnectorClasses, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { tokens } from '../../../theme';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getPurchase, viewPurchase } from '../../../redux/slice/Purchase.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../../../redux/slice/products.slice';
import Header from '../../../components/Header';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { addstore, editstore, getstore } from '../../../redux/slice/store.slice';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

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
        3: <img src="/assets/images/icons/tax.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
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

const steps = ['Basic Details', 'Variant', 'Tax & Warrenty Details'];

const validationSchemas =
    Yup.object({
        multipleQty: Yup.array().of(
            Yup.object({
                recieveQty: Yup.string().required('Recieve Qty is required'),
            })
        ),
        storedate: Yup.date().required('store date is required'),
        Invoicenumber: Yup.string().required('Invoice Number is required'),
        Invoicedate: Yup.date().required('Invoice Date is required'),
        TransporterName: Yup.string().required('Transporter Name is required'),
        LRNumber: Yup.string().required('LR Number is required'),
        DriverName: Yup.string().required('Driver Name is required'),
        DriverContactNumber: Yup.string().required('Driver Contact Number is required'),
        VehicleNumber: Yup.string().required('Vehicle Number is required'),
        EwayBillNumber: Yup.string().required('Eway Bill Number is required'),
        Frieght: Yup.string().required('Frieght is required'),
        Remark: Yup.string().required('Remark is required'),
    });

const initialValues = {
    multipleQty: [{
        recieveQty: '',
        total: '',
    }],
    storedate: '',
    Invoicenumber: '',
    Invoicedate: '',
    TransporterName: '',
    LRNumber: '',
    DriverName: '',
    DriverContactNumber: '',
    VehicleNumber: '',
    EwayBillNumber: '',
    Frieght: '',
    Remark: '',
    storeuploadFile: ''
};

const AddStore = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch()
    const [activeStep, setActiveStep] = React.useState(0);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const isLastStep = activeStep === steps.length - 1;
    const navigate = useNavigate()
    const imgUrl = 'https://solar-backend-teal.vercel.app';


    const [multipleRecieve, setmultipleRecieve] = useState(initialValues.multipleQty)

    const { state } = useLocation()

    // const id = state;

    const id = state?.id;

    const productData = useSelector(state => state.products.products.products);
    const purchase = useSelector(state => state.purchase.purchase)?.find(v => v?._id == id);
    const store = useSelector(state => state.store.Store)?.find(st => st.purchase == id)

    useEffect(() => {
        dispatch(getPurchase())
        dispatch(getProducts())
        dispatch(getstore())
    }, [state])

    const formatCurrency = (value) => {
        if (typeof value === 'number') {
            return value.toFixed(2);
        }
        return '0.00';
    };

    useEffect(() => {
        if (id && store) {
            setValues(store)
        }
    }, [id, store])

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => {
        setActiveStep(step);
    };

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
                        purchase: purchase._id,
                        status: 'Complete',
                        // multipleQty: values.multipleQty,
                        multipleQty: values.multipleQty.map((item) => {
                            const recieveQty = parseFloat(item.recieveQty) || 0;
                            const unitPrice = parseFloat(item.unitPrice) || 0;
                            const total = recieveQty * unitPrice;
                            return { ...item, total };
                        }),
                    };
                    if (values._id) {
                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;
                        dispatch(editstore({ id: values._id, ...submissionValues }));
                    } else {
                        dispatch(addstore(submissionValues));
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

    const handleSubmit = () => {
        validationSchemas.validate(values, { abortEarly: false })
            .then(() => {
                const submissionValues = {
                    ...values,
                    purchase: purchase._id,
                    // multipleQty: values.multipleQty,
                    multipleQty: values.multipleQty.map((item) => {
                        const recieveQty = parseFloat(item.recieveQty) || 0;
                        const unitPrice = parseFloat(item.unitPrice) || 0;
                        const total = recieveQty * unitPrice;
                        return { ...item, total }; // Ensure total is included
                    }),
                };
                if (values._id) {
                    dispatch(editstore({ id: values._id, ...submissionValues }));
                } else {
                    dispatch(addstore(submissionValues));
                }
                setActiveStep(0);
                navigate('/admin/pending-po');
                resetForm();
                setmultipleRecieve(initialValues.multipleQty);
            })
            .catch((validationErrors) => {
                console.log("Form validation errors:", validationErrors);
                alert("Please fill in all required fields before submitting.");
            });
    };

    const { handleBlur, handleChange, touched, setValues, errors, values, validateForm, setFieldValue, setFieldError, resetForm } = useFormik({
        initialValues: { ...initialValues, multipleQty: multipleRecieve },
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });


    return (
        <Box sx={{ padding: 2 }}>

            {id ? (
                <Header
                    title="Update Store"
                    subtitle="Update your Store here"
                />
            ) : (
                <Header
                    title="Add Store"
                    subtitle="Manager Your Store here"
                />
            )}

            <form onSubmit={handleSubmit} >
                <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>

                    {/* <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={(props) => (
                                    <ColorlibStepIcon {...props} theme={theme} icon={index + 1} onClick={() => handleStep(index)} />
                                )}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper> */}

                    {/* {activeStep === 0 && (
                        <> */}
                    <TableContainer TableContainer sx={{ marginTop: 2 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#293754' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>SR. NO.</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>PRODUCT NAME</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>DESCRIPTION</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>HSN CODE</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>QTY.</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>Recive QTY.</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>UNIT PRICE</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '14px' }}>TOTAL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchase?.multipledata?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>{productData?.find((p) => p._id === item.productName)?.productName || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>{productData?.find((p) => p._id === item.productName)?.Desacription || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>{productData?.find((p) => p._id === item.productName)?.HSNcode || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>{item.Qty}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>
                                            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                                <TextField
                                                    fullWidth
                                                    variant="filled"
                                                    type="text"
                                                    label="Recieve Qty :"
                                                    onBlur={handleBlur}
                                                    onChange={e => setFieldValue(`multipleQty[${index}].recieveQty`, e.target.value)}
                                                    // onChange={handleChange}
                                                    value={values.multipleQty?.[index]?.recieveQty || ''}
                                                    name={`multipleQty.${index}.recieveQty`}
                                                    sx={{ gridColumn: "span 2" }}
                                                    InputLabelProps={{
                                                        style: {
                                                            color: theme.palette.text.primary
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>Rs. {item.unitPrice}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', fontSize: '14px' }}>Rs. {values.multipleQty?.[index]?.recieveQty ? item.unitPrice * values.multipleQty?.[index]?.recieveQty : item.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" }, marginTop: 3,
                                }}>
                                <Grid item xs={6} md={4}>
                                    <TableContainer>
                                        <Table sx={{ '& td, & th': { border: '1px solid #1A2B4F' } }}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: '600' }}><strong>Taxable Amount :</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: '600' }}>Rs. {formatCurrency(purchase?.taxableAmount)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: '600' }}><strong>Total GST Amount :</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: '600' }}>Rs. {formatCurrency(purchase?.totalGstAmount)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: '700' }}><strong>TOTAL :</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: '700' }}><strong>Rs. {formatCurrency(purchase?.amountTotal)}</strong></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Box> */}

                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" }, marginTop: 3
                        }}>
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Date :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.storedate}
                                name="storedate"
                                error={!!touched.storedate && !!errors.storedate}
                                helperText={touched.storedate && errors.storedate}
                                sx={{ gridColumn: "span 2" }}
                                InputLabelProps={{
                                    shrink: true,
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
                                label="Invoice Number:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.Invoicenumber}
                                name="Invoicenumber"
                                error={!!touched.Invoicenumber && !!errors.Invoicenumber}
                                helperText={touched.Invoicenumber && errors.Invoicenumber}
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
                                type="date"
                                label="Invoice Date :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.Invoicedate}
                                name="Invoicedate"
                                error={!!touched.Invoicedate && !!errors.Invoicedate}
                                helperText={touched.Invoicedate && errors.Invoicedate}
                                sx={{ gridColumn: "span 2" }}
                                InputLabelProps={{
                                    shrink: true,
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
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" }, marginTop: 3
                        }}>
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Transporter Name :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.TransporterName}
                                name="TransporterName"
                                error={!!touched.TransporterName && !!errors.TransporterName}
                                helperText={touched.TransporterName && errors.TransporterName}
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
                                label="LR Number:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.LRNumber}
                                name="LRNumber"
                                error={!!touched.LRNumber && !!errors.LRNumber}
                                helperText={touched.LRNumber && errors.LRNumber}
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
                                label="Driver Name :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.DriverName}
                                name="DriverName"
                                error={!!touched.DriverName && !!errors.DriverName}
                                helperText={touched.DriverName && errors.DriverName}
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
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" }, marginTop: 3
                        }}>
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Driver Contact Number :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.DriverContactNumber}
                                name="DriverContactNumber"
                                error={!!touched.DriverContactNumber && !!errors.DriverContactNumber}
                                helperText={touched.DriverContactNumber && errors.DriverContactNumber}
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
                                label="Vehicle Number:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.VehicleNumber}
                                name="VehicleNumber"
                                error={!!touched.VehicleNumber && !!errors.VehicleNumber}
                                helperText={touched.VehicleNumber && errors.VehicleNumber}
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
                                label="Eway Bill Number :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.EwayBillNumber}
                                name="EwayBillNumber"
                                error={!!touched.EwayBillNumber && !!errors.EwayBillNumber}
                                helperText={touched.EwayBillNumber && errors.EwayBillNumber}
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
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 3" }, marginTop: 3
                        }}>
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Frieght :"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.Frieght}
                                name="Frieght"
                                error={!!touched.Frieght && !!errors.Frieght}
                                helperText={touched.Frieght && errors.Frieght}
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
                                label="Remark:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.Remark}
                                name="Remark"
                                error={!!touched.Remark && !!errors.Remark}
                                helperText={touched.Remark && errors.Remark}
                                sx={{ gridColumn: "span 2" }}
                                InputLabelProps={{
                                    style: {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            />
                        </FormControl>
                        {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="file"
                                        label="Store Upload File :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.storeuploadFile}
                                        name="storeuploadFile"
                                        error={!!touched.storeuploadFile && !!errors.storeuploadFile}
                                        helperText={touched.storeuploadFile && errors.storeuploadFile}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </FormControl> */}

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Store Upload File
                                <input
                                    type="file"
                                    hidden
                                    id="storeuploadFile"
                                    name="storeuploadFile"
                                    onChange={(event) => {
                                        setFieldValue("storeuploadFile", event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                />
                            </Button>
                            {values.storeuploadFile && (
                                <img
                                    src={typeof values.storeuploadFile === 'string' ? `${imgUrl}/${values.storeuploadFile}` : URL.createObjectURL(values.storeuploadFile)}
                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                />
                            )}
                            <IconButton aria-label="edit"
                            // onClick={() => handleView('storeuploadFile')}
                            >
                                <RemoveRedEyeIcon />
                            </IconButton>
                        </div>
                    </Box>
                    {/* </>
                    )} */}

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
                            </Button> */}
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Save
                            </Button>
                        </Stack>
                    </FormControl>
                </Stack>
            </form>
        </Box >
    )
}

export default AddStore