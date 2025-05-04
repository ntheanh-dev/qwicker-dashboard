import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Grid, Modal, Divider } from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};
export default function OrderTableRow({
  selected,
  postTime,
  product,
  price,
  poster,
  pickupLocation,
  picker,
  dropLocation,
  vehicle,
  status,
  handleClick,
  data,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenModal = () => {
    setOpen(false);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{poster}</TableCell>
        <TableCell>{pickupLocation}</TableCell>
        <TableCell>{picker}</TableCell>
        <TableCell>{dropLocation}</TableCell>
        <TableCell>{vehicle}</TableCell>
        <TableCell>{postTime}</TableCell>
        <TableCell>{product}</TableCell>
        <TableCell>{price}</TableCell>

        <TableCell>
          <Label color={(status === 'OFFLINE' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="order-detail-modal">
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Chi tiết đơn hàng: </Typography>
            <IconButton onClick={handleCloseModal}>
              <Iconify icon="ic:baseline-close" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">
            <strong>Mô tả:</strong> {data.description}
          </Typography>
          <Typography variant="body2">
            <strong>Thời gian đăng:</strong> {data.postTime}
          </Typography>
          <Typography variant="body2">
            <strong>Loại giao hàng:</strong> Giao ngay
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Trạng thái:</strong> {data.status}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">📦 Sản phẩm</Typography>
          <Typography>
            <strong>Danh mục:</strong> {data.product.category.name}
          </Typography>
          <Typography>
            <strong>Số lượng:</strong> {data.product.quantity}
          </Typography>
          <Typography>
            <strong>Khối lượng:</strong> {data.product.mass}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">📍 Điểm lấy hàng</Typography>
          <Typography>
            <strong>Liên hệ:</strong> {poster}
          </Typography>
          <Typography>
            <strong>SĐT:</strong> {data.pickupLocation.phoneNumber}
          </Typography>
          <Typography>
            <strong>Địa chỉ:</strong> {data.pickupLocation.formattedAddress}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">📍 Điểm giao hàng</Typography>
          <Typography>
            <strong>Liên hệ:</strong> {picker}
          </Typography>
          <Typography>
            <strong>SĐT:</strong> {data.dropLocation.phoneNumber}
          </Typography>
          <Typography>
            <strong>Địa chỉ:</strong> {data.dropLocation.formattedAddress}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">🛵 Phương tiện</Typography>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Avatar
                src={data.vehicleType.icon}
                sx={{
                  width: 34,
                  height: 34,
                  border: '2px solid #1976d2',
                  backgroundColor: '#fff',
                  objectFit: 'fill',
                }}
              />
            </Grid>
            <Grid item xs>
              <Typography>
                <strong>{data.vehicleType.name}</strong>
              </Typography>
              <Typography variant="body2">{data.vehicleType.description}</Typography>
              <Typography variant="body2">
                <strong>Khả năng:</strong> {data.vehicleType.capacity}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">💰 Thanh toán</Typography>
          <Typography>
            <strong>Phương thức:</strong>{' '}
            {data.payment.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
          </Typography>
          <Typography>
            <strong>Số tiền:</strong> {price} VND
          </Typography>
          <Typography>
            <strong>Người thanh toán:</strong> {data.payment.posterPay ? 'Người gửi' : 'Người nhận'}
          </Typography>
        </Box>
      </Modal>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpenModal}>
          <Iconify icon="fluent:apps-list-detail-20-regular" sx={{ mr: 2 }} />
          Xem chi tiết
        </MenuItem>

        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>
      </Popover>
    </>
  );
}

OrderTableRow.propTypes = {
  postTime: PropTypes.any,
  product: PropTypes.any,
  price: PropTypes.any,
  poster: PropTypes.any,
  pickupLocation: PropTypes.any,
  picker: PropTypes.any,
  dropLocation: PropTypes.any,
  vehicle: PropTypes.any,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  status: PropTypes.string,
  data: PropTypes.string,
};
