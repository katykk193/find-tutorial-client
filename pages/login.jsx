import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {
	const [state, setState] = useState({
		email: '',
		password: '',
		error: '',
		success: '',
		buttonText: 'Login'
	});

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const { email, password, error, success, buttonText } = state;

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: '',
			success: '',
			buttonText: 'Login'
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setState({ ...state, buttonText: 'Logging in' });

		try {
			const response = await axios.post(`${API}/login`, {
				email,
				password
			});

			authenticate(response, () =>
				isAuth() && isAuth().role === 'admin'
					? Router.push('/admin')
					: Router.push('/user')
			);
		} catch (err) {
			setState({
				...state,
				buttonText: 'Login',
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const loginForm = () => (
		<form className="bg-white p-10 my-24 mx-5 shadow-xl w-full md:w-1/2 lg:w-1/3" onSubmit={handleSubmit}>
			<h2 className="mb-8 text-2xl text-red-400 font-semibold">
				Login
			</h2>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4">
				<input
					value={email}
					onChange={handleChange('email')}
					type="email"
					className="shadow border appearance-none border rounded w-full py-2 px-3 text-gray-600 focus:shadow-xl"
					placeholder="Type your email"
					required
				/>
			</div>
			<div className="w-full mt-4">
				<input
					value={password}
					onChange={handleChange('password')}
					type="password"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 mb-3 focus:shadow-xl"
					placeholder="Type your password"
					required
				/>
			</div>
			<div className="w-full mt-8 items-start">
				<button className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
				<Link href="/auth/password/forgot">
					<a className="float-right text-red-500 border-b border-transparent hover:border-red-500">
						Forgot Password
					</a>
				</Link>
			</div>
		</form>
	);
	return <div className="flex justify-center">{loginForm()}</div>;
};

export default Login;
