import './Arena.css'

export default function Arena() {
    return(
        <section id = "Arena">
            <div className = "wrapper">
                <h2> Arena </h2>
                <form className = "form">
                    <label>
                    <p>Player 1</p>
                    <input type="text"/>
                    </label>
                    <label>
                    <p>Player 2</p>
                    <input type="text"/>
                    </label>
                    <div>
                    <button type="submit">Fight</button>
                    </div>
                </form>
            </div>
        </section>
    );
}