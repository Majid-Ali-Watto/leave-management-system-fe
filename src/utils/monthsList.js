const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthsArrayWithCurrentOpen() {
	const currentMonth = new Date().getMonth(); // Get the current month index (0 for Jan, 1 for Feb, etc.)
	return months.map((month, index) => {
		return {
			name: month,
			isOpen: index === currentMonth
		};
	});
}

// Example usage
export const monthsWithStatus = getMonthsArrayWithCurrentOpen();
