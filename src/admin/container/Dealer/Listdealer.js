import React, { useEffect, useState, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


import useMediaQuery from '@mui/material/useMediaQuery';
import { } from '../../../redux/slice/Commercialmarketing.slice';
import { deleteRasidentialMarketing, getRasidentialMarketing } from '../../../redux/slice/Residentialmarketing.slice';
import { deleteDealer, getDealers } from '../../../redux/slice/dealer.slice';
import { getRoles } from '../../../redux/slice/roles.slice';

const Dealer = memo(({ data, columns }) => {
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
});

const ListDealer = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const imgUrl = 'https://solar-backend-teal.vercel.app';


    const DealerRegister = useSelector(state => state.dealer.Dealer);

    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };


    useEffect(() => {
        dispatch(getDealers());
    }, []);

    const handleDelete = (id) => {
        dispatch(deleteDealer(id));
    };

    const navigate = useNavigate();

    const handleEdit = (data) => {
        setOpen(true);
        setUpdate(data);
        navigate('/admin/add-dealer', { state: data });
    };

    const handleView = (data) => {
        handleClickOpenView();
        setViewData(data)
    }

    const columns = useMemo(() => [
        {
            field: 'adharCard',
            headerName: 'AdharCard',
            width: 150,
            renderCell: (params) => (
                <img style={{ width: '50px', height: '50px', objectFit: 'cover', objectPosition: 'center center' }} src={`${imgUrl}/${params.row.adharCard}`} alt="avatar" />
            )
        },
        { field: 'ConsumerName', headerName: 'Name', width: 200 },
        {
            field: 'PhoneNumber', headerName: 'Contact No', width: 200,

        },
        {
            field: 'amount', headerName: 'Amount', width: 200,
        },
        {
            field: 'status', headerName: 'Status', width: 200,
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
        navigate('/admin/add-dealer');
    }

    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

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
            <Header
                title="DEALER"
                subtitle="Manage your Dealer here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMarketing}>
                    Add Delear
                </Button>
            </Box>

            <Box
                height="75vh"
                sx={useMemo(() => ({
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        fontSize: "14px  !important",
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
                <Dealer data={DealerRegister} columns={columns} />
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
                    {"Dealer Details"}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: theme.palette.background.purple }}>
                    <DialogContentText>
                        <div style={{ flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1' }}>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Dealer Name : </strong> {viewData?.ConsumerName}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Mobile No : </strong> {viewData?.PhoneNumber}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Marketing Type : </strong> {viewData?.MarketingType}</p>
                                </div>
                                <div style={{ flex: '1' }}>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Location : </strong> {viewData?.Location}</p>
                                    <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>amount : </strong> {viewData?.amount}</p>
                                </div>
                            </div>
                            <div>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>AdharCard : </strong> <img
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '20px' }}
                                    src={`${imgUrl}/${viewData?.adharCard}`}
                                    alt="AdharCard"
                                /></p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>LightBill : </strong> <img
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '20px' }}
                                    src={`${imgUrl}/${viewData?.lightBill}`}
                                    alt="LightBill"
                                /></p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Vera Bill:</strong><img
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '20px' }}
                                    src={`${imgUrl}/${viewData?.veraBill}`}
                                    alt="veraBill"
                                />
                                </p>
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

        </Box >
    );
};

export default ListDealer;

