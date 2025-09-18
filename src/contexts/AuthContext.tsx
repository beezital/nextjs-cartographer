import { createContext, ReactNode, useCallback, useEffect, useState } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";


const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const AuthContext = createContext<{
    user: User | null,
    login: () => void,
    logout: () => void,
}>({
    user: null,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ auth, children }: { auth: Auth, children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);

  function logout() {
    signOut(auth)
  }

  function login() {
    // https://firebase.google.com/docs/auth/web/google-signin
    signInWithPopup(auth, googleProvider)
  }

  useEffect(() => {
    // https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        // ...
        console.log("User logged in", user);
        setUser(user);
      } else {
        // User is signed out
        // ...
        console.log("User logged out");
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

