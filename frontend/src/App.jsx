import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import Contracts from './pages/Admin/Contracts';
import Stations from './pages/Admin/Stations';
import Columns from './pages/Admin/Columns';
import VolumeOther from './pages/Admin/VolumeOther';
import Progress from './pages/Admin/Progress';
import Comparison from './pages/Admin/Comparison';
import Reports from './pages/Admin/Reports';
import Profile from './pages/Admin/Profile';
import KTVSurveyContracts from './pages/KTV/KTVSurveyContracts';
import KTVSurveyDetail from './pages/KTV/KTVSurveyDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - không có sidebar */}
        <Route path="/login" element={<Login />} />
        
        {/* Các trang khác - có sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/columns" element={<Columns />} />
          <Route path="/volume-other" element={<VolumeOther />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          {/* KTV Routes */}
          <Route path="/hopdong-can-khaosat" element={<KTVSurveyContracts />} />
          <Route path="/ktv/survey/:id" element={<KTVSurveyDetail />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
