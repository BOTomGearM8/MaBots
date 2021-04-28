import './Header.css';

export default function Header(props) {
    return(
        <header>
            <h1>MaBots</h1>

            {props.headerState === 'start' ? 
                !props.token ? 
                    <button id = "login" onClick={props.toLogin}> Login </button>
                    : 
                    "Profile"
                : null
            }
            
            {props.headerState === 'start' ?
                !props.token ? <button>Sign Up</button> : null
                : null
            }
        </header>
    );
}