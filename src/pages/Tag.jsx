import { useAtom } from "jotai";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import {tagListAtom} from '../atoms/tagListAtom';
import { tagAtom } from "../atoms/tagAtom";
import { projectAtom } from "../atoms/projectAtom";
import { showDetailAtom } from "../atoms/showDetailAtom";

import { AddNewTag } from "../components/AddNewTag";
import { DeleteTag } from "../components/DeleteDBITem";
import { EditTagForm } from "../components/EditTagForm";

export function Tag(){
    const [tagList, setTagList]= useAtom(tagListAtom);
    const [tag, setTag] = useAtom(tagAtom);
    const [showTag, setShowTag] = useState(null);
    const [project, setProject] = useAtom(projectAtom);
    const [showDetail, setShowDetail] = useAtom(showDetailAtom);
    const [addItemForm, setAddItemForm] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    

    useEffect(() => {
        axios.get(`/api/Tag`)
            .then(response => {
                setTagList(response.data);
                setShowDetail(false);
                setTag(null);
            })
            .catch(error => {
                console.log(error);
                setTagList(null);
            });
        }, []);

    useEffect(()=> {
            showTag!=null && 
            axios.get(`/api/Tag/getSingleTag/${showTag.tagId}`)
            .then(response => {
                setTag(response.data)
                setShowDetail(true);
            }).catch(error => {
                console.log(error);
            });
    },[showTag])

    function goToProject(proj){
        setProject(proj);
        setShowDetail(true);
    }



    if (showDetail && tag) {
        return (
            <>
            <div className="header">
                <button className="editButton" onClick={()=>setShowEdit(!showEdit)}></button>
                <h2 id="nowShowing">{tag.name}</h2>
            </div>
            {showEdit && <EditTagForm editTag={tag} setShowEdit={setShowEdit}/>}
            <div id="contents">               
                <div id={`detail-${tag.tagId}`}>
                    {tag.projects?.length == 0 ? 
                        <p>Not used in any projects</p>: 
                        <><p>Used in project</p> 
                        <ul> 
                            {tag.projects.map(proj=> 
                            <li key={proj.projectId}>
                                    <Link to="../project" onClick={()=>goToProject(proj)}>
                                        {proj.name}</Link>
                            </li> )}
                        </ul></>}
                    {tag.tasks?.length > 0 && <p>Also used in <b>{tag.tasks.length}</b> tasks</p>}
                </div>
            </div>
        </>
        )
    } else
    return (
        <>
        <div className="header">
            <h2 id="nowShowing">{tagList?.length} Tags</h2>
        </div>
        <div id="contents" className="listAllTags">
        <div id="addNewItem" className={addItemForm ? 'shadowbox':''}>
            <button className={addItemForm? "addItemButtonActive":"addItemButton"} 
                onClick={() =>setAddItemForm(prev => !prev)} aria-label="Add new tag">+</button>
            {addItemForm && <AddNewTag /> }
            </div>
            {tagList?.map((item) => (
                <div key={item.tagId} className="itemCard" >
                    <div className="item" id={`detail-${item.tagId}`} onClick={()=>{setShowTag(item)}}>
                        <h3 className="tagName">{item.name}</h3>
                        <p className="usage">{item.projectCount || '0' } ({item.taskCount || '0'})</p>
                    </div>
                    <DeleteTag tagToDelete={item}/>
                </div>
            ))
            }
        </div>
    </>
    )
}