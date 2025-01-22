
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';


const API = "http://localhost/pedidos/pedidosback/api/productos/getProductos.php"

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const toast = useRef(null);
    const [imagen, setImagen] = useState(null); // Manejar una sola imagen

    const POST_API = 'http://localhost/pedidos/pedidosback/api/productos/postProducto.php';

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
        return <img src={`${product.miniatura}`} alt="foto" className="w-6rem shadow-2 border-round" />;
    };
    const openNew = () => {
        setProducto({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
        setImagen(null); // Reiniciar el archivo seleccionado al abrir el diálogo
        setVisible(true);
    };

    // Función para manejar el clic en el botón
    const saveProducto = async (event) => {
        event.preventDefault();
        const dataToSend = new FormData();

        // Agregar los datos del producto al objeto FormData
        Object.keys(producto).forEach(key => {
            dataToSend.append(key, producto[key]);
        });

        // Agregar la imagen al objeto FormData si existe
        if (imagen) {
            dataToSend.append('miniatura', imagen);
        }

        // Mostrar los valores de FormData en la consola
        for (let [key, value] of dataToSend.entries()) {
            console.log(`${key}:`, value);
        }
    
        const method = 'POST';
        const url = POST_API;
    
        try {
            const response = await fetch(url, {
                method: method,
                body: dataToSend, // Usar FormData directamente
            });
    
            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                const errorResult = await response.json();
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorResult.message || 'Error desconocido', life: 3000 });
                return;
            }
         
            const result = await response.json();
       console.log(result);
            // Mostrar mensaje de éxito
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Producto inscrito correctamente.`, life: 3000 });
            setVisible(false);
            fetchProductos();
            
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos.', life: 3000 });
        }
    };
    


    const handleEditarProducto = (producto) => {
        console.log("Editar producto:", producto);
        // Aquí puedes implementar la lógica para editar el curso
    };
    const confirmDelete = (id) => {
        setProductoToDelete(id);
        setConfirmDeleteVisible(true);
    };
    const deleteProducto = async () => {
        try {
            const response = await fetch(`http://localhost/pedidos/pedidosback/api/productos/deleteProducto.php?id=${productoToDelete}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado correctamente.', life: 3000 });
                fetchProductos();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
            }
        } catch (error) {
            console.error('Error al eliminar el Producto:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto.', life: 3000 });
        } finally {
            setConfirmDeleteVisible(false);
            setProductoToDelete(null);
        }
    };
    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Productos</span>

        </div>
    );
    const footer = `In total there are ${productos ? productos.length : 0} products.`;

    const footerForm = (
        <div>
            <Button label="Cancelar" icon="pi pi-times p-button-danger" onClick={() => setVisible(false)} />
            <Button label="Agregar" icon="pi pi-check p-button-success" onClick={saveProducto} />
        </div>
    );
    return (
        <>
            <Toast ref={toast} />
            <h2 className='text-center py-2'>Inventario</h2>
            <div className="d-flex justify-content-center py-3">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search " />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Filtrar producto por... " className="w-full px-5" />
                </IconField>
            </div>
            <div className='container p-2'>
                <Button icon="pi pi-plus" label="Agregar un producto nuevo" className='p-button-success' onClick={openNew} />
                <div className="card bg-dark text-white ">
                    <DataTable value={productos} filters={filters} header={header} footer={footer} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" sortable header="#"></Column>
                        <Column field="nombre" sortable header="Nombre"></Column>
                        <Column field={imageBodyTemplate} header="Imagen"></Column>
                        <Column header="Detalles Producto" body={(rowData) => (
                            <Button
                                icon="pi pi-info"
                                onClick={() => handleEditarProducto(rowData)}
                                className="p-button-info p-mr-2" // Margen a la derecha
                                label="Detalle"
                            />
                        )}></Column>
                        <Column header="Acciones" body={(rowData) => (
                            <div>
                                <Button
                                    icon="pi pi-pencil"
                                    onClick={() => handleEditarProducto(rowData)}
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

                    <Dialog header="Editar Categoria" visible={visible} footer={footerForm} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
                        <form className="p-fluid">
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre del producto</label>
                                <InputText
                                    id="nombre"
                                    className="w-full"
                                    value={producto.nombre}
                                    onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoria" className="form-label">Categoria del producto</label>
                                <InputText
                                    id="categoria"
                                    className="w-full"
                                    value={producto.categoria}
                                    onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precio" className="form-label">Precio del producto</label>
                                <InputText
                                    id="precio"
                                    className="w-full"
                                    value={producto.precio}
                                    onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="descuento" className="form-label">Descuento del producto</label>
                                <InputText
                                    id="descuento"
                                    className="w-full"
                                    value={producto.descuento}
                                    onChange={(e) => setProducto({ ...producto, descuento: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="rating" className="form-label">Rating del producto</label>
                                <InputText
                                    id="rating"
                                    className="w-full"
                                    value={producto.rating}
                                    onChange={(e) => setProducto({ ...producto, rating: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Stock</label>
                                <InputText
                                    id="stock"
                                    className="w-full"
                                    value={producto.stock}
                                    onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="marca" className="form-label">Marca del producto</label>
                                <InputText
                                    id="marca"
                                    className="w-full"
                                    value={producto.marca}
                                    onChange={(e) => setProducto({ ...producto, marca: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="miniatura" className="form-label pb-2">Selecciona imágenes</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="miniatura"
                                    accept="image/*"
                                    onChange={(e) => setImagen(e.target.files[0])} // Almacenar solo un archivo
                                    required
                                />
                            </div>


                        </form>
                    </Dialog>
                    <Dialog header="Confirmar Eliminación" visible={confirmDeleteVisible} footer={
                        <div>
                            <Button label="No" icon="pi pi-times" onClick={() => setConfirmDeleteVisible(false)} />
                            <Button label="Sí" icon="pi pi-check" onClick={deleteProducto} />
                        </div>
                    } onHide={() => setConfirmDeleteVisible(false)}>
                        <p>¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default Inventario