import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const listItemStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '10px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  marginBottom: '10px'
};

const placeholderStyle = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  padding: '10px',
  textAlign: 'center'
};

const ListItem = ({ fields, data, onDelete }) => {
  return (
    <div style={listItemStyle} className='group hover:bg-gray-50 transition-all animate-fadeIn'>
      {fields.map((field, index) => (
        <div key={index} style={placeholderStyle}>
          {data[field] !== undefined ? data[field] : 'Placeholder'}
        </div>
      ))}
                <Button
            variant="accent"
            shape="roundedFull"
            size="circle"
            onClick={() => onDelete(data._id)}
            className="opacity-0 group-hover:opacity-100"
            showToast={true}
            toastText="Expense has been deleted"
          >
            X</Button>
    </div>
  );
};

ListItem.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ListItem;