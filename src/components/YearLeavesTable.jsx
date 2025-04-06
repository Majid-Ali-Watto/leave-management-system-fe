import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { store } from "../utils/store";

function YearLeavesTable({ year }) {
	const [leaveData, setLeaveData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const leaveTypes = await store.getLeaveTypes();
				const yearlyLeaves = await store.getLeavesByYear(year);
				
				const leaveSummary = leaveTypes.map(leaveType => {
					const typeLeaves = yearlyLeaves.filter(leave => leave.leaveType === leaveType.type);
					const availedLeaves = typeLeaves.reduce((sum, leave) => sum + Number(leave.totalLeaves), 0);
					
					return {
						type: leaveType.type,
						total: leaveType.totalLeaves,
						availed: availedLeaves,
						remaining: leaveType.totalLeaves - availedLeaves
					};
				});

				setLeaveData(leaveSummary);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchData();
	}, [year]);

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
						Leave Summary for{" "}
						<mark className="bg-primary-100 px-2 py-1 rounded">
							<strong>{year}</strong>
						</mark>
					</p>
				</caption>

				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Leaves</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availed Leaves</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Leaves</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{leaveData.map((leave) => (
						<tr key={leave.type} className="hover:bg-gray-50">
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.type}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.total}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.availed}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.remaining}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

YearLeavesTable.propTypes = {
	year: PropTypes.number.isRequired
};

export default YearLeavesTable;
