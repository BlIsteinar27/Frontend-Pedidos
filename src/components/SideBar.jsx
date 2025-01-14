import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { FaMapMarkerAlt, FaUserAlt } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { GiNotebook } from 'react-icons/gi'
import { Link } from 'react-router-dom'

const SideBar = () => {
    // controla los detalles
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <div className="d-flex flex-column flex-shrink-0 p-4  sideBar-bg" style={{ width: 280 }}>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/inicio" href="#" className="nav-link text-white" aria-current="page">
                            <FaHouse className='icon me-2' />Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/inventario" href="#" className="nav-link text-white">

                            <GiNotebook className='icon me-2' />Inventario
                        </Link>
                    </li>
                    <li>
                        <Link to="/sedes" href="#" className="nav-link text-white">
                            <FaMapMarkerAlt className='icon me-2' />Sedes
                        </Link>
                    </li>
                    <li>
                        <Link to="/alumnos" href="#" className="nav-link text-white">
                            <FaUserAlt className='icon me-2' />Alumnos
                        </Link>
                    </li>
                </ul>
                <Button className="p-button-primary mt-2 text-center" href="#" onClick={handleShow}>
                    <i className='pi pi-user me-2'></i>Iniciar sesión
                </Button>
                <hr />
                <div className="dropdown">
                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://github.com/mdo.png" alt='' width={32} height={32} className="rounded-circle me-2" />
                        <strong>mdo</strong>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SideBar