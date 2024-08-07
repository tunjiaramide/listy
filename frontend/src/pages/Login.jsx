import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', data);
            localStorage.setItem('token', response.data.token);
            navigate('/listproperty');
        } catch (error) {
            console.error(error.response.data); // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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

export default Login;

