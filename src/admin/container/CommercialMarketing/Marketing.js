// import * as React from 'react';
// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';
// import { Formik, Form, Field, ErrorMessage, useFormikContext, useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCategories } from '../../../redux/slice/categories.slice';
// import { getSubcategories, getSubcategoriesByCategory } from '../../../redux/slice/subcategories.slice';
// import { addProduct, editProduct, getDetailsProducts } from '../../../redux/slice/products.slice';
// import Header from '../../../components/Header';
// import Radio from '@mui/material/Radio';
// import { useLocation, useParams } from 'react-router-dom';
// import { addCommercialMarketing, editCommercialMarketing, getCommercialMarketing } from '../../../redux/slice/Commercialmarketing.slice';
// import { useState } from 'react';
// import { useEffect } from 'react';

// const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
//     [`&.${stepConnectorClasses.alternativeLabel}`]: {
//         top: 22,
//     },
//     [`&.${stepConnectorClasses.active}`]: {
//         [`& .${stepConnectorClasses.line}`]: {
//             backgroundImage: 'linear-gradient( 95deg,#222222 0%, #FFFFFF 120%)',
//         },
//     },
//     [`&.${stepConnectorClasses.completed}`]: {
//         [`& .${stepConnectorClasses.line}`]: {
//             backgroundImage: 'linear-gradient( 95deg,#222222 0%, #FFFFFF 120%)',
//         },
//     },
//     [`& .${stepConnectorClasses.line}`]: {
//         height: 3,
//         border: 0,
//         backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//         borderRadius: 1,
//     },
// }));

// const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
//     zIndex: 1,
//     color: '#fff',
//     width: 50,
//     height: 50,
//     display: 'flex',
//     borderRadius: '50%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...(ownerState.active && {
//         border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
//         boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//     }),
//     ...(ownerState.completed && {
//         border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
//     }),
//     ...(ownerState.error && {
//         border: '2px solid red',
//     }),
// }));

// function ColorlibStepIcon(props) {
//     const { active, completed, className, icon, onClick, theme, error } = props;

//     const icons = {
//         1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//         2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//         3: <img src="/assets/images/icons/Customer Price.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//         4: <img src="/assets/images/icons/Dealer Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//         5: <img src="/assets/images/icons/Electricity Bill Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//         6: <img src="/assets/images/icons/Business Document Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//     };


//     return (
//         // <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
//         //     {icons[String(icon)]}
//         // </ColorlibStepIconRoot>
//         <ColorlibStepIconRoot ownerState={{ completed, active, error }} className={className} onClick={onClick}>
//             {icons[String(icon)]}
//         </ColorlibStepIconRoot>
//     );
// }


// ColorlibStepIcon.propTypes = {
//     active: PropTypes.bool,
//     className: PropTypes.string,
//     completed: PropTypes.bool,
//     icon: PropTypes.node,
//     onClick: PropTypes.func,
//     error: PropTypes.bool,
// };

// const steps = ['File No', 'Customer Basic Details', 'Customer Price', 'Dealer Details', 'Electricity Bill Details', 'Business Document Details '];

// const validationSchemas =
//     Yup.object({
//         // fillNo: Yup.string().required('File No. is required'),
//         MarketingType: Yup.string().required('Marketing Type is required'),
//         Date: Yup.date().required('Date is required'),
//         ConsumerName: Yup.string().required('Consumer Name is required'),
//         ContactPersonName: Yup.string().required('Contact Person Name is required'),
//         PhoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone Number is required'),
//         Address: Yup.string().required('Address is required'),
//         City_Village: Yup.string().required('City/Village is required'),
//         District_Location: Yup.string().required('District/Location is required'),
//         Pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
//         Latitude: Yup.number().min(-90).max(90).required('Latitude is required'),
//         Longitude: Yup.number().min(-180).max(180).required('Longitude is required'),
//         Amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
//         GST: Yup.number().min(0).max(100).required('GST is required'),
//         TotalAmount: Yup.number().positive('Total Amount must be positive').required('Total Amount is required'),
//         Dealer: Yup.string().required('Dealer is required'),
//         DealerCommission: Yup.number().min(0).max(100).required('Dealer Commission is required'),
//         ConsumerNumber: Yup.string().required('Consumer Number is required'),
//         ConnectionLoad: Yup.number().positive('Connection Load must be positive').required('Connection Load is required'),
//         Tarrif: Yup.string().required('Tarrif is required'),
//         AverageMonthlyBill: Yup.number().positive('Average Monthly Bill must be positive').required('Average Monthly Bill is required'),
//         GSTNumber: Yup.string().required('GST Number is required'),
//         PanNumber: Yup.string().required('PAN Number is required'),
//         MSME_UdyamREGISTRATION: Yup.string().required('MSME/Udyam Registration is required'),
//         PrimaryAmount: Yup.number().positive('Primary Amount must be positive').required('Primary Amount is required'),
//         SolarAmount: Yup.number().positive('Solar Amount must be positive').required('Solar Amount is required'),
//         CashAmount: Yup.number().positive('Cash Amount must be positive').required('Cash Amount is required'),
//         SolarModuleMake: Yup.string().required('Solar Module Make is required'),
//         SolarModuleWp: Yup.number().positive('Solar Module Wp must be positive').required('Solar Module Wp is required'),
//         SolarModuleNos: Yup.number().positive().integer('Solar Module Nos must be a positive integer').required('Solar Module Nos is required'),
//         SystemSizeKw: Yup.number().positive('System Size Kw must be positive').required('System Size Kw is required'),
//         InverterSize: Yup.number().positive('Inverter Size must be positive').required('Inverter Size is required'),
//     });

