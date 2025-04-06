import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { store } from "../utils/store";

function LeaveTableRow({ leaveType, month, year, formSubmitted, onFormStatusChange }) {
  const [counts, setCounts] = useState({ total: 0, availed: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const leaveCounts = await store.getMonthlyLeaveCounts(leaveType, month, year);
        setCounts(leaveCounts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCounts();
  }, [leaveType, month, year]);

  if (loading) {
    return (
      <tr className="hover:bg-gray-50">
        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
          Loading...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr className="hover:bg-gray-50">
        <td colSpan="5" className="px-6 py-4 text-center text-sm text-red-500">
          Error: {error}
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leaveType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counts.remaining}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counts.availed}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counts.total}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <input
          type="checkbox"
          checked={formSubmitted || false}
          onChange={() => onFormStatusChange(leaveType)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      </td>
    </tr>
  );
}

LeaveTableRow.propTypes = {
  leaveType: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  onFormStatusChange: PropTypes.func.isRequired
};

export default LeaveTableRow; 