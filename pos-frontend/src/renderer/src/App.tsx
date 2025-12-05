import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CashierDashboard from './pages/CashierDashboard';
import Stores from './pages/Stores';
import Branches from './pages/Branches';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Employees from './pages/Employees';
import Alerts from './pages/Alerts';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import CashierCustomers from './pages/CashierCustomers';
import BranchManagerDashboard from './pages/BranchManagerDashboard';
import BranchInventory from './pages/BranchInventory';
import BranchOrders from './pages/BranchOrders';
import BranchRefunds from './pages/BranchRefunds';
import BranchEmployees from './pages/BranchEmployees';
import BranchCustomers from './pages/BranchCustomers';

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/cashier/customers" element={<CashierCustomers />} />
        <Route path="/branch-dashboard" element={<BranchManagerDashboard />} />
        <Route path="/branch/orders" element={<BranchOrders />} />
        <Route path="/branch/refunds" element={<BranchRefunds />} />
        <Route path="/branch/inventory" element={<BranchInventory />} />
        <Route path="/branch/employees" element={<BranchEmployees />} />
        <Route path="/branch/customers" element={<BranchCustomers />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
