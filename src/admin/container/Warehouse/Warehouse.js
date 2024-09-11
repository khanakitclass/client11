// import React, { useEffect, useState, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// // import { useFormik } from 'formik';
// // import * as yup from 'yup';
// import { tokens } from '../../../theme';
// import { deleteWarehouse, getWarehouses } from '../../../redux/slice/warehouses.slice'; // Update with your actual slice paths
// import Header from "../../../components/Header";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import { useNavigate } from 'react-router-dom';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import { Country, State } from 'country-state-city';
// import TestCountry from './TestCountry';

// const WarehouseDataGrid = ({ data, columns }) => {
//     if (!data || !Array.isArray(data)) {
//         return <div>Loading.....</div>
//     }
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
// };

// const Warehouse = () => {
//     const theme = useTheme();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const colors = tokens(theme.palette.mode);
//     const warehouses = useSelector(state => state.warehouses.warehouses);

//     const [openView, setOpenView] = React.useState(false);
//     const [viewData, setViewData] = useState(null);
//     const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//     const [wareHouseDelete, setWareHouseDelete] = useState(null);
//     const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


//     useEffect(() => {
//         dispatch(getWarehouses());
//     }, [dispatch]);

//     const handleClickOpen = () => {
//         navigate('/admin/add-warehouses');
//         // setOpen(true);
//     };
//     const handleClickOpenView = () => {
//         setOpenView(true);
//     };

//     const handleCloseView = () => {
//         setOpenView(false);
//     };
//     const handleView = (data) => {
//         handleClickOpenView();
//         setViewData(data)
//     }
//     // const handleDelete = (id) => {
//     //     dispatch(deleteWarehouse(id));
//     // };

//     const handleDelete = (id) => {
//         setWareHouseDelete(id);
//         setDeleteConfirmOpen(true);
//     };

//     const confirmDelete = () => {
//         if (wareHouseDelete) {
//             dispatch(deleteWarehouse(wareHouseDelete));
//             setDeleteConfirmOpen(false);
//             setWareHouseDelete(null);
//         }
//     }
//     const cancelDelete = () => {
//         setDeleteConfirmOpen(false);
//         setWareHouseDelete(null);
//     }
//     const handleEdit = (data) => {
//         navigate('/admin/add-warehouses', { state: data });
//     };

//     const getCountryName = (countryCode) => {
//         const country = Country.getCountryByCode(countryCode);
//         return country ? country.name : countryCode;
//     };

//     const getStateName = (countryCode, stateCode) => {
//         const state = State.getStateByCodeAndCountry(stateCode, countryCode);
//         return state ? state.name : stateCode;
//     };

//     const columns = useMemo(() => [
//         { field: 'wareHouseName', headerName: 'Name', width: 200 },
//         { field: 'contactPersonName', headerName: 'Contact Person Name', width: 200 },
//         { field: 'city', headerName: 'District', width: 200 },
//         { field: 'contactNumber', headerName: 'Mobile', width: 150 },
//         { field: 'email', headerName: 'Email', width: 200 },
//         {
//             field: 'Action',
//             headerName: 'Action',
//             width: 150,
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


//     return (
//         <Box m="20px">
//             <Header
//                 title="WAREHOUSES"
//                 subtitle="Manage your warehouses here"
//             />
//             <Box display="flex" justifyContent="flex-end" mb={2}>
//                 <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
//                     Add Warehouse
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
//                 <WarehouseDataGrid data={warehouses} columns={columns} />
//             </Box>




//             <TestCountry />

//             <Dialog
//                 fullScreen={fullScreen}
//                 open={openView}
//                 onClose={handleCloseView}
//                 aria-labelledby="responsive-dialog-title"
//                 maxWidth={"sm"}
//                 fullWidth
//             >
//                 <DialogTitle id="responsive-dialog-title" style={{ backgroundColor: theme.palette.background.purple, textAlign: 'center' }}>
//                     {"Warehouse Details"}
//                 </DialogTitle>
//                 <DialogContent style={{ backgroundColor: theme.palette.background.purple }}>
//                     <DialogContentText>
//                         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//                             <div style={{ flex: '1' }}>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Ware House Code : </strong> {viewData?.wareHouseCode}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Ware House Name : </strong> {viewData?.wareHouseName}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Contact Person Name : </strong> {viewData?.contactPersonName}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Contact Number : </strong> {viewData?.contactNumber}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Email : </strong> {viewData?.email}</p>
//                             </div>
//                             <div style={{ flex: '1' }}>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Address : </strong> {viewData?.address}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Pincode : </strong> {viewData?.pincode}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>District : </strong> {viewData?.city}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>State : </strong> {viewData && viewData.country && viewData.state ? getStateName(viewData.country, viewData.state) : viewData?.state}</p>
//                                 <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Country : </strong> {viewData && viewData.country ? getCountryName(viewData.country) : viewData?.country}</p>
//                             </div>
//                         </div>
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions style={{ backgroundColor: theme.palette.background.purple }}>
//                     <Button autoFocus onClick={handleCloseView} style={{ color: theme.palette.text.primary }}>
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
//                 <DialogContent>
//                     Are you sure you want to delete this warehouse?
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
//                     <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
//                 </DialogActions>
//             </Dialog>



//         </Box>
//     );
// };

// export default Warehouse;




