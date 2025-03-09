import { RouterProvider } from '@tanstack/solid-router';
import { router } from './router';

import './app.css';

export default function App() {
  return <RouterProvider router={router} />;
}
