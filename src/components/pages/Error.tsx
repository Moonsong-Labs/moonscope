interface NotFoundProps {
	message?: string;
}

export const NotFound = ({ message = "Page Not Found" }) => {
	return (
		<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div class="p-8 bg-white rounded shadow-lg">
				<h1 class="text-4xl font-bold text-red-500">404</h1>
				<p class="text-gray-700 mt-4">{message}</p>
			</div>
		</div>
	);
};
