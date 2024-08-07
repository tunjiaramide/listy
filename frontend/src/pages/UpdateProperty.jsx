import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const property = response.data;
        setValue('title', property.title);
        setValue('description', property.description);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/api/properties/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/listproperty');
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title', { required: 'Title is required' })} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description', { required: 'Description is required' })} />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      <button type="submit">Update Property</button>
    </form>
    <Link to="/listproperty">Your Properties</Link>
    </>
  );
};

export default UpdateProperty;
