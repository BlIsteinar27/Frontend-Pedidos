
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Rating } from 'primereact/rating';
import { Toast } from 'bootstrap';


const API = "http://localhost/pedidos/pedidosback/api/productos/getProductos.php"

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const toast = useRef(null);

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

    const openNew = () => {
        setProducto({ nombre: '', categoria: '', precio: '', descuento: '', rating: '', stock: '', marca: '' });
        setIsEditing(false);
        setVisible(true);
    };

     // Función para manejar el clic en el botón
  const saveProducto = async (event) => {
    event.preventDefault();
    const method =  'POST';
    const url = POST_API;
    // Aquí puedes implementar la lógica para editar el curso
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      console.log(producto);

      const result = await response.json();

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Producto inscrito correctamente.`, life: 3000 });
        setVisible(false);
        fetchProductos();
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos.', life: 3000 });
    }
  };


    const handleEditarProducto = (producto) => {
        console.log("Editar producto:", producto);
        // Aquí puedes implementar la lógica para editar el curso
    };

    const handleEliminarProducto = (producto) => {
        console.log("Eliminar Producto:", producto);
        // Aquí puedes implementar la lógica para eliminar el curso
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
                        <Column field="foto" sortable header="Imagen"></Column>
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
                                    onClick={() => handleEliminarProducto(rowData.id)}
                                    className="p-button-danger" // Botón rojo para eliminar
                                />
                            </div>
                        )}></Column>
                    </DataTable>

                    <Dialog header="Editar producto" visible={visible} footer={footerForm} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
                        <form className="p-fluid">
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre del producto</label>
                                <InputText
                                    id="nombre"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoria" className="form-label">Nombre de la categoria</label>
                                <InputText
                                    id="categoria"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precio" className="form-label">Precio</label>
                                <InputText
                                    id="precio"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="descuento" className="form-label">Precio con descuento</label>
                                <InputText
                                    id="descuento"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, descuento: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="rating" className="form-label">Rating del producto</label>
                                <InputText
                                    id="rating"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, rating: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Stock </label>
                                <InputText
                                    id="stock"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="marca" className="form-label">Marca del producto</label>
                                <InputText
                                    id="marca"
                                    className="w-full"
                                    value=''
                                    onChange={(e) => setProducto({ ...producto, marca: e.target.value })}
                                />
                            </div>

                        </form>
                    </Dialog>

                </div>
            </div>
        </>
    )
}

export default Inventario