import { useAtom } from "jotai";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import {tagListAtom} from '../atoms/tagListAtom';
import { tagAtom } from "../atoms/tagAtom";
import axios from "axios";
import CraftInTimeAPI from '../backendconfig';
import { projectAtom } from "../atoms/projectAtom";
import { showDetailAtom } from "../atoms/showDetailAtom";

export function Tag(){

    const [showTag, setShowTag] = useState(false);
    const [tagList, setTagList]= useAtom(tagListAtom);
    const [tag, setTag] = useAtom(tagAtom);
    const [project, setProject] = useAtom(projectAtom);
    const [showDetail, setShowDetail] = useAtom(showDetailAtom);

    useEffect(() => {
        axios.get(`${CraftInTimeAPI}/Tag`)
                    .then(response => {
                        setTagList(response.data);
                        setShowTag(false);
                    })
                    .catch(error => {
                        console.log(error);
                    });
        }, []);
    
function getTag(e){
    let tagId = e.currentTarget.id.split('-')[1];
    axios.get(`${CraftInTimeAPI}/Tag/getSingleTag/${tagId}`)
    .then(response => {
        setTag(response.data)
        setShowTag(true);
    }).catch(error => {
        console.log(error);
    });
}

function goToProject(proj){
    setProject(proj);
    console.log(proj);
    console.log(project);
    setShowDetail(true);
}

    if (showTag) {
        return (
            <>
            <div className="header">
                <button className="editButton"></button>
                <h2 id="nowShowing">{tag.name}</h2>
                <button id="closeButton" onClick={() => setShowTag(false) }>Back to list</button>
            </div>
            <div id="contents">
                <div id="detail-4">
                    {tag.projects?.length == 0 ? 
                        <p>Not used in any projects</p>: 
                        <><p>Used in project</p> 
                        <ul> 
                            {tag.projects.map(proj=> 
                            <li key={proj.projectId}><Link to="../project" onClick={()=>goToProject(proj)}>{proj.name}</Link></li> )}
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
            {tagList?.map((item) => (
                <div key={item.tagId} className="itemCard" >
                    <div className="item" id={`detail-${item.tagId}`} onClick={getTag}>
                        <h3 className="tagName">{item.name}</h3>
                        <p className="usage">{item.projectCount} ({item.taskCount})</p>
                    </div>
                    <div className="delete">
                        <button className="deleteButton"></button>
                    </div>
                </div>

            ))
            }

        

        </div>
    </>
    )
}