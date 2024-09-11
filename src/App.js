// import { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Topbar from "./scenes/global/Topbar";
// import Dashboard from "./scenes/dashboard";
// import Team from "./scenes/team";
// import Invoices from "./scenes/invoices";
// import Contacts from "./scenes/contacts";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import Calendar from "./scenes/calendar/calendar";
// import MainSidebar from "./scenes/global/Sidebar";
// import Category from "./admin/container/Category/Category";
// import { Provider, useDispatch } from 'react-redux';
// import { configureStore } from "./redux/store";
// import { PersistGate } from 'redux-persist/integration/react'
// import Subcategory from "./admin/container/Subcategory/Subcategory";
// import Product from "./admin/container/Product/Product";
// import { SnackbarProvider } from 'notistack'
// import Alert from "./admin/component/Alert/Alert";
// import ListProducts from "./admin/container/Product/ListProducts";
// import Role from "./admin/container/Role/Role";
// import Vendor from "./admin/container/Vendor/Vendor";
// import Warehouse from "./admin/container/Warehouse/Warehouse";
// import User from "./admin/container/User/User";
// import Auth from "./admin/container/Auth/Auth";
// import AdminRoutes from "./routes/AdminRoutes";
// import UserRoutes from "./routes/UserRoutes";
// import PrivateRoutes from "./routes/PrivateRoutes";
// import Cookies from 'js-cookie';
// import { loginSuccess, refreshAccessToken } from "./redux/slice/auth.slice";

// function App() {
//   const [theme, colorMode] = useMode();
//   const { store, persistor } = configureStore();
//   const [isSidebar, setIsSidebar] = useState(true);


//   return (
//     <>
//       <SnackbarProvider
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <ColorModeContext.Provider value={colorMode}>
//           <ThemeProvider theme={theme}>
//             <Provider store={store}>
//               <PersistGate loading={null} persistor={persistor}>
//                 <Alert />
//                 <CssBaseline />
//                 <div className="app">
//                 <Topbar setIsSidebar={setIsSidebar} />
//                   <Routes>
//                     <Route exact path='/*' element={<UserRoutes />} />
//                     <Route element={<PrivateRoutes />}>
//                       <Route exact path='/admin/*' element={<AdminRoutes />} />
//                     </Route>
//                   </Routes>
//                 </div>
//               </PersistGate>
//             </Provider>
//           </ThemeProvider>
//         </ColorModeContext.Provider>
//       </SnackbarProvider>
//     </>
//   );
// }

// export default App;

// import { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Topbar from "./scenes/global/Topbar";
// import Sidebar from "./scenes/global/Sidebar";
// import Dashboard from "./scenes/dashboard";
// import Team from "./scenes/team";
// import Invoices from "./scenes/invoices";
// import Contacts from "./scenes/contacts";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import { CssBaseline } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import Calendar from "./scenes/calendar/calendar";
// import AdminRoutes from "./routes/AdminRoutes";
// import UserRoutes from "./routes/UserRoutes";
// import PrivateRoutes from "./routes/PrivateRoutes";
// import { Provider, useDispatch } from 'react-redux';
// import { configureStore } from "./redux/store";
// import { ThemeProvider } from "./context/ThemeContext";

// function App() {
//   const [theme, colorMode] = useMode();
//   const [isSidebar, setIsSidebar] = useState(true);
//   const { store, persistor } = configureStore();

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider>
//         <CssBaseline />
//         <div className="app">
//         <Provider store={store}>
//           <Sidebar isSidebar={isSidebar} />
//           <main className="content">
//             <Topbar setIsSidebar={setIsSidebar} />
//             <Routes>
//                     <Route exact path='/*' element={<UserRoutes />} />
//                     <Route element={<PrivateRoutes />}>
//                       <Route exact path='/admin/*' element={<AdminRoutes />} />
//                     </Route>
//                   </Routes>
//           </main>
//           </Provider>
//         </div>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default App;

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import Calendar from "./scenes/calendar/calendar";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import { Provider } from 'react-redux';
import { configureStore } from "./redux/store";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import Alert from "./admin/component/Alert/Alert";
import { SnackbarProvider } from 'notistack';


function App() {

  const { store, persistor } = configureStore();

  return (
    <SnackbarProvider>
      <Provider store={store}>
        <ThemeProvider>
          <ThemeContext.Consumer>
            {({ theme, toggleTheme }) => (
              <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Alert />
                <div className="app">
      
                  <Routes>
                    <Route exact path='/*' element={<UserRoutes />} />
                    <Route element={<PrivateRoutes />}>
                    <Route exact path='/admin/*' element={<AdminRoutes />} />
                    </Route>
                  </Routes>

                </div>
              </MuiThemeProvider>
            )}
          </ThemeContext.Consumer>
        </ThemeProvider>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
