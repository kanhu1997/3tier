import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

function LoginSignup({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const url = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;
      const body = isLogin ? { email: form.email, password: form.password } : form;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error');
        return;
      }
      const user = await res.json();
      onAuth(user);
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        )}
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" required type="password" />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ marginTop: 10 }}>
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default LoginSignup;
