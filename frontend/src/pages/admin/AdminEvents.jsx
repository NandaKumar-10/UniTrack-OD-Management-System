import React, { useState, useEffect } from 'react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', type: 'Internal', description: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/admin/events/${editingId}`
        : 'http://localhost:5000/api/admin/events';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to save event');

      setFormMessage({ type: 'success', text: editingId ? 'Event updated!' : 'Event published!' });
      setFormData({ title: '', type: 'Internal', description: '', date: '' });
      setEditingId(null);
      fetchEvents();
      
      // Clear message after 3 seconds
      setTimeout(() => setFormMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message });
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    const formattedDate = new Date(event.date).toISOString().split('T')[0];
    setFormData({
      title: event.title,
      type: event.type,
      description: event.description,
      date: formattedDate
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchEvents();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', type: 'Internal', description: '', date: '' });
    setFormMessage({ type: '', text: '' });
  };

  return (
    <div className="container fade-in">
      <h1 className="page-title">Event Publishing</h1>
      <p className="page-subtitle">Publish new department events and manage existing ones.</p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">{editingId ? 'Edit Event' : 'Publish New Event'}</h2>
        
        {formMessage.text && (
          <div style={{
            padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
            backgroundColor: formMessage.type === 'error' ? '#fee2e2' : '#d1fae5',
            color: formMessage.type === 'error' ? '#991b1b' : '#065f46'
          }}>
            {formMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Event Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" placeholder="e.g. Annual Hackathon" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Event Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="form-input">
              <option value="Internal">Internal Department Event</option>
              <option value="External">External Inter-College Event</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Event Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="form-input" rows="3" placeholder="Event details..."></textarea>
          </div>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Event' : 'Publish Event'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="card-title" style={{ marginBottom: '1rem' }}>Manage Existing Events</h2>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No events published yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td style={{ fontWeight: 500 }}>{event.title}</td>
                  <td>
                    <span className={`badge ${event.type === 'Internal' ? 'badge-info' : 'badge-approved'}`} style={{ backgroundColor: event.type === 'Internal' ? 'var(--primary-light)' : '#E0E7FF', color: event.type === 'Internal' ? 'var(--primary)' : '#4338CA' }}>
                      {event.type}
                    </span>
                  </td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {event.description}
                  </td>
                  <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(event)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(event._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
