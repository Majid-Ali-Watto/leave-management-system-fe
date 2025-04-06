const years = [];
const year = new Date().getFullYear();
years.push(year);
for (let i = year - 1; i >= 2022; i--) {
	years.push(i);
}
export default years;
