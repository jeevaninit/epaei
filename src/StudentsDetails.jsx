import React from 'react'

const StudentsDetails = () => {
    const [students, setStudents] = React.useState([]);

    const { useEffect } = React;

    const studentData = [
      {id: 1, date: '2024-06-01', name: 'John Doe', courses: ['Math', 'Science'], qualifications: ['BSc', 'MSc'], phone: '123-456-7890', remarks: 'Excellent student'},
        {id: 2, date: '2024-06-02', name: 'Jane Smith', courses: ['English', 'History'], qualifications: ['BA', 'MA'], phone: '987-654-3210', remarks: 'Very attentive'},
        {id: 3, date: '2024-06-03', name: 'Alice Johnson', courses: ['Art', 'Music'], qualifications: ['BFA', 'MFA'], phone: '555-123-4567', remarks: 'Creative and talented'},
        {id: 4, date: '2024-06-04', name: 'Bob Brown', courses: ['Physics', 'Chemistry'], qualifications: ['BSc', 'MSc'], phone: '444-555-6666', remarks: 'Strong analytical skills'},
        {id: 5, date: '2024-06-05', name: 'Charlie Davis', courses: ['Biology', 'Geography'], qualifications: ['BSc', 'MSc'], phone: '333-222-1111', remarks: 'Excellent research skills'},
        {id: 6, date: '2024-06-06', name: 'Diana Evans', courses: ['Philosophy', 'Sociology'], qualifications: ['BA', 'MA'], phone: '777-888-9999', remarks: 'Great critical thinking'},
        {id: 7, date: '2024-06-07', name: 'Ethan Foster', courses: ['Economics', 'Political Science'], qualifications: ['BA', 'MA'], phone: '111-222-3333', remarks: 'Strong leadership skills'},
        {id: 8, date: '2024-06-08', name: 'Fiona Green', courses: ['Computer Science', 'Mathematics'], qualifications: ['BSc', 'MSc'], phone: '888-777-6666', remarks: 'Excellent problem-solving skills'},
        {id: 9, date: '2024-06-09', name: 'George Harris', courses: ['Psychology', 'Education'], qualifications: ['BA', 'MA'], phone: '222-333-4444', remarks: 'Great communication skills'},
        {id: 10, date: '2024-06-10', name: 'Hannah Jackson', courses: ['Business Administration', 'Marketing'], qualifications: ['BBA', 'MBA'], phone: '999-888-7777', remarks: 'Strong business acumen'}
    ];

    useEffect(() => {
       /*  fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error('Error fetching students:', error)); */
            setStudents(studentData);
    }, []);

  return (
    <div>
        <h1>Students Details</h1>
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
              {[...students]
                .sort((firstStudent, secondStudent) =>
                  new Date(secondStudent.date) - new Date(firstStudent.date)
                )
                .map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.date}</td>
                  <td>{student.courses.join(', ')}</td>
                  <td>{student.qualifications.join(', ')}</td>
                  <td>{student.phone}</td>
                  <td>{student.remarks}</td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>

    </div>
  )
}

export default StudentsDetails