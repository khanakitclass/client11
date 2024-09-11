import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, useMediaQuery } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../../theme';
import { addUser, deleteUser, getUsers, editUser, currentUser } from '../../../redux/slice/users.slice';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getRoles } from '../../../redux/slice/roles.slice';
import html2canvas from 'html2canvas';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { Navigate, useNavigate } from 'react-router-dom';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';


const UserDataGrid = ({ data, columns }) => {
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
            getRowId={(row) => row?._id}
            autoHeight
        />
    );
};

const User = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const imgUrl ='https://server11-omega.vercel.app'; // Accessing the environment variable
    console.log(process.env)

    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteUserData, setDeleteUserData] = useState(null);
    const role = sessionStorage.getItem('role');

    useEffect(() => {
        dispatch(getRoles())
    }, []);

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getRoles())
    }, [dispatch]);

    const users = useSelector(state => state.users.users);
    const roles = useSelector(state => state.roles.roles);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
        setUpdate(null);
    };

    const handleDelete = (id) => {
        setDeleteUserData(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteUserData) {
            dispatch(deleteUser(deleteUserData));
            setDeleteConfirmOpen(false);
            setDeleteUserData(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeleteUserData(null);
    }

    const handleEdit = (data) => {
        console.log("handleEdithandleEdit", data);
        formik.setValues(data);
        setOpen(true);
        setUpdate(data._id);

    };

    const columns = useMemo(() => [
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 150,
            renderCell: (params) => (
                <img style={{ width: '50px', height: '50px', objectFit: 'cover', objectPosition: 'center center' }} src={`${imgUrl}/${params.row.avatar}`} alt="avatar" />
            )
        },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'contact', headerName: 'Mobile No', width: 150 },
        { field: 'address', headerName: 'Address', width: 200 },
        {
            field: 'role', headerName: 'Role', width: 150,
            renderCell: (params) => {
                // console.log(params.row.role, roles);
                const result = roles?.find((v) => v._id == params.row.role);
                return result ? result.roleName : '';
            }
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
    ], [roles]);

    const userSchema = yup.object({
        name: yup.string().required("Please enter user name"),
        email: yup.string().email("Enter a valid email").required("Please enter user email"),
        contact: yup.string().required("Please enter user mobile number"),
        address: yup.string().required("Please enter user address"),
        password: yup.string().required("Please enter a password"),
        role: yup.string().required("Please select a role"),
        avatar: yup.mixed()
            .required("Please select an image")
            .test("fileSize", "The file is too large", (value) => {
                if (value && value.size) {
                    return value.size <= 2 * 1024 * 1024; // 2MB
                }
                return true;
            })
            .test("fileType", "Unsupported File Format", (value) => {
                if (value && value.type) {
                    return ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(value.type);
                }
                return true;
            }),
    });


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            contact: '',
            address: '',
            password: '',
            role: '',
            avatar: ''
        },
        validationSchema: userSchema,

        onSubmit: (values, { resetForm }) => {
            if (update) {
                console.log(values);
                dispatch(editUser({
                    _id: update,
                    name: values.name,
                    email: values.email,
                    contact: values.contact,
                    address: values.address,
                    // password: values.password,
                    role: values.role,
                    avatar: values.avatar
                }));
                dispatch(currentUser())
            } else {
                dispatch(addUser(values));
            }
            resetForm();
            handleClose();
        }
    });

    const { handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue } = formik;

    const [openView, setOpenView] = React.useState(false);
    const [viewImage, setViewImage] = useState(null);
    const downloadRef = React.useRef(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleView = (imageType) => {
        let imageUrl;
        const baseUrl ={imgUrl};

        if (imageType === 'avatar') {
            imageUrl = values.avatar instanceof File ? URL.createObjectURL(values.avatar) :
                (values.avatar ? `${baseUrl}${values.avatar}` : '');
        }

        console.log("Image URL in handleView:", imageUrl);
        setViewImage(imageUrl);
        setOpenView(true);
    }

    const handleCloseView = () => {
        setOpenView(false);
    };

    const handleDownload = async () => {
        if (viewImage) {
            try {
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(viewImage)}`;
                const response = await fetch(proxyUrl);

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
    console.log("role", role, roles)
    const rolll = roles?.find((v) => v._id == role)
    console.log("rolll", rolll)
    const hasPermission = (requiredPermission) => {

        return rolll ? rolll.permissions.includes(requiredPermission) : false;
    };

    // Example usage for a specific page
    const canAccessPage = hasPermission("Users"); // Check if the user can access the Marketing page
    console.log("canAccessPage", canAccessPage)
    const navigate = useNavigate();
    if (!canAccessPage) {
        // Redirect or show an error message
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if (role !== '66c808446c54d2c10e16d367') {
    //         navigate('/admin/dashboard');
    //     }
    // }, [role])

    // const navigate = useNavigate();
    // useEffect(() => {
    //     const allowedRoles = ['Super Admin', 'Dealer', 'hr', 'Dealar1', 'Electric11'];
    //     if (!allowedRoles.includes(role)) {
    //         navigate('/admin/dashboard');
    //     }
    // }, [role])
    return (
        <Box m="20px">
            <Header
                title="USERS"
                subtitle="Manage Your Users Here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add User
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{update ? 'Edit User' : 'Add User'}</DialogTitle>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label="Enter User Namess"
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
                        <TextField
                            margin="dense"
                            id="email"
                            name="email"
                            label="Enter User Email"
                            type="email"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="contact"
                            name="contact"
                            label="Enter User Mobile Number"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contact}
                            error={touched.contact && Boolean(errors.contact)}
                            helperText={touched.contact && errors.contact}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="address"
                            name="address"
                            label="Enter User Address"
                            type="text"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address}
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            name="password"
                            label="Enter Password"
                            type="password"
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="role"
                            name="role"
                            label="Select Role"
                            select
                            fullWidth
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.role}
                            error={touched.role && Boolean(errors.role)}
                            helperText={touched.role && errors.role}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.text.primary
                                }
                            }}
                        >
                            {
                                roles?.map((v) => (
                                    <MenuItem value={v._id}>{v.roleName}</MenuItem>
                                ))
                            }
                        </TextField>
                        <br></br>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Avatar
                                <input
                                    type="file"
                                    hidden
                                    id="avatar"
                                    name="avatar"
                                    onChange={(event) => {
                                        setFieldValue("avatar", event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                />
                            </Button>
                            {values.avatar && (
                                <img
                                    src={typeof values.avatar === 'string' ? `${imgUrl}` + values.avatar : URL.createObjectURL(values.avatar)}
                                    alt="avatar"
                                    width="50"
                                    height="50"
                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                />
                            )}
                            <IconButton aria-label="edit" onClick={() => handleView('avatar')}>
                                <RemoveRedEyeIcon />
                            </IconButton>
                        </div>
                        {errors.avatar && touched.avatar ? <span style={{ color: "red" }}>{errors.avatar}</span> : null}
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
                        // borderBottom: "none",
                        fontSize: "14px !important",
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
                <UserDataGrid data={users} columns={columns} />
            </Box>

            <Dialog
                fullScreen={fullScreen}
                open={openView}
                onClose={handleCloseView}
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
                    <Button autoFocus onClick={handleCloseView} style={{ color: theme.palette.text.primary }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this user?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
};

export default User;
