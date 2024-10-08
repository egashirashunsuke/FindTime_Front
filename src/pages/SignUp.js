import { useForm} from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";
import '../style/Login.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";


export default function Login() {
    const navigate = useNavigate();
    

    const {
        register,
        handleSubmit,
        reset,
        formState:{ errors}
    } = useForm({
        mode: 'onChange',
    });

    const onSubmit = (data) => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/signup`,{
            name: data.username,
            password: data.password
        }).then((res) =>{
            if (res.status === 200 || res.status === 204) { 
                loginSuccess();
            }
          })
          //ユーザ名とパスワードが一致してたらまずいね
          console.log(`${process.env.REACT_APP_BASE_URL}/signup`)


    };


    const loginSuccess = () => {
        navigate("/");
    }

    const clearForm = () => {
        reset();
    }

    return (
        <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>サインアップ</h1>
                <hr />
                <div className="uiForm">
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
                        <Button
                        variant="contained"
                            type="submit"
                            className="submitButton"
                        >サインアップ
                        </Button>
                        <Button
                        variant="contained"
                            type="button"
                            className="clearButton"
                            onClick={clearForm}
                        >クリア</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
