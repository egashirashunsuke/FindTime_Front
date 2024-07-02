import { useState } from "react";
import { useForm} from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";
import './Login.css';
import { useNavigate } from "react-router-dom";

export default function Login() {//url覚えられてもいいように対策しないと
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

    const onSubmit = (data) => {
        if (data.username === "ega" && data.password === "Ega"){
            loginSuccess();
        }else{
            loginErrorMsg();
        }
        reset();
    };


    const loginSuccess = () => {
        navigate("/Home");
    }

    const loginErrorMsg = () => {
        setErrorMsg("ユーザ名もしくはパスワードが間違っています");
    }

    const clearForm = () => {
        reset();
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
                                    value: 20,
                                    message: '20文字以内で入力してください'
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
                        <button
                            type="submit"
                            className="submitButton"
                        >ログイン
                        </button>
                        <button
                            type="button"
                            className="clearButton"
                            onClick={clearForm}
                        >クリア</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
