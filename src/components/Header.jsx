import PropTypes from "prop-types";

function Header({ setAdd }) {
	return (
		<header className="header">
			<p className="header-title">Happy Leaves</p>
			<nav className="header-nav">
				<a
					onClick={() => setAdd(false)}
					className="header-link">
					View
				</a>
				<a
					onClick={() => setAdd(true)}
					className="header-link">
					Add
				</a>
			</nav>
		</header>
	);
}

Header.propTypes = {
	setAdd: PropTypes.func.isRequired
};

export default Header;
