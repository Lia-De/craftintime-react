import axios from "axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tagListAtom } from "../atoms/tagListAtom";


export const DeleteTag = ({tagToDelete}) => {
    const [tagList, setTagList] = useAtom(tagListAtom);

const [deleteData, setDeleteData] = useState(null);

const handleDelete = () => {
    confirm(`Are you sure you want to delete ${tagToDelete.Name}?`, 'Yes','Cancel') && setDeleteData(tagToDelete)
}

useEffect(()=>{
    deleteData && axios(
        {
            method: 'delete',
            url:  `/api/Tag/deleteTag`,
            data: tagToDelete,
            headers: {"Content-Type": "application/json",}
          })
        .then(response=> {
            console.log(response.data);
            setTagList((prev) => ( prev.filter(t => {
                return t.tagId != tagToDelete.tagId
            }) ) );

        })
        .catch(error=> console.log(error))
}, [deleteData])

return (
    <div className="delete">
        <button className="deleteButton" onClick={handleDelete}></button>
    </div>
)


}
// }/Tag/deleteTag`;
// deleteData = {
//     tagId: id,
//     Name: data
// };