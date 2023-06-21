import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="content">
                <h1 className="text-center mb-4">Integracja</h1>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card text-center">
                            <div className="card-body">
                                <h2 className="card-title">Login</h2>
                                <p className="card-text">Zaloguj się, jeśli posiadasz już konto.</p>
                                <Link to="/login" className="btn btn-primary">Login</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card text-center">
                            <div className="card-body">
                                <h2 className="card-title">Zarejestruj się</h2>
                                <p className="card-text">Zarejestruj się, jeśli nie posiadasz jeszcze konta</p>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
