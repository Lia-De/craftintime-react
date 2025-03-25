import { useAtom } from "jotai"
import { projectAtom } from "../atoms/projectAtom"
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";

export const EditProject = ({setEditing}) => {
    const [project, setProject] = useAtom(projectAtom);
    const {register, handleSubmit, formState:{errors}, clearErrors } = useForm();
    const [editObject, setEditObject] = useState(null);

    const onSubmit = (data) => {
    const obj = {
        ProjectId: Number(data.projectId),
        Name: data.name,
        Description: data.description,
        Status: Number(data.status)
    }
    setEditObject(obj);
    }

    useEffect(()=> {
        editObject && 
        axios.post('/api/Project/updateProject',editObject, {headers: {"Content-Type": "application/json",}})
        .then(response=>{
            response.data && setProject(response.data);
            setEditing(false);
        }).catch((e)=> {console.log(e,editObject)})
    },[editObject])

    // errors.name && console.log(`We have errors${errors}`, errors) && clearErrors();


    const confirmDelete = (task) => {
        confirm(`Are you sure you want to delete ${task.name}?`, 'Yes','Cancel') && 
        axios(
            {
                method: 'delete',
                url:  `/api/Task/deleteTask`,
                data: task,
                headers: {"Content-Type": "application/json",}
              })
            .then(()=> {
                 setProject(prev => ({
                    ...prev,
                    tasks : prev.tasks.filter(t => t.taskId != task.taskId)
                 })
                )
                }).catch((error)=>{console.log(error)})
    }



return (
    <div id="edits">
        <h3>Editing</h3>
        <div>
            <form id="editProjectForm" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" name='name' defaultValue={project.name} {...register('name', {minLength:3})}/>
                
                <label htmlFor="description">About:</label>
                <textarea id="description" name="description" 
                rows="5" defaultValue={project.description} {...register('description')}></textarea>
                
                <label htmlFor="statusZero">Planning</label>
                <input type="radio" id="statusZero" name="status"
                  defaultChecked={project.status === 0} value="0" {...register('status')} />
                <label htmlFor="statusOne">Active</label>
                <input type="radio" id="statusOne" name="status"
                  defaultChecked={project.status === 1} value="1" {...register('status')} />
                <label htmlFor="statusTwo">Inactive</label>
                <input type="radio" id="statusTwo" name="status"
                  defaultChecked={project.status === 2} value="2" {...register('status')} />
                <label htmlFor="statusThree">Complete</label>
                <input type="radio" id="statusThree" name="status"
                  defaultChecked={project.status === 3} value="3" {...register('status')}  />
                
                <p className="span2">Click to remove Tasks or Tags</p>
                <label>Tasks:</label>
                <div id="editProjectTasks">
                    {project.tasks.map((task) => {
                        return (!task.isDeleted && <p key={`task${task.taskId}`} 
                                className="deleteTask" onClick={() => 
                                confirmDelete(task)}>{task.name}</p>) }) }
                </div>
                
                <label>Tags:</label>
                <div id="editProjectTags">
                    <p id="tag-1" className="deleteTag">colourmart</p>
                    <p id="tag-3" className="deleteTag">twill</p>
                    <p id="tag-7" className="deleteTag">temple</p>
                    <p id="tag-15" className="deleteTag">linen</p>
                </div>
                <input type="hidden" name="projectId" value={project.projectId} {...register('projectId')}  />
                <button type="submit">Save</button>
            </form>
        </div>
    </div>
   )
    }

    // let requestData = {
    //     ProjectId: id,
    //     Name: name,
    //     Status: status,
    //     Description: description
    // };