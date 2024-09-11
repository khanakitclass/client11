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
import { getRoles } from '../../../redux/slice/roles.slice';

const ProductDataGrid = memo(({ data, columns }) => {
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

const ListProducts = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [openView, setOpenView] = React.useState(false);
    const [viewData, setViewData] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [productDelete, setProductDelete] = useState(null);

    const navigate = useNavigate();
    const products = useSelector(state => state.products.products.products);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };


    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        setDeleteConfirmOpen(true);
        setProductDelete(id);
    };
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setProductDelete(null);
    }

    const confirmDelete = () => {
        if (productDelete) {
            dispatch(deleteProduct(productDelete));
            setProductDelete(null);
            setDeleteConfirmOpen(false);
        }
    }

    const handleEdit = (data) => {
        // console.log("data>>>>>>",data);
        setOpen(true);
        setUpdate(data);
        navigate('/admin/add-product', { state: data });
    };

    const handleView = (data) => {
        handleClickOpenView();
        setViewData(data)
    }

    const columns = useMemo(() => [
        { field: 'productName', headerName: 'Product Name', width: 150 },
        {
            field: 'mainCategory', headerName: 'Category', width: 150,
            renderCell: (params) => {
                return params.row?.category_id?.name;
            }
        },
        {
            field: 'subCategory', headerName: 'Subcategory', width: 150,
            renderCell: (params) => {
                return params.row?.subcategory_id?.name
            }
        },
        { field: 'make', headerName: 'Make', width: 150 },
        { field: 'specifiaction', headerName: 'Specifiaction', width: 150 },
        { field: 'Size', headerName: 'Size', width: 150 },
        { field: 'Color', headerName: 'Color', width: 150 },
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

    const handleAddProduct = () => {
        navigate('/admin/add-product');
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

    const canAccessPage = hasPermission("Products");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }


    return (
        <Box m="20px">
            <Header
                title="PRODUCTS"
                subtitle="Manage your Products here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddProduct}>
                    Add Product
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
                <ProductDataGrid data={products} columns={columns} />
            </Box>

            <Dialog
                fullScreen={fullScreen}
                open={openView}
                onClose={handleCloseView}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title" style={{ backgroundColor: theme.palette.background.purple, textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    {"Product Details"}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: theme.palette.background.purple, fontSize: '20px' }}>

                    <DialogContentText component="div"  >
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1' }}>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }} ><strong>Category: </strong> {viewData?.mainCategory}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Subcategory: </strong> {viewData?.subCategory}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Name: </strong> {viewData?.productName}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Measurement: </strong> {viewData?.unitOfMeasurement}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>For: </strong> {viewData?.productFor}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Make: </strong> {viewData?.make}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Size: </strong> {viewData?.Size}</p>
                            </div>
                            <div style={{ flex: '1' }}>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Specification: </strong> {viewData?.specifiaction}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Color: </strong> {viewData?.Color}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Description: </strong> {viewData?.Desacription}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>HSN Code: </strong> {viewData?.HSNcode}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Tax: </strong> {viewData?.taxdetails}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Warranty Expiry: </strong> {viewData?.Warrentry}</p>
                                <p style={{ backgroundColor: theme.palette.background.light, marginBottom: '2px', padding: '10px' }}><strong>Active Status: </strong> {viewData?.isActive ? 'Yes' : 'No'}</p>
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
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this product?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListProducts;

