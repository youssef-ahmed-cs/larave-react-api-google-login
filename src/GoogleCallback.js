import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // On page load, we take "search" parameters
  // and proxy them to /api/auth/callback on our Laravel API
  useEffect(() => {
    fetch(`https://dev-hubs.tech/api/v1/auth/callback${location.search}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        return response.text().then((t) => {
          console.error("/api/v1/auth/callback error:", response.status, t);
          throw new Error(`API error ${response.status}: ${t}`);
        });
      })
      .then((data) => {
        // persist auth and user data so home can show it
        try {
          if (data.access_token)
            localStorage.setItem("access_token", data.access_token);
          if (data.user)
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (e) {
          console.warn("Could not persist auth data", e);
        }

        setLoading(false);
        setData(data);
        // go back to home and indicate registration success
        navigate("/?registered=1");
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [location.search]);

  // Helper method to fetch User data for authenticated user
  // Watch out for "Authorization" header that is added to this call
  function fetchUserData() {
    fetch(`https://dev-hubs.tech/api/v1/user`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + data.access_token,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        return response.text().then((t) => {
          console.error("/api/v1/user error:", response.status, t);
          throw new Error(`API error ${response.status}: ${t}`);
        });
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }

  if (loading) {
    return <DisplayLoading />;
  } else {
    if (user != null) {
      return <DisplayData data={user} />;
    } else {
      return (
        <div>
          <DisplayData data={data} />
          <div style={{ marginTop: 10 }}>
            <button onClick={fetchUserData}>Fetch User</button>
          </div>
        </div>
      );
    }
  }
}

function DisplayLoading() {
  return <div>Loading....</div>;
}

function DisplayData({ data }) {
  const hasUser =
    data && (data.user || data.email || data.id || data.access_token);
  return (
    <div>
      {hasUser ? (
        <div>User registered with Google</div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}

export default GoogleCallback;
