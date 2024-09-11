import React, { useRef, useState } from 'react';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ReactToPrint from 'react-to-print';
import { useTheme } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const PurchaseOrder = () => {
    const printRef = useRef();
    const theme = useTheme();
    const isPrinting = useRef(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleBeforeGetContent = () => {
        isPrinting.current = true; // Set to true when printing starts
    };

    const handleAfterPrint = () => {
        isPrinting.current = false; // Reset after printing
    };

    const orderDetails = {
        date: '21-08-2023',
        poNumber: '1234568',
        billTo: {
            companyName: 'Tvarit Energy LLP',
            address: '707 - Twin Star, North Block, Near Nana Mava Circle, 150 Ft Ring Road, Rajkot, Gujarat - 360005',
            gst: '24AAWFT9397E1ZX',
            contact: '+91 97445 71483',
            email: 'info@tvaritenergy.in',
            website: 'www.tvaritenergy.in',
        },
        vendor: {
            companyName: 'Solarium Green Energy Pvt Ltd',
            address: 'Solarium Green Energy',
        },
        shipTo: {
            companyName: 'Tvarit Energy LLP',
            address: '707 - Twin Star, North Block, Near Nana Mava Circle, 150 Ft Ring Road, Rajkot, Gujarat - 360005',
            contactPerson: 'Meet Patel',
            contactNumber: '+91 97445 71483',
        },
        items: [
            { description: 'Small part for FUJITSU inverter', hsnCode: '1234567', qty: 10, unitPrice: 250, total: 2500 },
            { description: 'Lighting Adapter', hsnCode: '3527391', qty: 1, unitPrice: 1250, total: 1250 },
        ],
        subTotal: 3750,
        gst: 18, // in percentage
    };

    const calculateGST = () => (orderDetails.subTotal * orderDetails.gst) / 100;
    const calculateTotal = () => orderDetails.subTotal + calculateGST();

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const downloadPDF = () => {
        // Ensure the text is dark before capturing
        const originalColor = document.body.style.color;
        document.body.style.color = 'black'; // Set text color to black

        html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210 - 20; // A4 width in mm minus left and right margins (10mm each)
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 10; // Start position with top margin

            // Add the image with margins
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight); // 10mm left margin
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight); // 10mm left margin
                heightLeft -= pageHeight;
            }

            // Add "PURCHASE ORDER" text in dark color, aligned to the right
            // if (theme.palette.mode == "dark") {
            //     pdf.setTextColor(0, 0, 0); // Set text color to black (RGB)
            //     pdf.setFontSize(20); // Set font size
            //     const textWidth = pdf.getTextWidth('PURCHASE ORDER'); // Get the width of the text
            //     const xPosition = 210 - 10 - textWidth; // Calculate X position (10mm right margin)
            //     pdf.text('PURCHASE ORDER', xPosition, 20); // Add text at specified position
            // }
            if (theme.palette.mode == "dark") {
                pdf.setTextColor(0, 0, 0); // Set text color to black (RGB)
                pdf.setFontSize(16); // Set font size\
                pdf.setTextColor(31, 47, 88); // Set text color to match the image
                pdf.setFont(undefined, "bold"); // Set font weight to bold
                const textWidth = pdf.getTextWidth('PURCHASE ORDER'); // Get the width of the text
                const xPosition = 210 - 25 - textWidth; // Calculate X position (10mm right margin)
                pdf.text('PURCHASE ORDER', xPosition, 20, { charSpace: 1 }); // Add text at specified position with letterspacing 5px
                pdf.setLineWidth(2); // Set line width for the underline
                // pdf.line(xPosition, 25, xPosition + textWidth, 25); // Draw underline
            } 

            pdf.save('purchase_order.pdf');

            // Restore original text color
            document.body.style.color = originalColor;
        });
    };

    return (
        <Box sx={{ padding: 4, maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <style>
                {`
                    @media print {
                        * {
                            color: black !important; /* Set all text to black */
                            background: transparent !important; /* Ensure background is transparent */
                        }
                        @page {
                            margin: 0; /* Remove default margin */
                        }
                        body {
                            padding: 20px; /* Add padding to the body */
                        }
                        .logo {
                            content: url('../../assets/images/logo/dark-logo.png'); /* Use black logo for print */
                        }
                    }
                `}
            </style>
            <IconButton aria-label="view" onClick={handleOpenDialog}>
                <RemoveRedEyeIcon />
            </IconButton>
            <div ref={printRef}>
                {/* Your entire JSX structure of the Purchase Order as before */}
                <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 4 }}>
                    <Grid item>
                        {console.log(isPrinting.current)}
                        <Box
                            component="img"
                            src={(theme.palette.mode === "dark" ? '../../assets/images/logo/dark-logo.png' : '../../assets/images/logo/logo.svg')}
                            alt="Tvarit Energy LLP Logo"
                            sx={{ width: 150 }}
                        />
                    </Grid>
                    <Grid item>
                        <Box sx={{ borderBottom: '2px solid #FB9822', marginBottom: 2 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '25px',
                                    letterSpacing: '5px',
                                    textAlign: 'right',
                                    color: theme.palette.mode === "dark" ? 'white' : '#1F2F58',
                                    position: 'relative', // Position relative for pseudo-element
                                    paddingBottom: '4px' // Optional: add some padding for spacing
                                }}
                            >
                                PURCHASE ORDER
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                    <Grid item xs={6}>
                        <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>BILL TO</Typography>
                        </Box>
                        <Typography>{orderDetails.billTo.companyName}</Typography>
                        <Typography>{orderDetails.billTo.address}</Typography>
                        <Typography>GST No: {orderDetails.billTo.gst}</Typography>
                        <Typography>Contact No: {orderDetails.billTo.contact}</Typography>
                        <Typography>Email: {orderDetails.billTo.email}</Typography>
                        <Typography>Website: {orderDetails.billTo.website}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>Date: {orderDetails.date}</Typography>
                        <Typography>PO #: {orderDetails.poNumber}</Typography>
                    </Grid>

                </Grid>

                <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                    <Grid item xs={6}>
                        <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>VENDOR</Typography>
                        </Box>
                        <Typography>{orderDetails.vendor.companyName}</Typography>
                        <Typography>{orderDetails.vendor.address}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>SHIP TO</Typography>
                        </Box>
                        <Typography>{orderDetails.shipTo.companyName}</Typography>
                        <Typography>{orderDetails.shipTo.address}</Typography>
                        <Typography>Contact Person: {orderDetails.shipTo.contactPerson}</Typography>
                        <Typography>Contact No: {orderDetails.shipTo.contactNumber}</Typography>
                    </Grid>




                </Grid>

                <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#293754' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>SR. NO.</TableCell>
                                <TableCell sx={{ color: 'white' }}>DESCRIPTION</TableCell>
                                <TableCell sx={{ color: 'white' }}>HSN CODE</TableCell>
                                <TableCell sx={{ color: 'white' }}>QTY.</TableCell>
                                <TableCell sx={{ color: 'white' }}>UNIT PRICE</TableCell>
                                <TableCell sx={{ color: 'white' }}>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderDetails.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.hsnCode}</TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell>₹{item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container justifyContent="space-between" sx={{ marginBottom: 4 }}>

                    <Grid item xs={6}>
                        <Box sx={{ marginBottom: 4, marginTop: 2 }}> {/* Added marginTop for spacing */}
                            <Typography variant="body1"><strong>Comment or Special Instructions:</strong></Typography>
                            <Grid container>
                                <Grid item xs={3}><Typography variant="body2"><strong>PAYMENT TERMS:</strong></Typography></Grid>
                                <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}><Typography variant="body2"><strong>INSURANCE:</strong></Typography></Grid>
                                <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}><Typography variant="body2"><strong>PACKAGING:</strong></Typography></Grid>
                                <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={3}><Typography variant="body2"><strong>DELIVERY:</strong></Typography></Grid>
                                <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Sub Total:</strong></TableCell>
                                        <TableCell align="right">₹{orderDetails.subTotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>GST ({orderDetails.gst}%):</strong></TableCell>
                                        <TableCell align="right">₹{calculateGST().toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="h6"><strong>TOTAL:</strong></Typography></TableCell>
                                        <TableCell align="right"><Typography variant="h6"><strong>₹{calculateTotal().toFixed(2)}</strong></Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex-end" style={{ paddingTop: '50px' }}>
                    <Grid item>
                        <Typography variant="body1">Company Stamp & Sign</Typography>
                    </Grid>
                </Grid>
            </div>

            <ReactToPrint
                trigger={() => {
                    isPrinting.current = true; // Set isPrinting to true when button is clicked
                    return <Button variant="contained" color="primary" sx={{ marginTop: 4 }} >Print PDF</Button>;
                }}
                content={() => printRef.current}
                onBeforeGetContent={handleBeforeGetContent}
                onAfterPrint={handleAfterPrint}
            />

{/*  VIEW ICON ............................................................ */}

            {/* Dialog for viewing details */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                {/* <DialogTitle>Purchase Order Details</DialogTitle> */}
                <DialogContent>
                    <Box sx={{ padding: 2 }}>
                        <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 4 }}>
                            <Grid item>
                                <Box
                                    component="img"
                                    src={(theme.palette.mode === "dark" ? '../../assets/images/logo/dark-logo.png' : '../../assets/images/logo/logo.svg')}
                                    alt="Tvarit Energy LLP Logo"
                                    sx={{ width: 150 }}
                                />
                            </Grid>
                            <Grid item> 
                                <Box sx={{ borderBottom: '2px solid #FB9822', marginBottom: 2 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '25px',
                                            letterSpacing: '5px',
                                            textAlign: 'right',
                                            color: theme.palette.mode === "dark" ? 'white' : '#1F2F58',
                                            position: 'relative', // Position relative for pseudo-element
                                            paddingBottom: '4px' // Optional: add some padding for spacing
                                        }}
                                    >

                                        PURCHASE ORDER
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>BILL TO</Typography>
                                </Box>
                                <Typography>{orderDetails.billTo.companyName}</Typography>
                                <Typography>{orderDetails.billTo.address}</Typography>
                                <Typography>GST No: {orderDetails.billTo.gst}</Typography>
                                <Typography>Contact No: {orderDetails.billTo.contact}</Typography>
                                <Typography>Email: {orderDetails.billTo.email}</Typography>
                                <Typography>Website: {orderDetails.billTo.website}</Typography>
                            </Grid>

                            <Grid item xs={6} >
                                <Typography>Date: {orderDetails.date}</Typography>
                                <Typography>PO #: {orderDetails.poNumber}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>VENDOR</Typography>
                                </Box>
                                <Typography>{orderDetails.vendor.companyName}</Typography>
                                <Typography>{orderDetails.vendor.address}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ backgroundColor: '#293754', color: 'white', padding: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>SHIP TO</Typography>
                                </Box>
                                <Typography>{orderDetails.shipTo.companyName}</Typography>
                                <Typography>{orderDetails.shipTo.address}</Typography>
                                <Typography>Contact Person: {orderDetails.shipTo.contactPerson}</Typography>
                                <Typography>Contact No: {orderDetails.shipTo.contactNumber}</Typography>
                            </Grid>
                        </Grid>

                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#293754' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>SR. NO.</TableCell>
                                        <TableCell sx={{ color: 'white' }}>DESCRIPTION</TableCell>
                                        <TableCell sx={{ color: 'white' }}>HSN CODE</TableCell>
                                        <TableCell sx={{ color: 'white' }}>QTY.</TableCell>
                                        <TableCell sx={{ color: 'white' }}>UNIT PRICE</TableCell>
                                        <TableCell sx={{ color: 'white' }}>TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetails.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.hsnCode}</TableCell>
                                            <TableCell>{item.qty}</TableCell>
                                            <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                                            <TableCell>₹{item.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="body1"><strong>Comment or Special Instructions:</strong></Typography>
                                <Grid container>
                                    <Grid item xs={3}><Typography variant="body2"><strong>PAYMENT TERMS:</strong></Typography></Grid>
                                    <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={3}><Typography variant="body2"><strong>INSURANCE:</strong></Typography></Grid>
                                    <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={3}><Typography variant="body2"><strong>PACKAGING:</strong></Typography></Grid>
                                    <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={3}><Typography variant="body2"><strong>DELIVERY:</strong></Typography></Grid>
                                    <Grid item xs={9}><Typography variant="body2">-</Typography></Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><strong>Sub Total:</strong></TableCell>
                                                <TableCell align="right">₹{orderDetails.subTotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>GST ({orderDetails.gst}%):</strong></TableCell>
                                                <TableCell align="right">₹{calculateGST().toFixed(2)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><Typography variant="h6"><strong>TOTAL:</strong></Typography></TableCell>
                                                <TableCell align="right"><Typography variant="h6"><strong>₹{calculateTotal().toFixed(2)}</strong></Typography></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="flex-end" style={{ paddingTop: '50px' }}>
                            <Grid item>
                                <Typography variant="body1">Company Stamp & Sign</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={downloadPDF} color="primary">Download PDF</Button>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PurchaseOrder;
