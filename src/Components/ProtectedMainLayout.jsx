import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function ProtectedMainLayout() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
     navbar
      <div className="flex flex-col w-full overflow-hidden">
        header
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedMainLayout