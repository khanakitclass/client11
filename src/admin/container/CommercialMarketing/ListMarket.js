// import React, { useEffect, useState, useMemo, memo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import { tokens } from '../../../theme';
// import { addCategories, deleteCategories, getCategories, editCategories } from '../../../redux/slice/categories.slice';
// import Header from "../../../components/Header";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import { getProducts, deleteProduct, getDetailsProducts } from '../../../redux/slice/products.slice';
// import { getSubcategories } from '../../../redux/slice/subcategories.slice';
// import { useNavigate } from 'react-router-dom';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


// import useMediaQuery from '@mui/material/useMediaQuery';
// import { deleteCommercialMarketing, deleteMarketing, getCommercialMarketing, getMarketing } from '../../../redux/slice/Commercialmarketing.slice';

// // const ProductDataGrid = memo(({ data, columns }) => {
// //     return (
// //         <DataGrid
// //             rows={data}
// //             columns={columns}
// //             components={{ Toolbar: GridToolbar }}
// //             pageSize={5}
// //             rowsPerPageOptions={[5, 10]}
// //             getRowId={(row) => row._id}
// //             autoHeight
// //         />
// //     );
// // });
// const MarketDataGrid = memo(({ data, columns }) => {
//     if (!data || !Array.isArray(data)) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <DataGrid
//             rows={data}
//             columns={columns}
//             components={{ Toolbar: GridToolbar }}
//             pageSize={5}
//             rowsPerPageOptions={[5, 10]}
//             getRowId={(row) => row?._id}
//             autoHeight
//         />
//     );
// });

// const ListMarket = () => {
//     const theme = useTheme();
//     const dispatch = useDispatch();
//     const colors = tokens(theme.palette.mode);

//     const [open, setOpen] = useState(false);
//     const [update, setUpdate] = useState(null);
//     const [openView, setOpenView] = React.useState(false);
//     const [viewData, setViewData] = useState(null);
//     const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


//     const CommercialMarket = useSelector(state => state.comMarketing.Marketing);

//     // useEffect(() => {
//     //     dispatch(getCommercialMarketing());
//     // }, []);

//     const handleClickOpenView = () => {
//         setOpenView(true);
//     };

//     const handleCloseView = () => {
//         setOpenView(false);
//     };


//     useEffect(() => {
//         dispatch(getCommercialMarketing());
//     }, [dispatch]);

//     const handleDelete = (id) => {
//         dispatch(deleteCommercialMarketing(id));
//     };

//     const navigate = useNavigate();

//     const handleEdit = (data) => {
//         console.log("data>>>>>>", data);
//         setOpen(true);
//         setUpdate(data);
//         navigate('/admin/add-market', { state: data });
//     };

//     const handleView = (data) => {
//         console.log("viewDataviewDataviewData", data);
//         handleClickOpenView();
//         setViewData(data)
//     }

//     const columns = useMemo(() => [
//         { field: 'fillNo', headerName: 'File NO', width: 200 },
//         {
//             field: 'contactPeosonName', headerName: 'Name', width: 200,
//             renderCell: (params) => {
//                 return params.row?.category_id?.name;
//             }
//         },
//         {
//             field: 'consumerNumber', headerName: 'Consumer No', width: 200,
//             renderCell: (params) => {
//                 return params.row?.subcategory_id?.name
//             }
//         },
//         {
//             field: 'Action',
//             headerName: 'Action',
//             width: 200,
//             renderCell: (params) => (
//                 <>
//                     <IconButton aria-label="edit" onClick={() => handleView(params.row)}>
//                         <RemoveRedEyeIcon />
//                     </IconButton>
//                     <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
//                         <EditIcon />
//                     </IconButton>
//                     <IconButton aria-label="delete" onClick={() => handleDelete(params.row._id)}>
//                         <DeleteIcon />
//                     </IconButton>
//                 </>
//             )
//         }
//     ], []);



