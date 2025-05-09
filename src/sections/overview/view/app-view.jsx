import { faker } from '@faker-js/faker';
import { useEffect, useReducer } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { authAPI, END_POINTS } from 'src/configs/api';

import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

function transformDataForChart(data) {
  // Sắp xếp theo thứ tự tháng tăng dần
  data.sort((a, b) => {
    const [ma, ya] = a.month.split('-').map(Number);
    const [mb, yb] = b.month.split('-').map(Number);
    return new Date(ya, ma - 1) - new Date(yb, mb - 1);
  });

  const labels = data.map((d) => `01/${d.month}`);
  const cashData = [];
  const vnpayData = [];

  data.forEach((d) => {
    const amount = parseFloat(d.totalAmount);
    if (d.paymentMethod === 'CASH') {
      cashData.push(amount);
      vnpayData.push(0);
    } else if (d.paymentMethod === 'VNPAY') {
      vnpayData.push(amount);
      cashData.push(0);
    } else {
      // Nếu có loại thanh toán khác, có thể mở rộng ở đây
      cashData.push(0);
      vnpayData.push(0);
    }
  });

  return {
    labels,
    series: [
      {
        name: 'CASH',
        type: 'column',
        fill: 'solid',
        data: cashData,
      },
      {
        name: 'VNPAY',
        type: 'column',
        fill: 'solid',
        data: vnpayData,
      },
    ],
  };
}

export default function AppView() {
  const [staticData, setStaticData] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      basicAccount: 0,
      shipperAccount: 0,
      totalPosts: 0,
      finishedPosts: 0,
      orderStatisticByVehicle: {},
      monthlyStatisticAmount: [],
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountRes = await authAPI().get(END_POINTS.totalAccount);
        const accountData = await accountRes.data;

        const numPostRes = await authAPI().get(END_POINTS.totalPost);
        const numPostData = await numPostRes.data;

        const orderStatisticByVehicle = await authAPI().get(END_POINTS.getPostStatisticByVehicle);
        const orderStatisticByVehicleData = await orderStatisticByVehicle.data;

        const monthlyStatisticAmountRest = await authAPI().get(END_POINTS.getTransactionAmount);
        const monthlyStatisticAmountData = await monthlyStatisticAmountRest.data;

        setStaticData({
          ...accountData.result,
          ...numPostData.result,
          orderStatisticByVehicle: { ...orderStatisticByVehicleData.result },
          monthlyStatisticAmount: [...monthlyStatisticAmountData.result],
        });
      } catch (error) {
        console.error('Fetch data failed:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('monthlyStatisticAmount', staticData.monthlyStatisticAmount);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Chào bạn !
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tài khoản cơ bản"
            total={staticData.basicUserAccount}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tài khoản shipper"
            total={staticData.shipperAccount}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/shipper.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tổng số đơn hàng"
            total={staticData.totalPosts}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/checklist.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Đơn hàng đã giao"
            total={staticData.finishedPosts}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/done.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Thống kê doanh thu"
            subheader="(+43%) hơn năm trước"
            chart={transformDataForChart(staticData.monthlyStatisticAmount)}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Đơn hàng theo phương tiện"
            chart={{
              series: Object.keys(staticData.orderStatisticByVehicle).map((key) => ({
                label: key,
                value: staticData.orderStatisticByVehicle[key],
              })),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Tỉ lệ"
            chart={{
              series: [
                { label: 'Thành phố Thủ Đức', value: 12 },
                { label: 'Quân Bình Tân', value: 8 },
                { label: 'Huyện Bình Chánh', value: 8 },
                { label: 'Quận Gò Vấp', value: 6 },
                { label: 'Quận 12', value: 6 },
                { label: 'Quận Bình Thạnh', value: 5 },
                { label: 'Huyện Hóc Môn', value: 5 },
                { label: 'Huyện Củ Chi', value: 4 },
                { label: 'Quận Tân Phú', value: 4 },
                { label: 'Quận Tân Bình', value: 4 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
