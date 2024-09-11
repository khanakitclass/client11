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
            getRowId={(row) => row?._id}
            autoHeight
        />
    );
});

const ListResidential = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    const ResidentialMarket = useSelector(state => state.resMarketing.Residential.Residential);

    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };


    useEffect(() => {
        dispatch(getRasidentialMarketing());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteRasidentialMarketing(id));
    };

    const navigate = useNavigate();

    const handleEdit = (data) => {
        setOpen(true);
        setUpdate(data);
        navigate('/admin/add-residential', { state: data });
    };

    const handleView = (data) => {
        console.log("viewDataviewDataviewData", data);
        handleClickOpenView();
        setViewData(data)
    }

    const columns = useMemo(() => [
        { field: 'fillNo', headerName: 'File NO', width: 200 },
        {
            field: 'consumerName', headerName: 'Name', width: 200,

        },
        {
            field: 'consumerNumber', headerName: 'Consumer No', width: 200,
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
        navigate('/admin/add-residential');
    }
    return (
        <Box m="20px">
            <Header
                title="Marketing"
                subtitle="Manage your Marketing here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddMarketing}>
                    Add Residential
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
                <MarketDataGrid data={ResidentialMarket} columns={columns} />
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
                    {"Residential Market Details"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1' }}>
                                <p><strong>File NO:</strong> {viewData?.fillNo}</p>
                                <p><strong>Name:</strong> {viewData?.consumerName}</p>
                                <p><strong>Consumer No:</strong> {viewData?.consumerNumber}</p>
                                <p><strong>PhoneNumber:</strong> {viewData?.phoneNumber}</p>
                                <p><strong>Address:</strong> {viewData?.address}</p>
                                <p><strong>City/Village:</strong> {viewData?.city}</p>
                                <p><strong>District/Location:</strong> {viewData?.district}</p>
                                <p><strong>Pincode:</strong> {viewData?.pincode}</p>
                                <p><strong>Latitude:</strong> {viewData?.latitude}</p>
                                <p><strong>Longitude:</strong> {viewData?.longitude}</p>
                            </div>
                            <div style={{ flex: '1' }}>
                                <p><strong>Primary Account:</strong> {viewData?.primaryAccount}</p>
                                <p><strong>Solar Amount:</strong> {viewData?.solarAmount}</p>
                                <p><strong>Date:</strong> {viewData?.date}</p>
                                <p><strong>dealerPolicy:</strong> {viewData?.dealerPolicy}</p>
                                <p><strong>Solar Module Make:</strong> {viewData?.solarModuleMake}</p>
                                <p><strong>Solar Modul Wp:</strong> {viewData?.solarModulWp}</p>
                                <p><strong>Solar Module Nos:</strong> {viewData?.solarModuleNos}</p>
                                <p><strong>Systm Size Kw:</strong> {viewData?.systmSizeKw}</p>
                                <p><strong>Inventry Size:</strong> {viewData?.inventrySize}</p>
                                <p><strong>dealer:</strong> {viewData?.dealer}</p>
                            </div>
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

export default ListResidential;

