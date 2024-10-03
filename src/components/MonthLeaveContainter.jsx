import { useEffect, useState } from "react";
import LeaveCard from "./LeaveCard";
import { monthsWithStatus } from "../utils/monthsList";
import YearsLeavesTable from "./YearLeavesTable";
function MonthLeaveContainter() {
	const [year, setYear] = useState(new Date().getFullYear());
	useEffect(() => {
		console.log(year);
	}, [year]);
	return (
		<div className="MonthLeaveContainter">
			<YearsLeavesTable
				year={year}
				setYear={setYear}
			/>
			<h3>Leave Details Month Wise</h3>
			{monthsWithStatus.map((month, i) => {
				return (
					<LeaveCard
						key={i}
						month={month}
					/>
				);
			})}
		</div>
	);
}

export default MonthLeaveContainter;
