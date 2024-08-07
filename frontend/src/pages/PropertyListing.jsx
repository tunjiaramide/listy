import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PropertyListing() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProperties(properties.filter(property => property._id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div>
      <h1>Property Listings</h1>
      <Link to="/addproperty">Add Property</Link>
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            {property.title} - {property.description} - {property.videoUrl} <br/>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
            <Link to={`/updateproperty/${property._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
