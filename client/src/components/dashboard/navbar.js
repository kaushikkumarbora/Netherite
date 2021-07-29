import '../landing.css'

function NavBarTop() {
    return (
        // <!-- Navigation-->
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container px-4 px-lg-5">
                <div className="navbar-brand" >Netherite</div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
                    aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span
                        className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active"><div className="nav-link">Team - BitOverflow - Rabijit Singh, Subhasish Goswami and Kaushik Kumar Bora</div></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default NavBarTop;