import React, { useState, useEffect } from "react";

function SignIn() {
  const [loginUrl, setLoginUrl] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    fetch("https://dev-hubs.tech/api/v1/auth", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        // Attempt to read response body for better debugging information
        return response.text().then((text) => {
          console.error("/api/v1/auth error:", response.status, text);
          throw new Error(`API error ${response.status}: ${text}`);
        });
      })
      .then((data) => setLoginUrl(data.url))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        setStoredUser(JSON.parse(userJson));
      }
    } catch (e) {
      console.warn('Failed to read stored user', e);
    }

    // Check URL for registered flag
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === '1') {
        setRegistered(true);
        // remove registered param from URL without reloading
        params.delete('registered');
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setStoredUser(null);
    setRegistered(false);
  }

  return (
    <div>
      {registered && (
        <div style={{ padding: 10, background: '#e6ffed', border: '1px solid #8fd19e', marginBottom: 12 }}>
          Registration successful — you are now signed in.
        </div>
      )}

      {storedUser ? (
        <div>
          <h3>Signed in as {storedUser.name || storedUser.username}</h3>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div>{loginUrl != null && <a href={loginUrl}>Google Sign In</a>}</div>
      )}
    </div>
  );
}

export default SignIn;
