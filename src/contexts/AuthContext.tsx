import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase"; // the auth instance from firebase.ts


const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const AuthContext = createContext<{
  user: User | null,
  login: () => void,
  logout: () => void,
  canCreateGroup: boolean,
}>({
  user: null,
  login: () => { },
  logout: () => { },
  canCreateGroup: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [canCreateGroup, setCanCreateGroup] = useState<boolean>(false);

  function logout() {
    signOut(auth)
  }

  function login() {
    // https://firebase.google.com/docs/auth/web/google-signin
    signInWithPopup(auth, googleProvider)
  }

  const updatePrivileges = useCallback((claims: Record<string, unknown> | null) =>  {
    setCanCreateGroup(claims != null); // FIXME: see TODO below
    // TODO:
    // if (claims) {
    //   if (claims["subscription"] === "test") {
    //     setCanCreateGroup(true);
    //   }
    // }
  }, []);

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
        auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
          console.log("  claims", idTokenResult.claims);
          updatePrivileges(idTokenResult.claims);
        });
      } else {
        // User is signed out
        // ...
        console.log("User logged out");
        setUser(null);
        updatePrivileges(null);
      }
    });
  }, [updatePrivileges]);

  return (
    <AuthContext.Provider value={{ user, login, logout, canCreateGroup }}>
      {children}
    </AuthContext.Provider>
  );
}

