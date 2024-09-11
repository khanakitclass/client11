import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel, FormControl } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../../theme';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { addTerms, deleteTerms, editTerms, getTerms } from '../../../redux/slice/Terms.slice';
import { useNavigate } from 'react-router-dom';
import { getRoles } from '../../../redux/slice/roles.slice';

const TermsDataGrid = ({ data, columns }) => {
    if (!data || !Array.isArray(data)) {
        return <div>No data availble...</div>;
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
            checkboxSelection
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

const Addterms = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteRoleData, setDeleteRoleData] = useState(null);

    const terms = useSelector(state => state.Terms.Terms);
    console.log(terms);

    useEffect(() => {
        dispatch(getTerms());
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
        setDeleteRoleData(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteRoleData) {
            dispatch(deleteTerms(deleteRoleData));
            setDeleteConfirmOpen(false);
            setDeleteRoleData(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeleteRoleData(null);
    }

    const handleEdit = (data) => {
        formik.setValues(data);
        setOpen(true);
        setUpdate(data._id);
    };

    // const columns = useMemo(() => [
    //     { field: 'name', headerName: 'Name', width: 200 },
    //     { 
    //         field: 'description', 
    //         headerName: 'Description', 
    //         width: 800,
    //         renderCell: (params) => (
    //             <div style={{ whiteSpace: 'normal', wordWrap: 'break-word',padding:'10px', overflowWrap: 'break-word', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //                 {params.value}
    //             </div>
    //         )
    //     },
    //     {
    //         field: 'Action',
    //         headerName: 'Action',
    //         renderCell: (params) => (
    //             <>
    //                 <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
    //                     <EditIcon />
    //                 </IconButton>
    //                 <IconButton aria-label="delete" onClick={() => handleDelete(params.row._id)}>
    //                     <DeleteIcon />
    //                 </IconButton>
    //             </>
    //         )
    //     }
    // ], []);
    const columns = useMemo(() => [
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'description',
            headerName: 'Description',
            width: 800,
            renderCell: (params) => (
                <div style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxHeight: '100px',
                    overflow: 'auto', // Change to 'auto' to allow scrolling if needed
                    textOverflow: 'ellipsis'
                }}>
                    {params.value}
                </div>
            )
        },
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

    const termsSchema = yup.object({
        name: yup.string().required("Please enter name"),
        description: yup.string().required("Please enter description"),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: termsSchema,
        onSubmit: (values, { resetForm }) => {
            if (update) {
                dispatch(editTerms({
                    _id: update,
                    name: values.name,
                    description: values.description,
                }));
            } else {
                console.log(values);
                dispatch(addTerms(values));
            }
            resetForm();
            handleClose();
        }
    });

    const { handleSubmit, handleChange, handleBlur, values, errors, touched } = formik;


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

    const canAccessPage = hasPermission("Terms & Conditions");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }


    return (
        <Box m="20px">
            <Header
                title="TERMS & CONDITIONS"
                subtitle="Manage Your Terms & Condition Here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Terms & Condition

                </Button>
            </Box>

            <Dialog open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                sx={{ '& .MuiDialog-paper': { width: '600px', height: '400px' } }} // Custom width and height
            >
                <DialogTitle>{update ? 'Edit Terms & Condition' : 'Add Terms & Condition'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label="Enter Terms Name"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />

                        <FormControl variant="filled" sx={{ gridColumn: 'span 1', marginTop: '20px', width: '100%' }}>
                            <TextField
                                id="description"
                                fullWidth
                                multiline
                                rows={6}
                                variant="filled"
                                name="description"
                                label="Enter Description"
                                type="text"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                InputLabelProps={{
                                    style: {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            />
                        </FormControl>
                        {/* <TextField
                            margin="dense"
                            id="description"
                            name="description"
                            label="Enter Description"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        /> */}

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
                <TermsDataGrid data={terms} columns={columns} />
            </Box>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this Terms & Condition?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Addterms;
