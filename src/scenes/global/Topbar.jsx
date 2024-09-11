// // import { Box, IconButton, useTheme } from "@mui/material";
// // import { useContext } from "react";
// // import { ColorModeContext, tokens } from "../../theme";
// // import InputBase from "@mui/material/InputBase";
// // import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// // import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// // import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// // import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// // import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// // import SearchIcon from "@mui/icons-material/Search";
// // import Header from "../../components/Header";

// // const Topbar = () => {
// //   const theme = useTheme();
// //   const colors = tokens(theme.palette.mode);
// //   const colorMode = useContext(ColorModeContext);

// //   return (
// //     <Box display="flex" justifyContent="space-between" alignItems="flex-start" p={2}>
// //       {/* <Box display="flex" justifyContent="space-between" >
// //         <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

// //         <Box>
// //           <Button
// //             sx={{
// //               backgroundColor: colors.blueAccent[700],
// //               color: colors.grey[100],
// //               fontSize: "14px",
// //               fontWeight: "bold",
// //               padding: "10px 20px",
// //             }}
// //           >
// //             <DownloadOutlinedIcon sx={{ mr: "10px" }} />
// //             Download Reports
// //           </Button>
// //         </Box>
// //       </Box> */}

// //       {/* ICONS */}
// //       <Box display="flex" sx={{justifyContent: 'flex-end'}}>
// //         <IconButton onClick={colorMode.toggleColorMode}>
// //           {theme.palette.mode === "dark" ? (
// //             <DarkModeOutlinedIcon />
// //           ) : (
// //             <LightModeOutlinedIcon />
// //           )}
// //         </IconButton>
// //         {/* <IconButton>
// //           <NotificationsOutlinedIcon />
// //         </IconButton> */}
// //         {/* <IconButton>
// //           <SettingsOutlinedIcon />
// //         </IconButton> */}
// //         <IconButton>
// //           <PersonOutlinedIcon />
// //         </IconButton>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Topbar;
// import React, { useEffect, useState, useMemo, memo } from 'react';

// import { Box, IconButton, useTheme } from "@mui/material";
// import { useContext } from "react";
// import { ColorModeContext, tokens } from "../../theme";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import { ThemeContext } from '../../context/ThemeContext';

// const Topbar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const { toggleColorMode } = useContext(ColorModeContext);

//   const themeContext = useContext(ThemeContext);
//   console.log(themeContext); //7

//   const handleTheme = () => {
//     // 2
//     themeContext.toggleTheme(themeContext.theme);
//   }

//   return (
//     <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
//       <IconButton onClick={toggleColorMode}>
//         {theme.palette.mode === "dark" ? (
//           <DarkModeOutlinedIcon />
//         ) : (
//           <LightModeOutlinedIcon />
//         )}
//       </IconButton>
//       <IconButton>
//         <PersonOutlinedIcon />
//       </IconButton>
//     </Box>
//   );
// };

// export default React.memo(Topbar);

import React, { useContext } from 'react';
import { Box, IconButton, useTheme } from "@mui/material";
// import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { ThemeContext } from '../../context/ThemeContext';

const Topbar = () => {
  const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  // const colorMode = useContext(ColorModeContext);

  const themeContext = useContext(ThemeContext);
  console.log(themeContext); //7

  const handleTheme = () => {
    themeContext.toggleTheme(themeContext.theme);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      <IconButton onClick={handleTheme}>
        {theme.palette.mode === "dark" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
      <IconButton>
        <PersonOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default React.memo(Topbar);
