import React, { useEffect, useState, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../../theme';
import { addCategories, deleteCategories, getCategories, editCategories } from '../../../redux/slice/categories.slice';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { getRoles } from '../../../redux/slice/roles.slice';
import { useNavigate } from 'react-router-dom';

const CategoryDataGrid = memo(({ data, columns }) => {
    if (!data || !Array.isArray(data)) {
        return <div>Loading....</div>
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



const Category = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const categories = useSelector(state => state.categories.categories);
    // console.log(categories, "cate");

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
        setUpdate(null);
    };

    const handleDelete = (id) => {
        setCategoryToDelete(id);
        setDeleteConfirmOpen(true);
    };
    const confirmDelete = () => {
        if (categoryToDelete) {
            dispatch(deleteCategories(categoryToDelete));
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
    };
    const handleEdit = (data) => {
        formik.setValues(data);
        setOpen(true);
        setUpdate(data._id);
    };

    const columns = useMemo(() => [
        { field: 'categoryName', headerName: 'Name', width: 300 },
        {
            field: 'Action',
            headerName: 'Action',
            renderCell: (params) => (
                <>
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

    const categorySchema = yup.object({
        categoryName: yup.string().required("Please enter category name"),
    });

    const formik = useFormik({
        initialValues: {
            categoryName: '',
        },
        validationSchema: categorySchema,
        onSubmit: (values, { resetForm }) => {
            if (update) {
                dispatch(editCategories({
                    _id: update,
                    categoryName: values.categoryName,
                    unit: values.unit
                }));
            } else {
                dispatch(addCategories(values));
            }
            resetForm();
            handleClose();
        }
    });

    const { handleSubmit, handleChange, handleBlur, values, errors, touched } = formik;

    const role = sessionStorage.getItem('role');
    useEffect(() => {
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
            <Header
                title="CATEGORIES"
                subtitle="Manage your Categories here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Category
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {update ? 'Edit Category' : 'Add Category'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ minWidth: 400 }}>
                        <TextField
                            margin="dense"
                            id="categoryName"
                            name="categoryName"
                            label="Enter Category Name"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.categoryName}
                            error={touched.categoryName && Boolean(errors.categoryName)}
                            helperText={touched.categoryName && errors.categoryName}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} style={{ color: theme.palette.text.primary }}>Cancel</Button>
                        <Button type="submit" style={{ color: theme.palette.text.primary }}>{update ? 'Update' : 'Add'}</Button>
                    </DialogActions>
                </form>
            </Dialog>

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
                        fontSize: "14px  !important"
                    },
                    "& .css-6hy2kr-MuiDataGrid-root": {
                        fontSize: "14px  !important"
                    },
                    "& .css-1v3msgo-MuiTypography-root-MuiDialogContentText-root": {
                        fontSize: "14px  !important"
                    },
                    "& .css-t89xny-MuiDataGrid-columnHeaderTitle": {
                        fontSize: "14px !important"
                    },
                }), [colors])}
            >
                <CategoryDataGrid data={categories} columns={columns} />
            </Box>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this category?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Category;