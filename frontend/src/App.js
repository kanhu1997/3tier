import React, { useEffect, useState } from 'react';
import LoginSignup from './LoginSignup';

// Use Jenkins server IP for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.254.131:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch users
  useEffect(() => {
    if (user) {
      fetch(API_URL)
        .then(res => res.json())
        .then(setUsers);
    }
  }, [user]);

  // Edit user
  const handleEdit = userObj => {
    setEditing(userObj.id);
  };

  // Update user (no add, only update/delete)
  const handleUpdate = async (id, name, email) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    setEditing(null);
    fetch(API_URL).then(res => res.json()).then(setUsers);
  };

  // Delete user
  const handleDelete = async id => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetch(API_URL).then(res => res.json()).then(setUsers);
  };

  if (!user) {
    return <LoginSignup onAuth={setUser} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>User Management</h1>
      <div style={{ marginBottom: 10 }}>Welcome, {user.name} (<span>{user.email}</span>) <button onClick={() => setUser(null)}>Logout</button></div>
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(userObj => (
            <tr key={userObj.id}>
              <td>
                {editing === userObj.id ? (
                  <input
                    defaultValue={userObj.name}
                    onBlur={e => handleUpdate(userObj.id, e.target.value, userObj.email)}
                  />
                ) : userObj.name}
              </td>
              <td>
                {editing === userObj.id ? (
                  <input
                    defaultValue={userObj.email}
                    onBlur={e => handleUpdate(userObj.id, userObj.name, e.target.value)}
                  />
                ) : userObj.email}
              </td>
              <td>
                {editing === userObj.id ? (
                  <button onClick={() => setEditing(null)}>Cancel</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(userObj)}>Edit</button>
                    <button onClick={() => handleDelete(userObj.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20, color: 'gray' }}>
        <b>Note:</b> To add a new user, please use the Sign Up form (log out and click "Sign Up").
      </div>
    </div>
  );
}

export default App;
