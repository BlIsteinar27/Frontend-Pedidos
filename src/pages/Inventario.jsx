
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'bootstrap';


const API = "http://localhost/pedidos/pedidosback/api/productos/getProductos.php"

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({ nombre: '', cédula: '', teléfono: '' });
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        const response = await fetch(API);
        const data = await response.json();
        setProductos(data);
    };

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const imageBodyTemplate = (product) => {
        return <img src={`${product.foto}`} alt="foto" className="w-6rem shadow-2 border-round" />;
    };

    const statusBodyTemplate = (product) => {
        return <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Productos</span>

        </div>
    );
    const footer = `In total there are ${productos ? productos.length : 0} products.`;
    return (
        <>
           
            <h2 className='text-center py-2'>Inventario</h2>
            <div className="d-flex justify-content-center py-3">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search " />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Filtrar producto por... " className="w-full px-5" />
                </IconField>
            </div>
            <div className='container p-2'>
                <Button icon="pi pi-plus" label="Agregar un producto nuevo" className='p-button-success' />
                <div className="card bg-dark text-white ">
                    <DataTable value={productos} filters={filters} header={header} footer={footer} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" sortable header="#"></Column>
                        <Column field="nombre" sortable header="Nombre"></Column>
                        <Column field="foto" sortable header="Imagen"></Column>
                        <Column header="Detalles Producto" body={(rowData) => (
                            <Button
                                icon="pi pi-info"
                                onClick={() => editAlumno(rowData)}
                                className="p-button-info p-mr-2" // Margen a la derecha
                                label="Detalle"
                            />
                        )}></Column>
                        <Column header="Acciones" body={(rowData) => (
                            <div>
                                <Button
                                    icon="pi pi-pencil"
                                    onClick={() => editAlumno(rowData)}
                                    className="p-button-info p-mr-2" // Margen a la derecha
                                />
                                <Button
                                    icon="pi pi-trash"
                                    onClick={() => confirmDelete(rowData.id)}
                                    className="p-button-danger" // Botón rojo para eliminar
                                />
                            </div>
                        )}></Column>
                    </DataTable>

                </div>
            </div>
        </>
    )
}

export default Inventario