import Header from "./components/Header";
import MonthLeaveContainter from "./components/MonthLeaveContainter";
import AddLeaveData from "./components/AddLeaveData";
import { useState } from "react";
function App() {
	const [add, setAdd] = useState(false);

	return (
		<>
			<Header setAdd={setAdd} />
			<main>{!add ? <MonthLeaveContainter /> : <AddLeaveData />}</main>
		</>
	);
}

export default App;
