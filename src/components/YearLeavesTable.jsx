import { useEffect, useState } from "react";
import years from "../utils/Years";
import leaves from "../utils/store";
import PropTypes from "prop-types";

function YearsLeavesTable({ setYear }) {
	const [leave, setLeave] = useState([]);
	useEffect(() => {
		setLeave(leaves.getLeaves());
	}, []);
	function getAvailed(type) {
		console.warn(leave)
		const list = leave?.filter((l) => {
			return l?.leaveType == type;
		});
		const total = list?.reduce((total, leave) => total + Number(leave.totalLeaves), 0);
		return total;
	}
	return (
		<div className="LeavesTable">
			<table>
				<caption>
					<p>
						Leave Details for the year
						<select
							onChange={(event) => setYear(event.target.value)}
							// defaultValue=""
						>
							<option
								value=""
								disabled>
								Select a year
							</option>
							{years.map((year) => (
								<option
									key={year}
									value={year}>
									{year}
								</option>
							))}
						</select>
					</p>
				</caption>
				<thead>
					<tr>
						<th>Leave Type</th>
						<th>Remaining</th>
						<th>Availed</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{leaves.getTotalLeaves().map((leave) => (
						<tr key={leave.type}>
							<td>{leave.type}</td>
							<td>{leave.count - getAvailed(leave.type) || 0}</td>
							<td>{getAvailed(leave.type) || 0}</td>
							<td>{leave.count}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

YearsLeavesTable.propTypes = {
	setYear: PropTypes.func.isRequired
};

export default YearsLeavesTable;
