import React, { useState, useEffect } from 'react';
import TeachersApi from '../ApiCalls/TeachersApi';

//Component for CRUD operation using server calls
function TeacherEditing(){
    
    //--state all teachers
    //Empty array of all teachers (Will be filled from server)
    const [teachers, setTeachers] = useState([]);

    //--state current teacher
    const [currentTeacher, setCurrentTeacher] = useState({
        id: 0,
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    //--Edit-Create
    const [editing, setEditing] = useState(false);

    //--Event for each state changed
    //--if empty its trrigered only once
    useEffect(() => {
        refreshTeachers()
    }, 
    []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentTeacher({ ...currentTeacher, [name]: value});
    };

    //Happens pnly once when the app loads
    //--Load all Teachers from remote api
    const refreshTeachers = () => {
        //Call API in server
        //And save it into state
        TeachersApi.getTeachers().then(response => {
            setTeachers(response.data);
        });
    };

    const addTeacher = () =>{
        //Call server Add
        TeachersApi.createTeacher(currentTeacher).then(response =>{
        
        //--Refresh current list
        refreshTeachers();

        //--Clean current teacher
        setCurrentTeacher({
            id: 0,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
            });
        });
    };

    const updateTeacher = () =>{
        TeachersApi.updateTeacher(currentTeacher.id, currentTeacher).then(response =>{
        
        //--Refresh current list
        refreshTeachers();

        //--Clean current teacher
        setCurrentTeacher({
            id: 0,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
            });

            setEditing(false);
        });
    };

    const deleteTeacher = id => {
        TeachersApi.deleteTeacher(id).then(() =>{
            refreshTeachers();
        });
    };


    const editTeacher = teacher=> {
        setCurrentTeacher(teacher);
        setEditing(true);
    }

//{/*EDIT/CREATE FORM*/}
//{/*LIST OF ALL TEACHERS (each item will have edit&delete buttons)*/}

    return(
        /* List + Form */
        <div className='container'>
            <h2>Teachers</h2>
            <form 
                onSubmit={event => {
                    event.preventDefault();
                    editing ? updateTeacher() : addTeacher();
                }}
            >
                <div className='form-group'>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={currentTeacher.email}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={currentTeacher.password}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className='form-group'>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={currentTeacher.firstName}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className='form-group'>
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={currentTeacher.lastName}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className='form-group'>
                    <label>Phone number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={currentTeacher.phoneNumber}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <button type='submit' className='btn btn-primary mt-2'>
                    {editing? 'Update' : 'Add'}
                </button>

            </form>

            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.email}</td>
                            <td>{teacher.firstName}</td>
                            <td>{teacher.lastName}</td>
                            <td>{teacher.phoneNumber}</td>
                            <td>
                                <button onClick={() => editTeacher(teacher)} className='btn btn-warning m-1'>Edit</button>
                                <button onClick={() => deleteTeacher(teacher.id)} className='btn btn-danger m-1'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );

}

export default TeacherEditing;