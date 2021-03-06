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
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const passwordResetForm = () => (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-10 my-10 sm:my-24 mx-5 shadow-xl w-full md:w-1/2 lg:w-1/3"
		>
			<h1 className="mb-8 text-2xl text-red-400 font-semibold">
				Hi {name}, ready to reset password?
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4 text-gray-600">
				<label className="font-semibold">Password</label>
				<input
					value={newPassword}
					onChange={handleChange}
					type="password"
					className="shadow border appearance-none border rounded w-full py-2 px-3 focus:shadow-xl"
					placeholder="Type new password"
					required
				/>
			</div>
			<div className="w-full mt-8 items-start">
				<button className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);

	return <div className="flex justify-center">{passwordResetForm()}</div>;
};

export default withRouter(ResetPassword);
