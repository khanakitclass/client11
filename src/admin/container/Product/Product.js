// import * as React from 'react';
// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText } from '@mui/material';
// import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCategories } from '../../../redux/slice/categories.slice';
// import { getSubcategories, getSubcategoriesByCategory } from '../../../redux/slice/subcategories.slice';
// import { addProduct } from '../../../redux/slice/products.slice';
// import Header from '../../../components/Header';
// import { useLocation } from 'react-router-dom';

// const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 22,
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient( 95deg,#222222 0%, #FFFFFF 120%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage: 'linear-gradient( 95deg,#222222 0%, #FFFFFF 120%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
//   zIndex: 1,
//   color: '#fff',
//   width: 50,
//   height: 50,
//   display: 'flex',
//   borderRadius: '50%',
//   justifyContent: 'center',
//   alignItems: 'center',
//   ...(ownerState.active && {
//     border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
//     boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//   }),
//   ...(ownerState.completed && {
//     border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
//     border: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black',
//   }),
// }));

// function ColorlibStepIcon(props) {
//   const { active, completed, className, icon, onClick, theme } = props;

//   console.log(theme.palette.mode);

//   const icons = {
//     1: <img src='assets/images/icons/basicw.svg' style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//     2: <img src='assets/images/icons/variant.svg' style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//     3: <img src='assets/images/icons/tax.svg' style={{ filter: theme.palette.mode === 'light' ? 'invert(1) brightness(2)' : 'invert(0) brightness(1)' }} width="25" height="26" />,
//   };

//   return (
//     <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} onClick={onClick}>
//       {icons[String(icon)]}
//     </ColorlibStepIconRoot>
//   );
// }

// ColorlibStepIcon.propTypes = {
//   active: PropTypes.bool,
//   className: PropTypes.string,
//   completed: PropTypes.bool,
//   icon: PropTypes.node,
//   onClick: PropTypes.func,
// };

// const steps = ['Basic Details', 'Variant', 'Tax & Warrenty Details'];

// const validationSchemas =
//   Yup.object({
//     category_id: Yup.string().required("Please select category"),
//     subcategory_id: Yup.string().required("Please select subcategory"),
//     name: Yup.string().required(),
//     measurement: Yup.string().required(),
//     for: Yup.string().required("Please select product for."),
//     make: Yup.string().required(),
//     specification: Yup.string().required(),
//     description: Yup.string().required(),
//     hsn: Yup.string().required(),
//     tax: Yup.string().required(),
//     warrenty: Yup.string().required()
//   });

// const initialValues = {
//   category_id: '',
//   subcategory_id: '',
//   name: '',
//   measurement: '',
//   for: '',
//   make: '',
//   specification: '',
//   description: '',
//   hsn: '',
//   tax: '',
//   warrenty: ''
// };

// export default function CustomizedSteppers() {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     dispatch(getCategories());


//   }, []);

//   const categories = useSelector(state => state.categories);
//   const subcategories = useSelector(state => state.subcategories);

//   const isLastStep = activeStep === steps.length - 1;

//   const handleNext = (values, actions) => {
//     console.log(values);
//     setTouchedSteps((prevTouchedSteps) => {
//       const newTouchedSteps = [...prevTouchedSteps];
//       newTouchedSteps[activeStep] = true;
//       return newTouchedSteps;
//     });

//     if (!isLastStep) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     } else {
//       actions.validateForm().then((errors) => {
//         console.log(errors);
//         if (Object.keys(errors).length === 0) {
//           alert(JSON.stringify(values, null, 2));
//           dispatch(addProduct(values));
//           actions.resetForm();
//           setActiveStep(0)
//         } else {
//           alert('Please fix the errors in the form before submitting');
//         }
//         actions.setSubmitting(false);
//       });
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStep = (step) => {
//     setActiveStep(step);
//   };
//   const isNonMobile = useMediaQuery("(min-width:600px)");
//   const theme = useTheme();

//   const changeCategorySelect = (event) => {
//     const selectedCategoryId = event.target.value;
//     // setFieldValue("category_id", selectedCategoryId);
//     dispatch(getSubcategoriesByCategory(selectedCategoryId))
//     // setFieldValue("subcategory_id", "");

//     getMeasurementLabel(selectedCategoryId)
//   };

//   const [msg, setMsg] = React.useState('');
//   const getMeasurementLabel = (category_id) => {
//     const category = categories.categories.find(category => category._id === category_id);
//     setMsg(`${category ? ' (' + category.unit + ')' : ''}`);
//   };

//   // const filteredCategoryUnit = subcategories.filter(v => v._id === values.category_id)?.unit;

//   const {state} = useLocation();
//   console.log(state);

//   return (
//     <Box m="20px">
//       <Header
//         title="ADD PRODUCT"
//         subtitle="Add your product here"
//       />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchemas}
//         onSubmit={handleNext}

//       >
//         {({ isSubmitting, validateForm, handleSubmit, errors, handleBlur, handleChange, touched, values, setFieldValue }) => (
//           <Form>
//             <Stack sx={{ width: '100%', marginTop: '30px' }} spacing={4}>
//               <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
//                 {steps.map((label, index) => (
//                   <Step key={label}>
//                     <StepLabel StepIconComponent={(props) => (
//                       <ColorlibStepIcon {...props} theme={theme} icon={index + 1} onClick={() => handleStep(index)} />
//                     )}>
//                       {label}
//                     </StepLabel>
//                   </Step>
//                 ))}
//               </Stepper>
//               {activeStep === 0 && (
//                 <>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <InputLabel id="category-label" style={{ color: theme.palette.text.primary }}>Category</InputLabel>
//                       <Select
//                         variant="filled"
//                         name='category_id'
//                         labelId="category-label"
//                         id="category_id"
//                         onChange={(event) => { setFieldValue("category_id", event.target.value); changeCategorySelect(event) }}
//                         sx={{ gridColumn: "span 2" }}
//                         value={values.category_id}
//                         onBlur={handleBlur}
//                         error={!!touched.category_id && !!errors.category_id}
//                       >
//                         {
//                           categories.categories.map((v) => (
//                             <MenuItem value={v._id}>{v.name}</MenuItem>
//                           ))
//                         }


//                       </Select>
//                       {touched.category_id && errors.category_id && (
//                         <FormHelperText error>{errors.category_id}</FormHelperText>
//                       )}
//                     </FormControl>
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <InputLabel id="category-label" style={{ color: theme.palette.text.primary }}>Subcategory</InputLabel>
//                       <Select
//                         variant="filled"
//                         label="Subcategory"
//                         name="subcategory_id"
//                         labelId="subcategory-label"
//                         id="subcategory_id"
//                         value={values.subcategory_id}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         sx={{ gridColumn: "span 2" }}
//                         error={!!touched.subcategory_id && !!errors.subcategory_id}
//                       >
//                         {subcategories.subcategories.map((v) => (
//                           <MenuItem key={v._id} value={v._id}>
//                             {v.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                       {touched.subcategory_id && errors.subcategory_id && (
//                         <FormHelperText error>{errors.subcategory_id}</FormHelperText>
//                       )}

//                     </FormControl>


//                   </Box>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         fullWidth
//                         variant="filled"
//                         type="text"
//                         label="Product Name"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.campaignName}
//                         name="name"
//                         error={!!touched.name && !!errors.name}
//                         helperText={touched.name && errors.name}
//                         sx={{ gridColumn: "span 2" }}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />
//                     </FormControl>
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         fullWidth
//                         variant="filled"
//                         type="text"
//                         label={`Unit of Measurement` + msg}
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.measurement}
//                         name="measurement"
//                         error={!!touched.measurement && !!errors.measurement}
//                         helperText={touched.measurement && errors.measurement}
//                         sx={{ gridColumn: "span 2" }}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />

//                     </FormControl>
//                   </Box>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <InputLabel id="for-label" style={{ color: theme.palette.text.primary }}>Product for</InputLabel>
//                       <Select
//                         variant="filled"
//                         name='for'
//                         labelId="for-label"
//                         id="for"
//                         onChange={handleChange}
//                         sx={{ gridColumn: "span 2" }}
//                         value={values.for}
//                         error={!!touched.for && !!errors.for}
//                       >
//                         <MenuItem value={"Purchase"}>Purchase</MenuItem>
//                         <MenuItem value={"Selling"}>Selling</MenuItem>
//                       </Select>
//                       {touched.for && errors.for && (
//                         <FormHelperText error>{errors.for}</FormHelperText>
//                       )}
//                     </FormControl>
//                   </Box>
//                 </>
//               )}
//               {activeStep === 1 && (
//                 <>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         fullWidth
//                         variant="filled"
//                         type="text"
//                         label="Make"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.make}
//                         name="make"
//                         error={!!touched.make && !!errors.make}
//                         helperText={touched.make && errors.make}
//                         sx={{ gridColumn: "span 2" }}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />
//                     </FormControl>
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         fullWidth
//                         variant="filled"
//                         type="text"
//                         label="Specification"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.specification}
//                         name="specification"
//                         error={!!touched.specification && !!errors.specification}
//                         helperText={touched.specification && errors.specification}
//                         sx={{ gridColumn: "span 2" }}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />

//                     </FormControl>



//                   </Box>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(1, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 1" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         id="description"
//                         label="Description"
//                         multiline
//                         rows={4}
//                         defaultValue=""
//                         variant="filled"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.description}
//                         name="description"
//                         error={!!touched.description && !!errors.description}
//                         helperText={touched.description && errors.description}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />
//                     </FormControl>
//                   </Box>
//                 </>
//               )}
//               {activeStep === 2 && (
//                 <>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         fullWidth
//                         variant="filled"
//                         type="text"
//                         label="HSN Code"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.hsn}
//                         name="hsn"
//                         error={!!touched.hsn && !!errors.hsn}
//                         helperText={touched.hsn && errors.hsn}
//                         sx={{ gridColumn: "span 2" }}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />
//                     </FormControl>
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         fullWidth
//                         variant="filled"
//                         type="text"
//                         label="Tax"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.tax}
//                         name="tax"
//                         error={!!touched.tax && !!errors.tax}
//                         helperText={touched.tax && errors.tax}
//                         sx={{ gridColumn: "span 2" }}
//                         InputLabelProps={{
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}
//                       />

