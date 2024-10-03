import { useState } from "react";
import PropTypes from "prop-types";
import leaves from "../utils/store";

function AddAllLeavesData({ leaveTypes }) {
	const [leaveType, setLeaveType] = useState(leaveTypes[0]);
	const [totalLeaves, setTotalLeaves] = useState(1);

	const handleSubmit = (event) => {
		event.preventDefault();
		leaves.addTotalLeaves({ type: leaveType, count: totalLeaves });
	};

	return (
		<div className="add-leaves-container">
			<form
				className="add-leaves-form"
				onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="leave-type">Leave Type</label>
					<select
						id="leave-type"
						name="leaveType"
						value={leaveType}
						onChange={(e) => setLeaveType(e.target.value)}>
						{leaveTypes.map((type, index) => (
							<option
								key={index}
								value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="total-leaves">Total Leaves</label>
					<select
						id="total-leaves"
						name="totalLeaves"
						value={totalLeaves}
						onChange={(e) => setTotalLeaves(Number(e.target.value))}>
						{Array.from({ length: 30 }, (_, i) => i + 1).map((v, i) => (
							<option
								key={i}
								value={v}>
								{v}
							</option>
						))}
					</select>
				</div>
				<button type="submit">Save Data</button>
			</form>
		</div>
	);
}

AddAllLeavesData.propTypes = {
	leaveTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default AddAllLeavesData;
