// This file handles the authentication state.

import {Session as KratosSession} from '@ory/kratos-client';
import AsyncStore from '@react-native-community/async-storage';

// The key under which the session is being stored
const userSessionName = 'user_session';

// The session type
export type SessionContext = {
  // The session token
  session_token: string;

  // The session itself
  session: KratosSession;
} | null;

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getAuthenticatedSession = (): Promise<SessionContext> => {
  const parse = (sessionRaw: string | null): SessionContext => {
    if (!sessionRaw) {
      return null;
    }

    // sessionRaw is a JSON String that needs to be parsed.
    return JSON.parse(sessionRaw);
  };

  let p = AsyncStore.getItem(userSessionName);

  return p.then(parse);
};

// Sets the session.
export const setAuthenticatedSession = (
  session: SessionContext,
): Promise<void> => {
  if (!session) {
    return killAuthenticatedSession();
  }

  AsyncStore.setItem(userSessionName, JSON.stringify(session));
};

// Removes the session from the store.
export const killAuthenticatedSession = () => {
  return AsyncStore.removeItem(userSessionName);
};
