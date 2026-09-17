import React from 'react'

const studentData = [
  { id: 1, date: '2024-06-01', name: 'John Doe', courses: ['Math', 'Science'], qualifications: ['BSc', 'MSc'], phone: '123-456-7890', remarks: 'Excellent student' },
  { id: 2, date: '2024-06-02', name: 'Jane Smith', courses: ['English', 'History'], qualifications: ['BA', 'MA'], phone: '987-654-3210', remarks: 'Very attentive' },
  { id: 3, date: '2024-06-03', name: 'Alice Johnson', courses: ['Art', 'Music'], qualifications: ['BFA', 'MFA'], phone: '555-123-4567', remarks: 'Creative and talented' },
  { id: 4, date: '2024-06-04', name: 'Bob Brown', courses: ['Physics', 'Chemistry'], qualifications: ['BSc', 'MSc'], phone: '444-555-6666', remarks: 'Strong analytical skills' },
  { id: 5, date: '2024-06-05', name: 'Charlie Davis', courses: ['Biology', 'Geography'], qualifications: ['BSc', 'MSc'], phone: '333-222-1111', remarks: 'Excellent research skills' },
  { id: 6, date: '2024-06-06', name: 'Diana Evans', courses: ['Philosophy', 'Sociology'], qualifications: ['BA', 'MA'], phone: '777-888-9999', remarks: 'Great critical thinking' },
  { id: 7, date: '2024-06-07', name: 'Ethan Foster', courses: ['Economics', 'Political Science'], qualifications: ['BA', 'MA'], phone: '111-222-3333', remarks: 'Strong leadership skills' },
  { id: 8, date: '2024-06-08', name: 'Fiona Green', courses: ['Computer Science', 'Mathematics'], qualifications: ['BSc', 'MSc'], phone: '888-777-6666', remarks: 'Excellent problem-solving skills' },
  { id: 9, date: '2024-06-09', name: 'George Harris', courses: ['Psychology', 'Education'], qualifications: ['BA', 'MA'], phone: '222-333-4444', remarks: 'Great communication skills' },
  { id: 10, date: '2024-06-10', name: 'Hannah Jackson', courses: ['Business Administration', 'Marketing'], qualifications: ['BBA', 'MBA'], phone: '999-888-7777', remarks: 'Strong business acumen' },
]

const StudentsDetails = () => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredStudents = studentData
    .filter((student) => {
      const searchableDate = `${student.date} ${new Date(`${student.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`.toLowerCase()
      const searchablePhone = student.phone.replace(/\D/g, '')
      const normalizedQuery = normalizedSearch.replace(/\D/g, '')

      return student.name.toLowerCase().includes(normalizedSearch)
        || searchableDate.includes(normalizedSearch)
        || searchablePhone.includes(normalizedQuery)
    })
    .sort((firstStudent, secondStudent) => new Date(secondStudent.date) - new Date(firstStudent.date))

  return (
    <main className="students-page">
      <div className="students-heading">
        <p className="eyebrow">Overview</p>
        <h1>Students Details</h1>
        <p>Review student records, courses, qualifications, and notes.</p>
      </div>
      <div className="students-toolbar">
        <label htmlFor="student-search">Search students</label>
        <input
          id="student-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name, date, or phone number"
        />
        {searchTerm && <span>{filteredStudents.length} result{filteredStudents.length === 1 ? '' : 's'}</span>}
      </div>
      <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">Courses</th>
                <th scope="col">Qualifications</th>
                <th scope="col">Phone</th>
                <th scope="col">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td data-label="Name">{student.name}</td>
                  <td data-label="Date">{new Date(`${student.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td data-label="Courses">{student.courses.join(', ')}</td>
                  <td data-label="Qualifications">{student.qualifications.join(', ')}</td>
                  <td data-label="Phone">{student.phone}</td>
                  <td data-label="Remarks">{student.remarks}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr className="empty-results">
                  <td colSpan="6">No students match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </main>
  )
}

export default StudentsDetails