//                     </FormControl>


//                   </Box>
//                   <Box
//                     display="grid"
//                     gap="30px"
//                     gridTemplateColumns="repeat(2, minmax(0, 1fr))"
//                     sx={{
//                       "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
//                     }}
//                   >
//                     <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
//                       <TextField
//                         id="description"
//                         label="Warrenty"
//                         type="date"
//                         rows={4}
//                         variant="filled"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.warrenty}
//                         name="warrenty"
//                         error={!!touched.warrenty && !!errors.warrenty}
//                         helperText={touched.warrenty && errors.warrenty}
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             color: theme.palette.text.primary
//                           }
//                         }}

//                       />
//                     </FormControl>
//                   </Box>
//                 </>
//               )}
//               <FormControl>
//               <Stack direction="row" spacing={2} sx={{ m: 1, minWidth: 120 }}>
//                 <Button
//                   variant="contained"
//                   disabled={activeStep === 0}
//                   onClick={handleBack}
//                 >
//                   Back
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   type="button"
//                   onClick={() => {
//                     validateForm().then((errors) => {
//                       if (Object.keys(errors).length === 0 || isLastStep) {
//                         handleSubmit();
//                       } else {
//                         setTouchedSteps((prevTouchedSteps) => {
//                           const newTouchedSteps = [...prevTouchedSteps];
//                           newTouchedSteps[activeStep] = true;
//                           return newTouchedSteps;
//                         });
//                         setActiveStep((prevActiveStep) => prevActiveStep + 1);
//                       }
//                     });
//                   }}
//                 >
//                   {isLastStep ? 'Submit' : 'Next'}
//                 </Button>
//               </Stack>
//               </FormControl>
//             </Stack>
//           </Form>
//         )}
//       </Formik>
//     </Box>
//   );
// }


