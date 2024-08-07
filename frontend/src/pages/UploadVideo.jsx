import { useForm } from 'react-hook-form';
import axios from 'axios';

const UploadVideo = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            // Create a FormData object to hold the file
            const formData = new FormData();
            formData.append('video', data.videoUrl[0]);

      
            // Upload the video to S3
            const uploadRes = await axios.post('http://localhost:5000/api/videos/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
      
            console.log(uploadRes.data.videoUrl)
            alert('Video successfully uploaded');
          } catch (error) {
            console.error(error);
            alert('Error uploading video');
          }
    };

  return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="videoUrl">Upload Video</label>
                <input id="videoUrl" type="file" accept="video/*" {...register('videoUrl', { required: 'Video upload is required' })} />
                {errors.videoUrl && <p>{errors.videoUrl.message}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
  )
}

export default UploadVideo
