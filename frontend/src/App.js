import React, { useEffect, useState } from 'react';
import LoginSignup from './LoginSignup';

// Use Jenkins server IP for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.254.131:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
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

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create or update user
  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_URL}/${editing}` : API_URL;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', email: '' });
    setEditing(null);
    fetch(API_URL).then(res => res.json()).then(setUsers);
  };

  // Edit user
  const handleEdit = userObj => {
    setForm({ name: userObj.name, email: userObj.email });
    setEditing(userObj.id);
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
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
        <button type="submit">{editing ? 'Update' : 'Add'} User</button>
        {editing && <button type="button" onClick={() => { setForm({ name: '', email: '' }); setEditing(null); }}>Cancel</button>}
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(userObj => (
            <tr key={userObj.id}>
              <td>{userObj.name}</td>
              <td>{userObj.email}</td>
              <td>
                <button onClick={() => handleEdit(userObj)}>Edit</button>
                <button onClick={() => handleDelete(userObj.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
