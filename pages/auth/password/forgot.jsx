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
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const passwordForgotForm = () => (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-10 my-10 sm:my-24 mx-5 shadow-xl w-full md:w-1/2 lg:w-1/3"
		>
			<h1 className="mb-8 text-2xl text-red-400 font-semibold">
				Forgot Password
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4 text-gray-600">
				<label className="font-semibold">Email</label>
				<input
					value={email}
					onChange={handleChange}
					type="email"
					className="shadow border appearance-none border rounded w-full py-2 px-3 focus:shadow-xl"
					placeholder="Type your email"
					required
				/>
			</div>
			<div className="mt-8">
				<button className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);

	return <div className="flex justify-center">{passwordForgotForm()}</div>;
};

export default ForgotPassword;
