import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';

const Inventario = () => {
    const toast = useRef(null);
    const [file, setFile] = useState(null);
    const [nombre, setNombre] = useState('');

    const onUpload = (e) => {
        console.log("Archivos seleccionados:", e.files); // Verifica qué archivos están siendo seleccionados
        if (e.files.length > 0) {
            setFile(e.files[0]);
            toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Archivo cargado correctamente.' });
        }
    };

    const saveProducto = async (event) => {
        event.preventDefault();

        if (!file) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona una imagen.', life: 3000 });
            return;
        }

        // Crear un objeto FormData
        const formData = new FormData();
        formData.append('miniatura', file); // Agregar el archivo de imagen
        formData.append('nombre', nombre); // Agregar otros campos si es necesario

        try {
            // Realizar la solicitud POST al backend
            const response = await fetch("http://localhost/pedidos/pedidosback/api/productos/postProducto.php", {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto inscrito correctamente.', life: 3000 });
                setFile(null); // Limpiar el archivo después de la carga
                setNombre(''); // Limpiar el campo de nombre
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos.', life: 3000 });
        }
    };


    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <h2>Agregar Producto</h2>
            <form onSubmit={saveProducto}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre del producto</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="p-inputtext p-component"
                    />
                </div>
                {/* Componente FileUpload en modo básico */}
                <FileUpload
                    mode="basic"
                    name="demo[]"
                    accept="image/*"
                    maxFileSize={1000000}
                    customUpload
                    onUpload={(e) => {
                        console.log("Archivos seleccionados:", e.files); // Verifica qué archivos están siendo seleccionados
                        if (e.files.length > 0) {
                            setFile(e.files[0]); // Establecer el archivo seleccionado en el estado
                            toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Archivo cargado correctamente.' });
                        } else {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se ha seleccionado ningún archivo.', life: 3000 });
                        }
                    }}
                />
                <Button type="submit" label="Agregar Producto" className='p-button-success' />
            </form>
        </div>
    );
};

export default Inventario;
