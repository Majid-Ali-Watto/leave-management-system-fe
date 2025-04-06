import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, addDoc, writeBatch } from 'firebase/firestore';

const leavesCollection = collection(db, 'leaves');
const leaveTypesCollection = collection(db, 'leaveTypes');
const formSubmissionsCollection = collection(db, 'formSubmissions');

export const store = {
	// Leave Types Management
	async getLeaveTypes() {
		const snapshot = await getDocs(leaveTypesCollection);
		return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	},

	async addLeaveType(leaveType) {
		const docRef = await addDoc(leaveTypesCollection, leaveType);
		return { id: docRef.id, ...leaveType };
	},

	async updateLeaveType(id, leaveType) {
		const docRef = doc(db, 'leaveTypes', id);
		await updateDoc(docRef, leaveType);
		return { id, ...leaveType };
	},

	async deleteLeaveType(id) {
		const docRef = doc(db, 'leaveTypes', id);
		await deleteDoc(docRef);
		return id;
	},

	// Leave Management
	async getLeaves() {
		const snapshot = await getDocs(leavesCollection);
		return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	},

	async getLeaveById(id) {
		const docRef = doc(db, 'leaves', id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() };
		}
		return null;
	},

	async getLeavesByMonth(month, year) {
		const q = query(
			leavesCollection,
			where('month', '==', month),
			where('year', '==', year)
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	},

	async addLeave(leave) {
		const docRef = await addDoc(leavesCollection, leave);
		return { id: docRef.id, ...leave };
	},

	async updateLeave(id, leave) {
		const docRef = doc(db, 'leaves', id);
		await updateDoc(docRef, leave);
		return { id, ...leave };
	},

	async deleteLeave(id) {
		const docRef = doc(db, 'leaves', id);
		await deleteDoc(docRef);
		return id;
	},

	async getLeavesByYear(year) {
		const q = query(leavesCollection, where('year', '==', year));
		const snapshot = await getDocs(q);
		return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	},

	// Leave Calculations
	async getLeaveCounts(leaveType, year) {
		const leaveTypes = await this.getLeaveTypes();
		const typeConfig = leaveTypes.find(t => t.type === leaveType);
		
		if (!typeConfig) {
			throw new Error(`Leave type ${leaveType} not found`);
		}

		const yearlyLeaves = await this.getLeavesByYear(year);
		const typeLeaves = yearlyLeaves.filter(leave => leave.leaveType === leaveType);

		const totalLeaves = typeConfig.totalLeaves;
		const availedLeaves = typeLeaves.reduce((sum, leave) => sum + Number(leave.totalLeaves), 0);
		const remainingLeaves = totalLeaves - availedLeaves;

		return {
			total: totalLeaves,
			availed: availedLeaves,
			remaining: remainingLeaves
		};
	},

	async getMonthlyLeaveCounts(leaveType, month, year) {
		const yearlyLeaves = await this.getLeavesByYear(year);
		const monthLeaves = yearlyLeaves.filter(leave => 
			leave.leaveType === leaveType && 
			leave.month === month
		);

		const availedLeaves = monthLeaves.reduce((sum, leave) => sum + Number(leave.totalLeaves), 0);
		
		// Get total and remaining from yearly counts
		const yearlyCounts = await this.getLeaveCounts(leaveType, year);
		
		return {
			total: yearlyCounts.total,
			availed: availedLeaves,
			remaining: yearlyCounts.remaining
		};
	},

	// Form Submission Status
	async updateFormSubmissionStatus(leaveType, month, year, submitted) {
		const docId = `${leaveType}-${month}-${year}`;
		const docRef = doc(db, 'formSubmissions', docId);
		
		await setDoc(docRef, {
			leaveType,
			month,
			year,
			submitted,
			updatedAt: new Date().toISOString()
		}, { merge: true });
	},

	async getFormSubmissionStatus(leaveType, month, year) {
		const docId = `${leaveType}-${month}-${year}`;
		const docRef = doc(db, 'formSubmissions', docId);
		const docSnap = await getDoc(docRef);
		
		if (docSnap.exists()) {
			return docSnap.data().submitted;
		}
		return false;
	},

	// Batch Operations
	async addMultipleLeaves(leaves) {
		const batch = writeBatch(db);
		const newLeaves = [];

		for (const leave of leaves) {
			const docRef = doc(leavesCollection);
			batch.set(docRef, leave);
			newLeaves.push({ id: docRef.id, ...leave });
		}

		await batch.commit();
		return newLeaves;
	},

	async updateMultipleLeaves(leaves) {
		const batch = writeBatch(db);

		for (const leave of leaves) {
			const docRef = doc(db, 'leaves', leave.id);
			batch.update(docRef, leave);
		}

		await batch.commit();
		return leaves;
	}
};