// const initialValues = {
//     // fillNo: '',
//     MarketingType: '',
//     Date: '',
//     ConsumerName: '',
//     ContactPersonName: '',
//     PhoneNumber: '',
//     Address: '',
//     City_Village: '',
//     District_Location: '',
//     Pincode: '',
//     Latitude: '',
//     Amount: '',
//     GST: '',
//     TotalAmount: '',
//     Dealer: '',
//     DealerCommission: '',
//     ConsumerNumber: '',
//     ConnectionLoad: '',
//     Tarrif: '',
//     AverageMonthlyBill: '',
//     GSTNumber: '',
//     PanNumber: '',
//     MSME_UdyamREGISTRATION: '',
//     PrimaryAmount: '',
//     SolarAmount: '',
//     CashAmount: '',
//     SolarModuleMake: '',
//     SolarModuleWp: '',
//     SolarModuleNos: '',
//     SystemSizeKw: '',
//     InverterSize: '',
// };

// export default function Marketing() {
//     const [activeStep, setActiveStep] = React.useState(0);
//     const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
//     const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
//     const [filteredSubcategories, setFilteredSubcategories] = React.useState([]);
//     const [marketingType, setMarketingType] = React.useState('');
//     const [fileNo, setFileNo] = useState('');

//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     const { id } = useParams();

//     useEffect(() => {
//         dispatch(getCommercialMarketing());
//     }, []);

//     const CommercialMarket = useSelector(state => state.comMarketing.Marketing);

//     const getCommercialMarketName = (CommercialMarketId) => {
//         const CommercialMarket = CommercialMarket.find(com => com._id === CommercialMarketId);
//         return CommercialMarket ? CommercialMarket.CommercialMarketName : "";
//     }


//     useEffect(() => {
//         if (CommercialMarket && CommercialMarket.length === 0) {
//             setFileNo('A001');
//         } else if (CommercialMarket && CommercialMarket.length > 0) {
//             let n = CommercialMarket.length
//             let lastFillNo = CommercialMarket[n - 1].fillNo

//             const prefix = lastFillNo.charAt(0);

//             let sequenceNumber = parseInt(lastFillNo.substr(1));
//             if (sequenceNumber < 100) {
//                 sequenceNumber++;
//             } else {
//                 const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
//                 sequenceNumber = 1;
//                 setFileNo(`${nextPrefix}001`)
//             }
//             setFileNo(`${prefix}${sequenceNumber.toString().padStart(3, '0')}`)
//         }
//     }, [CommercialMarket])


//     const isLastStep = activeStep === steps.length - 1;

//     const handleNext = (values, actions) => {
//         setTouchedSteps((prevTouchedSteps) => {
//             const newTouchedSteps = [...prevTouchedSteps];
//             newTouchedSteps[activeStep] = true;
//             return newTouchedSteps;
//         });
//         if (activeStep === 0 && !values.MarketingType) {
//             actions.setFieldError('MarketingType', 'Please select a Marketing Type');
//             return;
//         }

//         actions.validateForm().then((errors) => {
//             if (Object.keys(errors).length === 0) {
//                 if (!isLastStep) {
//                     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//                 } else {
//                     const submissionValues = {
//                         ...values,
//                         fillNo: fileNo,
//                         mainCommercialMarketName: getCommercialMarketName(values.mainCommercialMarketName),
//                     };
//                     if (id) {
//                         delete submissionValues.isActive;
//                         delete submissionValues.createdAt;
//                         delete submissionValues.updatedAt;

//                         dispatch(editCommercialMarketing({ id: values._id, ...submissionValues }));
//                     } else {
//                         console.log("values>>>>>>", submissionValues);
//                         dispatch(addCommercialMarketing(submissionValues));
//                     }

