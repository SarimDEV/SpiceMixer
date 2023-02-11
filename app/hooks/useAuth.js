import React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/auth';
import { useRecoilState } from 'recoil';
import { authDisplayName } from '../auth/atoms';

export function useAuth() {
  const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [signingUp, setSigningUp] = React.useState(false);
  const [displayName, setDisplayName] = useRecoilState(authDisplayName);

  React.useEffect(() => {
    setLoading(true);
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      async (newUser) => {
        try {
          if (newUser) {
            console.log(newUser);
            setUser(newUser);
            if (newUser.displayName) {
              setDisplayName(newUser.displayName);
            }
          } else {
            setUser(undefined);
          }
          setLoading(false);
        } catch (err) {
          setUser(undefined);
          console.log(err);
        }
      },
    );

    return unsubscribeFromAuthStatuChanged;
  }, [setDisplayName]);

  return {
    user,
    loading,
    signingUp,
    setSigningUp,
  };
}
