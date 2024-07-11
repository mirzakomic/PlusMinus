import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className,
  variant,
  size,
  fontSize, 
  shape, 
  href, 
  type,
  showToast,
  toastText
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium transition duration-300';
  const variantMap = {
      primary: 'bg-primary text-secondary  hover:bg-secondary hover:text-primary shadow-lg',
      secondary: 'bg-secondary text-primary hover:bg-primary hover:text-secondary shadow-lg',
      accent: 'bg-accent text-white hover:bg-black shadow-lg',
  };
  const sizeMap = {
    big: 'h-14 px-5 py-5 text-lg',
    small: 'h-10 px-5 text-sm',
    circle: 'p-0 w-10 h-10'
  }
  const shapeMap = {
    roundedFull: 'rounded-full',
    xl: 'rounded-2xl',
    xxl: 'rounded-3xl',
    xxxl: 'rounded-4xl',
    no: ''
  }
  const variantClass = variantMap[variant] || primary;
  const sizeClass = sizeMap[size] || big;
  const fontSizeClass = fontSize || '';
  const shapeClass = shapeMap[shape] || '';
  const disabledClass = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  const classNames = `${baseClass} ${variantClass} ${sizeClass} ${shapeClass} ${disabledClass} ${fontSizeClass} ${className}`.trim();

  const handleClick = async (e) => {
    if (onClick) {
      try {
        await onClick(e);
        if (showToast) {
          toast.success(toastText || "Action was successful!");
        }
      } catch (error) {
        if (showToast) {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  if (href) {
    return (
      <Link to={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={classNames} 
      onClick={handleClick} 
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent']),
  size: PropTypes.oneOf(['small', 'big', 'circle']),
  fontSize: PropTypes.string,
  shape: PropTypes.oneOf(['roundedFull', 'xl', 'xxl', 'xxxl', 'no']),
  href: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  showToast: PropTypes.bool,
  toastText: PropTypes.string
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: '',
  variant: 'primary',
  size: 'small',
  fontSize: '',
  shape: 'square',
  href: null,
  type: 'button',
  showToast: false,
  toastText: ''

};

export default Button;