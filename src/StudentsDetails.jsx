import React from 'react'

const PAGE_SIZE = 8

const emptyForm = {
  name: '',
  date: '',
  courses: '',
  qualifications: '',
  phone: '',
  remarks: '',
}

const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const StudentsDetails = () => {
  const [students, setStudents] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingStudentId, setEditingStudentId] = React.useState(null)
  const [form, setForm] = React.useState(emptyForm)
  const [status, setStatus] = React.useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)

  const loadStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Student records could not be loaded.')
      setStudents(result.students)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadStudents()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSaving(true)

    try {
      const endpoint = editingStudentId === null ? '/api/students' : `/api/students/${editingStudentId}`
      const response = await fetch(endpoint, {
        method: editingStudentId === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Student record could not be saved.')

      setStudents((currentStudents) => editingStudentId === null
        ? [...currentStudents, result.student]
        : currentStudents.map((student) => student.id === result.student.id ? result.student : student))
      setForm(emptyForm)
      setIsFormOpen(false)
      setEditingStudentId(null)
      setStatus({ type: 'success', message: editingStudentId === null ? 'Student added successfully.' : 'Student updated successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (student) => {
    setEditingStudentId(student.id)
    setForm({ ...student, courses: student.courses.join(', '), qualifications: student.qualifications.join(', ') })
    setIsFormOpen(true)
    setStatus({ type: '', message: '' })
  }

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete the record for ${student.name}?`)) return

    setStatus({ type: '', message: '' })
    try {
      const response = await fetch(`/api/students/${student.id}`, { method: 'DELETE' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Student record could not be deleted.')
      setStudents((currentStudents) => currentStudents.filter((currentStudent) => currentStudent.id !== student.id))
      setStatus({ type: 'success', message: 'Student deleted successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const normalizedPhoneSearch = normalizedSearch.replace(/\D/g, '')
  const filteredStudents = students
    .filter((student) => {
      const searchableDate = `${student.date} ${formatDate(student.date)}`.toLowerCase()
      const searchablePhone = student.phone.replace(/\D/g, '')

      return student.name.toLowerCase().includes(normalizedSearch)
        || searchableDate.includes(normalizedSearch)
        || searchablePhone.includes(normalizedPhoneSearch)
    })
    .sort((firstStudent, secondStudent) => new Date(secondStudent.date) - new Date(firstStudent.date))
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE)
  const visibleStudents = filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  React.useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
    if (currentPage > lastPage) setCurrentPage(lastPage)
  }, [currentPage, filteredStudents.length])

  return (
    <main className="students-page">
      <div className="students-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Students Details</h1>
          <p>Review student records, courses, qualifications, and notes.</p>
        </div>
        <button className="add-student-button" type="button" onClick={() => { setEditingStudentId(null); setForm(emptyForm); setIsFormOpen(true); setStatus({ type: '', message: '' }) }}>
          + Add new student
        </button>
      </div>

      {isFormOpen && (
        <section className="student-form-panel" aria-labelledby="student-form-title">
          <div className="form-panel-heading">
            <div>
              <p className="eyebrow">{editingStudentId === null ? 'New record' : 'Edit record'}</p>
              <h2 id="student-form-title">{editingStudentId === null ? 'Add student details' : 'Update student details'}</h2>
            </div>
            <button className="close-form-button" type="button" onClick={() => setIsFormOpen(false)} aria-label="Close form">&times;</button>
          </div>
          <form className="student-form" onSubmit={handleSubmit}>
            <label>Full name<input name="name" value={form.name} onChange={handleChange} required /></label>
            <label>Date<input name="date" type="date" value={form.date} onChange={handleChange} required /></label>
            <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={handleChange} required /></label>
            <label>Courses <span>(comma separated)</span><input name="courses" value={form.courses} onChange={handleChange} placeholder="Math, Science" required /></label>
            <label>Qualifications <span>(comma separated)</span><input name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="BSc, MSc" required /></label>
            <label className="wide-field">Remarks<textarea name="remarks" value={form.remarks} onChange={handleChange} rows="3" /></label>
            <div className="form-actions">
              <button className="cancel-button" type="button" onClick={() => { setIsFormOpen(false); setEditingStudentId(null) }}>Cancel</button>
              <button className="submit-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingStudentId === null ? 'Save student' : 'Update student'}</button>
            </div>
          </form>
        </section>
      )}

      {status.message && <p className={`student-status ${status.type}`} role="status">{status.message}</p>}

      <div className="students-toolbar">
        <label htmlFor="student-search">Search students</label>
        <input id="student-search" type="search" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1) }} placeholder="Search by name, date, or phone number" />
        {searchTerm && <span>{filteredStudents.length} result{filteredStudents.length === 1 ? '' : 's'}</span>}
      </div>

      <div className="students-table-wrapper">
        {isLoading ? <p className="table-message">Loading student records...</p> : (
          <table className="students-table">
            <thead><tr><th scope="col">Name</th><th scope="col">Date</th><th scope="col">Courses</th><th scope="col">Qualifications</th><th scope="col">Phone</th><th scope="col">Remarks</th><th scope="col">Actions</th></tr></thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.id}>
                  <td data-label="Name">{student.name}</td>
                  <td data-label="Date">{formatDate(student.date)}</td>
                  <td data-label="Courses">{student.courses.join(', ')}</td>
                  <td data-label="Qualifications">{student.qualifications.join(', ')}</td>
                  <td data-label="Phone">{student.phone}</td>
                  <td data-label="Remarks">{student.remarks || '-'}</td>
                  <td data-label="Actions" className="student-actions">
                    <button type="button" onClick={() => handleEdit(student)}>Edit</button>
                    <button type="button" onClick={() => handleDelete(student)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && <tr className="empty-results"><td colSpan="7">No students match your search.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="students-pagination" aria-label="Student records pages">
          <button type="button" onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>Previous</button>
          <span aria-live="polite">Page {currentPage} of {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === totalPages}>Next</button>
        </nav>
      )}
    </main>
  )
}

export default StudentsDetails
