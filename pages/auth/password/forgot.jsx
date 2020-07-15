import { useState } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';

const ForgotPassword = () => {
	const [state, setState] = useState({
		email: '',
		buttonText: 'Forgot Password',
		success: '',
		error: ''
	});

	const { email, buttonText, success, error } = state;

	const handleChange = (e) => {
		setState({ ...state, email: e.target.value, success: '', error: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Sending' });
		try {
			const response = await axios.put(`${API}/forgot-password`, {
				email
			});
			setState({
				...state,
				email: '',
				buttonText: 'Done',
				success: response.data.message
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Forgot Password',
				error: err.response ? err.response.data.error : err.onString()
			});
		}
	};

	const passwordForgotForm = () => (
		<form onSubmit={handleSubmit} className="w-full max-w-sm">
			<h1 className="mt-4 mb-5 sm:mb-20 text-2xl md:text-5xl text-purple-400 font-bold">
				Forgot Password
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4">
				<input
					value={email}
					onChange={handleChange}
					type="email"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					placeholder="Type your email"
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

	return <>{passwordForgotForm()}</>;
};

export default ForgotPassword;
