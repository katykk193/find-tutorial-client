export const showSuccessMessage = (success) => (
	<div className="bg-green-100 border border-green-200 text-green-700 px-3 py-2">
		{success}
	</div>
);

export const showErrorMessage = (error) => (
	<div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded">
		{error}
	</div>
);