//                     actions.resetForm();
//                     setActiveStep(0);
//                 }
//             } else {
//                 setStepsWithErrors((prevStepsWithErrors) => {
//                     const newStepsWithErrors = [...prevStepsWithErrors];
//                     newStepsWithErrors[activeStep] = true;
//                     return newStepsWithErrors;
//                 });
//                 alert('Please fix the errors in the form before submitting');
//             }
//             actions.setSubmitting(false);
//         });
//     };

//     const handleBack = () => {
//         setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     };

//     const handleStep = (step) => {
//         setActiveStep(step);
//     };
//     const isNonMobile = useMediaQuery("(min-width:600px)");
//     const theme = useTheme();

//     const { handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm, setFieldError } = useFormik({
//         initialValues,
//         validationSchema: validationSchemas,
//         onSubmit: handleNext,
//     });

//     // React.useEffect(() => {
//     //     if (id) {
//     //         dispatch(getDetailsProducts(id)).then((response) => {
//     //             if (response.payload && response.payload.products) {
//     //                 const productData = response.payload.products;
//     //                 const categoryId = CommercialMarket.find(cat => cat.categoryName === productData.mainCategory)?._id;

//     //                 setValues({
//     //                     ...productData,
//     //                     mainCategory: categoryId || '',
//     //                 });
//     //             }
//     //         });
//     //     }
//     // }, [id, dispatch, CommercialMarket]);
//     return (
//         <Box m="20px">
//             {id ? (
//                 <Header
//                     title="Update Product Details"
//                     subtitle="Update your Marketing Detail"
//                 />
//             ) : (
//                 <Header
//                     title="Marketing Details"
//                     subtitle="Manager Your Marketing Detail here"
//                 />
//             )}

//             <form onSubmit={handleSubmit}>
//                 <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>
//                     <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
//                         {steps.map((label, index) => (
//                             <Step key={label}>
//                                 <StepLabel StepIconComponent={(props) => (
//                                     <ColorlibStepIcon
//                                         {...props}
//                                         theme={theme}
//                                         icon={index + 1}
//                                         onClick={() => handleStep(index)}
//                                         error={index === 0 && touched.MarketingType && errors.MarketingType}
//                                     />
//                                 )}>
//                                     {label}
//                                 </StepLabel>
//                             </Step>
//                         ))}
//                     </Stepper>
//                     {activeStep === 0 && (
//                         <>
//                             <Box
//                                 display="grid"
//                                 gap="30px"
//                                 gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                 sx={{
//                                     "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                 }}
//                             >
//                                 <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="filled"
//                                         type="text"
//                                         label="File No :"
//                                         value={fileNo}
//                                         name="fillNo"
//                                         InputProps={{
//                                             readOnly: true,
//                                         }}
//                                         sx={{
//                                             gridColumn: "span 2",
//                                         }}
//                                         InputLabelProps={{
//                                             style: {
//                                                 color: theme.palette.text.primary
//                                             }
//                                         }}
//                                     />
//                                 </FormControl>
//                                 <TextField
//                                     margin="dense"
//                                     id="MarketingType"
//                                     name="MarketingType"
//                                     label="Marketing Type :"
//                                     select
//                                     fullWidth
//                                     variant="filled"
//                                     onChange={(e) => {
//                                         handleChange(e);
//                                         setMarketingType(e.target.value);
//                                     }}
//                                     onBlur={handleBlur}
//                                     value={values.MarketingType}
//                                     error={touched.MarketingType && Boolean(errors.MarketingType)}
//                                     helperText={touched.MarketingType && errors.MarketingType}
//                                     InputLabelProps={{
//                                         style: {
//                                             color: theme.palette.text.primary
//                                         }
//                                     }}
//                                 >
//                                     {console.log("values.MarketingType",values.MarketingType)}
//                                     <MenuItem value="Commercial Marketing">Commercial Marketing</MenuItem>
//                                     <MenuItem value="Residential Marketing">Residential Marketing</MenuItem>
//                                 </TextField>
//                                 <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                     <TextField
//                                         id="Date"
//                                         label="Date :"
//                                         type="date"
//                                         rows={4}
//                                         variant="filled"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.Date}
//                                         name="Date"
//                                         error={!!touched.Date && !!errors.Date}
//                                         helperText={touched.Date && errors.Date}
//                                         InputLabelProps={{
//                                             shrink: true,
//                                             style: {
//                                                 color: theme.palette.text.primary
//                                             }
//                                         }}

//                                     />
//                                 </FormControl>
//                             </Box>
//                         </>
//                     )}
//                     {marketingType === 'Commercial Marketing' && (
//                         <>
//                             {activeStep === 1 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Consumer Name as per Light bill :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.ConsumerName}
//                                                 name="ConsumerName"
//                                                 error={!!touched.ConsumerName && !!errors.ConsumerName}
//                                                 helperText={touched.ConsumerName && errors.ConsumerName}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Contact Person Name : "
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.ContactPersonName}
//                                                 name="ContactPersonName"
//                                                 error={!!touched.ContactPersonName && !!errors.ContactPersonName}
//                                                 helperText={touched.ContactPersonName && errors.ContactPersonName}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />

