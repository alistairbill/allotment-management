import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import config from "../firebase.config.ts";

const app = initializeApp(config);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
