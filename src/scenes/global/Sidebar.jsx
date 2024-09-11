import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import InventoryIcon from '@mui/icons-material/Inventory';
// import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slice/auth.slice";
import { currentUser } from "../../redux/slice/users.slice";
import { getRoles } from "../../redux/slice/roles.slice";
import CssBaseline from '@mui/material/CssBaseline';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { pathname: currentPath } = useLocation();

  return (
    <MenuItem
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} className={selected === title ? 'active' : ''} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};



const MainSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const { pathname: currentPath } = useLocation();
  const dispatch = useDispatch();

  const users = useSelector(state => state.users);
  const roles = useSelector(state => state.roles);

  console.log("auth.user", users);

  useEffect(() => {
    dispatch(currentUser());
    dispatch(getRoles());
  }, [])

  return (
    <Box
      sx={{
        paddingLeft: '0 !important',
        "& .ps-sidebar-root": {
          background: `${colors.primary[400]} !important`,
        },
        "& .ps-submenu-content": {
          background: `${colors.primary[400]} !important`,
        },
        "& .ps-sidebar-container": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .ps-menu-button:hover": {
          color: "#6870fa !important",
          background: theme.palette.mode === "dark" ? '#13395e !important' : 'lightgray !important',
        },
        "& .logoIcon .ps-menu-button:hover": {
          background: "none !important"
        },
      }}
    >
      <Sidebar collapsed={isCollapsed} style={{ height: '100vh' }}>
        <Menu
          iconShape="square"
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: theme.palette.mode === "dark" ? '#13395e' : 'lightgray',
                color: '#6870fa',
              },
            },
          }}
        >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            className="logoIcon"
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              background: "none !important"
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <img
                    alt="logo"
                    width="120px"
                    height="90px"
                    src={`${theme.palette.mode === "dark" ? '../../assets/images/logo/dark-logo.png' : '../../assets/images/logo/logo.svg'}`}
                    style={{ cursor: "pointer", paddingTop: '20px' }}
                  />
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={`http://localhost:8000/${users.currUser?.avatar}`}
                  style={{ cursor: "pointer", borderRadius: "50%", marginTop: "36px" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {users.currUser?.name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {roles.roles.find((v) => v._id == users.currUser?.role)?.name}
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu
              label="User"
              icon={<PersonIcon />}
              selected={selected}
              setSelected={setSelected}
            >
              <MenuItem style={{ paddingLeft: "30%" }} component={<Link to="/admin/role" onClick={() => setSelected('/admin/role')} className={selected === '/admin/role' ? 'active' : ''} />}>Role</MenuItem>
              <MenuItem style={{ paddingLeft: "30%" }} component={<Link to="/admin/users" onClick={() => setSelected('/admin/users')} className={selected === '/admin/users' ? 'active' : ''} />}>Manage Users</MenuItem>
            </SubMenu>

            <SubMenu
              label="Products"
              icon={<InventoryIcon />}
              selected={selected}
              setSelected={setSelected}
            >
              <MenuItem style={{ paddingLeft: "30%" }} component={<Link to="/admin/category" onClick={() => setSelected('/admin/category')} className={selected === '/admin/category' ? 'active' : ''} />}>Category</MenuItem>
              <MenuItem style={{ paddingLeft: "30%" }} component={<Link to="/admin/subcategory" onClick={() => setSelected('/admin/subcategory')} className={selected === '/admin/subcategory' ? 'active' : ''} />}>Sub-Category</MenuItem>


              <SubMenu
                label="Product"
                selected={selected}
                setSelected={setSelected}
                style={{ paddingLeft: "30%" }}
              >
                <MenuItem style={{ paddingLeft: "40%" }} component={<Link to="/admin/add-product" onClick={() => setSelected('/admin/add-product')} className={selected === '/admin/add-product' ? 'active' : ''} />}>Add Product</MenuItem>
                <MenuItem style={{ paddingLeft: "40%" }} component={<Link to="/admin/list-products" onClick={() => setSelected('/admin/list-products')} className={selected === '/admin/list-products' ? 'active' : ''} />}>List Products</MenuItem>
              </SubMenu>
            </SubMenu>



            <Item
              title="Vendors"
              to="/admin/vendors"
              icon={<GroupIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu
              label="Warehouses"
              icon={<WarehouseIcon />}
              selected={selected}
              setSelected={setSelected}
            >
              <MenuItem style={{ paddingLeft: "30%" }} component={<Link to="/admin/list-warehouses" onClick={() => setSelected('/admin/list-warehouses')} className={selected === '/admin/list-warehouses' ? 'active' : ''} />}>List Warehouses</MenuItem>
            </SubMenu>

            {/* <SubMenu
              label="Account"
              to="/"
              icon={<AccountBalanceIcon />}
              selected={selected}
              setSelected={setSelected}
            >
              <MenuItem>Dealer Pay</MenuItem>
              <MenuItem>Elecrician/Fabrication Pay</MenuItem>
              <MenuItem>Elecrician/Fabrication Pay</MenuItem>
            </SubMenu> */}

            <MenuItem
              to="/admin/logout"
              icon={<LogoutIcon />}
              onClick={() => { console.log("lgogog"); dispatch(logout()) }}
              selected={selected}
              setSelected={setSelected}
            >Logout</MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default MainSidebar;
