import React from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/auth';

export function useAuth() {
  const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      async (newUser) => {
        try {
          if (newUser) {
            console.log(newUser);
            setUser(newUser);
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
  }, []);

  return {
    user,
    loading,
  };
}
