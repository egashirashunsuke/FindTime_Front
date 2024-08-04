import axios from 'axios';
import Sidebar from './Sidebar';
import React from 'react';
import "../style/common.css"
import "../style/BandForm.css"
import { Button} from '@mui/material';
import { useForm} from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";


function BandForm() {
    const {register:registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: errorCreate }
    } = useForm({
        mode: `onChange`
    })

    const {register:registerJoin,
        handleSubmit: handleSubmitJoin,
        formState: { errors: errorJoin }
    } = useForm({
        mode: `onChange`
    })


    const CreateSubmit = (data) => {
        console.log(data.groupname)
        
        axios.post("http://localhost:8000/api/bands",{
            name: data.groupname
        }).then((res) => {
            if (res.status === 200){
                window.alert("グループを作成しました")
            }
        }).catch((err) => {
            window.alert("グループの作成に失敗しました")
        })
    }

    const JoinSubmit = (data) => {
        console.log(data.joinid)
        axios.post("http://localhost:8000/api/bands/" + data.joinid + "/members").then((res) => {
            if (res.status === 200){
                window.alert("グループに参加しました")
            }
        }).catch((err) => {
            window.alert("グループへの参加に失敗しました")
        })
    }

    return(<div className='container'>
        <Sidebar />
        <div className='main_container'>
            <div className='bandform_container'>
                <div className='create_group_container'>
                    <h2 className='create_group_title'>グループを作成</h2>
                    <form className='bandform_form' onSubmit={handleSubmitCreate(CreateSubmit)}>
                        <input type='text' className="groupForm" label="グループ名"  
                        {...registerCreate("groupname",{required: "グループ名を入力してください"})}/>
                        <ErrorMessage errors={errorCreate} name="groupname" render={({message}) => <span>{message}</span>} />
                        <Button  className="groupButton" variant="contained" type='submit'>
                            グループを作成
                        </Button>
                    </form>
                </div>

                <hr/>

                <div className='join_group_container'>
                    <h2 className='join_group_title'>グループに参加</h2>
                    <form className="bandform_form" onSubmit={handleSubmitJoin(JoinSubmit)}>
                        <input type='text' className="groupForm" label="グループID"  
                        {...registerJoin("joinid",{required: "グループIDを入力してください"})}/>
                        <ErrorMessage errors={errorJoin} name="joinid" render={({message}) => <span>{message}</span>} />
                        <Button className="groupButton" variant="contained" type='submit'>
                            グループに参加
                        </Button>
                    </form>
                    </div>
                </div>
            </div>


    </div>)
}

export default BandForm


// function BandForm() {
//     const [createValue, setCreateValues] = useState();
//     const [joinValue, setJoinValues] = useState();

//     const handleChange = (e) => {
//         const {name, value} = e.target;
//         if (name === "groupname"){
//             setCreateValues(value)
//         } else if (name === "groupid"){
//             setJoinValues(value)
//         }
//     }

//     const handleCreateSubmit = (e) => {
//         axios.post("http://localhost:8000/api/bands",{
//             name: createValue
//         }).then((res) => {
//             if (res.status === 200){
//                 window.alert("グループを作成しました")
//             }
//         })
//     }

//     const handleJoinSubmit = (e) => {
//         axios.post("http://localhost:8000/api/bands/" + joinValue + "/members").then((res) => {
//             if (res.status === 200){
//                 window.alert("グループに参加しました")
//             }
//         })
//     }

//     return(<div className='container'>
//         <Sidebar />
//         <div className='main_container'>
//             <div className='bandform_container'>
//                 <div className='create_group_container'>
//                     <h2 className='create_group_title'>グループを作成</h2>
//                     <form className='bandform_form' onSubmit={handleCreateSubmit}>
//                         <TextField className="groupForm" label="グループ名" name='groupname' onChange={(e) => handleChange(e)}/>
//                         <Button  className="groupButton" varisant="contained" type='submit'>
//                             グループを作成
//                         </Button>
//                     </form>
//                 </div>

//                 <hr/>

//                 <div className='join_group_container'>
//                     <h2 className='join_group_title'>グループに参加</h2>
//                     <form className="bandform_form" onSubmit={handleJoinSubmit}>
//                         <TextField className="groupForm" label="グループID" type="text"  name='groupid' onChange={(e) => handleChange(e)}/>
//                         <Button className="groupButton" variant="contained" type='submit'>
//                             グループに参加
//                         </Button>
//                     </form>
//                     </div>
//                 </div>
//             </div>


//     </div>)
// }

// export default BandForm