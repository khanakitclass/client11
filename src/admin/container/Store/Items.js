import { Box, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { memo, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import { getProducts } from '../../../redux/slice/products.slice';
import { getPurchase } from '../../../redux/slice/Purchase.slice';
import { getstore } from '../../../redux/slice/store.slice';

const ItemsDataGrid = memo(({ data, columns }) => {
  if (!data || !Array.isArray(data)) {
    return <div>Loading...</div>;
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
});

function Items() {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch()

  const purchase = useSelector(state => state.purchase.purchase);

  const products = useSelector(state => state.products.products.products);
  console.log(products)

  const store = useSelector(state => state.store.Store)

  // const category = useSelector(state => state.category.category.categories);




  const columns = useMemo(() => [
    // {
    //   field: 'mainCategory', headerName: 'Category', width: 150,
    //   renderCell: (params) => {
    //     const product = products?.find(p => p._id === params.row.multipledata[0].productName);
    //     return product ? product.mainCategory : '';
    //   }
    // },
    // {
    //   field: 'subCategory', headerName: 'Subcategory', width: 150,
    //   renderCell: (params) => {
    //     const product = products?.find(p => p._id === params.row.multipledata[0].productName);
    //     return product ? product.subCategory : '';
    //   }
    // },
    // {
    //   field: 'mainCategory', headerName: 'Category', width: 250,
    //   renderCell: (params) => {
    //     const categories = params.row.multipledata.map(data => {
    //       const product = products?.find(p => p._id === data.productName);
    //       return product ? product.mainCategory : '';
    //     }).filter(Boolean); // Filter out any empty values
    //     return categories.join(', '); // Join with a comma
    //   }
    // },
    // {
    //   field: 'subCategory', headerName: 'Subcategory', width: 200,
    //   renderCell: (params) => {
    //     const subcategories = params.row.multipledata.map(data => {
    //       const product = products?.find(p => p._id === data.productName);
    //       return product ? product.subCategory : '';
    //     }).filter(Boolean); // Filter out any empty values
    //     return subcategories.join(', '); // Join with a comma
    //   }
    // },
    {
      field: 'mainCategory', headerName: 'Category', width: 250,
      renderCell: (params) => {
        const categories = params.row.multipledata.map(data => {
          const product = products?.find(p => p._id === data.productName);
          return product ? product.mainCategory : '';
        }).filter(Boolean); // Filter out any empty values
        return <div style={{ whiteSpace: 'pre-line' }}>{categories.join('\n')}</div>; // Join with a newline
      }
    },
    {
      field: 'subCategory', headerName: 'Subcategory', width: 200,
      renderCell: (params) => {
        const subcategories = params.row.multipledata.map(data => {
          const product = products?.find(p => p._id === data.productName);
          return product ? product.subCategory : '';
        }).filter(Boolean); // Filter out any empty values
        return <div style={{ whiteSpace: 'pre-line' }}>{subcategories.join('\n')}</div>; // Join with a newline
      }
    },
    // {
    //   field: 'productName', headerName: 'Product Name', width: 200,
    //   renderCell: (params) => {

    //     if (!Array.isArray(products) || products.length === 0) return '';

    //     return params.row.multipledata.map((data) =>
    //       products.find((p) => p._id == data.productName)?.productName
    //     ).filter(Boolean).join(', ') || '';
    //   }
    // },
    {
      field: 'productName', headerName: 'Product Name', width: 200,
      renderCell: (params) => {

        if (!Array.isArray(products) || products.length === 0) return '';

        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {params.row.multipledata.map((data) =>
              products.find((p) => p._id == data.productName)?.productName
            ).filter(Boolean).join('\n') || ''}
          </div>
        );
      }
    },
    // {
    //   field: 'unitPrice', headerName: 'Unit Price', width: 150,
    //   renderCell: (params) => {
    //     return params.row.multipledata.map(data => data.unitPrice).join(', ')
    //   }
    // },
    {
      field: 'unitPrice', headerName: 'Unit Price', width: 150,
      renderCell: (params) => {
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {params.row.multipledata.map(data => data.unitPrice).join('\n')}
          </div>
        );
      }
    },
    // {
    //   field: 'recieveQty', headerName: 'Inward Stock Qua', width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <div style={{ whiteSpace: 'pre-line' }}>
    //         {/* {params.row.multipledata.map(data => data.Qty).join('\n')} */}
    //         {store.map(data => data.purchase == params.row._id ? data.multipleQty.map(qty => qty.recieveQty).join('\n') : '')}
    //       </div>
    //     );
    //   }
    // },
    {
      field: 'recieveQty', headerName: 'Inward Stock Qua', width: 150,
      renderCell: (params) => {
        const qtyData = store.map(data => data.purchase == params.row._id ? data.multipleQty.map(qty => qty.recieveQty).join('\n') : '').filter(Boolean);
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {qtyData.length > 0 ? qtyData.join('\n') : '0'}
          </div>
        );
      }
    },
    {
      field: 'check', headerName: 'Outward Stock', width: 150,
      renderCell: () => {
        return (0);
      }
    },
    {
      field: 'total', headerName: 'Amount', width: 150,
      renderCell: (params) => {
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {params.row.multipledata.map(data => data.total).join('\n')}
          </div>
        );
      }
    },
    {
      field: 'gst', headerName: 'GST', width: 150,
      renderCell: (params) => {
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {params.row.multipledata.map(data => data.gst).join('\n')}
          </div>
        );
      }
    },
    {
      field: 'amountTotal', headerName: 'Total Amount', width: 150,
      renderCell: (params) => {
        return params.row.amountTotal
      }
    },
  ], [products]);

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getPurchase())
    dispatch(getstore())
  }, [])


  return (
    <Box m="20px">
      <Header
        title="Items"
        subtitle="Manage your Items here"
      />

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
        <ItemsDataGrid data={purchase} columns={columns} />
      </Box>
    </Box>
  )
}

export default Items;
