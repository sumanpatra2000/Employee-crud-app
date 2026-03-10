import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export default function App() {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    salary: ''
  });

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    salary: ''
  });

  const load = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    await api.post('/employees', {
      ...form,
      salary: form.salary === '' ? null : Number(form.salary)
    });

    setForm({
      first_name: '',
      last_name: '',
      email: '',
      birthdate: '',
      salary: ''
    });

    await load();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      await load();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp.employee_id);

    setEditForm({
      first_name: emp.first_name || '',
      last_name: emp.last_name || '',
      email: emp.email || '',
      birthdate: emp.birthdate || '',
      salary: emp.salary || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/employees/${id}`, {
        ...editForm,
        salary: editForm.salary === '' ? null : Number(editForm.salary)
      });

      setEditingId(null);
      await load();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleEditChange = (e) =>
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div style={{ margin: 20 }}>
      <h1>Employees</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Birthdate</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>

              <td>{emp.employee_id}</td>

              <td>
                {editingId === emp.employee_id ? (
                  <input
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleEditChange}
                  />
                ) : emp.first_name}
              </td>

              <td>
                {editingId === emp.employee_id ? (
                  <input
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleEditChange}
                  />
                ) : emp.last_name}
              </td>

              <td>
                {editingId === emp.employee_id ? (
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                ) : emp.email}
              </td>

              <td>
                {editingId === emp.employee_id ? (
                  <input
                    type="date"
                    name="birthdate"
                    value={editForm.birthdate || ''}
                    onChange={handleEditChange}
                  />
                ) : emp.birthdate ? new Date(emp.birthdate).toLocaleDateString() : '-'}
              </td>

              <td>
                {editingId === emp.employee_id ? (
                  <input
                    type="number"
                    name="salary"
                    value={editForm.salary}
                    onChange={handleEditChange}
                  />
                ) : emp.salary != null ? Number(emp.salary).toFixed(2) : '-'}
              </td>

              <td>
                {editingId === emp.employee_id ? (
                  <>
                    <button onClick={() => saveEdit(emp.employee_id)}>
                      Save
                    </button>

                    <button onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(emp)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(emp.employee_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <hr />
<h2>Add Employee</h2>
      <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
        <input
          name="first_name"
          value={form.first_name}
          onChange={onChange}
          placeholder="First name"
        />

        <input
          name="last_name"
          value={form.last_name}
          onChange={onChange}
          placeholder="Last name"
        />

        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
        />

        <input
          name="birthdate"
          type="date"
          value={form.birthdate}
          onChange={onChange}
        />

        <input
          name="salary"
          type="number"
          step="0.01"
          value={form.salary}
          onChange={onChange}
          placeholder="Salary"
        />

        <button type="submit">Add</button>
      </form>

    </div>
  );
}