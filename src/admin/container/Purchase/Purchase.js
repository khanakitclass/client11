import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, Checkbox, FormControlLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, MenuItem, useTheme, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addPurchase, editPurchase, getPurchase, viewPurchase } from '../../../redux/slice/Purchase.slice';
import { getProducts } from '../../../redux/slice/products.slice';
import AddIcon from '@mui/icons-material/Add';
import { getVendors } from '../../../redux/slice/vendors.slice';
import { getWarehouses } from '../../../redux/slice/warehouses.slice';
import { getRoles } from '../../../redux/slice/roles.slice';
import { getTerms } from '../../../redux/slice/Terms.slice';


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

const steps = ['Purchase Order(PO) Generate', 'Partially Payment', 'Payment to Vendor', 'Partially Material', 'Material Recieved at Store'];

const validationSchemas =
    Yup.object({});

const initialValues = {
    // SrNo: '',
    multipledata: [{
        productName: '',
        description: '',
        HSHCode: '',
        total: '',
        unitPrice: '',
        gst: '',
        gstAmount: '',
        Qty: '',
    }],
    vendor: '',
    werehouse: '',
    taxableAmount: '',
    totalGstAmount: '',
    amountTotal: 0,
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

export default function Purchase() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [SrNo, setSrNo] = useState('');
    const [purchasemap, setpurchasemap] = useState(initialValues.multipledata)
    // const [terms,setTerms] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const purchase = useSelector(state => state.purchase.purchase);

    const productData = useSelector(state => state.products.products.products);
    const vendors = useSelector(state => state.vendors.vendors); // Update to match your actual slice name
    const warehouses = useSelector(state => state.warehouses.warehouses);
    const terms = useSelector(state => state.Terms.Terms);

    const { state } = useLocation();
    const purchaseData = state;
    // const id = state?._id;
    const isMobile = useMediaQuery('(max-width:1024px)');
    const [completedSteps, setCompletedSteps] = useState(purchaseData?.filledSteps.map((v) => parseInt(v)) || []);
    const [filledSteps, setFilledSteps] = useState(purchaseData?.filledSteps || []);
    // terms
    const [acceptedTerms, setAcceptedTerms] = useState({});

    const handleTermChange = (termId) => {
        setAcceptedTerms(prev => ({
            ...prev,
            [termId]: !prev[termId]
        }));
    };

    useEffect(() => {
        if (purchaseData?._id && purchaseData?.acceptedTerms) {
            const initialAcceptedTerms = purchaseData.acceptedTerms.reduce((acc, termId) => {
                acc[termId] = true;
                return acc;
            }, {});
            setAcceptedTerms(initialAcceptedTerms);
        }
    }, [purchaseData]);

    const isLastStep = activeStep === steps.length - 1;
    const [isNewPurchase, setIsNewPurchase] = useState(true);
    React.useEffect(() => {
        dispatch(getPurchase());
        dispatch(getProducts());
        dispatch(getVendors());
        dispatch(getWarehouses());
        dispatch(getTerms());
        
        if (purchaseData?._id) {
            setValues(purchaseData);
            setFilledSteps(purchaseData?.filledSteps || []);
            setIsNewPurchase(false);
        } else {
            resetForm();
            setpurchasemap([{
                productName: '',
                description: '',
                HSHCode: '',
                total: '',
                unitPrice: '',
                gst: '',
                gstAmount: '',
                Qty: '',
            }]);
            setIsNewPurchase(true);
        }
    }, [dispatch, purchaseData?._id])
    

   // Modify the SrNo generation useEffect:
React.useEffect(() => {
    if (isNewPurchase) {
        const currentDate = new Date();
        let financialYear;

        if (currentDate.getMonth() >= 3) {
            financialYear = `${currentDate.getFullYear()}-${(currentDate.getFullYear() + 1).toString().slice(-2)}`;
        } else {
            financialYear = `${currentDate.getFullYear() - 1}-${currentDate.getFullYear().toString().slice(-2)}`;
        }

        let sequenceNumber = 1;

        if (purchase && purchase.length > 0) {
            let lastFillNo = purchase[purchase.length - 1]?.SrNo;
            if (lastFillNo) {
                const parts = lastFillNo.split('/');
                sequenceNumber = parseInt(parts[2]) + 1;
            }
        }

        setSrNo(`TEL/${financialYear}/${sequenceNumber.toString().padStart(4, '0')}`);
    }
}, [purchase, isNewPurchase]);
    const [description, setDescription] = useState();
    const [HSHCode, setHSHCode] = useState();

    const isStepFilled = (step) => {
        const stepFields = {
            0: ['SrNo', 'vendor', 'werehouse', 'productName', 'description', 'HSHCode', 'Qty', 'unitPrice', 'gst', 'gstAmount', 'total', 'taxableAmount', 'totalGstAmount', 'amountTotal'],
            1: ['', ''],
            2: ['', ''],
            3: ['', ''],
            4: ['', ''],
        };

        if (!stepFields[step]) return false;
        return stepFields[step].every(field => values[field]);
    };

    // const handleNext = (values, actions) => {
    //     setTouchedSteps((prevTouchedSteps) => {
    //         const newTouchedSteps = [...prevTouchedSteps];
    //         newTouchedSteps[activeStep] = true;
    //         return newTouchedSteps;
    //     });
    //     if (!isLastStep) {
    //         setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     } else {
    //         actions.validateForm().then((errors) => {
    //             if (Object.keys(errors).length === 0) {

    //                 // const submissionValues = {
    //                 //     ...values,
    //                 //     multipledata: values.multipledata,
    //                 // };
    //                 const submissionValues = {
    //                     ...values,
    //                     multipledata: values.multipledata.map(item => ({
    //                         ...item,
    //                         total: item.Qty * item.unitPrice, // Ensure total is calculated
    //                         gstAmount: (item.gst * item.Qty * item.unitPrice) / 100 // Ensure gstAmount is calculated
    //                     })),
    //                     totalGstAmount: totalGstAmount,
    //                     amountTotal: values.taxableAmount + totalGstAmount,
    //                 };

    //                 if (purchaseData?._id) {
    //                     delete submissionValues.isActive;
    //                     delete submissionValues.createdAt;
    //                     delete submissionValues.updatedAt;
    //                     dispatch(editPurchase({ id: values?._id, ...submissionValues, navigate }));
    //                 } else {
    //                     // dispatch(addPurchase({
    //                     //     data: {
    //                     //         ...values, SrNo, description, HSHCode
    //                     //     }, navigate
    //                     // }));
    //                     dispatch(addPurchase({
    //                         // data: submissionValues, navigate
    //                         data: {
    //                             ...submissionValues, SrNo
    //                         }, navigate
    //                     }));
    //                 }

    //                 actions.resetForm();
    //                 setValues(initialValues);
    //                 setActiveStep(0);
    //             } else {
    //                 console.log("Form validation errors:", errors);
    //                 setStepsWithErrors((prevStepsWithErrors) => {
    //                     const newStepsWithErrors = [...prevStepsWithErrors];
    //                     newStepsWithErrors[activeStep] = true;
    //                     return newStepsWithErrors;
    //                 });
    //                 alert('Please fix the errors in the form before submitting');
    //             }
    //             actions.setSubmitting(false);
    //         })
    //     }
    // };


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
                        filledSteps,
                        multipledata: values.multipledata.map(item => ({
                            ...item,
                            total: item.Qty * item.unitPrice, // Ensure total is calculated
                            gstAmount: (item.gst * item.Qty * item.unitPrice) / 100 // Ensure gstAmount is calculated
                        })),
                        vendor: values.vendor,
                        werehouse: values.werehouse,
                        taxableAmount: values.taxableAmount,
                        totalGstAmount: totalGstAmount,
                        amountTotal: values.taxableAmount + totalGstAmount,
                        SrNo: SrNo,
                        acceptedTerms: Object.keys(acceptedTerms).filter(termId => acceptedTerms[termId]), // Add this line
                    };

                    if (purchaseData?._id) {
                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;
                        dispatch(editPurchase({ id: values?._id, ...submissionValues, navigate }));
                    } else {
                        dispatch(addPurchase({
                            data: {
                                ...submissionValues, SrNo
                            }, navigate
                        }));
                    }

                    actions.resetForm();
                    setValues(initialValues);
                    setpurchasemap(initialValues.multipledata);
                    navigate('/admin/purchase');
                    setActiveStep(0);
                    setAcceptedTerms({}); // Reset accepted terms
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

    // React.useEffect(() => {
    //     if (purchaseData?._id) {
    //         dispatch(viewPurchase(purchaseData?._id)).then((response) => {
    //             if (response.payload) {
    //                 const perchaseData = response.payload;
    //                 setValues({
    //                     ...perchaseData,
    //                     multipledata: [...perchaseData.multipledata],
    //                 });
    //                 setpurchasemap([...perchaseData.multipledata]);
    //             }
    //         }).catch(error => {
    //             console.error("Error fetching data:", error);
    //         });
    //     }
    // }, [purchaseData?._id, dispatch]);

    React.useEffect(() => {
        if (purchaseData?._id) {
            dispatch(viewPurchase(purchaseData?._id)).then((response) => {
                if (response.payload) {
                    const perchaseData = response.payload;
                    const totalGstAmount = perchaseData.multipledata.reduce((sum, item) => {
                        const gstAmount = (parseFloat(item.gst) || 0) * ((parseFloat(item.Qty) || 0) * (parseFloat(item.unitPrice) || 0)) / 100;
                        return sum + gstAmount;
                    }, 0);
                    setValues({
                        ...perchaseData,
                        multipledata: [...perchaseData.multipledata],
                        totalGstAmount: totalGstAmount, // Set totalGstAmount
                        vendor: perchaseData.vendor, // Ensure vendor is set
                        werehouse: perchaseData.werehouse, // Ensure werehouse is set
                    });
                    setpurchasemap([...perchaseData.multipledata]);
                    setTotalGstAmount(totalGstAmount);
                    setFieldValue('totalGstAmount', totalGstAmount);
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [purchaseData?._id, dispatch]);


    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();

    const { handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm, setFieldError, resetForm } = useFormik({
        initialValues: { ...initialValues, multipledata: purchasemap },
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });


    React.useEffect(() => {
        if (values?.productName) {
            let data = productData?.find((v) => v._id == values.productName)
            setDescription(data?.Desacription)
            setHSHCode(data?.HSNcode)
            // setGST(data?.HSNcode)
        }
    }, [values])




    // const handleSubmit = () => {
    //     validationSchemas.validate(values, { abortEarly: false })
    //         .then(() => {
    //             const submissionValues = {
    //                 ...values,
    //             };
    //             if (purchaseData?._id) {
    //                 dispatch(editPurchase({ id: purchaseData?._id, ...submissionValues }));
    //             } else {

    //             }
    //             setActiveStep(0);
    //             navigate('/admin/purchase');
    //             setValues(initialValues); // Reset the local state
    //             // resetForm();
    //         })
    //         .catch((validationErrors) => {
    //             console.log("Form validation errors:", validationErrors);
    //             alert("Please fill in all required fields before submitting.");
    //         });
    // };

    const handleSubmit = () => {
        setFilledSteps(prev => [...new Set([...prev, activeStep.toString()])]);
        validationSchemas.validate(values, { abortEarly: false })
            .then(() => {
                const submissionValues = {
                    ...values,
                    filledSteps: [...filledSteps, activeStep.toString()],
                    multipledata: values.multipledata.map(item => ({
                        ...item,
                        total: parseFloat(item.Qty) * parseFloat(item.unitPrice),
                        gstAmount: (parseFloat(item.gst) * parseFloat(item.Qty) * parseFloat(item.unitPrice)) / 100
                    })),
                    totalGstAmount: totalGstAmount,
                    amountTotal: parseFloat(values.taxableAmount) + parseFloat(totalGstAmount),
                    terms: Object.keys(acceptedTerms).filter(termId => acceptedTerms[termId]), // Add this line
                };
                if (purchaseData?._id) {
                    dispatch(editPurchase({ id: purchaseData?._id, ...submissionValues }));
                } else {
                    dispatch(addPurchase({
                        data: {
                            ...submissionValues,
                            SrNo,
                        },
                        navigate
                    }));
                }
                setActiveStep(0);
                navigate('/admin/purchase');
                resetForm();
                // setpurchasemap(initialValues.multipledata);
                setIsNewPurchase(true); // Reset to new purchase state after submission
                setpurchasemap([{
                    productName: '',
                    description: '',
                    HSHCode: '',
                    total: '',
                    unitPrice: '',
                    gst: '',
                    gstAmount: '',
                    Qty: '',
                }]);
                setAcceptedTerms({}); // Reset accepted terms

                setSrNo(''); // Reset SrNo
                setTotalGstAmount(0); // Reset totalGstAmount
                // purchasemap. = 0;
              
            })
            .catch((validationErrors) => {
                console.log("Form validation errors:", validationErrors);
                alert("Please fill in all required fields before submitting.");
            });
            console.log("dtaa",purchasemap);
    };

    React.useEffect(() => {
        if (purchaseData?._id) {
            dispatch(viewPurchase(purchaseData?._id)).then((response) => {
                if (response.payload) {
                    const perchaseData = response.payload;
                    const totalGstAmount = perchaseData.multipledata.reduce((sum, item) => {
                        const gstAmount = (parseFloat(item.gst) || 0) * ((parseFloat(item.Qty) || 0) * (parseFloat(item.unitPrice) || 0)) / 100;
                        return sum + gstAmount;
                    }, 0);
                    setValues({
                        ...perchaseData,
                        multipledata: [...perchaseData.multipledata],
                        totalGstAmount: totalGstAmount,
                        vendor: perchaseData.vendor,
                        werehouse: perchaseData.werehouse,
                    });
                    setpurchasemap([...perchaseData.multipledata]);
                    setTotalGstAmount(totalGstAmount);
                    setFieldValue('totalGstAmount', totalGstAmount);

                    // Set accepted terms
                    if (perchaseData.terms && Array.isArray(perchaseData.terms)) {
                        const initialAcceptedTerms = perchaseData.terms.reduce((acc, termId) => {
                            acc[termId] = true;
                            return acc;
                        }, {});
                        setAcceptedTerms(initialAcceptedTerms);
                    }
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [purchaseData?._id, dispatch]);

    const [totalGstAmount, setTotalGstAmount] = useState(0);
    const handleAddRow = () => {
        setpurchasemap([...purchasemap, {
            productName: '',
            description: '',
            HSHCode: '',
            total: 0,
            unitPrice: '',
            gst: '',
            gstAmount: 0,
            Qty: '',
        }]);
    };

    // taxable amount
    React.useEffect(() => {
        const totalTaxableAmount = purchasemap.reduce((sum, item) => {
            const unitPrice = parseFloat(item.unitPrice) || 0; // Default to 0 if NaN
            const qty = parseFloat(item.Qty) || 0; // Default to 0 if NaN
            return sum + (unitPrice * qty);
        }, 0);
        setFieldValue('taxableAmount', totalTaxableAmount); // Update taxableAmount

        const totalGstAmount = purchasemap.reduce((sum, item) => {
            const gstAmount = parseFloat(item.gstAmount) || 0; // Default to 0 if NaN
            return sum + gstAmount;
        }, 0);
        setFieldValue('totalGstAmount', totalGstAmount); // Update totalGstAmount
    }, [purchasemap, setFieldValue]);

    const handleChangeMultipleData = (index, field, value) => {
        const updatedData = [...purchasemap];
        updatedData[index][field] = value;
        setpurchasemap(updatedData);
        setFieldValue(`multipledata.${index}.${field}`, value);

        // Recalculate total GST amount
        const newTotalGstAmount = updatedData.reduce((sum, item) => {
            const qty = parseFloat(item.Qty) || 0;
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const gst = parseFloat(item.gst) || 0;
            const gstAmount = (gst * qty * unitPrice) / 100;
            return sum + gstAmount;
        }, 0);
        setTotalGstAmount(newTotalGstAmount);
        setFieldValue('totalGstAmount', newTotalGstAmount);
    };


    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

    const roles = useSelector(state => state.roles.roles);
    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    const canAccessPage = hasPermission("Purchase");

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }


    return (
        <Box m="20px">
            {purchaseData?._id ? (
                <Header
                    title="Update Purchase"
                    subtitle="Update your Purchase Detail"
                />
            ) : (
                <Header
                    title="Add Purchase"
                    subtitle="Add your Purchase Detail"
                />
            )}

            <form onSubmit={handleSubmit} >
                <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>
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
                            <Box display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="SR No :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={SrNo}
                                        name="SrNo"
                                        error={!!touched.SrNo && !!errors.SrNo}
                                        helperText={touched.SrNo && errors.SrNo}
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
                                        select
                                        variant="filled"
                                        label="Vendor : "
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            handleChange(event);
                                            setFieldValue('vendor', event.target.value);
                                        }}
                                        value={values.vendor || ''}
                                        name="vendor"
                                        error={!!touched.vendor && !!errors.vendor}
                                        helperText={touched.vendor && errors.vendor}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    >
                                        {vendors?.map((v) => (
                                            <MenuItem key={v._id} value={v._id}>{v.businessName}</MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="filled"
                                        label="Warehouse : "
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            handleChange(event);
                                            setFieldValue('werehouse', event.target.value);
                                        }}
                                        value={values.werehouse || ''}
                                        name="werehouse"
                                        error={!!touched.werehouse && !!errors.werehouse}
                                        helperText={touched.werehouse && errors.werehouse}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                    >
                                        {warehouses?.map((w) => (
                                            <MenuItem key={w._id} value={w._id}>{w.wareHouseName}</MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </Box>
                            {purchasemap && purchasemap.length > 0 && purchasemap.map((person, index) => (
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
                                                select
                                                variant="filled"
                                                label="Product Name : "
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    const selectedProductId = event.target.value;
                                                    const selectedProduct = productData.find(p => p._id === selectedProductId);
                                                    handleChange(event);
                                                    setFieldValue(`multipledata.${index}.productName`, selectedProductId);
                                                    if (selectedProduct) {
                                                        setFieldValue(`multipledata.${index}.description`, selectedProduct.Desacription);
                                                        setFieldValue(`multipledata.${index}.HSHCode`, selectedProduct.HSNcode);
                                                        setFieldValue(`multipledata.${index}.gst`, selectedProduct.taxdetails);
                                                        handleChangeMultipleData(index, 'gst', selectedProduct.taxdetails);
                                                    }
                                                }}
                                                value={values.multipledata?.[index]?.productName || ''}
                                                name={`multipledata.${index}.productName`}
                                                error={!!touched.multipledata?.[index]?.productName && !!errors.multipledata?.[index]?.productName}
                                                helperText={touched.multipledata?.[index]?.productName && errors.multipledata?.[index]?.productName}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            >
                                                {productData?.map((v) => (
                                                    <MenuItem key={v._id} value={v._id}>{v.productName}</MenuItem>
                                                ))}
                                            </TextField>
                                        </FormControl>

                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                label="Description : "
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.multipledata?.[index]?.description || ''}
                                                name={`multipledata.${index}.description`}
                                                error={!!touched.multipledata?.[index]?.description && !!errors.multipledata?.[index]?.description}
                                                helperText={touched.multipledata?.[index]?.description && errors.multipledata?.[index]?.description}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                label="HSN Code : "
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.multipledata?.[index]?.HSHCode || ''}
                                                name={`multipledata.${index}.HSHCode`}
                                                error={!!touched.multipledata?.[index]?.HSHCode && !!errors.multipledata?.[index]?.HSHCode}
                                                helperText={touched.multipledata?.[index]?.HSHCode && errors.multipledata?.[index]?.HSHCode}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                                InputProps={{
                                                    readOnly: true,
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
                                                label="Qty : "
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    const qty = event.target.value || 0;
                                                    const unitPrice = values.multipledata?.[index]?.unitPrice || 0;
                                                    setFieldValue(`multipledata.${index}.total`, qty * unitPrice);
                                                    handleChangeMultipleData(index, 'Qty', qty);
                                                }}
                                                value={values.multipledata?.[index]?.Qty || ''}
                                                name={`multipledata.${index}.Qty`}
                                                error={!!touched.multipledata?.[index]?.Qty && !!errors.multipledata?.[index]?.Qty}
                                                helperText={touched.multipledata?.[index]?.Qty && errors.multipledata?.[index]?.Qty}
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
                                                label="Unit Price :"
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    const unitPrice = event.target.value || 0;
                                                    const qty = values.multipledata?.[index]?.Qty || 0;
                                                    setFieldValue(`multipledata.${index}.total`, qty * unitPrice);
                                                    handleChangeMultipleData(index, 'unitPrice', unitPrice);
                                                }}
                                                value={values.multipledata?.[index]?.unitPrice || ''}
                                                name={`multipledata.${index}.unitPrice`}
                                                error={!!touched.multipledata?.[index]?.unitPrice && !!errors.multipledata?.[index]?.unitPrice}
                                                helperText={touched.multipledata?.[index]?.unitPrice && errors.multipledata?.[index]?.unitPrice}
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
                                                label="Total :"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.multipledata?.[index]?.Qty * values.multipledata?.[index]?.unitPrice || 0}
                                                name={`multipledata.$[index].total`}
                                                error={!!touched.total && !!errors.total}
                                                helperText={touched.total && errors.total}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box display="grid"
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
                                                label="GST : "
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.multipledata?.[index]?.gst || ''}
                                                name={`multipledata.${index}.gst`}
                                                error={!!touched.multipledata?.[index]?.gst && !!errors.multipledata?.[index]?.gst}
                                                helperText={touched.multipledata?.[index]?.gst && errors.multipledata?.[index]?.gst}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="GST Amount :"
                                                value={(values.multipledata?.[index]?.gst * values.multipledata?.[index]?.Qty * values.multipledata?.[index]?.unitPrice) / 100 || 0}
                                                name={`multipledata.${index}.gstAmount`}
                                                error={!!touched.gstAmount && !!errors.gstAmount}
                                                helperText={touched.gstAmount && errors.gstAmount}
                                                sx={{ gridColumn: "span 2" }}
                                                InputLabelProps={{
                                                    style: {
                                                        color: theme.palette.text.primary
                                                    }
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                </>
                            ))}
                            <Box display="flex" justifyContent="flex-end" m={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddRow}
                                >
                                    Add Purchase Details
                                </Button>
                            </Box>

                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>Terms and Conditions</Typography>
                                {terms.map((t) => (
                                    <Box key={t._id} sx={{ p: 1, borderRadius: 1 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={acceptedTerms[t._id] || false}
                                                    onChange={() => handleTermChange(t._id)}
                                                    name={`term-${t._id}`}
                                                    sx={{
                                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                                        '&.Mui-checked': {
                                                            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{t.name}</Typography>
                                            }
                                        />
                                    </Box>
                                ))}
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
                                        label="Taxable Amount :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.taxableAmount}
                                        name="taxableAmount"
                                        error={!!touched.taxableAmount && !!errors.taxableAmount}
                                        helperText={touched.taxableAmount && errors.taxableAmount}
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
                                        label="Total GST Amount :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={Math.round(totalGstAmount)}
                                        name="totalGstAmount"
                                        error={!!touched.totalGstAmount && !!errors.totalGstAmount}
                                        helperText={touched.totalGstAmount && errors.totalGstAmount}
                                        sx={{ gridColumn: "span 2" }}
                                        InputLabelProps={{
                                            style: {
                                                color: theme.palette.text.primary
                                            }
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </FormControl>
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Amount Total :"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={parseFloat(values.taxableAmount) + parseFloat(totalGstAmount)}
                                        name="amountTotal"
                                        error={!!touched.amountTotal && !!errors.amountTotal}
                                        helperText={touched.amountTotal && errors.amountTotal}
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
                                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                }}
                            >

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
                                {isLastStep ? (purchaseData?._id ? 'Update' : 'Submit') : 'Next'}
                            </Button>
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
    );

}