import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	showSuccessMessage,
	showErrorMessage
} from '../../../../helpers/alerts';
import { API } from '../../../../config';
import jwt from 'jsonwebtoken';
import Router, { withRouter } from 'next/router';

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		newPassword: '',
		buttonText: 'Reset Password',
		success: '',
		error: ''
	});

	const { name, token, newPassword, buttonText, success, error } = state;

	useEffect(() => {
		const decoded = jwt.decode(router.query.id);
		if (decoded) {
			setState({ ...state, name: decoded.name, token: router.query.id });
		}
	}, [router]);

	const handleChange = (e) => {
		setState({
			...state,
			newPassword: e.target.value,
			success: '',
			error: ''
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Sending' });
		try {
			const response = await axios.put(`${API}/reset-password`, {
				resetPasswordLink: token,
				newPassword
			});

			setState({
				...state,
				newPassword: '',
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

	const passwordResetForm = () => (
		<form onSubmit={handleSubmit} className="w-full max-w-sm">
			<h1 className="mt-4 mb-5 sm:mb-20 text-2xl md:text-5xl text-purple-400 font-bold">
				Hi {name}, ready to reset password?
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4">
				<input
					value={newPassword}
					onChange={handleChange}
					type="password"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					placeholder="Type new password"
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

	return <>{passwordResetForm()}</>;
};

export default withRouter(ResetPassword);
