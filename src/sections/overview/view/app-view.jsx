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

        setStaticData({
          ...accountData.result,
          ...numPostData.result,
          orderStatisticByVehicle: { ...orderStatisticByVehicleData.result },
        });
      } catch (error) {
        console.error('Fetch data failed:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
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
            subheader="(+43%) "
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
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
