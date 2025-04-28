import { Helmet } from 'react-helmet-async';

import { VehicleView } from 'src/sections/vehicle/view';

// ----------------------------------------------------------------------

export default function VehiclePage() {
  return (
    <>
      <Helmet>
        <title> Vehicle | Các phương tiện đang hỗ trợ </title>
      </Helmet>

      <VehicleView />
    </>
  );
}