//     const handleAddMarketing = () => {
//         navigate('/admin/add-market');
//     }
//     return (
//         <Box m="20px">
//             <Header
//                 title="Marketing"
//                 subtitle="Manage your Marketing here"
//             />
//             <Box display="flex" justifyContent="flex-end" mb={2}>
//                 <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMarketing}>
//                     Add Commercial
//                 </Button>
//             </Box>

//             <Box
//                 height="75vh"
//                 sx={useMemo(() => ({
//                     "& .MuiDataGrid-root": {
//                         border: "none",
//                     },
//                     "& .MuiDataGrid-cell": {
//                         borderBottom: "none",
//                     },
//                     "& .MuiDataGrid-columnHeaders": {
//                         backgroundColor: colors.blueAccent[700],
//                         borderBottom: "none",
//                     },
//                     "& .MuiDataGrid-virtualScroller": {
//                         backgroundColor: colors.primary[400],
//                     },
//                     "& .MuiDataGrid-footerContainer": {
//                         borderTop: "none",
//                         backgroundColor: colors.blueAccent[700],
//                     },
//                     "& .MuiCheckbox-root": {
//                         color: `${colors.greenAccent[200]} !important`,
//                     },
//                     "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//                         color: `${colors.grey[100]} !important`,
//                     },
//                 }), [colors])}
//             >
//                 <MarketDataGrid data={CommercialMarket} columns={columns} />
//             </Box>

//             <Dialog
//                 fullScreen={fullScreen}
//                 open={openView}
//                 onClose={handleCloseView}
//                 aria-labelledby="responsive-dialog-title"
//                 maxWidth={"sm"}
//                 fullWidth
//             >
//                 <DialogTitle id="responsive-dialog-title">
//                     {"Market Details"}
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//                             <div style={{ flex: '1' }}>
//                                 <p><strong>File NO:</strong> {viewData?.fillNo}</p>
//                                 <p><strong>Name:</strong> {viewData?.contactPeosonName}</p>
//                                 <p><strong>Consumer No:</strong> {viewData?.consumerNumber}</p>
//                                 <p><strong>PhoneNumber:</strong> {viewData?.phoneNumber}</p>
//                                 <p><strong>Address:</strong> {viewData?.address}</p>
//                                 <p><strong>City/Village:</strong> {viewData?.city}</p>
//                                 <p><strong>District/Location:</strong> {viewData?.district}</p>
//                                 <p><strong>Pincode:</strong> {viewData?.pincode}</p>
//                                 <p><strong>Latitude:</strong> {viewData?.latitude}</p>
//                                 <p><strong>Average Monthly Bill:</strong> {viewData?.averageMonthlyBill}</p>
//                                 <p><strong>Gst Number:</strong> {viewData?.gstNumber}</p>
//                                 <p><strong>Pan Number:</strong> {viewData?.panNumber}</p>
//                             </div>
//                             <div style={{ flex: '1' }}>
//                                 <p><strong>Amount:</strong> {viewData?.amount}</p>
//                                 <p><strong>gst:</strong> {viewData?.gst}</p>
//                                 <p><strong>Total Amount:</strong> {viewData?.totalAmount}</p>
//                                 <p><strong>Bank:</strong> {viewData?.bank}</p>
//                                 <p><strong>Consumer Name As Per LightBill:</strong> {viewData?.consumerNameAsPerLightBill}</p>
//                                 <p><strong>Date:</strong> {viewData?.date}</p>
//                                 <p><strong>Dealer Commission:</strong> {viewData?.dealerCommission}</p>
//                                 <p><strong>Consumer Number:</strong> {viewData?.consumerNumber}</p>
//                                 <p><strong>Conection Load:</strong> {viewData?.conectionLoad}</p>
//                                 <p><strong>Tarrif:</strong> {viewData?.tarrif}</p>
//                                 <p><strong>msme/Udhyam Registration:</strong> {viewData?.udhyamRegistration}</p>
//                             </div>
//                         </div>
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button autoFocus onClick={handleCloseView} style={{color:'white'}}>
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//         </Box>
//     );
// };

// export default ListMarket;

