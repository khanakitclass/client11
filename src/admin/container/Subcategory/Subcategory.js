import React, { useEffect, useState, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../../theme';
import { addCategories, deleteCategories, getCategories, editCategories } from '../../../redux/slice/categories.slice';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { addSubcategories, deleteSubcategories, editSubcategories, getSubcategories } from '../../../redux/slice/subcategories.slice';
import { getRoles } from '../../../redux/slice/roles.slice';
import { useNavigate } from 'react-router-dom';

const SubcategoryDataGrid = memo(({ data, columns }) => {

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
    )
});

const Subcategory = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [subCategory, setSubCategory] = useState(null);

    const categories = useSelector(state => state.categories.categories);
    // console.log(categories);
    const subcategories = useSelector(state => state.subcategories.subcategories);

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getSubcategories());
    }, [dispatch]);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
        setUpdate(null);
    };

    const handleDelete = (id) => {
        setDeleteConfirmOpen(true);
        setSubCategory(id);
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setSubCategory(null);
    }

    const confirmDelete = () => {
        if (subCategory) {
            dispatch(deleteSubcategories(subCategory));
            setSubCategory(null);
            setDeleteConfirmOpen(false);
        }
    }

    const handleEdit = (data) => {
        formik.setValues(data);
        setOpen(true);
        setUpdate(data._id);
    };

    const columns = useMemo(() => [
        { field: 'subCategoryName', headerName: 'Name', width: 200 },
        {
            field: 'categoryName', headerName: 'Category', width: 200,
            renderCell: (params) => {
                // console.log(params.row);
                const category = categories?.find((v) => v._id === params.row.categoryName);
                // console.log(category);
                return category ? category.categoryName : '';
            }
        },
        { field: 'unit', headerName: 'Unit', width: 200 },
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
    ], [categories]);

    const subCategorySchema = yup.object({
        categoryName: yup.string().required("Please select category"),
        subCategoryName: yup.string().required("Please enter subcategory name"),
        unit: yup.string().required("Please enter category unit")
    });

    const formik = useFormik({
        initialValues: {
            categoryName: '',
            subCategoryName: '',
            unit: ''
        },
        validationSchema: subCategorySchema,
        onSubmit: (values, { resetForm }) => {
            if (update) {
                dispatch(editSubcategories({
                    _id: update,
                    categoryName: values.categoryName,
                    subCategoryName: values.subCategoryName,
                    unit: values.unit
                }));
            } else {
                dispatch(addSubcategories(values));
            }
            resetForm();
            handleClose();
        }
    });

    const { handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue } = formik;

    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

    const roles = useSelector(state => state.roles.roles);
    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };
    const navigate = useNavigate()

    const canAccessPage = hasPermission("Products");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }

    return (
        <Box m="20px">
            <Header title="SUBCATEGORIES" subtitle="Manage your Subcategories here" />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Subcategory
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{update ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <FormControl variant="filled" sx={{ m: 1, minWidth: 400 }}>
                            <InputLabel>Select Category</InputLabel>
                            <Select
                                name="categoryName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.categoryName}
                                fullWidth
                                variant="filled"
                                InputLabelProps={{
                                    style: {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            >
                                {categories?.map((v) => (
                                    <MenuItem key={v._id} value={v._id}>{v.categoryName}</MenuItem>
                                ))}
                            </Select>
                            {touched.categoryName && errors.categoryName && (
                                <span style={{
                                    color: "#f44336", fontFamily: "Source Sans Pro, sans-serif",
                                    fontWeight: "400", margin: "0 14px", fontSize: "0.6428571428571428rem",
                                }}>{errors.categoryName}</span>
                            )}

                            <TextField
                                margin="dense"
                                id="subCategoryName"
                                name="subCategoryName"
                                label="Enter Subcategory Name"
                                type="text"
                                fullWidth
                                variant="filled"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.subCategoryName}
                                error={touched.subCategoryName && Boolean(errors.subCategoryName)}
                                helperText={touched.subCategoryName && errors.subCategoryName}
                                InputLabelProps={{
                                    style: {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            />
                            <TextField
                                margin="dense"
                                id="unit"
                                name="unit"
                                label="Enter Category Unit"
                                type="text"
                                fullWidth
                                variant="filled"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.unit}
                                error={touched.unit && Boolean(errors.unit)}
                                helperText={touched.unit && errors.unit}
                                InputLabelProps={{
                                    style: {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            />
                        </FormControl>
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
                <SubcategoryDataGrid data={subcategories} columns={columns} />
            </Box>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this SubCategory?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Subcategory;
