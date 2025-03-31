import { useAtom } from "jotai"
import { projectAtom } from "../atoms/projectAtom"
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { PopulatedStatusList } from "./FormatData";
import { taskListAtom } from "../atoms/taskListAtom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EditProject = ({setUiState}) => {
    const [project, setProject] = useAtom(projectAtom);
    const [taskList, setTaskList] = useAtom(taskListAtom);
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
        axios.post(`${API_BASE_URL}/Project/updateProject`,editObject, {headers: {"Content-Type": "application/json",}})
        .then(response=>{
            response.data && setProject(response.data);
            setUiState(prev => ({...prev, editing: false}))
        }).catch((e)=> {console.log(e,editObject)})
    },[editObject])


    const confirmDelete = (task) => {
        confirm(`Are you sure you want to delete ${task.name}?`, 'Yes','Cancel') && 
        axios({
                method: 'delete',
                url:  `${API_BASE_URL}/Task/deleteTask`,
                data: task,
                headers: {"Content-Type": "application/json",}
              })
            .then(()=> {
                taskList && setTaskList(prev => prev.filter(t => t.taskId != task.taskId));
                 setProject(prev => ({
                    ...prev,
                    tasks : prev.tasks.filter(t => t.taskId != task.taskId)
                 })
                )
                }).catch((error)=>{console.log(error)})
    }

    const confirmRemoveTag = (tag) => {
        axios.post(`${API_BASE_URL}/Project/removeTag/${project.projectId}/${tag.tagId}`)
        .catch(e => {console.log(e)}).finally(()=>{
            setProject(prev => ({
                ...prev,
                tags: prev.tags.filter(t => t.tagId!= tag.tagId)
            }))
        })
    }


return (
    <div id="edits">
        <h3>Editing</h3>
        <div>
            <form id="editProjectForm" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" name='name' 
                    defaultValue={project.name} {...register('name', {required:true, minLength:3})}/>
                    {errors.name && <p className="errorMessage">Name must be at least 3 characters</p>}
                <label htmlFor="description">About:</label>
                <textarea id="description" name="description" rows="5" 
                    defaultValue={project.description} {...register('description')}></textarea>
                
              <PopulatedStatusList item={project} register={register} />
                
                {(project.tasks.length> 0 || project.tags.length>0 )&& 
                    <p className="span2">Click to remove Tasks or Tags</p>}
                {project.tasks.length > 0 && (<><label>Tasks:</label>
                <div id="editProjectTasks">
                    {project.tasks.map((task) => {
                        return (!task.isDeleted && <p key={`task${task.taskId}`} 
                                className="deleteTask" onClick={() => 
                                confirmDelete(task)}>{task.name}</p>) }) }
                </div></>)}
                
                {project.tags.length>0 && (<><label>Tags:</label>
                <div id="editProjectTags">
                    {project.tags.map(tag => {
                        return <p key={tag.tagId} 
                        onClick={()=>{confirmRemoveTag(tag)}}
                        className="deleteTag">{tag.name}</p>
                    })}
                </div>
                </>)}

                <input type="hidden" name="projectId" 
                    value={project.projectId} {...register('projectId')}  />
                <button type="submit">Save</button>
            </form>
        </div>
    </div>
   )
    }

