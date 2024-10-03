import PropTypes from "prop-types";
import LeavesTable from "./LeavesTable";

function LeaveCard({ month }) {
	return (
		<div className="LeaveCard">
			<details open={month.isOpen}>
				<summary>{month.name}</summary>
				<LeavesTable month={month} />
			</details>
		</div>
	);
}

LeaveCard.propTypes = {
	month: PropTypes.shape({
		name: PropTypes.string.isRequired,
		isOpen: PropTypes.bool.isRequired
	}).isRequired
};

export default LeaveCard;
