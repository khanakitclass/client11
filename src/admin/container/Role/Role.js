import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../../theme';
import { addRole, deleteRole, getRoles, editRole } from '../../../redux/slice/roles.slice'; // Update with your actual slice paths
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getsidebar } from '../../../redux/slice/SidebarName.slice';
import { useNavigate } from 'react-router-dom';

const RoleDataGrid = ({ data, columns }) => {
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

const Role = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteRoleData, setDeleteRoleData] = useState(null);

    const roles = useSelector(state => state.roles.roles);
    // console.log(roles);

    useEffect(() => {
        dispatch(getRoles());
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
            dispatch(deleteRole(deleteRoleData));
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

    const columns = useMemo(() => [
        { field: 'roleName', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 200 },
        {
            field: 'permissions',
            headerName: 'Permissions',
            width: 600,
            renderCell: (params) => (
                <>
                    {params.row.permissions.join(' , ')}
                </>
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

    const roleSchema = yup.object({
        roleName: yup.string().required("Please enter role name"),
        description: yup.string().required("Please enter role description"),
        permissions: yup.array().of(yup.string()),
    });

    const formik = useFormik({
        initialValues: {
            roleName: '',
            description: '',
            permissions: []
        },
        validationSchema: roleSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            if (update) {
                dispatch(editRole({
                    _id: update,
                    roleName: values.roleName,
                    description: values.description,
                    permissions: values.permissions
                }));
            } else {
                console.log(values);
                dispatch(addRole(values));
            }
            resetForm();
            handleClose();
        }
    });

    const { handleSubmit, handleChange, handleBlur, values, errors, touched } = formik;


    const SideBar = useSelector((state) => state.sidebar.sidebar);

    useEffect(() => {
        dispatch(getsidebar());
    }, [dispatch]);

    const navigate = useNavigate()

    const role = sessionStorage.getItem('role');
    React.useEffect(() => {
        dispatch(getRoles())
    }, []);

    const rolll = roles?.find((v) => v._id == role)
    const hasPermission = (requiredPermission) => {
        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    const canAccessPage = hasPermission("Users");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }

    return (
        <Box m="20px">
            <Header
                title="ROLES"
                subtitle="Manage Your Roles Here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Role
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{update ? 'Edit Role' : 'Add Role'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="roleName"
                            name="roleName"
                            label="Enter Role Name"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.roleName}
                            error={touched.roleName && Boolean(errors.roleName)}
                            helperText={touched.roleName && errors.roleName}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            name="description"
                            label="Enter Role Description"
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
                        />
                        {/* Dynamic permissions */}
                        {SideBar.filter(permission => !['Dashboard', 'Log Out'].includes(permission.categoryName)).map((permission) => (
                            <FormControlLabel
                                key={permission._id}
                                control={
                                    <Checkbox
                                        checked={values.permissions.includes(permission.categoryName)}
                                        onChange={(e) => {
                                            let newPermissions = values.permissions.filter(p => p !== 'Dashboard' && p !== 'Log Out');
                                            if (e.target.checked) {
                                                newPermissions.push(permission.categoryName);
                                            } else {
                                                newPermissions = newPermissions.filter(p => p !== permission.categoryName);
                                            }
                                            // Add 'Dashboard' at the beginning and 'Log Out' at the end
                                            newPermissions = ['Dashboard', ...new Set(newPermissions), 'Log Out'];
                                            formik.setFieldValue('permissions', newPermissions);
                                        }}
                                        name="permissions"
                                        value={permission.categoryName}
                                    />
                                }
                                label={permission.categoryName}
                            />
                        ))}
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
                <RoleDataGrid data={roles} columns={columns} />
            </Box>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this role?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Role;
