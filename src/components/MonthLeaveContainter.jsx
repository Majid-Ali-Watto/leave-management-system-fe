import { useEffect, useState } from "react";
import LeaveCard from "./LeaveCard";
import { monthsWithStatus } from "../utils/monthsList";
import YearsLeavesTable from "./YearLeavesTable";

function MonthLeaveContainer() {
	const [year, setYear] = useState(new Date().getFullYear());

	return (
		<div className="MonthLeaveContainer">
			<YearsLeavesTable
				year={year}
				setYear={setYear}
			/>
			<h3>Leave Details Month Wise</h3>
			{monthsWithStatus.map((month, i) => (
				<LeaveCard
					key={i}
					month={month}
					year={year}
				/>
			))}
		</div>
	);
}

export default MonthLeaveContainer;
