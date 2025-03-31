import he from 'he';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useAtom } from 'jotai';
import { projectAtom } from '../atoms/projectAtom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ApplyTimer = ({ setUiState, date}) => {
    const [project, setProject] = useAtom(projectAtom);
    const {handleSubmit, register}= useForm();
    
    const onSubmit = async (data) => {
        setUiState(prev =>({
          ...prev,
          stopTimer: false,
          startTimer: false
        }));
        
        const dataToSend = {
            timestamp: Number(data.date),
            projectID: Number(data.projectId),
            taskId: Number(data.taskId),
          };
          
          try{ 
            await axios.post(`${API_BASE_URL}/Project/stopTimer/${dataToSend.projectId}/${dataToSend.taskId}`,
              dataToSend,
               {headers: {"Content-Type": "application/json",}}
              )
          .then(response => {      
            setProject((prev) => ({
              ...prev,
              totalWorkingTime: response.data // Replace existing 
          }));

          })
          .catch(error=>{
            console.log(error)
          })}
          catch (e) {
            console.log(e);
          }

    }
    
    // Print the form to choose which task (that are not deleted) to apply the timer to. Default to the project itself.
    let tasks = project.tasks.filter(t=> !t.isDeleted);
    return (
        <form id="chooseTaskForm" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" 
              name="date" value={date} {...register('date')}/>
            <input type="hidden" 
              name="projectId" value={project.projectId} {...register('projectId')} />
            <p>If the timer applies to a particular task, pick the right one here</p>
            <label htmlFor="0">Apply to project
                <input type="radio" id="task-0" name="appliedToTask" 
                defaultChecked value="0" {...register('taskId')}/>
            </label>
            {tasks.map(t=> (
                <label key={`label-${t.taskId}`} htmlFor={`task-${t.taskId}`}>{he.decode(t.name)}
                    <input  type="radio" id={`task-${t.taskId}`} 
                      name="appliedToTask" value={t.taskId} {...register('taskId')} />
                </label>
            ))}
      
            <button>Apply</button>
        </form>       
    )
}