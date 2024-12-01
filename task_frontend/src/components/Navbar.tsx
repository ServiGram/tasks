import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav>
            <form action="#">
                <div className="form-input">
                    <input type="search" placeholder="Search..." />
                    <button type="button" className="search-btn">
                        <i className="bx bx-search"></i>
                    </button>
                </div>
            </form>
        </nav>
    );
};

export default Navbar;
