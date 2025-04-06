import { useState } from "react";
import PropTypes from "prop-types";
import { store } from "../utils/store";

function AddAllLeavesData({ leaveTypes }) {
	const [leaveType, setLeaveType] = useState(leaveTypes[0]);
	const [totalLeaves, setTotalLeaves] = useState(1);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await store.addLeaveType({
				type: leaveType,
				totalLeaves: totalLeaves
			});
			setSuccess(true);
			setError(null);
		} catch (err) {
			setError(err.message);
			setSuccess(false);
		}
	};

	return (
		<div className="add-store-container">
			<form
				className="add-store-form"
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
					<label htmlFor="total-store">Total Leaves</label>
					<select
						id="total-store"
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
				{error && <div className="text-red-500 mb-2">{error}</div>}
				{success && <div className="text-green-500 mb-2">Leave type added successfully!</div>}
				<button type="submit">Save Data</button>
			</form>
		</div>
	);
}

AddAllLeavesData.propTypes = {
	leaveTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default AddAllLeavesData;
