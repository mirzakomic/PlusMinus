import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx'; // Optional utility to combine class names
import { Link, NavLink } from 'react-router-dom';

const NavItem = ({ className, onClick, children, to }) => {
  // Default class names
  const defaultClassName = "text-white uppercase font-bold text-sm hover:bg-secondary hover:text-primary p-3 rounded-2xl transition-all";
  
  return (
    <NavLink 
      className={clsx(defaultClassName, className)} // Combining default and passed class names
      onClick={onClick}
      to={to}
    >
      {children}
    </NavLink>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
};

NavItem.defaultProps = {
  className: '',
  onClick: () => {}
};

export default NavItem;