//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Phone Number : "
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.PhoneNumber}
//                                                 name="PhoneNumber"
//                                                 error={!!touched.PhoneNumber && !!errors.PhoneNumber}
//                                                 helperText={touched.PhoneNumber && errors.PhoneNumber}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>


//                                     </Box>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Address"
//                                                 label="Address :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Address}
//                                                 name="Address"
//                                                 error={!!touched.Address && !!errors.Address}
//                                                 helperText={touched.Address && errors.Address}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="City_Village"
//                                                 label="City/Village :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.City_Village}
//                                                 name="City_Village"
//                                                 error={!!touched.City_Village && !!errors.City_Village}
//                                                 helperText={touched.City_Village && errors.City_Village}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="District_Location"
//                                                 label="District/Location :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.District_Location}
//                                                 name="District_Location"
//                                                 error={!!touched.District_Location && !!errors.District_Location}
//                                                 helperText={touched.District_Location && errors.District_Location}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Pincode"
//                                                 label="Pincode :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Pincode}
//                                                 name="Pincode"
//                                                 error={!!touched.Pincode && !!errors.Pincode}
//                                                 helperText={touched.Pincode && errors.Pincode}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Latitude"
//                                                 label="Latitude :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Latitude}
//                                                 name="Latitude"
//                                                 error={!!touched.Latitude && !!errors.Latitude}
//                                                 helperText={touched.Latitude && errors.Latitude}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Longitude"
//                                                 label="Longitude :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Longitude}
//                                                 name="Longitude"
//                                                 error={!!touched.Longitude && !!errors.Longitude}
//                                                 helperText={touched.Longitude && errors.Longitude}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 2 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Amount :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Amount}
//                                                 name="Amount"
//                                                 error={!!touched.Amount && !!errors.Amount}
//                                                 helperText={touched.Amount && errors.Amount}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="GST :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.GST}
//                                                 name="GST"
//                                                 error={!!touched.GST && !!errors.GST}
//                                                 helperText={touched.GST && errors.GST}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Total Amount :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.TotalAmount}
//                                                 name="TotalAmount"
//                                                 error={!!touched.TotalAmount && !!errors.TotalAmount}
//                                                 helperText={touched.TotalAmount && errors.TotalAmount}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 3 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Dealer :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Dealer}
//                                                 name="Dealer"
//                                                 error={!!touched.Dealer && !!errors.Dealer}
//                                                 helperText={touched.Dealer && errors.Dealer}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Dealer Commission :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.DealerCommission}
//                                                 name="DealerCommission"
//                                                 error={!!touched.DealerCommission && !!errors.DealerCommission}
//                                                 helperText={touched.DealerCommission && errors.DealerCommission}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 4 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Consumer Number :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.ConsumerNumber}
//                                                 name="ConsumerNumber"
//                                                 error={!!touched.ConsumerNumber && !!errors.ConsumerNumber}
//                                                 helperText={touched.ConsumerNumber && errors.ConsumerNumber}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Connection Load :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.ConnectionLoad}
//                                                 name="ConnectionLoad"
//                                                 error={!!touched.ConnectionLoad && !!errors.ConnectionLoad}
//                                                 helperText={touched.ConnectionLoad && errors.ConnectionLoad}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Tarrif :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Tarrif}
//                                                 name="Tarrif"
//                                                 error={!!touched.Tarrif && !!errors.Tarrif}
//                                                 helperText={touched.Tarrif && errors.Tarrif}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Average Monthly Bill :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.AverageMonthlyBill}
//                                                 name="AverageMonthlyBill"
//                                                 error={!!touched.AverageMonthlyBill && !!errors.AverageMonthlyBill}
//                                                 helperText={touched.AverageMonthlyBill && errors.AverageMonthlyBill}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         {/* <FormControl>
//                                     <FormLabel id="demo-row-radio-buttons-group-label" sx={{
//                                         color: '#FFFFFF',
//                                         '&.Mui-focused': {
//                                             color: '#FFFFFF',
//                                         },
//                                     }}>Phase :</FormLabel>
//                                     <RadioGroup
//                                         row
//                                         aria-labelledby="demo-row-radio-buttons-group-label"
//                                         name="row-radio-buttons-group"
//                                     >
//                                         <FormControlLabel value="1" control={<Radio
//                                             sx={{
//                                                 color: '#FFFFFF',
//                                                 '&.Mui-checked': {
//                                                     color: '#FFFFFF',
//                                                 },
//                                             }}
//                                         />} label="1" />
//                                         <FormControlLabel value="3" control={<Radio
//                                             sx={{
//                                                 color: '#FFFFFF',
//                                                 '&.Mui-checked': {
//                                                     color: '#FFFFFF',
//                                                 },
//                                             }}
//                                         />} label="3" />
//                                     </RadioGroup>
//                                 </FormControl> */}
//                                         <FormControl>
//                                             <FormLabel id="demo-row-radio-buttons-group-label" sx={{
//                                                 color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
//                                                 '&.Mui-focused': {
//                                                     color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
//                                                 },
//                                             }}>Phase :</FormLabel>
//                                             <RadioGroup
//                                                 row
//                                                 aria-labelledby="demo-row-radio-buttons-group-label"
//                                                 name="row-radio-buttons-group"
//                                             >
//                                                 <FormControlLabel value="1" control={<Radio
//                                                     sx={{
//                                                         color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
//                                                         '&.Mui-checked': {
//                                                             color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
//                                                         },
//                                                     }}
//                                                 />} label="1" />
//                                                 <FormControlLabel value="3" control={<Radio
//                                                     sx={{
//                                                         color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
//                                                         '&.Mui-checked': {
//                                                             color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
//                                                         },
//                                                     }}
//                                                 />} label="3" />
//                                             </RadioGroup>
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 5 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="GST Number :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.GSTNumber}
//                                                 name="GSTNumber"
//                                                 error={!!touched.GSTNumber && !!errors.GSTNumber}
//                                                 helperText={touched.GSTNumber && errors.GSTNumber}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Pan Number:"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.PanNumber}
//                                                 name="PanNumber"
//                                                 error={!!touched.PanNumber && !!errors.PanNumber}
//                                                 helperText={touched.PanNumber && errors.PanNumber}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="MSME/udyam REGISTRATION :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.MSME_UdyamREGISTRATION}
//                                                 name="MSME_UdyamREGISTRATION"
//                                                 error={!!touched.MSME_UdyamREGISTRATION && !!errors.MSME_UdyamREGISTRATION}
//                                                 helperText={touched.MSME_UdyamREGISTRATION && errors.MSME_UdyamREGISTRATION}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                         </>
//                     )}

