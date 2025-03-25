
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useAtom } from "jotai";
import { projectAtom } from "../atoms/projectAtom";

export const AddNewItemForm = ({setAddItemForm, setProject, setShowProject}) => {
    const { register, handleSubmit, reset, formState:{errors} } = useForm();
    const [newProject, setNewProject] = useState(null);

    const onSubmit = (data) => {
        setNewProject(data);
        reset();
    }
    
    // When the user submits the form - send new user to backend
    useEffect(()=> {
        if (newProject!= null) {
            newProject && axios.post(`/api/Project/addProject`, newProject, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
        .then(response =>{
            setProject(response.data);
            setAddItemForm(false);
        })
        .catch(error => {
            alert(error);
        })
        .finally(()=> setShowProject(true)
        );
    }
    },[newProject])

return (<>
        <h4>Add project</h4>
        <form id="addProject" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Project name:</label>
            <input 
                placeholder={errors.name&&'Projects must have a name'} 
                type="text" id="newName" name="name" {...register('name', {required:true})} />
            <label htmlFor="description">Description</label>
            <input id="description" name="description" type="text" {...register('description')} />
            <button type="submit">Add</button>
        </form>
        </>
        
    )
}

export const AddNewTaskForm = ({setAddTaskForm}) =>{
    const { register, handleSubmit, reset, formState:{errors} } = useForm();
    const [newTask, setNewTask] = useState(null);
    const [project, setProject] = useAtom(projectAtom);

    const onSubmit = (data) => {
        let newDesc = data.description==='' ? null : data.description;
        let newDeadline=data.deadline==='' ? null : data.deadline;
        setNewTask(({...data, description: newDesc, deadline: newDeadline}));
        
        reset();
    }
    useEffect(() => {
        console.log(newTask);
        (newTask!=null) && axios.post('/api/Task/addTask',newTask, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((result) => {
            console.log(result.data);
            setProject(prev => ({
                ...prev,
                tasks: [...prev.tasks, result.data] // Append the new task to the array
            }));
        })
        .catch((e)=>console.log(e))
        .finally(()=>{
            setAddTaskForm(prev => !prev);
        });
    },[newTask])
    
    return (
    <div id="addNewItem" className="shadowbox">
        <form id="addTask" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Task name:</label>
            <input 
                placeholder={errors.name&&'Tasks must have a name'} 
                type="text" id="name" name="name" {...register('name', {required:true})} />
            <label htmlFor="description">Description</label>
            <input id="description" name="description" type="text" {...register('description')} />
            <input type="hidden" name="projectId" value={project.projectId} {...register('projectId')} />
            <label htmlFor="deadline">Optional Deadline: </label>
            <input type="datetime-local" id="deadline" name="deadline" defaultValue={null} {...register('deadline')} />
            <button type="submit">Add</button>
        </form>
    </div>
    )
}