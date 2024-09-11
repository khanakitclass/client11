import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import { deleteVendor, getVendors } from '../../../redux/slice/vendors.slice'; // Update with your actual slice paths
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Country, State, City } from 'country-state-city';
import { getRoles } from '../../../redux/slice/roles.slice';

const VendorDataGrid = ({ data, columns }) => {
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

const Vendor = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteVendorData, setDeleteVendorData] = useState(null);

    const vendors = useSelector(state => state.vendors.vendors); // Update to match your actual slice name

    useEffect(() => {
        dispatch(getVendors());
    }, [dispatch]);

    const handleDelete = (id) => {
        setDeleteVendorData(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteVendorData) {
            dispatch(deleteVendor(deleteVendorData));
            setDeleteConfirmOpen(false);
            setDeleteVendorData(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeleteVendorData(null);
    }
    const handleEdit = (data) => {
        navigate('/admin/add-vendor', { state: data });
    };

    const handleAddVendor = () => {
        navigate('/admin/add-vendor')
    }
    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };
    const handleView = (data) => {
        handleClickOpenView();
        // console.log("data>>>>>>>>", data);
        const countryName = Country.getCountryByCode(data.country)?.name || data.country;
        const stateName = State.getStateByCodeAndCountry(data.state, data.country)?.name || data.state;

        setViewData({
            ...data,
            country: countryName,
            state: stateName
        })
    }

    const columns = useMemo(() => [
        { field: 'businessName', headerName: 'Business Name', width: 150 },
        { field: 'vendorType', headerName: 'Vendor Type', width: 150 },
        {
            field: 'contactPersonName', headerName: 'Contact Person Name', width: 200,
            renderCell: (params) => {
                // console.log(params.row.contactPersonalDetails[0].contactPersonName)
                return params.row.contactPersonalDetails[0]?.contactPersonName;
            }
        },
        {
            field: 'contactNumber', headerName: 'Contact Number', width: 200,
            renderCell: (params) => {
                // console.log(params.row.contactPersonalDetails[0].contactNumber)
                return params.row.contactPersonalDetails[0]?.contactNumber;
            }
        },
        {
            field: 'designation', headerName: 'Designation', width: 150,
            renderCell: (params) => {
                // console.log(params.row.contactPersonalDetails[0].designation)
                return params.row.contactPersonalDetails[0]?.designation;
            }
        },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'registrationType', headerName: 'Registration Type', width: 150 },
        { field: 'gstNumber', headerName: 'Gst Number', width: 150 },
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

    const canAccessPage = hasPermission("Vendors");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }


    return (
        <Box m="20px">
            <Header
                title="VENDORS"
                subtitle="Manage your Vendors here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddVendor}>
                    Add Vendor
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
                <VendorDataGrid data={vendors} columns={columns} />
            </Box>
            <Dialog
                fullScreen={fullScreen}
                open={openView}
                onClose={handleCloseView}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title" style={{ backgroundColor: theme.palette.background.purple, textAlign: "center", fontWeight: 'bold', fontSize: '18px' }}>
                    {"Vendor Details"}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: theme.palette.background.purple }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1' }}>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Business Name:</strong> {viewData?.businessName}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Company Email:</strong> {viewData?.companyEmailId}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Registration Type:</strong> {viewData?.registrationType}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>GST Number:</strong> {viewData?.gstNumber}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>PAN Number:</strong> {viewData?.panNumber}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Udyam Registration:</strong> {viewData?.UdyamRegistration}</p>
                        </div>
                        <div style={{ flex: '1' }}>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Office Address:</strong> {viewData?.officeAddress}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>City:</strong> {viewData?.city}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>District:</strong> {viewData?.district}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>State:</strong> {viewData?.state}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Country:</strong> {viewData?.country}</p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Pincode:</strong> {viewData?.pincode}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1' }}>
                            <h3>Contact Persons:</h3>
                            {viewData?.contactPersonalDetails?.map((contact, index) => (
                                <div key={index}>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Name:</strong> {contact.contactPersonName}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Designation:</strong> {contact.designation}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Department:</strong> {contact.department}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Contact Number:</strong> {contact.contactNumber}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Email:</strong> {contact.emailId}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ flex: '1' }}>
                            <h3>Bank Details:</h3>
                            {viewData?.bankDetails?.map((bank, index) => (
                                <div key={index}>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Bank Name:</strong> {bank.bankName}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Branch Name:</strong> {bank.branchName}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Account Number:</strong> {bank.accountNumber}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Account Type:</strong> {bank.accountType}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>IFSC Code:</strong> {bank.IFSCCode}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>

                <DialogActions style={{ backgroundColor: theme.palette.background.purple }}>
                    <Button autoFocus onClick={handleCloseView} style={{ color: theme.palette.text.primary }} >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this vendor?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Vendor;
