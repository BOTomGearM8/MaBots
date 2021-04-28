import useToken from './useToken';
import Login from './Login';

export default function Header(props) {
    const { token, setToken } = useToken();

    return(
        <header>
            <h1>MaBots</h1>

            {props.headerState === 'loginClicked' && <Login setToken={setToken}></Login>}

            {props.headerState === 'start' ? 
                !token ? 
                    <button onClick={props.toLogin}> Login </button>
                    : 
                    "Profile"
                : null
            }
            

            {props.headerState === 'start' ?
                !token ? <button>Sign Up</button> : null
                : null
            }
        </header>
    );
}