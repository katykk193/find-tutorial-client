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
				error: err.response.data.error
			});
		}
	};

	const loginForm = () => (
		<form className="w-full max-w-sm" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-20 text-2xl md:text-5xl text-purple-400 font-bold">
				Login
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4">
				<input
					value={email}
					onChange={handleChange('email')}
					type="email"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					placeholder="Type your email"
					required
				/>
			</div>
			<div className="w-full mt-4">
				<input
					value={password}
					onChange={handleChange('password')}
					type="password"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
					placeholder="Type your password"
					required
				/>
			</div>
			<div className="w-full mt-8 items-start">
				<button className="shadow-xl bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);
	return (
		<>
			{JSON.stringify(isAuth())}
			{loginForm()}
			<Link href="/auth/password/forgot">
				<a className="float-right text-red-600 border-b border-transparent hover:border-red-600">Forgot Password</a>
			</Link>
		</>
	);
};

export default Login;
