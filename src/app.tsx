import { useState } from 'preact/hooks'
import Map from './map.tsx';
import Login from './login.tsx';
import { auth } from "./firebase.ts"
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';


export function App() {
  const [signedIn, setSignedIn] = useState(false);
  onAuthStateChanged(auth, (user) => {
    setSignedIn(!!user);
  });

  const [error, setError] = useState("");
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      }
    }
  };

  return signedIn ? (
    <Map />
  ) : (
    <Login error={error} login={login} />
  );
}