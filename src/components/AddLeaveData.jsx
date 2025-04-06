import { useState } from "react";
import AddAllLeavesData from "./AddAllLeavesData";
import LeaveApplied from "./LeaveApplied";

const leaveTypes = ["Casual", "Medical", "Annual", "Compensatory"];

function AddLeaveData() {
	const [state, setState] = useState(true);
	const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	return (
		<div className="add-leave-data-container">
			<div className="add-section-btns">
				<button
					className={!state ? "active" : "inactive"}
					onClick={() => setState(false)}>
					Add All Leaves Data
				</button>
				<button
					className={state ? "active" : "inactive"}
					onClick={() => setState(true)}>
					Add Leave Data
				</button>
			</div>
			{state ? (
				<div>
					<div className="flex gap-4 mb-4 mt-4">
						<select
							className="border rounded px-3 py-2"
							value={selectedMonth}
							onChange={(e) => setSelectedMonth(e.target.value)}
						>
							{months.map((month) => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
						<select
							className="border rounded px-3 py-2"
							value={selectedYear}
							onChange={(e) => setSelectedYear(Number(e.target.value))}
						>
							{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
					<LeaveApplied 
						month={selectedMonth}
						year={selectedYear}
						leaveTypes={leaveTypes}
					/>
				</div>
			) : (
				<AddAllLeavesData leaveTypes={leaveTypes} />
			)}
		</div>
	);
}

export default AddLeaveData;
