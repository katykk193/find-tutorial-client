import { useState } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import {API} from '../config';

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

		} catch (err){
			setState({
				...state,
				buttonText: 'Register',
				error: err.response.data.error
			});
		}

	}

	const regitserForm = () => (
		<form className="w-full max-w-sm" onSubmit={handleSubmit}>
			<h1 className="mt-4 text-2xl">Register</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="md:w-3/3 mt-2">
				<input
					value={name}
					onChange={handleChange('name')}
					type="text"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Type your name"
				/>
			</div>
			<div className="md:w-3/3 mt-4">
				<input
					value={email}
					onChange={handleChange('email')}
					type="email"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Type your email"
				/>
			</div>
			<div className="md:w-3/3 mt-4">
				<input
					value={password}
					onChange={handleChange('password')}
					type="password"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Type your password"
				/>
			</div>
			<div className="md:w-3/3 mt-4 items-start">
				<button className="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);
	return (
		<>
			<div className="flex justify-center items-center">
				{regitserForm()}
			</div>
		</>
	);
};

export default Register;