import React, { useEffect, useState, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../../theme';
import { addCategories, deleteCategories, getCategories, editCategories } from '../../../redux/slice/categories.slice';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getProducts, deleteProduct, getDetailsProducts } from '../../../redux/slice/products.slice';
import { getSubcategories } from '../../../redux/slice/subcategories.slice';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


import useMediaQuery from '@mui/material/useMediaQuery';
import { deleteCommercialMarketing, deleteMarketing, getCommercialMarketing, getMarketing } from '../../../redux/slice/Commercialmarketing.slice';
import { getDealers } from '../../../redux/slice/dealer.slice';
import { getUsers } from '../../../redux/slice/users.slice';

// const ProductDataGrid = memo(({ data, columns }) => {
//     return (
//         <DataGrid
//             rows={data}
//             columns={columns}
//             components={{ Toolbar: GridToolbar }}
//             pageSize={5}
//             rowsPerPageOptions={[5, 10]}
//             getRowId={(row) => row._id}
//             autoHeight
//         />
//     );
// });
const MarketDataGrid = memo(({ data, columns }) => {
    if (!data || !Array.isArray(data)) {
        return <div>Loading...</div>;
    }

    return (
        <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            getRowId={(row) => row._id}
            autoHeight
        />
    );
});

const ListMarket = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const [dealer,setDealar] = useState('');

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    const CommercialMarket = useSelector(state => state.comMarketing.Marketing);
    const allUsers = useSelector(state => state.users.users);

    useEffect(() => {
        if(allUsers && viewData) {
            const dealerName = allUsers.find(user => user._id === viewData.Dealer);
            setDealar(dealerName);
        }
    },[allUsers, viewData])

    useEffect(() => {
        dispatch(getCommercialMarketing());
        dispatch(getUsers());
    }, []);

    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };


    useEffect(() => {
        dispatch(getCommercialMarketing());
    }, [dispatch]);

    const handleDelete = (id) => {
        // console.log("id>>>>>>>", id);
        dispatch(deleteCommercialMarketing(id));
    };

    const navigate = useNavigate();

    const handleEdit = (data) => {
        // console.log("data>>>>>>", data);
        setOpen(true);
        setUpdate(data);
        navigate('/admin/add-market', { state: data });
    };

    const handleView = (data) => {
        // console.log("viewDataviewDataviewData", data);
        handleClickOpenView();
        setViewData(data)
    }

    const columns = useMemo(() => [
        { field: 'fillNo', headerName: 'File NO', width: 200 },
        {
            field: 'ConsumerName || ContactPersonName', headerName: 'Name', width: 200,
            renderCell: (params) => {
                const consumerName = params.row?.ConsumerName;
                const contactPersonName = params.row?.ContactPersonName;
                const nameToShow = consumerName || contactPersonName;
                return nameToShow || params.row?.category_id?.name;
            }
        },
        {
            field: 'MarketingType', headerName: 'type', width: 200,
            renderCell: (params) => {
                return params.row.name;
            }
        },
        {
            field: 'consumerNumber', headerName: 'Consumer No', width: 200,
            renderCell: (params) => {
                return params.row?.ConsumerNumber
            }
        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => (
                <>
                    <IconButton aria-label="edit" onClick={() => handleView(params.row)}>
                        <RemoveRedEyeIcon />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ], []);



    const handleAddMarketing = () => {
        navigate('/admin/add-market');
    }
    return (
        <Box m="20px">
            <Header
                title="Marketing"
                subtitle="Manage your Marketing here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMarketing}>
                    Add Marketing
                </Button>
            </Box>

            <Box
                height="75vh"
                sx={useMemo(() => ({
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }), [colors])}
            >
                <MarketDataGrid data={CommercialMarket} columns={columns} />
            </Box>

            <Dialog
                fullScreen={fullScreen}
                open={openView}
                onClose={handleCloseView}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Market Details"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* {console.log("viewDast>>>>>>>>>",viewData.MarketingType)} */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {viewData?.MarketingType === 'Residential Marketing' ? (
                                <>
                                    <div style={{ flex: '1' }}>
                                        <p><strong>FillNo:</strong> {viewData?.fillNo}</p>
                                        <p><strong>Marketing Type:</strong> {viewData?.MarketingType}</p>
                                        <p><strong>Consumer Name:</strong> {viewData?.ConsumerName}</p>
                                        <p><strong>Address:</strong> {viewData?.Address}</p>
                                        <p><strong>Cash Amount:</strong> {viewData?.CashAmount}</p>
                                        <p><strong>ConsumerNumber:</strong> {viewData?.ConsumerNumber}</p>
                                        <p><strong>Date:</strong> {viewData?.Date}</p>
                                        <p><strong>Dealer:</strong>{dealer?.name}</p>
                                        <p><strong>DealerPolicy:</strong> {viewData?.DealerPolicy}</p>
                                        <p><strong>InverterSize:</strong> {viewData?.InverterSize}</p>
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <p><strong>PhoneNumber:</strong> {viewData?.PhoneNumber}</p>
                                        <p><strong>City_Village:</strong> {viewData?.City_Village}</p>
                                        <p><strong>District_Location:</strong> {viewData?.District_Location}</p>
                                        <p><strong>Primary Amount:</strong> {viewData?.PrimaryAmount}</p>
                                        <p><strong>Solar Amount:</strong> {viewData?.SolarAmount}</p>
                                        <p><strong>Solar Module Make:</strong> {viewData?.SolarModuleMake}</p>
                                        <p><strong>Solar Module Nos:</strong> {viewData?.SolarModuleNos}</p>
                                        <p><strong>Solar Module Wp:</strong> {viewData?.SolarModuleWp}</p>
                                        <p><strong>System Size Kw:</strong> {viewData?.SystemSizeKw}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ flex: '1' }}>
                                        <p><strong>FillNo:</strong> {viewData?.fillNo}</p>
                                        <p><strong>Consumer Name:</strong> {viewData?.ConsumerName}</p>
                                        <p><strong>Address:</strong> {viewData?.Address}</p>
                                        <p><strong>Amount:</strong> {viewData?.Amount}</p>
                                        <p><strong>Consumer Number:</strong> {viewData?.ConsumerNumber}</p>
                                        <p><strong>Date:</strong> {viewData?.Date}</p>
                                        <p><strong>Dealer:</strong> {dealer?.name}</p>
                                        <p><strong>Dealer Commission:</strong> {viewData?.DealerCommission}</p>
                                        <p><strong>Average Monthly Bill:</strong> {viewData?.AverageMonthlyBill}</p>
                                        <p><strong>Pan Number:</strong> {viewData?.PanNumber}</p>
                                        <p><strong>Tarrif:</strong> {viewData?.Tarrif}</p>
                                        <p><strong>Total Amount:</strong> {viewData?.TotalAmount}</p>
                                        <p><strong>Phase :</strong> {viewData?.Phase}</p>
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <p><strong>Marketing Type:</strong> {viewData?.MarketingType}</p>
                                        <p><strong>Phone Number:</strong> {viewData?.PhoneNumber}</p>
                                        <p><strong>City_Village:</strong> {viewData?.City_Village}</p>
                                        <p><strong>District_Location:</strong> {viewData?.District_Location}</p>
                                        <p><strong>Connection Load:</strong> {viewData?.ConnectionLoad}</p>
                                        <p><strong>Contact Person Name:</strong> {viewData?.ContactPersonName}</p>
                                        <p><strong>GST:</strong> {viewData?.GST}</p>
                                        <p><strong>GSTNumber:</strong> {viewData?.GSTNumber}</p>
                                        <p><strong>Latitude:</strong> {viewData?.Latitude}</p>
                                        <p><strong>Longitude:</strong> {viewData?.Longitude}</p>
                                        <p><strong>MSME_Udyam REGISTRATION:</strong> {viewData?.MSME_UdyamREGISTRATION}</p>
                                        <p><strong>Pincode:</strong> {viewData?.Pincode}</p>
                                    </div>
                                </>
                            )}

                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseView} style={{ color: 'white' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ListMarket;


