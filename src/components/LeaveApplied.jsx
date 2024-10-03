import { useState } from "react";
import PropTypes from "prop-types";
import leaves from "../utils/store";
function LeaveApplied({ leaveTypes }) {
	const [leaveType, setLeaveType] = useState("");
	const [totalLeaves, setTotalLeaves] = useState(1);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [formSubmissionDate, setSubmissionDate] = useState("");
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [purpose, setPurpose] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const handleDateChange = (e, setDate) => {
		setDate(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			leaveType,
			totalLeaves,
			fromDate,
			toDate,
			isFormSubmitted,
			purpose,
			formSubmissionDate
		};
		console.log(data);
		leaves.addLeaves([data]);
		setSuccessMessage("Data saved successfully!");
		// Here you would typically handle form submission, e.g., make an API call
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
						onChange={(e) => setTotalLeaves(e.target.value)}>
						{Array.from({ length: 30 }, (_, i) => i + 1).map((v, i) => (
							<option
								key={i}
								value={v}>
								{v}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="from-date">From</label>
					<input
						type="date"
						id="from-date"
						value={fromDate}
						onChange={(e) => handleDateChange(e, setFromDate)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="to-date">To</label>
					<input
						type="date"
						id="to-date"
						value={toDate}
						onChange={(e) => handleDateChange(e, setToDate)}
					/>
				</div>
				<div
					className="form-group"
					id="form-submitted">
					<label htmlFor="form-submitted">Form Submitted</label>
					<input
						type="checkbox"
						id="form-submitted"
						checked={isFormSubmitted}
						onChange={() => setIsFormSubmitted(!isFormSubmitted)}
					/>
				</div>
				{isFormSubmitted && (
					<div className="form-group">
						<label htmlFor="to-date">Form Submission Date</label>
						<input
							type="date"
							id="to-date"
							value={formSubmissionDate}
							onChange={(e) => handleDateChange(e, setSubmissionDate)}
						/>
					</div>
				)}
				<div>
					<textarea
						placeholder="Purpose of leave"
						value={purpose}
						onChange={(e) => setPurpose(e.target.value)}></textarea>
				</div>
				<button type="submit">Save Data</button>
				{successMessage && <p className="success-message">{successMessage}</p>}
			</form>
		</div>
	);
}

LeaveApplied.propTypes = {
	leaveTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LeaveApplied;
