// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";

/* Importing the functions from the firestore.js file. */
import {
    collection,
    getFirestore
} from "firebase/firestore";

/* A shorthand for console.log. */
const log = console.log;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize the firestore instance
export const db = getFirestore(app);

// collection ref
export const employeeCollection = collection(db, "employee");
export const attendanceCollection = collection(db, "attendance");
export const hrSettingsCollection = collection(db, "hrSettings");
export const leaveManagementCollection = collection(db, "leaveManagement");
export const performanceEvaluationCollection = collection(db, "performanceEvaluation");
export const employeeInfoChangeRequestCollection = collection(db, "employeeInfoChangeRequest");
export const objectiveCollection = collection(db, "objective");
export const competencyAssessmentCollection = collection(db, "competencyAssessment");