//                     {marketingType === 'Residential Marketing' && (
//                         <>
//                             {activeStep === 1 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Consumer Name :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.ConsumerName}
//                                                 name="ConsumerName"
//                                                 error={!!touched.ConsumerName && !!errors.ConsumerName}
//                                                 helperText={touched.ConsumerName && errors.ConsumerName}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Phone Number : "
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.PhoneNumber}
//                                                 name="PhoneNumber"
//                                                 error={!!touched.PhoneNumber && !!errors.PhoneNumber}
//                                                 helperText={touched.PhoneNumber && errors.PhoneNumber}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />

//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Consumer Number : "
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.ConsumerNumber}
//                                                 name="ConsumerNumber"
//                                                 error={!!touched.ConsumerNumber && !!errors.ConsumerNumber}
//                                                 helperText={touched.ConsumerNumber && errors.ConsumerNumber}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>


//                                     </Box>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Address"
//                                                 label="Address :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Address}
//                                                 name="Address"
//                                                 error={!!touched.Address && !!errors.Address}
//                                                 helperText={touched.Address && errors.Address}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="City_Village"
//                                                 label="City/Village :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.City_Village}
//                                                 name="City_Village"
//                                                 error={!!touched.City_Village && !!errors.City_Village}
//                                                 helperText={touched.City_Village && errors.City_Village}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="District_Location"
//                                                 label="District/Location :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.District_Location}
//                                                 name="District_Location"
//                                                 error={!!touched.District_Location && !!errors.District_Location}
//                                                 helperText={touched.District_Location && errors.District_Location}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Pincode"
//                                                 label="Pincode :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Pincode}
//                                                 name="Pincode"
//                                                 error={!!touched.Pincode && !!errors.Pincode}
//                                                 helperText={touched.Pincode && errors.Pincode}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Latitude"
//                                                 label="Latitude :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Latitude}
//                                                 name="Latitude"
//                                                 error={!!touched.Latitude && !!errors.Latitude}
//                                                 helperText={touched.Latitude && errors.Latitude}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 id="Longitude"
//                                                 label="Longitude :"
//                                                 multiline
//                                                 defaultValue=""
//                                                 variant="filled"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.Longitude}
//                                                 name="Longitude"
//                                                 error={!!touched.Longitude && !!errors.Longitude}
//                                                 helperText={touched.Longitude && errors.Longitude}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 2 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Primary Amount :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.PrimaryAmount}
//                                                 name="PrimaryAmount"
//                                                 error={!!touched.PrimaryAmount && !!errors.PrimaryAmount}
//                                                 helperText={touched.PrimaryAmount && errors.PrimaryAmount}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Solar Amount :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.SolarAmount}
//                                                 name="SolarAmount"
//                                                 error={!!touched.SolarAmount && !!errors.SolarAmount}
//                                                 helperText={touched.SolarAmount && errors.SolarAmount}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Cash Amount :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.CashAmount}
//                                                 name="CashAmount"
//                                                 error={!!touched.CashAmount && !!errors.CashAmount}
//                                                 helperText={touched.CashAmount && errors.CashAmount}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 3 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <TextField
//                                             margin="dense"
//                                             id="Dealer"
//                                             name="Dealer"
//                                             label="Dealer :"
//                                             select
//                                             fullWidth
//                                             variant="filled"
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             value={values.Dealer}
//                                             error={touched.Dealer && Boolean(errors.Dealer)}
//                                             helperText={touched.Dealer && errors.Dealer}
//                                             InputLabelProps={{
//                                                 style: {
//                                                     color: theme.palette.text.primary
//                                                 }
//                                             }}
//                                         >
//                                             {/* {
//                                             roles.map((v) => (
//                                                 <MenuItem value={v._id}>{v.roleName}</MenuItem>
//                                             ))
//                                         } */}
//                                         </TextField>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Dealer Commission :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.DealerCommission}
//                                                 name="DealerCommission"
//                                                 error={!!touched.DealerCommission && !!errors.DealerCommission}
//                                                 helperText={touched.DealerCommission && errors.DealerCommission}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                             {activeStep === 4 && (
//                                 <>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(3, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Solar Module Make :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.SolarModuleMake}
//                                                 name="SolarModuleMake"
//                                                 error={!!touched.SolarModuleMake && !!errors.SolarModuleMake}
//                                                 helperText={touched.SolarModuleMake && errors.SolarModuleMake}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Solar Module Wp :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.SolarModuleWp}
//                                                 name="SolarModuleWp"
//                                                 error={!!touched.SolarModuleWp && !!errors.SolarModuleWp}
//                                                 helperText={touched.SolarModuleWp && errors.SolarModuleWp}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Solar Module Nos :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.SolarModuleNos}
//                                                 name="SolarModuleNos"
//                                                 error={!!touched.SolarModuleNos && !!errors.SolarModuleNos}
//                                                 helperText={touched.SolarModuleNos && errors.SolarModuleNos}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                                         sx={{
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
//                                         }}
//                                     >
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="System Size Kw :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.SystemSizeKw}
//                                                 name="SystemSizeKw"
//                                                 error={!!touched.SystemSizeKw && !!errors.SystemSizeKw}
//                                                 helperText={touched.SystemSizeKw && errors.SystemSizeKw}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                         <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                                             <TextField
//                                                 fullWidth
//                                                 variant="filled"
//                                                 type="text"
//                                                 label="Inverter Size :"
//                                                 onBlur={handleBlur}
//                                                 onChange={handleChange}
//                                                 value={values.InverterSize}
//                                                 name="InverterSize"
//                                                 error={!!touched.InverterSize && !!errors.InverterSize}
//                                                 helperText={touched.InverterSize && errors.InverterSize}
//                                                 sx={{ gridColumn: "span 2" }}
//                                                 InputLabelProps={{
//                                                     style: {
//                                                         color: theme.palette.text.primary
//                                                     }
//                                                 }}
//                                             />
//                                         </FormControl>
//                                     </Box>
//                                 </>
//                             )}
//                         </>
//                     )}

