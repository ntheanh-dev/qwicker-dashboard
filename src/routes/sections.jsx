import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthContext } from 'src/auth/AuthProvider';

import ProtectedRoute from './ProtectedRoute';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useContext(AuthContext);

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        // { element: <IndexPage />, index: true },
        { path: '/', element: <ProtectedRoute />, children: [{ element: <IndexPage /> }] },
        { path: 'user', element: <ProtectedRoute />, children: [{ element: <UserPage /> }] },
        {
          path: 'products',
          element: <ProtectedRoute />,
          children: [{ element: <ProductsPage /> }],
        },
        { path: 'blog', element: <ProtectedRoute />, children: [{ element: <BlogPage /> }] },
      ],
    },
    {
      path: 'login',
      element: user ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
