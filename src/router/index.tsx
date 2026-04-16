import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequestsPage } from '../features/requests';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/requests" replace /> },
  { path: '/requests', element: <RequestsPage /> },
]);
