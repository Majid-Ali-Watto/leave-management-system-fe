import { useState } from "react";
import AddAllLeavesData from "./AddAllLeavesData";
import LeaveApplied from "./LeaveApplied";

const leaveTypes = ["Casual", "Medical", "Annual", "Compensatory"];

function AddLeaveData() {
	const [state, setState] = useState(true);

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
			{state ? <LeaveApplied leaveTypes={leaveTypes} /> : <AddAllLeavesData leaveTypes={leaveTypes} />}
		</div>
	);
}

export default AddLeaveData;
