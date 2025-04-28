import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Trang chủ',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Tài khoản',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Đơn hàng',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Phương tiện',
    path: '/vehicle',
    icon: icon('car-svgrepo-com'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
