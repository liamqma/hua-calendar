import { getAuth, signInWithPopup, GoogleAuthProvider, browserLocalPersistence, setPersistence, User } from "firebase/auth";
import firebase from './firebase';
import Button from '@mui/material/Button';

const provider = new GoogleAuthProvider();

function Login({ setUser }: { setUser: (user: User) => void }): JSX.Element {
    const auth = getAuth(firebase);

    function onGoogleButtonClick(): void {
        setPersistence(auth, browserLocalPersistence).then(() => {
            signInWithPopup(auth, provider).then(result => setUser(result.user))
        })
    }

    return (
        <Button variant="contained" onClick={onGoogleButtonClick} >
            Sign in with Google
        </Button>
    );
}

export default Login;
