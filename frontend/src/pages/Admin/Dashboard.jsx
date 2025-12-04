import React from 'react';
import SummaryCards from '../../components/SummaryCards';
import RevenueChart from '../../components/RevenueChart';
import ProvinceProgress from '../../components/ProvinceProgress';
import ProjectDistribution from '../../components/ProjectDistribution';
import RecentContracts from '../../components/RecentContracts';
import DashboardFilters from '../../components/DashboardFilters';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">DASHBOARD TỔNG QUAN</h1>
        <p className="text-sm text-gray-500 mt-1">TỔNG HỢP THÔNG TIN VÀ THỐNG KÊ HỆ THỐNG</p>
      </div>

      {/* Filter Bar */}
      <DashboardFilters />

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <ProvinceProgress />
        <ProjectDistribution />
      </div>

      {/* Recent Contracts */}
      <RecentContracts />
    </div>
  );
};

export default Dashboard;
