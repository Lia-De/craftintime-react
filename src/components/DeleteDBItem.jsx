import axios from "axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tagListAtom } from "../atoms/tagListAtom";
import { projectListAtom } from "../atoms/projectListAtom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DeleteTag = ({tagToDelete}) => {
    const [tagList, setTagList] = useAtom(tagListAtom);
    const [deleteData, setDeleteData] = useState(null);

    const handleDelete = () => {
        confirm(`Are you sure you want to delete ${tagToDelete.name}?`, 'Yes','Cancel') && setDeleteData(tagToDelete)
    }

    useEffect(()=>{
        deleteData && axios(
            {
                method: 'delete',
                url:  `${API_BASE_URL}/Tag/deleteTag`,
                data: deleteData,
                headers: {"Content-Type": "application/json",}
            })
            .then(()=> {
                    setTagList((prev) => ( prev.filter(t => {
                        return t.tagId != tagToDelete.tagId
                    }) ) );
            })
            .catch(error=> console.log(error))
    }, [deleteData])

    return (
        <div className="delete">
            <button className="deleteButton"
                onClick={handleDelete} 
                aria-label={`Delete tag ${tagToDelete.name}`}>
            </button>
        </div>
    )
} // end DeleteTag

export const DeleteProject = ({projectToDelete}) =>{
    const [projectList, setProjectList] = useAtom(projectListAtom);
    const [deleteData, setDeleteData] = useState(null);

    const handleDelete = () => {
        confirm(`Are you sure you want to delete ${projectToDelete.name}?`, 'Yes','Cancel') 
        && setDeleteData(projectToDelete)
    }

    useEffect(()=>{
        deleteData && axios(
            {
                method: 'delete',
                url:  `${API_BASE_URL}/Project/deleteProject`,
                data: deleteData,
                headers: {"Content-Type": "application/json",}
            })
            .then(()=> {
                setProjectList((prev) => (
                    prev.filter(t => { return t.projectId != deleteData.projectId  }) ) )
            }).catch((e)=>{console.log(e)});

    },[deleteData])

    return (
        <div className="delete">
            <button className="deleteButton"  
                onClick={handleDelete} 
                aria-label={`Delete project ${projectToDelete.name}`}>
            </button>
        </div>
    )
}
