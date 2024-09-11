import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { tokens } from '../../../theme';
import Header from "../../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { addsidebar, deletesidebar, editsidebar, getsidebar } from '../../../redux/slice/SidebarName.slice';
import { getRoles } from '../../../redux/slice/roles.slice';
import { useNavigate } from 'react-router-dom';


const SidebarGrid = ({ data, columns }) => {
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

export default function AddSidebar() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletesidebarData, setDeletesidebarData] = useState(null);
    const [update, setUpdate] = useState(null);
    const imgUrl = 'https://solar-backend-teal.vercel.app';

    const SideBar = useSelector((state) => state.sidebar.sidebar);
    console.log("sidebar", theme.palette.mode)
    const initialValues = {
        categoryName: '',
        slideBarImage: '',
        subsidebaradd: [{ subcategoryName: '' }],
        to: ''
    };

    const sideBarSchema = Yup.object({
        categoryName: Yup.string().required('Category Name is required'),
        slideBarImage: Yup.string().required('SlideBar Image is required'),
    });

    useEffect(() => {
        dispatch(getsidebar());
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
        setDeletesidebarData(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deletesidebarData) {
            dispatch(deletesidebar(deletesidebarData));
            setDeleteConfirmOpen(false);
            setDeletesidebarData(null);
        }
    }
    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setDeletesidebarData(null);
    }

    const handleEdit = (data) => {
        formik.setValues(data);
        setsubsidebar(data.subsidebaradd);
        setOpen(true);
        setUpdate(data._id);
    };

    const columns = useMemo(() => [
        {
            field: 'slideBarImage', headerName: 'Icon', width: 200,
            renderCell: (params) => {

                return (
                    <img style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'center center', filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} src={` ${imgUrl}/${params.row.slideBarImage}`} alt="avatar" />
                )
            }
        },
        { field: 'categoryName', headerName: 'Sidebar Name', width: 200 },
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
    ], [theme.palette.mode]);


    const [subsidebar, setsubsidebar] = useState(initialValues.subsidebaradd);

    const handlesubsidebar = () => {
        setsubsidebar([...subsidebar, { subcategoryName: '' }]);
    };


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: sideBarSchema,
        onSubmit: (values, { resetForm }) => {
            if (update) {
                dispatch(editsidebar({
                    _id: update,
                    categoryName: values.categoryName,
                    slideBarImage: values.slideBarImage,
                    subsidebaradd: values.subsidebaradd,
                    to: values.to
                }));
            } else {
                dispatch(addsidebar(values));
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

    const canAccessPage = hasPermission("Users");
    console.log("canAccessPage", canAccessPage)

    if (!canAccessPage) {
        navigate('/admin/dashboard');
        console.log("Access denied: You do not have permission to access this page.");
    }

    return (
        <Box m="20px">
            <Header
                title="Side Bar"
                subtitle="Manage Your Side Bar Here"
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Side Bar
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{update ? 'Edit Sidebar' : 'Add Sidebar'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ minWidth: 400 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Icon
                                <input
                                    type="file"
                                    hidden
                                    id="slideBarImage"
                                    name="slideBarImage"
                                    onChange={(event) => {
                                        setFieldValue("slideBarImage", event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                />
                            </Button>
                            {values.slideBarImage && (
                                <img
                                    src={typeof values.slideBarImage === 'string'
                                        ? ` ${imgUrl}/${values.slideBarImage}`
                                        : (values.slideBarImage instanceof File ? URL.createObjectURL(values.slideBarImage) : '')}
                                    alt="avatar"
                                    width="50"
                                    height="50"
                                    style={{ objectFit: 'cover', borderRadius: '5px', marginLeft: '20px' }}
                                />
                            )}
                        </div>
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
                        {subsidebar && subsidebar.length > 0 && subsidebar.map((subsidebardata, index) => (
                            <TextField
                                margin="dense"
                                name={`subsidebaradd.${index}.subcategoryName`}
                                label="Enter Sub Category Name"
                                type="text"
                                fullWidth
                                variant="filled"
                                onChange={e => setFieldValue(`subsidebaradd[${index}].subcategoryName`, e.target.value)}
                                onBlur={handleBlur}
                                value={values.subsidebaradd?.[index]?.subcategoryName || ''}
                                error={touched.subsidebaradd?.[index]?.subcategoryName && Boolean(errors.subsidebaradd?.[index]?.subcategoryName)}
                                helperText={touched.subsidebaradd?.[index]?.subcategoryName && errors.subsidebaradd?.[index]?.subcategoryName}
                                InputLabelProps={{
                                    style: {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            />
                        ))}
                        <Box display="flex" justifyContent="flex-end" m={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handlesubsidebar}
                            >
                                Add Sub Sidebar
                            </Button>
                        </Box>
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
                <SidebarGrid
                    data={SideBar}
                    columns={columns} />
            </Box>
            <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
                <DialogContent>
                    Are you sure you want to delete this side bar?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} style={{ color: theme.palette.text.primary }}>No</Button>
                    <Button onClick={confirmDelete} style={{ color: theme.palette.text.primary }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
