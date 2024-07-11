import Sidebar from './Sidebar';
import React from 'react';
import "../style/common.css"


function UseCase() {

    return(
    <div className='container'>
        <Sidebar />
        <div className='main_container'>
            <h1>使い方</h1>
            <h2>
                マイスケジュール
            </h2>
            <h2>
                グループスケジュール
            </h2>
            <h2>
                グループの作成/参加
            </h2>
        </div>
    
    </div>)
}

export default UseCase
