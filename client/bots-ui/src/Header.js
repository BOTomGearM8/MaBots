import './Header.css';
import { HomeOutlined } from '@ant-design/icons';

export default function Header(props) {
    return(
        <header>
            <h1>MaBots</h1>

            <HomeOutlined onClick={props.toStart} className="home-button" twoToneColor="#eb2f96" />

            {props.headerState === 'start' ? 
                !props.token ? 
                    <button id = "login" onClick={props.toLogin}> Login </button>
                    : 
                    <button id = "profile" onClick={props.toProfile}> Profile </button>
                : null
            }
            
            {props.headerState === 'start' ?
                !props.token ? <button id = "register" onClick={props.toRegister}>Sign Up</button> : null
                : null
            }

            {props.headerState === 'start' ?
                !props.token ? null : <button id = "logout" onClick={props.doLogout}>Logout</button>
                : null
            }
        </header>
    );
}