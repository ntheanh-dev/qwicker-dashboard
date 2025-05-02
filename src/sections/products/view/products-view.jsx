import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Table, TableBody, TableContainer, TablePagination } from '@mui/material';

import { products } from 'src/_mock/products';
import { authAPI, END_POINTS } from 'src/configs/api';

import Scrollbar from 'src/components/scrollbar';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import TableNoData from '../table-no-data';
import OrderTableRow from '../order-table-row';
import ProductFilters from '../product-filters';
import TableEmptyRows from '../table-empty-rows';
import OrderTableHead from '../order-table-head';
import OrderTableToolbar from '../order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authAPI().get(END_POINTS.getAllPost('status=SEARCH_TIMEOUT'));
        const orderData = await res.data;
        setOrders(orderData.result);

        console.log('Fetch data successfully:', orderData.result);
      } catch (error) {
        console.error('Fetch data failed:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Đơn hàng
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
          <ProductSort />
        </Stack>
      </Stack>

      <Card>
        <OrderTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={orders.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'poster', label: 'Người giao' },
                  { id: 'pickupLocation', label: 'Nơi lấy hàng' },
                  { id: 'picker', label: 'Người nhận' },
                  { id: 'dropLocation', label: 'Nơi trả hàng' },
                  { id: 'vehicle', label: 'Phương tiên giao' },
                  { id: 'postTime', label: 'Giờ đặt' },
                  { id: 'product', label: 'Sản phẩm' },
                  { id: 'price', label: 'Giá giao' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      postTime={row.postTime}
                      product={row.product.category.name}
                      price={row.payment.price}
                      poster={row.pickupLocation.contact}
                      pickupLocation={row.pickupLocation.addressLine}
                      picker={row.dropLocation.contact}
                      dropLocation={row.dropLocation.addressLine}
                      vehicle={row.vehicleType.name}
                      status={row.status}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
