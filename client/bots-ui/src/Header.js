import './Header.css';

export default function Header(props) {
    return(
        <header>
            <h1>MaBots</h1>

            {props.headerState === 'start' ? 
                !props.token ? 
                    <button id = "login" onClick={props.toLogin}> Login </button>
                    : 
                    <button id = "profile"> Profile </button>
                : null
            }
            
            {props.headerState === 'start' ?
                !props.token ? <button id = "register" onClick={props.toRegister}>Sign Up</button> : null
                : null
            }
        </header>
    );
}