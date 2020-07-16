import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { isAuth } from '../helpers/auth';

const Register = () => {
	const [state, setState] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		success: '',
		buttonText: 'Register'
	});

	const { name, email, password, error, success, buttonText } = state;

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: '',
			success: '',
			buttonText: 'Register'
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setState({ ...state, buttonText: 'Registering' });

		try {
			const response = await axios.post(`${API}/register`, {
				name,
				email,
				password
			});

			setState({
				...state,
				name: '',
				email: '',
				password: '',
				buttonText: 'Submitted',
				success: response.data.message
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Register',
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const regitserForm = () => (
		<form className="w-full max-w-sm" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-20 text-2xl sm:text-5xl text-purple-400 font-bold">
				Register
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-2">
				<input
					value={name}
					onChange={handleChange('name')}
					type="text"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					placeholder="Type your name"
					required
				/>
			</div>
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
	return <>{regitserForm()}</>;
};

export default Register;
