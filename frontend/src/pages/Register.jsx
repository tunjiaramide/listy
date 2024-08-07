import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', data);
            alert('Registration successfully');
            navigate('/login');
            console.log(response.data); // Handle success
          } catch (error) {
            console.error(error.response.data); // Handle error
          }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" {...register('name', { required: 'Name is required' })} />
                {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" {...register('email', { required: 'Email is required' })} />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Register;