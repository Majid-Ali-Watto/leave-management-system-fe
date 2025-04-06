import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { store } from "../utils/store";

function LeaveApplied({ month, year, leaveTypes }) {
	const [leaves, setLeaves] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		leaveType: leaveTypes[0],
		fromDate: "",
		toDate: "",
		reason: ""
	});

	useEffect(() => {
		const fetchLeaves = async () => {
			try {
				setLoading(true);
				// Check if month is a string or an object with name property
				const monthName = typeof month === 'string' ? month : month?.name;
				if (!monthName) {
					throw new Error('Month is required');
				}
				const monthLeaves = await store.getLeavesByMonth(monthName, year);
				setLeaves(monthLeaves);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchLeaves();
	}, [month, year]);

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			// Validate dates
			if (!formData.fromDate || !formData.toDate) {
				throw new Error("Please select both from and to dates");
			}

			const from = new Date(formData.fromDate);
			const to = new Date(formData.toDate);

			if (from > to) {
				throw new Error("From date cannot be after to date");
			}

			// Calculate total leaves (excluding weekends)
			let totalLeaves = 0;
			let currentDate = new Date(from);
			while (currentDate <= to) {
				const day = currentDate.getDay();
				if (day !== 0 && day !== 6) { // Not Saturday or Sunday
					totalLeaves++;
				}
				currentDate.setDate(currentDate.getDate() + 1);
			}

			// Check if user has enough leaves
			const leaveCounts = await store.getLeaveCounts(formData.leaveType, year);
			if (leaveCounts.remaining < totalLeaves) {
				throw new Error(`Not enough ${formData.leaveType} leaves remaining. Available: ${leaveCounts.remaining}`);
			}

			// Add the leave
			await store.addLeave({
				leaveType: formData.leaveType,
				fromDate: from.toISOString(),
				toDate: to.toISOString(),
				totalLeaves,
				reason: formData.reason,
				month: typeof month === 'string' ? month : month?.name,
				year,
				status: "approved"
			});

			// Update form submission status for the month
			await store.updateFormSubmissionStatus(
				formData.leaveType,
				typeof month === 'string' ? month : month?.name,
				year,
				true
			);

			// Refresh leaves list
			const monthName = typeof month === 'string' ? month : month?.name;
			const updatedLeaves = await store.getLeavesByMonth(monthName, year);
			setLeaves(updatedLeaves);
			
			// Reset form
			setFormData({
				leaveType: leaveTypes[0],
				fromDate: "",
				toDate: "",
				reason: ""
			});
			setShowForm(false);
			setError(null);
		} catch (err) {
			setError(err.message);
		}
	};

	if (loading) {
		return <div className="text-center py-4">Loading...</div>;
	}

	if (error) {
		return <div className="text-red-500 text-center py-4">Error: {error}</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">
					Leaves Applied in{" "}
					<mark className="bg-primary-100 px-2 py-1 rounded">
						<strong>{typeof month === 'string' ? month : month?.name}</strong>
					</mark>
				</h3>
				<button
					onClick={() => setShowForm(!showForm)}
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
				>
					{showForm ? "Cancel" : "Apply New Leave"}
				</button>
			</div>

			{showForm && (
				<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Leave Type</label>
							<select
								name="leaveType"
								className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
								value={formData.leaveType}
								onChange={handleFormChange}
								required
							>
								{leaveTypes.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">From Date</label>
							<input
								type="date"
								name="fromDate"
								className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
								value={formData.fromDate}
								onChange={handleFormChange}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">To Date</label>
							<input
								type="date"
								name="toDate"
								className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
								value={formData.toDate}
								onChange={handleFormChange}
								required
							/>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Reason</label>
							<textarea
								name="reason"
								className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
								value={formData.reason}
								onChange={handleFormChange}
								required
								rows={3}
							/>
						</div>
					</div>

					{error && <div className="text-red-500">{error}</div>}

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Apply Leave
					</button>
				</form>
			)}

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200">
					<caption className="caption-top py-4">
						<p className="text-lg font-semibold">
							Leaves Applied in{" "}
							<mark className="bg-primary-100 px-2 py-1 rounded">
								<strong>{typeof month === 'string' ? month : month?.name}</strong>
							</mark>
						</p>
					</caption>

					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{leaves.map((leave) => (
							<tr key={leave.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.leaveType}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.totalLeaves}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.reason}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<span className={`px-2 py-1 rounded-full text-xs ${
										leave.status === 'approved' ? 'bg-green-100 text-green-800' :
										leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
										'bg-yellow-100 text-yellow-800'
									}`}>
										{leave.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

LeaveApplied.propTypes = {
	month: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			name: PropTypes.string.isRequired
		})
	]).isRequired,
	year: PropTypes.number.isRequired,
	leaveTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LeaveApplied;
