/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { motion, AnimatePresence } from "framer-motion";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu); // Toggle visibilitas submenu
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.layout === "/admin" || route.layout === "/auth") {
        if (route.submenu) {
          return (
            <div
              className="relative mb-3 flex hover:cursor-pointer"
              onClick={toggleSubMenu}
            >
              <li
                className="my-[3px] flex cursor-pointer items-center px-8"
                key={index}
              >
                <div>
                  <div className="flex cursor-pointer items-center">
                    <span
                      className={`${
                        activeRoute(route.path) === true
                          ? "font-bold text-brand-500 dark:text-white"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {route.icon ? route.icon : <DashIcon />}{" "}
                    </span>
                    <p
                      className={`leading-1 ml-4 flex ${
                        activeRoute(route.path) === true
                          ? "font-bold text-navy-700 dark:text-white"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {route.name}
                    </p>
                  </div>
                  <AnimatePresence>
                    {showSubMenu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                        key={index + "_submenu"}
                      >
                        {createLinks(route.submenu)} {/* Recursive call */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            </div>
          );
        } else {
          return (
            <Link key={index} to={route.layout + "/" + route.path}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  key={index}
                >
                  <span
                    className={`${
                      activeRoute(route.path) === true
                        ? "font-bold text-brand-500 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${
                      activeRoute(route.path) === true
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.name}
                  </p>
                </li>
                {activeRoute(route.path) ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
            </Link>
          );
        }
      }
      return null;
    });
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;
