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
import DownloadIcon from '@mui/icons-material/Download';
import { getLiasoning } from '../../../redux/slice/liasoning.slice';
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
const MarketDataGrid = memo(({ data, columns }) => {
    if (!data || !Array.isArray(data)) {
        return <div>No Marketing...</div>;
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
const ListMarket = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const [dealer, setDealar] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteMarketing, setDeleteMarketing] = useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const downloadRef = React.useRef(null);
    const CommercialMarket = useSelector(state => state.comMarketing.Marketing);

    const liasoningData = useSelector(state => state.liasoning.Liasoning);

    useEffect(() => {
        dispatch(getLiasoning());
    }, [])

    // console.log("CommercialMarket>>>>>>>>>>>>>",CommercialMarket);
    const DealerRegister = useSelector(state => state.dealer.Dealer);
    const allUsers = useSelector(state => state.users.users);
    useEffect(() => {
        if (allUsers && viewData) {
            const dealerName = allUsers.find(user => user._id === viewData.Dealer);
            setDealar(dealerName);
        }
    }, [allUsers, viewData])

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
        dispatch(getDealers());
    }, [dispatch]);

    const handleDelete = (id) => {
        setDeleteMarketing(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteMarketing) {
            dispatch(deleteCommercialMarketing(deleteMarketing));
            setDeleteConfirmOpen(false);
            setDeleteMarketing(null);
        }
    }

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeleteMarketing(null);
    }

    const navigate = useNavigate();

    const handleEdit = (data) => {
        // console.log("data>>>>>>", data);
        setOpen(true);
        setUpdate(data);
        // navigate('/admin/add-market', { state: data });
        navigate('/admin/add-market', { state: { id: data._id, dealerset: "" } });


    };
    const handleView = (data) => {
        // console.log("viewDataviewDataviewData", data);
        // const dealername = DealerRegister.find((a) => (a._id == data.Dealer))
        // console.log(dealername.ConsumerName);

        // const name = dealername.ConsumerName

        handleClickOpenView();
        setViewData(data)
        console.log(data);
    }

    const columns = useMemo(() => [
        { field: 'fillNo', headerName: 'File No', width: 200 },
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
            field: 'MarketingType', headerName: 'Type', width: 200,
            renderCell: (params) => {
                return params.row.name;
            }
        },
        {
            field: 'ConsumerNumber', headerName: 'Consumer No', width: 200,
        },
        {
            field: 'status', headerName: 'Status', width: 200,
        },
        // {
        //     field: 'Action',
        //     headerName: 'Action',
        //     width: 200,
        //     renderCell: (params) => (
        //         <>
        //             <IconButton aria-label="edit" onClick={() => handleView(params.row)}>
        //                 <RemoveRedEyeIcon />
        //             </IconButton>
        //             <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
        //                 <EditIcon />
        //             </IconButton>
        //             <IconButton aria-label="delete" onClick={() => handleDelete(params.row._id)}>
        //                 <DeleteIcon />
        //             </IconButton>
        //         </>
        //     )
        // }
        {
            field: 'Action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                const liasoningItem = liasoningData.find(item => item.fillNo === params.row.fillNo); // Check if the fillNo matches
                const isDisabled = liasoningItem && liasoningItem.status === "Enabled"; // Check if the status is Disabled
                return (
                    <>
                        <IconButton aria-label="view" onClick={() => handleView(params.row)} disabled={isDisabled}>
                            <RemoveRedEyeIcon />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => handleEdit(params.row)} disabled={isDisabled}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDelete(params.row._id)} disabled={isDisabled}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            }
        },
    ], [liasoningData]);
    const [openViewImage, setOpenViewImage] = React.useState(false);
    const [viewImage, setViewImage] = useState(null);

    const [values, setValues] = useState({}); // Define values state
    const [dealarData, setDealarData] = useState({}); // Define dealarData state

    const handleViewImage = (imageType) => {
        let imageUrl;
        const baseUrl = 'http://localhost:4000/';

        if (imageType === 'adharCard') {
            imageUrl = `${baseUrl}${viewData?.adharCard}`;
        } else if (imageType === 'lightBill') {
            imageUrl = `${baseUrl}${viewData?.lightBill}`;
        } else if (imageType === 'veraBill') {
            imageUrl = `${baseUrl}${viewData?.veraBill}`;
        }

        setViewImage(imageUrl);
        setOpenViewImage(true);
    }
    // const handleCloseView = () => {
    //     setOpenView(false);
    // };
    // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleCloseViewImage = () => {
        setOpenViewImage(false);
    };
    const handleDownload = async () => {
        console.log(viewImage);

        if (viewImage) {
            try {
                let imageUrl;
                // Use viewData._id or another relevant property instead of id
                if (viewData && viewData._id) { // Ensure viewData and _id exist
                    console.log(viewImage);
                    if (viewImage.includes("4000")) {
                        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(viewImage)}`;
                        imageUrl = proxyUrl;
                    } else {
                        imageUrl = viewImage;
                    }
                } else {
                    imageUrl = viewImage; // Fallback to viewImage if no id
                }

                const response = await fetch(imageUrl);

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
    const handleAddMarketing = () => {
        navigate('/admin/add-market');
    }
    return (
        <Box m="20px">
            <Header
                title="MARKETING"
                subtitle="Manage Your Marketing Here"
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
                        // borderBottom: "none",
                        fontSize: "14px !important"
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
                        fontSize: "13px !important"
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
                <DialogTitle id="responsive-dialog-title" style={{ backgroundColor: theme.palette.background.purple, textAlign: 'center' }}>
                    {viewData?.MarketingType === 'Residential Marketing'
                        ? "Residential Market Details"
                        : "Commercial Market Details"}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: theme.palette.background.purple }}>
                    <DialogContentText>
                        {/* {console.log("viewDast>>>>>>>>>", viewData)} */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {viewData?.MarketingType === 'Residential Marketing' ? (
                                <>
                                    <div style={{ flex: '1' }}>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Fill No:</strong> {viewData?.fillNo}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Marketing Type:</strong> {viewData?.MarketingType}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Consumer Name:</strong> {viewData?.ConsumerName}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Address:</strong> {viewData?.Address}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Cash Amount:</strong> {viewData?.CashAmount}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Consumer Number:</strong> {viewData?.ConsumerNumber}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Date:</strong> {viewData?.Date}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Dealer:</strong> {DealerRegister.find(dealer => dealer._id === viewData?.Dealer)?.ConsumerName}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Dealer Policy:</strong> {viewData?.DealerPolicy}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Inverter Size:</strong> {viewData?.InverterSize}</p>

                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Phone Number:</strong> {viewData?.PhoneNumber}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>City Village:</strong> {viewData?.City_Village}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>District Location:</strong> {viewData?.District_Location}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Primary Amount:</strong> {viewData?.PrimaryAmount}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Solar Amount:</strong> {viewData?.SolarAmount}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Solar Module Make:</strong> {viewData?.SolarModuleMake}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Solar Module Nos:</strong> {viewData?.SolarModuleNos}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Solar Module Wp:</strong> {viewData?.SolarModuleWp}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>System Size Kw:</strong> {viewData?.SystemSizeKw}</p>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ flex: '1' }}>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Fill No:</strong> {viewData?.fillNo}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Consumer Name:</strong> {viewData?.ConsumerName}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Address:</strong> {viewData?.Address}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Amount:</strong> {viewData?.Amount}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Consumer Number:</strong> {viewData?.ConsumerNumber}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Date:</strong> {viewData?.Date}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Dealer:</strong> {DealerRegister.find(dealer => dealer._id === viewData?.Dealer)?.ConsumerName}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Dealer Commission:</strong> {viewData?.DealerCommission}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Average Monthly Bill:</strong> {viewData?.AverageMonthlyBill}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Pan Number:</strong> {viewData?.PanNumber}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Tarrif:</strong> {viewData?.Tarrif}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Total Amount:</strong> {viewData?.TotalAmount}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Phase :</strong> {viewData?.Phase}</p>
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Marketing Type:</strong> {viewData?.MarketingType}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Phone Number:</strong> {viewData?.PhoneNumber}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>City Village:</strong> {viewData?.City_Village}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>District Location:</strong> {viewData?.District_Location}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Connection Load:</strong> {viewData?.ConnectionLoad}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Contact Person Name:</strong> {viewData?.ContactPersonName}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>GST :</strong> {viewData?.GST}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>GST Number:</strong> {viewData?.GSTNumber}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Latitude:</strong> {viewData?.Latitude}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Longitude:</strong> {viewData?.Longitude}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>MSME/Udyam REGISTRATION:</strong> {viewData?.MSME_UdyamREGISTRATION}</p>
                                        <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Pincode:</strong> {viewData?.Pincode}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* BRIJESH START */}
                        <div>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>AdharCard : </strong> <img
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '20px' }}
                                src={`http://localhost:4000/${viewData?.adharCard}`}
                                alt="AdharCard"
                            />
                                <IconButton aria-label="view" onClick={() => handleViewImage('adharCard')}>
                                    <RemoveRedEyeIcon />
                                </IconButton>
                            </p>

                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>LightBill : </strong> <img
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '20px' }}
                                src={`http://localhost:4000/${viewData?.lightBill}`}
                                alt="LightBill"
                            />
                                <IconButton aria-label="view" onClick={() => handleViewImage('lightBill')}>
                                    <RemoveRedEyeIcon />
                                </IconButton>
                            </p>
                            <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Vera Bill:</strong><img
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '20px' }}
                                src={`http://localhost:4000/${viewData?.veraBill}`}
                                alt="veraBill"
                            />
                                <IconButton aria-label="view" onClick={() => handleViewImage('veraBill')}>
                                    <RemoveRedEyeIcon />
                                </IconButton>
                            </p>
                        </div>
                        {/* BRIJESH END*/}

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
                    Are you sure you want to delete this Marketing?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                // fullScreen={fullScreen}
                open={openViewImage}
                onClose={handleCloseViewImage}
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
                {/* <DialogContent style={{ backgroundColor: theme.palette.background.purple, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            {viewImage ? (
                                <div  style={{ maxWidth: '100%', maxHeight: '80vh' }} >
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
                        </DialogContent> */}
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
                    <Button autoFocus onClick={handleCloseViewImage} style={{ color: theme.palette.text.primary }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListMarket;

