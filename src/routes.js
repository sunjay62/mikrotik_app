import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/pppclient";
import TableProfile from "views/admin/profileitem";
import { Route } from "react-router-dom";
// Icon Imports
import {
  MdHome,
  MdBarChart,
  MdPerson,
  MdCircle,
  MdBusiness,
  MdAccountCircle,
  MdMobiledataOff,
} from "react-icons/md";
import { FaServer } from "react-icons/fa";
import Sites from "views/admin/sites";
import ProtectedRoute from "utils/ProtectedRoute";
import Mikrotik from "views/admin/mikrotik";
import Account from "views/admin/account";
import ViewDetailMikrotik from "views/admin/mikrotik/view-detail";
import ViewDetailSite from "views/admin/sites/view-detail";
import ViewProfile from "views/admin/mikrotik/view-profile";
import MikrotikProfileDetail from "views/admin/mikrotik/view-profile/components/MikrotikProfileDetail";
import SiteProfileDetail from "views/admin/sites/view-profile/components/SiteProfileDetail";
import ViewDetailProfile from "views/admin/profileitem/view-detail";
import ViewDetailSecret from "views/admin/pppclient/view-detail";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "home",
    icon: <MdHome className="h-6 w-6" />,
    component: <ProtectedRoute element={<MainDashboard />} />,
  },
  {
    name: "MikroTik",
    layout: "/admin",
    icon: <FaServer className="h-5 w-6" />,
    path: "mikrotik",
    component: <ProtectedRoute element={<Mikrotik />} />,
  },
  {
    name: "View Mikrotik",
    layout: "/admin",
    path: "mikrotik/view-detail/:mikrotikId",
    component: <ProtectedRoute element={<ViewDetailMikrotik />} />,
  },
  {
    name: "Mikrotik Profile Detail",
    layout: "/admin",
    path: "mikrotik/view-profile",
    component: <ProtectedRoute element={<MikrotikProfileDetail />} />,
  },
  {
    name: "Profile",
    layout: "/admin",
    icon: <MdMobiledataOff className="h-6 w-6" />,
    path: "profile",
    component: <ProtectedRoute element={<TableProfile />} />,
  },
  {
    name: "View Mikrotik",
    layout: "/admin",
    path: "profile/view-detail/:name",
    component: <ProtectedRoute element={<ViewDetailProfile />} />,
  },
  {
    name: "PPP Client",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "ppp-client",
    component: <ProtectedRoute element={<DataTables />} />,
  },
  {
    name: "View Site",
    layout: "/admin",
    path: "ppp-client/view-detail/:client_id",
    component: <ProtectedRoute element={<ViewDetailSecret />} />,
  },
  {
    name: "Sites",
    layout: "/admin",
    icon: <MdBusiness className="h-6 w-6" />,
    path: "sites",
    component: <ProtectedRoute element={<Sites />} />,
  },
  {
    name: "View Site",
    layout: "/admin",
    path: "sites/view-detail/:siteId",
    component: <ProtectedRoute element={<ViewDetailSite />} />,
  },
  {
    name: "Sites Profile Detail",
    layout: "/admin",
    path: "sites/view-profile",
    component: <ProtectedRoute element={<SiteProfileDetail />} />,
  },
  {
    name: "Administrator",
    layout: "/admin",
    path: "administrator",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProtectedRoute element={<Account />} />,
  },
];
export default routes;