import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button, Stack, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, TextField, useMediaQuery, Box, FormControl, InputLabel, Select, MenuItem, useTheme, FormHelperText } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, useFormikContext, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../../redux/slice/categories.slice';
import { getSubcategories, getSubcategoriesByCategory } from '../../../redux/slice/subcategories.slice';
import { addProduct, editProduct, getDetailsProducts } from '../../../redux/slice/products.slice';
import Header from '../../../components/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
    mainCategory: Yup.string().required("Please select category"),
    subCategory: Yup.string().required("Please select subcategory"),
    productName: Yup.string().required(),
    unitOfMeasurement: Yup.string().required(),
    productFor: Yup.string().required("Please select product for."),
    make: Yup.string().required(),
    specifiaction: Yup.string().required(),
    Desacription: Yup.string().required(),
    HSNcode: Yup.string().required(),
    taxdetails: Yup.string().required(),
    // Warrentry: Yup.string().required('Year is required'),
    Size: Yup.string().required(),
    Color: Yup.string().required(),
  });

const initialValues = {
  mainCategory: '',
  subCategory: '',
  productName: '',
  unitOfMeasurement: '',
  productFor: '',
  make: '',
  specifiaction: '',
  Desacription: '',
  HSNcode: '',
  taxdetails: '',
  Warrentry: '',
  Size: '',
  Color: ''
};

