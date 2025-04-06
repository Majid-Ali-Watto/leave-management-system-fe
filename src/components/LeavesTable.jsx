import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { store } from "../utils/store";
import LeaveTableRow from "./LeaveTableRow";

function LeavesTable({ month, year }) {
	const [leaveData, setLeaveData] = useState([]);
	const [formSubmitted, setFormSubmitted] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const leaveTypes = await store.getLeaveTypes();
				const formStatusPromises = leaveTypes.map(async (leaveType) => {
					const status = await store.getFormSubmissionStatus(leaveType.type, month.name, year);
					return { [leaveType.type]: status };
				});
				
				const formStatuses = await Promise.all(formStatusPromises);
				const formStatusMap = formStatuses.reduce((acc, status) => ({ ...acc, ...status }), {});
				
				setFormSubmitted(formStatusMap);
				setLeaveData(leaveTypes);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchData();
	}, [month.name, year]);

	const handleCheckboxChange = async (leaveType) => {
		try {
			const newStatus = !formSubmitted[leaveType];
			await store.updateFormSubmissionStatus(leaveType, month.name, year, newStatus);
			setFormSubmitted(prev => ({
				...prev,
				[leaveType]: newStatus
			}));
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
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white border border-gray-200">
				<caption className="caption-top py-4">
					<p className="text-lg font-semibold">
						Leave Details for the{" "}
						<mark className="bg-primary-100 px-2 py-1 rounded">
							<strong>{month.name}</strong>
						</mark>
						{" "}month
					</p>
				</caption>

				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining till {month.name}</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availed in {month.name}</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total till {month.name}</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Submitted</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{leaveData.map((leave) => (
						<LeaveTableRow
							key={leave.type}
							leaveType={leave.type}
							month={month.name}
							year={year}
							formSubmitted={formSubmitted[leave.type] || false}
							onFormStatusChange={handleCheckboxChange}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

LeavesTable.propTypes = {
	month: PropTypes.shape({
		name: PropTypes.string.isRequired
	}).isRequired,
	year: PropTypes.number.isRequired
};

export default LeavesTable;
