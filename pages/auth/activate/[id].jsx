import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { withRouter } from 'next/router';

const ActivateAccount = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		buttonText: 'Activate Account',
		success: '',
		error: ''
	});

	const { name, token, buttonText, success, error } = state;

	useEffect(() => {
		let token = router.query.id;
		if (token) {
			const { name } = jwt.decode(token);
			setState({ ...state, name, token });
		}
	}, [router]);

	const clickSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Activating' });
		try {
			const response = await axios.post(`${API}/register/activate`, {
				token
			});
			setState({
				...state,
				name: '',
				token: '',
				buttonText: 'Activated',
				success: response.data.message
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Activate Account',
				error: err.response ? err.response.data.error : err.onString()
			});
		}
	};
	return (
		<div className="w-full max-w-sm m-auto">
			<h1 className="mt-8 text-xl">
				G'day {name}, ready to active your account?
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<button
				onClick={clickSubmit}
				className="shadow mt-8 bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
			>
				{buttonText}
			</button>
		</div>
	);
};

export default withRouter(ActivateAccount);
