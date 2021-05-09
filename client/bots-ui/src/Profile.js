export default function Profile() {
    const tokenString = window.sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const mapString = window.sessionStorage.getItem('tokenMap');
    const map = JSON.parse(mapString);
    const user = map[userToken.token];
    
    return (
        <div className="profile-wrapper">
            <h1> {user} </h1>
            <h2> My Bots </h2>
            <div>
                <p> list </p>
            </div>
        </div>
    );
}