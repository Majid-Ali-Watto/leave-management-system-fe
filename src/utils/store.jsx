class Leaves {
	#totalLeaves = [
		{
			type: "Casual",
			count: 0
		},
		{
			type: "Medical",
			count: 0
		},
		{
			type: "Annual",
			count: 0
		}
	];
	constructor() {
		const total = localStorage.getItem("totalLeaves");
		if (!total) localStorage.setItem("totalLeaves", JSON.stringify(this.#totalLeaves));
	}

	addLeaves(leaves) {
		let leavesList = JSON.parse(localStorage.getItem("leaves")) || [];
		leavesList = [...leavesList, leaves];
		localStorage.setItem("leaves", JSON.stringify(...leavesList));
	}
	addTotalLeaves(totalLeaves) {
		let leavesList = JSON.parse(localStorage.getItem("totalLeaves"));
		const index = leavesList.findIndex((e) => e.type === totalLeaves.type);
		leavesList[index].count = totalLeaves.count;
		console.log(leavesList);
		localStorage.setItem("totalLeaves", JSON.stringify(leavesList));
	}
	getTotalLeaves() {
		return JSON.parse(localStorage.getItem("totalLeaves")) || [];
	}
	getLeaves() {
		return JSON.parse(localStorage.getItem("leaves")) || [];
	}
}

const leaves = new Leaves();
export default leaves;
