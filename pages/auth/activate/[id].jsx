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
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};
	return (
		<div className="text-red-400 flex justify-center">
			<div className="bg-white p-6 sm:p-10 my-6 sm:my-24 mx-5 shadow-xl w-full md:w-2/3 xl:w-1/3">
				<h1 className="mb-5 text-2xl font-semibold">
					G'day {name}, ready to active your account?
				</h1>
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}

				<div>
					<button
						onClick={clickSubmit}
						className="shadow btn-primary mt-8 bg-teal-500 text-white font-bold py-2 px-4 rounded"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default withRouter(ActivateAccount);
