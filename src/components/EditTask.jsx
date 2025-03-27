import axios from "axios";
import { useForm } from "react-hook-form";
import { PopulatedStatusList } from "./FormatData";
import { useAtom } from "jotai";
import { taskListAtom } from "../atoms/taskListAtom";

// API Call
function sendEdit(updatedTask) {
    return axios.post('/api/Task/updateTask', updatedTask, {
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.data)
    .catch(error => {
        console.log(error);
        return null;
    });
}

// Shared function for submitting task updates
async function handleTaskUpdate(data, task, setTaskList, callback) {
    const newDeadline = data.deadline === '' ? null : data.deadline;
    const newDesc = data.description === '' ? null : data.description;
    const newStatus = data.status ? Number(data.status) : null;

    const obj = {
        ...data,
        deadline: newDeadline,
        description: newDesc,
        taskId: Number(task.taskId),
        projectId: Number(task.projectId),
        status: newStatus
    };

    const updatedTask = await sendEdit(obj);
    
    if (updatedTask) {
        setTaskList(prev =>
            prev.map(t => t.taskId === task.taskId ? updatedTask : t)
        );
        if (callback) callback();  // Call the provided UI state update function
    }
}

// Edit Task Component
export const EditTask = ({ task, setUiState }) => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const [taskList, setTaskList] = useAtom(taskListAtom);

    return (
        <div id="edits">
            <h3>Editing</h3>
            <form id="editTaskForm" onSubmit={handleSubmit((data) => 
                handleTaskUpdate(data, task, setTaskList, () => 
                    setUiState(prev => ({ ...prev, editingTask: false }))
                )
            )}>
                <label htmlFor="name">Name: </label>
                <input type="text" id="name" defaultValue={task.name} {...register('name', { required: true })}/>
                {errors.name && <p className="errorMessage">Name must be at least 3 characters</p>}

                <label htmlFor="description">About:</label>
                <textarea id="description" rows="5" defaultValue={task.description} {...register('description')} />
                
                <PopulatedStatusList item={task} register={register} />

                <label htmlFor="deadline">Deadline: </label>
                <input type="datetime-local" id="deadline" defaultValue={task.deadline} {...register('deadline')} />

                <button type="submit">Save</button>
            </form>
        </div>
    );
}

// Edit Task Deadline Component
export const EditTaskDeadline = ({ task, uiState, setUiState }) => {
    const { register, handleSubmit } = useForm();
    const [taskList, setTaskList] = useAtom(taskListAtom);

    if (uiState.taskDeadlineToggle && uiState.taskDeadlineItem === task.taskId) {
        return (
            <>
                <form id="setDeadlineForm" onSubmit={handleSubmit((data) => 
                    handleTaskUpdate(data, task, setTaskList, () => 
                        setUiState(prev => ({
                            ...prev, 
                            taskDeadlineToggle: false,
                            taskDeadlineItem: 0
                        }))
                    )
                )}>
                    <input type="datetime-local" {...register('deadline')} />
                    <button type="submit">Save</button>
                </form>
                <p className="noDeadline" onClick={() => 
                    setUiState(prev => ({ ...prev, taskDeadlineToggle: false }))
                }></p>
            </>
        );
    } else {
        return (
            <p className="noDeadline" onClick={() => 
                setUiState(prev => ({ 
                    ...prev, 
                    taskDeadlineToggle: true,
                    taskDeadlineItem: task.taskId
                }))
            }></p>
        );
    }
};



// import axios from "axios"
// import { useForm } from "react-hook-form"
// import { formatDateTime, PopulatedStatusList } from "./FormatData";
// import { useEffect, useState } from "react";
// import { useAtom } from "jotai";
// import { taskListAtom } from "../atoms/taskListAtom";

// function sendEdit(updatedTask) {
//     console.log(updatedTask);
    
//     return axios.post('/api/Task/updateTask', updatedTask, {
//         headers: { "Content-Type": "application/json" },
//     })
//     .then(response => response.data) // Return the actual updated task
//     .catch(error => {
//         console.log(error);
//         return null; // Return null to avoid breaking the UI
//     });
// }

// export const EditTask = ({ task, setUiState }) => {
//     const { handleSubmit, register, formState: { errors } } = useForm();
//     const [taskList, setTaskList] = useAtom(taskListAtom);
    
