import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AddProperty = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      // Create a FormData object to hold the file
      const formData = new FormData();
      formData.append('video', data.videoUrl[0]);

      // Upload the video to S3
      const uploadRes = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      const videoUrl = uploadRes.data.videoUrl;

      // Submit the property details with the video URL
      const propertyData = {
        title: data.title,
        description: data.description,
        videoUrl: videoUrl
      };

      await axios.post('http://localhost:5000/api/properties', propertyData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Property created successfully');
      navigate('/listproperty');

    } catch (error) {
      console.error(error);
      alert('Error creating property');
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
      <div>
        <label htmlFor="videoUrl">Upload Video</label>
        <input id="videoUrl" type="file" accept="video/*" {...register('videoUrl', { required: 'Video upload is required' })} />
        {errors.videoUrl && <p>{errors.videoUrl.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
    <br/>
    <Link to="/listproperty">Your Properties</Link>
    </>
  );
}

export default AddProperty;