import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
import { tokens } from '../../../theme';
import { deleteWarehouse, getWarehouses } from '../../../redux/slice/warehouses.slice'; // Update with your actual slice paths
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Country, State } from 'country-state-city';
import { getRoles } from '../../../redux/slice/roles.slice';
let country_state_district = require('@coffeebeanslabs/country_state_district');


// let country_state_district = require('@coffeebeanslabs/country_state_district');
// console.log("selected state", State, Country, City)
let countries = country_state_district.getAllCountries();
let districts = country_state_district.getDistrictsByStateId();
let states = country_state_district.getAllStates();
// console.log("districts", districts)
// console.log("states", states)



const WarehouseDataGrid = ({ data, columns }) => {
    if (!data || !Array.isArray(data)) {
        return <div>Loading.....</div>
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
            sx={{
                "@media print": {
                    "& .MuiDataGrid-root": {
                        color: "black !important",
                    },
                    "& .MuiDataGrid-cell": {
                        color: "black !important",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        color: "black !important",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        color: "black !important",
                    },
                    "& .css-7ms3qr-MuiTablePagination-displayedRows": {
                        color: "black !important",
                    },
                },
            }}
        />
    );
};

const Warehouse = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const colors = tokens(theme.palette.mode);
    const warehouses = useSelector(state => state.warehouses.warehouses);

    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [wareHouseDelete, setWareHouseDelete] = useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    useEffect(() => {
        dispatch(getWarehouses());
    }, [dispatch]);

    const handleClickOpen = () => {
        navigate('/admin/add-warehouses');
        // setOpen(true);
    };
    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };
    const handleView = (data) => {
        handleClickOpenView();
        setViewData(data)
    }
    // const handleDelete = (id) => {
    //     dispatch(deleteWarehouse(id));
    // };

    const handleDelete = (id) => {
        setWareHouseDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (wareHouseDelete) {
            dispatch(deleteWarehouse(wareHouseDelete));
            setDeleteConfirmOpen(false);
            setWareHouseDelete(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setWareHouseDelete(null);
    }
    const handleEdit = (data) => {
        navigate('/admin/add-warehouses', { state: data });
    };



    const columns = useMemo(() => [
        { field: 'wareHouseCode', headerName: 'Warehouse Code', width: 200 },
        { field: 'wareHouseName', headerName: 'Warehouse Name', width: 200 },
        { field: 'contactPersonName', headerName: 'Contact Person Name', width: 200 },
        { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
        { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
        // {
        //     field: 'country', headerName: 'country', width: 200,
        //     renderCell: (params) => {
        //         return country_state_district.getAllCountries(params.row.country)[0]?.name
        //     }
        // },
        // {
        //     field: 'state', headerName: 'state', width: 200,
        //     renderCell: (params) => {
        //         console.log(params.row.country);
        //         const state = country_state_district.getStatesByCountryId(params.row.country).find((v) => v.id == params.row.state).name
        //         return state


        //     }
        // },
        {
            field: 'district', headerName: 'District', width: 200,
            renderCell: (params) => {
                const district = country_state_district.getDistrictsByStateId(params.row.state).find((v) => v.id == params.row.district).name
                return district

            }
        },
        { field: 'city', headerName: 'City', width: 200 },
        {
            field: 'Action',
            headerName: 'Action',
            width: 150,
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



    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

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
            <Header
                title="WAREHOUSES"
                subtitle="Manage your Warehouses here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Warehouse
                </Button>
            </Box>

            <Box
                height="75vh"
                sx={useMemo(() => ({
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        fontSize: "14px !important",
                        // borderBottom: "none",
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
                        fontSize: "13px !important",
                    },
                    "& .MuiDataGrid-cellContent": {
                        fontSize: "14px !important"
                    },
                    "& .css-6hy2kr-MuiDataGrid-root": {
                        fontSize: "14px !important"
                    },
                    "& .css-1v3msgo-MuiTypography-root-MuiDialogContentText-root": {
                        fontSize: "14px !important"
                    },
                    "& .css-t89xny-MuiDataGrid-columnHeaderTitle": {
                        fontSize: "14px !important"
                    },
                }), [colors])}
            >
                <WarehouseDataGrid data={warehouses} columns={columns} />
            </Box>




            <Dialog
                fullScreen={fullScreen}
                open={openView}
                onClose={handleCloseView}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title" style={{ backgroundColor: theme.palette.background.purple, textAlign: 'center' }}>
                    {"Warehouse Details"}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: theme.palette.background.purple }}>
                    <DialogContentText>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1' }}>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Ware House Code : </strong> {viewData?.wareHouseCode}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Ware House Name : </strong> {viewData?.wareHouseName}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Contact Person Name : </strong> {viewData?.contactPersonName}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Contact Number : </strong> {viewData?.contactNumber}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Email : </strong> {viewData?.email}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Address : </strong> {viewData?.address}</p>
                            </div>
                            <div style={{ flex: '1' }}>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Pincode : </strong> {viewData?.pincode}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>District : </strong> {viewData?.district}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>City : </strong> {viewData?.city}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>State : </strong> {viewData?.state}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Country : </strong> {viewData?.country}</p>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ backgroundColor: theme.palette.background.purple }}>
                    <Button autoFocus onClick={handleCloseView} style={{ color: theme.palette.text.primary }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this warehouse?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Warehouse;
