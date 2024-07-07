import React from 'react';
import PropTypes from 'prop-types';

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

const ListItem = ({ fields, data }) => {
  return (
    <div style={listItemStyle}>
      {fields.map((field, index) => (
        <div key={index} style={placeholderStyle}>
          {data[field] !== undefined ? data[field] : 'Placeholder'}
        </div>
      ))}
    </div>
  );
};

ListItem.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.object.isRequired
};

export default ListItem;