export default function Product() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [touchedSteps, setTouchedSteps] = React.useState([false, false, false]);
  const [filteredSubcategories, setFilteredSubcategories] = React.useState([]);
  const [msg, setMsg] = React.useState('');

  const dispatch = useDispatch();
  const { state } = useLocation();

  const id = state?._id;

  React.useEffect(() => {
    dispatch(getCategories());
    dispatch(getSubcategories());
  }, [dispatch]);

  const categories = useSelector(state => state.categories.categories);
  const subcategories = useSelector(state => state.subcategories.subcategories);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.categoryName : "";
  }
  const getSubCategoryName = (subcategoryId) => {
    const subcategory = subcategories.find(subcategory => subcategory._id === subcategoryId);
    return subcategory ? subcategory.subCategoryName : "";
  }
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
            mainCategory: getCategoryName(values.mainCategory),
            subCategory: getSubCategoryName(values.subCategory)
          };
          if (id) {

            delete submissionValues.isActive;
            delete submissionValues.createdAt;
            delete submissionValues.updatedAt;

            dispatch(editProduct({ id: values._id, ...submissionValues }));
          } else {
            // console.log("values>>>>>>", submissionValues);
            dispatch(addProduct(submissionValues));
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

  const changeCategorySelect = async (cat_id, initialSubCategory = null) => {
    await dispatch(getSubcategoriesByCategory(cat_id));
    const filteredSubs = subcategories.filter(sub => sub.categoryName === cat_id);
    setFilteredSubcategories(filteredSubs);

    if (initialSubCategory) {
      // Find the subcategory ID that matches the initial subcategory name
      const subCategoryId = filteredSubs.find(sub => sub.subCategoryName === initialSubCategory)?._id;
      if (subCategoryId) {
        setFieldValue("subCategory", subCategoryId);
      }
    } else {
      setFieldValue("subCategory", "");
    }
    // await getMeasurementLabel(cat_id);
  };

  const getMeasurementLabel = (subCategoryId) => {
    const category = subcategories.find(sub => sub._id === subCategoryId);
    console.log("category", category);
    setMsg(`${category ? ' (' + category.unit + ')' : ''}`);
  };


  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryId = event.target.value;
    setFieldValue("subCategory", selectedSubCategoryId);
    getMeasurementLabel(selectedSubCategoryId);
  };


  const { handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue, setValues, validateForm } = useFormik({
    initialValues,
    validationSchema: validationSchemas,
    onSubmit: handleNext,
  });
  React.useEffect(() => {
    if (values.mainCategory) {
      const filteredSubs = subcategories.filter(sub => sub.categoryName === values.mainCategory);
      setFilteredSubcategories(filteredSubs);
    }
  }, [subcategories, values.mainCategory]);
  React.useEffect(() => {
    if (id) {
      dispatch(getDetailsProducts(id)).then((response) => {
        if (response.payload && response.payload.products) {

          const productData = response.payload.products;

          const categoryId = categories.find(cat => cat.categoryName === productData.mainCategory)?._id;

          setValues({
            ...productData,
            mainCategory: categoryId || '',
            subCategory: productData.subCategory
          });

          if (categoryId) {
            changeCategorySelect(categoryId, productData.subCategory);

          }
        }
      });
    }
  }, [id, dispatch, categories, subcategories]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, index) => 2000 + index);
  const defaultYear = years.includes(currentYear) ? currentYear : years[0];


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

  const canAccessPage = hasPermission("Products");
  console.log("canAccessPage", canAccessPage)

  if (!canAccessPage) {
    navigate('/admin/dashboard');
    console.log("Access denied: You do not have permission to access this page.");
  }

  return (
    <Box m="20px">
      {id ? (
        <Header
          title="Update Product"
          subtitle="Update your Product here"
        />
      ) : (
        <Header
          title="Add Product"
          subtitle="Manager Your Product here"
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
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                }}
              >
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="category-label" style={{ color: theme.palette.text.primary }}>Category :</InputLabel>
                  {/* {console.log("values.mainCategory", values.mainCategory)} */}
                  <Select
                    variant="filled"
                    name='mainCategory'
                    labelId="category-label"
                    id="mainCategory"
                    onChange={(event) => {
                      setFieldValue("mainCategory", event.target.value);
                      changeCategorySelect(event.target.value);
                    }}
                    sx={{ gridColumn: "span 2" }}
                    value={values.mainCategory}
                    onBlur={handleBlur}
                    error={!!touched.mainCategory && !!errors.mainCategory}
                  >
                    {categories?.map((category) => (
                      <MenuItem key={category._id} value={category._id} >
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>

                  {touched.mainCategory && errors.mainCategory && (
                    <FormHelperText error>{errors.mainCategory}</FormHelperText>
                  )}
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="category-label" style={{ color: theme.palette.text.primary }}>Subcategory :</InputLabel>
                  {console.log("values.subCategory", values.subCategory)}
                  <Select
                    variant="filled"
                    name="subCategory"
                    labelId="subcategory-label"
                    id="subCategory"
                    value={values.subCategory}
                    onChange={handleSubCategoryChange}
                    onBlur={handleBlur}
                    sx={{ gridColumn: "span 2" }}
                    error={!!touched.subCategory && !!errors.subCategory}
                  >
                    {filteredSubcategories?.map((subcategory) => (
                      <MenuItem key={subcategory._id} value={subcategory._id} >
                        {subcategory.subCategoryName}
                      </MenuItem>
                    ))}
                  </Select>

                  {touched.subCategory && errors.subCategory && (
                    <FormHelperText error>{errors.subCategory}</FormHelperText>
                  )}

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
                    label="Product Name :"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productName}
                    name="productName"
                    error={!!touched.productName && !!errors.productName}
                    helperText={touched.productName && errors.productName}
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
                    label={`Unit of Measurement :` + msg}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.unitOfMeasurement}
                    name="unitOfMeasurement"
                    error={!!touched.unitOfMeasurement && !!errors.unitOfMeasurement}
                    helperText={touched.unitOfMeasurement && errors.unitOfMeasurement}
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
                  id="productFor"
                  name="productFor"
                  label="Product For :"
                  select
                  fullWidth
                  variant="filled"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.productFor}
                  error={touched.productFor && Boolean(errors.productFor)}
                  helperText={touched.productFor && errors.productFor}
                  InputLabelProps={{
                    style: {
                      color: theme.palette.text.primary
                    }
                  }}
                >
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Sell">Sell</MenuItem>
                </TextField>

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
                    label="Make :"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.make}
                    name="make"
                    error={!!touched.make && !!errors.make}
                    helperText={touched.make && errors.make}
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
                    label="Specification : "
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.specifiaction}
                    name="specifiaction"
                    error={!!touched.specifiaction && !!errors.specifiaction}
                    helperText={touched.specifiaction && errors.specifiaction}
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
                    label="Size :"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Size}
                    name="Size"
                    error={!!touched.Size && !!errors.Size}
                    helperText={touched.Size && errors.Size}
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
                    label="Color :"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Color}
                    name="Color"
                    error={!!touched.Color && !!errors.Color}
                    helperText={touched.Color && errors.Color}
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
                gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                }}
              >
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <TextField
                    id="Desacription"
                    label="Discription :"
                    multiline
                    defaultValue=""
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Desacription}
                    name="Desacription"
                    rows={4}
                    error={!!touched.Desacription && !!errors.Desacription}
                    helperText={touched.Desacription && errors.Desacription}
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
                    label="HSN Code :"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.HSNcode}
                    name="HSNcode"
                    error={!!touched.HSNcode && !!errors.HSNcode}
                    helperText={touched.HSNcode && errors.HSNcode}
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
                    label="Tax Details :"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.taxdetails}
                    name="taxdetails"
                    error={!!touched.taxdetails && !!errors.taxdetails}
                    helperText={touched.taxdetails && errors.taxdetails}
                    sx={{ gridColumn: "span 2" }}
                    InputLabelProps={{
                      style: {
                        color: theme.palette.text.primary
                      }
                    }}
                  />
                </FormControl>
                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="warranty-year-label" style={{ color: theme.palette.text.primary }}>Warranty Year</InputLabel>
                  <Select
                    labelId="warranty-year-label"
                    id="Warrentry"
                    value={values.Warrentry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="Warrentry"
                    error={!!touched.Warrentry && !!errors.Warrentry}
                    InputLabelProps={{
                      style: {
                        color: theme.palette.text.primary
                      }
                    }}
                    MenuProps={{
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
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.Warrentry && errors.Warrentry && (
                    <FormHelperText error>{errors.Warrentry}</FormHelperText>
                  )}
                </FormControl> */}
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="warranty-year-label" style={{ color: theme.palette.text.primary }}>Warranty Year</InputLabel>
                  <Select
                    labelId="warranty-year-label"
                    id="Warrentry"
                    // value={values.Warrentry}
                    value={values.Warrentry || defaultYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="Warrentry"
                    error={!!touched.Warrentry && !!errors.Warrentry}
                    InputLabelProps={{
                      style: {
                        color: theme.palette.text.primary
                      }
                    }}
                    MenuProps={{
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
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.Warrentry && errors.Warrentry && (
                    <FormHelperText error>{errors.Warrentry}</FormHelperText>
                  )}
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

