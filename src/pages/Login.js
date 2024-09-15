import { useState } from "react";
import { useForm} from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";
import '../style/Login.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";

export default function Login() {
    const navigate = useNavigate();
    const [errorMsg,setErrorMsg] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState:{ errors}
    } = useForm({
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`,{
            name: data.username,
            password: data.password})
            
            if (res.status === 200){
                localStorage.setItem("token",res.data.token)
                loginSuccess();
            } 
        } catch (error) {
            loginErrorMsg();
        }
    };


    const loginSuccess = () => {
        navigate("/mycalendar");
    }

    const loginErrorMsg = () => {
        setErrorMsg("ユーザ名もしくはパスワードが間違っています");
    }

    const clearForm = () => {
        reset();
    }

    const navigateSignin = () => {
        navigate("/signup")
    }

    return (
        <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>ログイン</h1>
                <hr />
                <div className="uiForm">
                    <p className="errorMsg">{errorMsg}</p>
                    <div className="formField">
                        <label htmlFor="userID">ユーザ名</label>
                        <input
                            id="useID"
                            type="text"
                            placeholder="userID"
                            {...register('username',{
                                required: 'ユーザ名を入力してください',
                                maxLength: {
                                    value: 10,
                                    message: '10文字以内で入力してください'
                                },
                            })}
                        />
                    </div>
                    <ErrorMessage errors={errors} name="username" render={({message}) => <span>{message}</span>} />
                    <div className="formField">
                        <label htmlFor="password">パスワード</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="password"
                            {...register('password',{
                                required:'パスワードを入力してください',
                                maxLength:{
                                    value:20,
                                    message: '20文字以内で入力してください'
                                },
                            })}
                        />
                    </div>
                    <ErrorMessage errors={errors} name="password" render={({message}) => <span>{message}</span>} />
                    <div className="loginButton">
                        <Button
                            variant="contained"
                            type="submit"
                            className="submitButton"
                        >ログイン
                        </Button>
                        <Button
                            variant="contained"
                            type="button"
                            className="clearButton"
                            onClick={clearForm}
                        >クリア</Button>
                    </div>
                    <Button variant="contained" onClick={navigateSignin}>サインアップへ</Button>
                </div>
            </form>
            
        </div>
    )
}
