//Protect Pages with Authentication (ProtectedRoute.js): Implement a higher-order component to restrict access to authenticated users only.

import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute(Component) {
  return function WithAuth(props) {
    const user = useAuth();
    const router = useRouter();

    if (!user) {
      router.push('/login');
      return null;
    }

    return <Component {...props} />;
  };
}
