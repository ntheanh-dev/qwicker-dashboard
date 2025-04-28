import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { authAPI, END_POINTS } from 'src/configs/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import VehicleTableRow from '../vehicle-table-row';
import VehicleTableHead from '../vehicle-table-head';
import VehicleTableToolbar from '../vehicle-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------
const style = {
  flex: 1,
  position: 'relative',
  top: { xs: '40%', md: '30%' },
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '38%' },
  height: { xs: 560, md: 400 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
function VehiclePage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  const [vehicle, setVehicle] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authAPI().get(END_POINTS.getAllVehicle);
        setVehicle([...res.data.result]);
      } catch (error) {
        console.error('Fetch data failed:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const newSelecteds = vehicle.map((n) => n.name);
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
    inputData: vehicle,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tài khoản</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpen}
        >
          Tạo mới
        </Button>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} xs={12}>
          <Button
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 40,
              borderRadius: 35,
              backgroundColor: '#fff',
              color: '#000',
            }}
          >
            <Iconify icon="ic:baseline-close" />
          </Button>
          <Box sx={{ display: 'inline-flex' }}>
            <Iconify icon="ion:people" mt={0.5} mr={1} />
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
              Tạo mới người dùng
            </Typography>
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic-1"
                label="Họ và tên lót"
                variant="outlined"
                size="small"
                sx={{ width: '96%' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic-2"
                label="Tên"
                variant="outlined"
                size="small"
                sx={{ width: '96%' }}
              />
            </Grid>
            <Grid item xs={12} md={6} mt={2}>
              <TextField
                id="outlined-basic-2"
                label="Địa chỉ"
                variant="outlined"
                size="small"
                sx={{ width: '96%' }}
              />
            </Grid>
            <Grid item xs={12} md={6} mt={2}>
              <TextField
                id="outlined-basic-2"
                label="Số điện thoại"
                variant="outlined"
                size="small"
                sx={{ width: '96%' }}
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6} mt={2}>
              <TextField
                id="outlined-basic-2"
                label="Email"
                variant="outlined"
                size="small"
                sx={{ width: '96%' }}
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6} mt={2}>
              <TextField
                id="outlined-basic-2"
                label="Password"
                variant="outlined"
                size="small"
                sx={{ width: '96%' }}
                type="password"
              />
            </Grid>
            <Grid item xs={12} md={6} mt={2}>
              <Button
                variant="contained"
                component="label"
                startIcon={<Iconify icon="clarity:avatar-solid" />}
              >
                Tải hình đại diện
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
          <Box spacing={3} sx={{ right: 50, position: 'absolute' }}>
            <Button
              variant="contained"
              component="label"
              color="grey"
              sx={{ mr: 1 }}
              startIcon={<Iconify icon="mdi:remove" />}
              onClick={handleClose}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<Iconify icon="material-symbols:save-outline" />}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>
      <Card>
        <VehicleTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <VehicleTableHead
                order={order}
                orderBy={orderBy}
                rowCount={vehicle.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên' },
                  { id: 'capacity', label: 'Sức chứa' },
                  { id: 'description', label: 'Mô tả thêm' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <VehicleTableRow
                      key={row.id}
                      name={row.name}
                      iconUrl={row.icon}
                      capacity={row.capacity}
                      description={row.description}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, vehicle.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={vehicle.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

export default VehiclePage;
