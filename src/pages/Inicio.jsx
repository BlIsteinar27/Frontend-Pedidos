import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const API = 'http://localhost/pedidos/api/productos/getProductos.php';

const Inicio = () => {
    const [datos, setDatos] = useState([]);

    const getDatos = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            setDatos(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDatos();
    }, []);

    return (
        <>
            
            <div className="container">
                <h3 className="text-center py-4">Todos los productos ({datos.length})</h3>
                <div className="row ">
                    {datos && datos.map((item) => (
                        <div key={item.id} className='col-md-4'>
                            <Card 
                                title={`${item.nombre}`} 
                                subTitle={`${item.precio} $`} 
                                footer={
                                    <>
                                        <Button label="info" icon="pi pi-info" />
                                        
                                    </>
                                } 
                                header={<img alt={item.nombre} src={item.foto} />} // Mueve aquí la imagen
                                className="md:w-25rem m-1 "
                                heigth="100"
                            >
                                <p className="m-0">
                                    {item.descripcion}
                                </p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Inicio;