//                     <FormControl>
//                         <Stack direction="row" spacing={2} sx={{ m: 1, minWidth: 120 }}>
//                             <Button
//                                 variant="contained"
//                                 disabled={activeStep === 0}
//                                 onClick={handleBack}
//                             >
//                                 Back
//                             </Button>
//                             {/* <Button
//                                 variant="contained"
//                                 color="primary"
//                                 type="button"
//                                 onClick={() => {
//                                     validateForm().then((errors) => {
//                                         if (activeStep === 0 && !values.MarketingType) {
//                                             setFieldError('MarketingType', 'Please select a Marketing Type');
//                                             return;
//                                         }
//                                         if (Object.keys(errors).length === 0 || isLastStep) {
//                                             handleSubmit();
//                                         } else {
//                                             setTouchedSteps((prevTouchedSteps) => {
//                                                 const newTouchedSteps = [...prevTouchedSteps];
//                                                 newTouchedSteps[activeStep] = true;
//                                                 return newTouchedSteps;
//                                             });
//                                             setActiveStep((prevActiveStep) => prevActiveStep + 1);
//                                         }
//                                     });
//                                 }}
//                             >
//                                 {isLastStep ? id ? 'Update' : 'Submit' : 'Next'}
//                             </Button> */}
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 type="button"
//                                 onClick={() => {
//                                     if (activeStep === 0 && !values.MarketingType) {
//                                         setFieldError('MarketingType', 'Please select a Marketing Type');
//                                         return;
//                                     }
//                                     validateForm().then((errors) => {
//                                         if (Object.keys(errors).length === 0 || isLastStep) {
//                                             handleSubmit();
//                                         } else {
//                                             setTouchedSteps((prevTouchedSteps) => {
//                                                 const newTouchedSteps = [...prevTouchedSteps];
//                                                 newTouchedSteps[activeStep] = true;
//                                                 return newTouchedSteps;
//                                             });
//                                             setActiveStep((prevActiveStep) => prevActiveStep + 1);
//                                         }
//                                     });
//                                 }}
//                             >
//                                 {isLastStep ? id ? 'Update' : 'Submit' : 'Next'}
//                             </Button>
//                         </Stack>
//                     </FormControl>
//                 </Stack>
//             </form>

