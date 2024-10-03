import PropTypes from "prop-types";

function LeavesTable({ month }) {
	return (
		<div className="LeavesTable">
			<table>
				<caption>
					<p>
						Leave Details for the{" "}
						<mark>
							<strong>{month.name}</strong>
						</mark>
						month
					</p>
				</caption>

				<thead>
					<tr>
						<th>Leave Type</th>
						<th>Remainig till {month.name}</th>
						<th>Availed in {month.name}</th>
						<th>Total till {month.name}</th>
						<th>Form Submitted</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Casual</td>
						<td>5</td>
						<td>3</td>
						<td>8</td>
						<td>
							<input type="checkbox" />
						</td>
					</tr>
					<tr>
						<td>Medical</td>
						<td>5</td>
						<td>3</td>
						<td>8</td>
						<td>
							<input type="checkbox" />
						</td>
					</tr>
					<tr>
						<td>Annual</td>
						<td>5</td>
						<td>3</td>
						<td>8</td>
						<td>
							<input type="checkbox" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
LeavesTable.propTypes = {
	month: PropTypes.shape({
		name: PropTypes.string.isRequired
	}).isRequired
};
export default LeavesTable;
