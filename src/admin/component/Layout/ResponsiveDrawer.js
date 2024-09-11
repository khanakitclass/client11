import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slice/auth.slice';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { getsidebar } from '../../../redux/slice/SidebarName.slice';
import { getRoles } from '../../../redux/slice/roles.slice';


const drawerWidth = 240;
const role = sessionStorage.getItem("role");


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',

}));
const MenuItem = ({ item, depth = 0 }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imgUrl ='https://solar-backend-teal.vercel.app';
  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    } else if (item.categoryName && Array.isArray(item.subsidebaradd) && item.subsidebaradd.length === 0) {
      navigate(`/admin/${item.categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      setOpen(!open);
    }
  };
  const handleLogout = async () => {
    try {
      const id = sessionStorage.getItem("id");
      if (id) {
        await dispatch(logout({ id, navigate }));
      }
      sessionStorage.removeItem("id");
    } catch (error) {
      console.log(error)
    }
  };

  if (item.subsidebaradd && item.subsidebaradd.length > 0 && item.subsidebaradd.some(subItem => subItem.subcategoryName)) {
    return (
      <>
        <ListItemButton onClick={handleClick} sx={{ pl: 2 * (depth + 1) }}>
          <ListItemIcon>
            <img style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'center center', filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} src={`${imgUrl}/${item.slideBarImage}`} alt="avatar" />
          </ListItemIcon>
          <ListItemText primary={item.categoryName} sx={{ color: theme.palette.text.primary }} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subsidebaradd.map((subItem, index) => (
              <ListItemButton
                key={index}
                component={NavLink}
                to={`/admin/${subItem.subcategoryName.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{ pl: 2 * (depth + 2), pr: 2, display: 'flex', justifyContent: 'center' }}
              >
                <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontSize: '14px' }}>
                  {subItem.subcategoryName}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    );
  }


  if (item.subsidebaradd && item.subsidebaradd.length > 0 && item.subsidebaradd.some(subItem => subItem.subcategoryName)) {
    return (
      <>
        <ListItemButton onClick={handleClick} sx={{ pl: 2 * (depth + 1), pr: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon>
              <img style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'center center', filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} src={`${imgUrl}/${item.slideBarImage}`} alt="avatar" />
            </ListItemIcon>
            <ListItemText primary={item.categoryName} sx={{ color: theme.palette.text.primary }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {item.subsidebaradd.map((subItem, index) => (
              <Typography
                key={index}
                component={NavLink}
                to={`/admin/${subItem.subcategoryName.toLowerCase().replace(/\s+/g, '-')}`}
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  marginBottom: index < item.subsidebaradd.length - 1 ? 1 : 0
                }}
              >
                {subItem.subcategoryName}
              </Typography>
            ))}
          </Box>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </>
    );
  } else {
    return (
      <ListItemButton
        component={item.categoryName === "Log Out" ? "button" : NavLink}
        to={item.categoryName === "Log Out" ? undefined : (item.to || item.categoryName)}
        onClick={item.categoryName === "Log Out" ? handleLogout : handleClick}
        sx={{
          pl: 2 * (depth + 1),
          '&:hover': {
            backgroundColor: 'rgba(30, 144, 255, 0.2)',
            width: '100%',
          },
        }}
      >
        <ListItemIcon>
          {item.categoryName === "Log Out" ? (
            <PowerSettingsNewIcon />
          ) : (
            <img style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'center center', filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} src={`${imgUrl}/${item.slideBarImage}`} alt="avatar" />
          )}
        </ListItemIcon>
        <ListItemText primary={item.categoryName} sx={{ color: theme.palette.text.primary }} />
      </ListItemButton>
    );
  }

};
function ResponsiveDrawer(props) {

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const roles = useSelector(state => state.roles.roles);
  const [matchedRole, setMatchedRole] = useState(null);
  const imgUrl ='https://solar-backend-teal.vercel.app';
  useEffect(() => {
    dispatch(getRoles())
  }, [dispatch]);

  // useEffect(() => {
  //   setMatchedRole(roles.find(r => r._id === role));
  // }, [roles]);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setMatchedRole(roles.find(r => r._id === storedRole));
    }
  }, [roles]);

  const [open, setOpen] = useState(false);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const id = sessionStorage.getItem("id");
      if (id) {
        await dispatch(logout({ id, navigate }));
      }
      sessionStorage.removeItem("id");
    } catch (error) {
      console.log(error)
    }

  }
  // const adminLinks = [
  //   { categoryName: 'Log out', slideBarImage: <PowerSettingsNewIcon />, onClick: handleLogout },
  // ];
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pageName = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ') : '';

  const SideBar = useSelector((state) => state.sidebar.sidebar);

  useEffect(() => {
    dispatch(getsidebar());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isLargeScreen &&
        <AppBar position="fixed" open={open} className="r_bg">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
            </Typography>
          </Toolbar>
        </AppBar>
      }
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage: 'none'
          },
        }}
        variant={isLargeScreen ? "permanent" : "temporary"}
        anchor="left"
        open={isLargeScreen || open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <div className='mb-5 mt-3'>
            <img
              alt="logo"
              width="100px"
              height="80px"
              src={`${theme.palette.mode === "dark" ? '../../assets/images/logo/dark-logo.png' : '../../assets/images/logo/logo.svg'}`}
              style={{ cursor: "pointer", paddingTop: '20px' }}
            />
          </div>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* {matchedRole && matchedRole.permissions.map((permission, index) => (
            <MenuItem key={index} item={{ categoryName: permission, to: `/admin/${permission.toLowerCase().replace(/\s+/g, '-')}` }} />
          ))} */}
          {/* {SideBar.map((item, index) => (
            <MenuItem key={index} item={item} to={`${item.categoryName}`} />
          ))} */}

          {/* <MenuItem key="dashboard" item={{
            categoryName: 'Dashboard', slideBarImage:
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.7487 16.5003V19.25H8.24937V16.5003C8.24937 16.318 8.32179 16.1432 8.45071 16.0142C8.57963 15.8853 8.75447 15.8129 8.93679 15.8129H13.0613C13.2436 15.8129 13.4185 15.8853 13.5474 16.0142C13.6763 16.1432 13.7487 16.318 13.7487 16.5003ZM10.999 8.9387C10.2408 8.9387 9.62421 9.55532 9.62421 10.3135C9.62421 11.0718 10.2408 11.6884 10.999 11.6884C11.7573 11.6884 12.3739 11.0718 12.3739 10.3135C12.3739 9.55532 11.7573 8.9387 10.999 8.9387ZM19.2481 9.67699V19.25H15.1236V16.5003C15.1236 15.3633 14.1983 14.4381 13.0613 14.4381H8.93679C7.7998 14.4381 6.87453 15.3633 6.87453 16.5003V19.25H2.75001V9.67699C2.74902 9.35378 2.82205 9.03464 2.96349 8.74402C3.10492 8.4534 3.31102 8.19902 3.56598 8.00037L9.68745 3.20424C10.0613 2.90999 10.5233 2.75 10.999 2.75C11.4748 2.75 11.9368 2.90999 12.3106 3.20424L16.4984 6.48461V4.12607H17.8732V7.56111L18.4321 7.999C18.687 8.19771 18.893 8.45211 19.0345 8.74271C19.1759 9.03332 19.249 9.35243 19.2481 9.67562V9.67699ZM13.7487 10.3135C13.7487 8.79709 12.5155 7.56386 10.999 7.56386C9.4826 7.56386 8.24937 8.79709 8.24937 10.3135C8.24937 11.83 9.4826 13.0632 10.999 13.0632C12.5155 13.0632 13.7487 11.83 13.7487 10.3135Z" fill="currentColor" />
              </svg>
            , to: '/admin/dashboard'
          }} /> */}
          {matchedRole && matchedRole.permissions.map((permission, index) => (
            SideBar.filter(item => item.categoryName === permission).map((filteredItem) => (
              <MenuItem key={filteredItem.categoryName} item={{ ...filteredItem, categoryName: filteredItem.categoryName, to: `/admin/${filteredItem.categoryName.toLowerCase().replace(/\s+/g, '-')}` }} />
            ))
          ))}

          {/* {adminLinks.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))} */}
        </List>
      </Drawer>
      <Main open={isLargeScreen || open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