//         </Box >
//     );
// }

import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, MenuItem, useTheme, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import Radio from '@mui/material/Radio';
import { useLocation } from 'react-router-dom';
import { addCommercialMarketing, editCommercialMarketing, getCommercialMarketing, viewComerialMarketing } from '../../../redux/slice/Commercialmarketing.slice';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDealers } from '../../../redux/slice/dealer.slice';
import { getUsers } from '../../../redux/slice/users.slice';
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
    const { active, completed, className, icon, onClick, theme, error, marketingType } = props;

    const commercialIcons = {
        1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        3: <img src="/assets/images/icons/Customer Price.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        4: <img src="/assets/images/icons/Dealer Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        5: <img src="/assets/images/icons/Electricity Bill Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        6: <img src="/assets/images/icons/Business Document Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
    };

    const residentialIcons = {
        1: <img src="/assets/images/icons/file.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        2: <img src="/assets/images/icons/Customer.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        3: <img src="/assets/images/icons/Customer Price.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        4: <img src="/assets/images/icons/Dealer Details.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
        5: <img src="/assets/images/icons/Vector.svg" style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" alt='' />,
    };
    const icons = marketingType === 'Commercial Marketing' ? commercialIcons : residentialIcons;


    return (
        // <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
        //     {icons[String(icon)]}
        // </ColorlibStepIconRoot>
        <ColorlibStepIconRoot
            ownerState={{ completed, active, error }}
            className={className}
            onClick={onClick}
        >
            {icons[String(icon)]}
            {error && (
                <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                }} />
            )}
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

const validationSchemas =
    Yup.object({
        // fillNo: Yup.string().required('File No. is required'),
        MarketingType: Yup.string().required('MarketingType is required'),
        Date: Yup.date().required('Date is required').min(new Date(), 'This Date cannot be use beacuse its in the past'),
        ConsumerName: Yup.string().required('Consumer Name is required'),
        ContactPersonName: Yup.string().required('Contact Person Name is required'),
        PhoneNumber: Yup.string().required('Contact Person Name is required').matches(/^\d{10}$/, 'Phone number must be 10 digits'),
        Address: Yup.string().required('Address is required'),
        City_Village: Yup.string().required('City/Village is required'),
        District_Location: Yup.string().required('District/Location is required'),
        Pincode: Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be 6 digits'),
        Latitude: Yup.number().required('Latitude is required'),
        Longitude: Yup.number().required('Longitude is required'),
        Amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
        GST: Yup.number().required('GST is required').min(0).max(100),
        TotalAmount: Yup.number().required('Total Amount is required').positive('Total Amount must be positive'),
        Dealer: Yup.string().required('Dealer is required').matches(/^[0-9a-fA-F]{24}$/, 'Invalid Dealer ID'),
        DealerCommission: Yup.number().required('Dealer Commission is required').min(0).max(100),
        DealerPolicy: Yup.number().required('Dealer Policy is required').min(0).max(100),
        ConsumerNumber: Yup.string().required('Consumer Number is required'),
        ConnectionLoad: Yup.number().required('Connection Load is required'),
        Tarrif: Yup.string().required('Tarrif is required'),
        AverageMonthlyBill: Yup.number().required('Average Monthly Bill is required').positive('Average Monthly Bill must be positive'),
        GSTNumber: Yup.string().required('GST Number is required'),
        PanNumber: Yup.string().required('Pan Number is required'),
        MSME_UdyamREGISTRATION: Yup.string().required('MSME UdyamREGISTRATION is required'),
        PrimaryAmount: Yup.number().positive('Primary Amount must be positive'),
        SolarAmount: Yup.number().positive('Solar Amount must be positive'),
        CashAmount: Yup.number().positive('Cash Amount must be positive'),
        SolarModuleMake: Yup.string(),
        SolarModuleWp: Yup.number().positive('Solar Module Wp must be positive'),
        SolarModuleNos: Yup.number().positive().integer('Solar Module Nos must be a positive integer'),
        SystemSizeKw: Yup.number().positive('System Size Kw must be positive'),
        InverterSize: Yup.number().positive('Inverter Size must be positive'),
        Phase: Yup.number(),
    });

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
    DealerPolicy: ''
};