//     const onSubmit = async (data) => {
//         let newDeadline = data.deadline === '' ? null : data.deadline;
//         let newDesc = data.description === '' ? null : data.description;
//         let newStatus = data.status ? Number(data.status) : null;

//         const obj = {
//             ...data,
//             deadline: newDeadline,
//             description: newDesc,
//             taskId: Number(task.taskId),
//             projectId: Number(task.projectId),
//             status: newStatus
//         };

//         const updatedTask = await sendEdit(obj); // Wait for the response

//         if (updatedTask) { // Ensure it's not null before updating
//             setTaskList(prev =>
//                 prev.map(t => t.taskId === task.taskId ? updatedTask : t)
//             );
//             setUiState(prev => ({ ...prev, editingTask: false }));
//         }
//     };
    

//     return (

//         <div id="edits">
//             <h3>Editing</h3>
//             <div>
//                 <form id="editTaskForm" onSubmit={handleSubmit(onSubmit)}>
//                     <label htmlFor="name">Name: </label>
//                     <input type="text" id="name" defaultValue={task.name} name="name" {...register('name', {required:true})}/>
//                     {errors.name && <p className="errorMessage">Name must be at least 3 characters</p>}
//                     <label htmlFor="description">About:</label>
//                     <textarea id="description" name="description" rows="5" 
//                         defaultValue={task.description} {...register('description')}></textarea>

//                     <PopulatedStatusList item={task} register={register}/>
//                     {task.tags.length>0 && (<>
//                     <p className="span2">Click to remove Tags</p>
//                     <label>Tags:</label>
//                     <div id="editTaskTags">
//                         {task.tags.map(tag => {
//                             return <p key={tag.tagId} 
//                             onClick={()=>{confirmRemoveTag(tag)}}
//                             className="deleteTag">{tag.name}</p>
//                         })}
//                     </div>
//                     </>)}
//                     <label htmlFor="deadline">Deadline: </label>
//                     <input name="deadline" id="deadline" defaultValue={task.deadline} 
//                         type="datetime-local" {...register('deadline')} />
//                     <button type="submit">Save</button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export const EditTaskDeadline = ({task, uiState, setUiState}) => {
//     const {register, handleSubmit, reset} = useForm();
//     const [taskList, setTaskList] = useAtom(taskListAtom);

//     const onSubmit = async (data)=>{
//         if (data.deadline != ''){
//             let newDeadline = data.deadline;
//             let newDesc = data.description === '' ? null : data.description;
//             let newStatus = data.status ? Number(data.status) : null;
    
//             const obj = {
//                 ...data,
//                 deadline: newDeadline,
//                 description: newDesc,
//                 taskId: Number(task.taskId),
//                 projectId: Number(task.projectId),
//                 status: newStatus
//             };
    
//             const updatedTask = await sendEdit(obj); // Wait for the response
    
//             if (updatedTask) { // Ensure it's not null before updating
//                 setTaskList(prev =>
//                     prev.map(t => t.taskId === task.taskId ? updatedTask : t)
//                 );
//                 setUiState(prev => ({ ...prev, 
//                     taskDeadlineToggle: !prev.taskDeadlineToggle,
//                     taskDeadlineItem: 0
//                 }))}
//         }
//     }
    
//     if (uiState.taskDeadlineToggle && uiState.taskDeadlineItem === task.taskId) {
//     return (<>
//         <form id="setDeadlineForm" onSubmit={handleSubmit(onSubmit)}>
//             <input type="datetime-local" name="deadline" id="deadline" {...register('deadline')}/>
//             <button type="submit">Save</button>
        
//             </form>
//             <p className="noDeadline" 
//                     onClick={() => setUiState(prev => (
//                         { ...prev, 
//                             taskDeadlineToggle: !prev.taskDeadlineToggle}))}></p>
//         </>)
            
//     } else {
//     return   ( <p className="noDeadline" 
//                     onClick={() => setUiState(prev => (
//                         { ...prev, 
//                             taskDeadlineToggle: !prev.taskDeadlineToggle,
//                             taskDeadlineItem: task.taskId
//                             }
//                     ))}></p>)
//     }


// }