export default function Marketing() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [stepsWithErrors, setStepsWithErrors] = React.useState([]);
    const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
    const [marketingType, setMarketingType] = React.useState('');
    const [fileNo, setFileNo] = useState('');
    const [dealer, setDealar] = useState([]);

    const dispatch = useDispatch();
    const { state } = useLocation();
    // console.log("state>>>>>>>>>>>>>",state);
    // const { id } = useParams();
    const id = state?._id;

    useEffect(() => {
        dispatch(getCommercialMarketing());
        dispatch(getUsers());
        dispatch(getRoles());
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

    useEffect(() => {
        if (allUsers.length && allRoles.length) {
            const dealerRole = allRoles.find(role => role.roleName === 'Dealer');
            if (dealerRole) {
                const filteredDealers = allUsers.filter(user => user.role === dealerRole._id);
                setDealar(filteredDealers);
            }
        }
    }, [allUsers, allRoles]);

    // ... existing code ...

    useEffect(() => {
        if (!id) {
            if (CommercialMarket && CommercialMarket.length === 0) {
                setFileNo('A001');
            } else if (CommercialMarket && CommercialMarket.length > 0) {
                let n = CommercialMarket.length;
                let lastFillNo = CommercialMarket[n - 1]?.fillNo; // Add optional chaining here

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
                    setFileNo('A001'); // Fallback in case lastFillNo is undefined
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

    // ... existing code ...

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
                        DealerCommission: values.DealerCommission,
                        ConsumerNumber: values.ConsumerNumber,
                    };

                    let submissionValues;

                    if (values.MarketingType === 'Commercial Marketing') {
                        submissionValues = {
                            ...commonFields,
                            Amount: values.Amount,
                            GST: values.GST,
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
                            SystemSizeKw: values.SystemSizeKw,
                            InverterSize: values.InverterSize,
                        };
                    }
                    // console.log("submissionValues>>>>>>>>>>", submissionValues);
                    // console.log("Values>>>>>>>>>>", values);
                    if (id) {
                        // console.log("id@@@@@@", id);
                        delete submissionValues.isActive;
                        delete submissionValues.createdAt;
                        delete submissionValues.updatedAt;

                        dispatch(editCommercialMarketing({ id: values._id, ...submissionValues })).then(() => {
                            dispatch(getCommercialMarketing()); // Fetch updated data
                        });
                    } else {
                        // console.log("values>>>>>>", submissionValues);
                        dispatch(addCommercialMarketing(submissionValues)).then(() => {
                            dispatch(getCommercialMarketing()); // Fetch updated data
                        });
                    }

                    actions.resetForm();
                    setActiveStep(0);
                }
            } else {
                // Set error states for each step based on validation
                const newStepsWithErrors = steps.map((_, index) => {
                    const stepErrors = Object.keys(errors).filter((key) => {
                        return key.startsWith(`step${index + 1}`); // Adjust this logic based on your field naming
                    });
                    return stepErrors.length > 0; // Mark step as having errors if any field has errors
                });
                setStepsWithErrors(newStepsWithErrors); // Update the error state for all steps
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
        validationSchema: validationSchemas,
        onSubmit: handleNext,
    });

    const steps = values.MarketingType === 'Commercial Marketing' ? commercialSteps : residentialSteps;
    const isLastStep = activeStep === steps.length - 1;

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
                    {/* <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
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
                    </Stepper> */}

                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={(props) => (
                                    <ColorlibStepIcon
                                        {...props}
                                        theme={theme}
                                        icon={index + 1}
                                        onClick={() => handleStep(index)}
                                        error={stepsWithErrors[index]} // Pass error state for the current step
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
                                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                                    <TextField
                                        id="Date"
                                        label="Date :"
                                        type="date"
                                        rows={4}
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
                                                    dealer.map((v) => (
                                                        <MenuItem value={v._id}>{v.name}</MenuItem>
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
                                                    dealer.map((v) => (
                                                        <MenuItem key={v._id} value={v._id}>{v.name}</MenuItem>
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
                            {/* <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => {
                                    validateForm().then((errors) => {
                                        if (activeStep === 0 && !values.MarketingType) {
                                            setFieldError('MarketingType', 'Please select a Marketing Type');
                                            return;
                                        }
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
                            </Button> */}
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
                                {isLastStep ? (id ? 'Update' : 'Submit') : 'Next'}
                            </Button>
                        </Stack>
                    </FormControl>
                </Stack>
            </form>

        </Box >
    );
}

