// controlador de productos
const getPool = require('../connection');
const { closeConnection } = require('../funciones');


// mostrar los productos
async function getsProducts(req, res) {
    try {
        // validación de token
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    status:400,
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }
        // llamamos la conexion
        const pool = await getPool();
        const sqlQuery = `SELECT * FROM t_productos`;
        const result = await pool.query(sqlQuery);

        // mandamos la repuesta
        res.json({
            status: 200,
            error: false,
            des: 'ruta de productos',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });

        // Cerramos la conexion
        closeConnection(pool, res);
    } catch (error) {
        // manejo de errores
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// agregar productos
async function addProducts(req, res) {

    try {
        // validación de token
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    status:400,
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        // validamos que le usuario si posee los privilegios adecuados
        if (Number(req.results.privilegio) == 4 || Number(req.results.privilegio) == 2) {
            return res.json({
                status: 400,
                error: true,
                errorMessage: 'No tiene acceso a esta acción por motivos de privilegios'
            })
        }
        // capturamos los campo del mandado por el body
        const { codProducto, nombre, descripcion, precio } = req.body;
        // llamamos la conexion
        const pool = await getPool();
        // obetenemos la secuencia
        const resultSeq = await pool.query('SELECT COALESCE(max(NCODIGO),0) + 1 as seq FROM t_productos');
        // alamcenamos la secunecia en una variable
        const seq = resultSeq.rows[0].seq;
        // construimos el query 
        const sqlQuery = `
        INSERT INTO t_productos 
        (
            NCODIGO
            ,NCODIGO_PRODUCTO
            ,VNOMBRE
            ,VDESCRIPCION
            ,NPRECIO
        ) VALUES ($1, $2, $3, $4, $5)
        `;
        // ejecutamos el query
        const result = await pool.query(sqlQuery, [seq, codProducto, nombre, descripcion, precio]);

        // validamos el insert
        if (result.rowCount > 0) {
            res.json({
                status: 200,
                error: false,
                message: 'Se guardó correctamente',
                idProduct:seq 
            });
        } else {
            // si no se hizo la inserción
            res.json({
                status: 500,
                error: true,
                errorMessage: 'Error al guardar el producto'
            });
        }

        // Cerramos la conexion
        closeConnection(pool, res);

    } catch (error) {
        // manejos de errores
        console.error('Error al ejecutar el insert:', error);
        res.json({
            status: 500,
            error: true,
            message: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// actualizar productos
async function updateProducts(req, res) {
    try {
        // validación de token
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    status:400,
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        // validamos que le usuario si posee los privilegios adecuados
        if (Number(req.results.privilegio) == 4 || Number(req.results.privilegio) == 2) {
            return res.json({
                status: 400,
                error: true,
                errorMessage: 'No tiene acceso a esta acción por motivos de privilegios'
            })
        }

        // capturamos los campo del body
        const { codigo, codProducto, nombre, descripcion, precio } = req.body;
        // llamamos la conexion
        const pool = await getPool();
        const sqlQuery = `
        UPDATE t_productos SET 
            NCODIGO_PRODUCTO = $2
            ,VNOMBRE = $3
            ,VDESCRIPCION = $4
            ,NPRECIO = $5
        WHERE NCODIGO = $1
        `;
        // ejecutamos el query
        const result = await pool.query(sqlQuery, [codigo, codProducto, nombre, descripcion, precio]);

        // validamos la actualización
        if (result.rowCount > 0) {
            res.json({
                status: 200,
                error: false,
                message: 'Se actualizo correctamente',
                results: result.rows[0]
            });
        } else {
            // si hay un error al actulizar
            res.json({
                status: 500,
                error: true,
                errorMessage: 'Error al actualizar los campos'
            });
        }

        // Cerramos la conexion
        closeConnection(pool, res);

    } catch (error) {
        // manejos de errores
        console.error('Error al ejecutar el update:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// eliminar producto
async function deleteProduct(req, res) {
    try {
        // validación de token
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    status:400,
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        // validamos que le usuario si posee los privilegios adecuados
        if (Number(req.results.privilegio) == 3 || Number(req.results.privilegio) == 2) {
            return res.json({
                status: 400,
                error: true,
                errorMessage: 'No tiene acceso a esta acción por motivos de privilegios'
            })
        }

        // capturamos el parametro
        const id = req.params.id;
        // llamamos la conexion
        const pool = await getPool();
        // ejecutamos el query
        const result = await pool.query('DELETE FROM t_productos WHERE NCODIGO = $1', [id]);

        // validamos la eliminación
        if (result.rowCount > 0) {
            res.json({
                status: 200,
                error: false,
                message: 'Producto eliminado correctamente',
                results: result.rows[0]
            });
        } else {
            // manejo de errores
            res.json({
                status: 404,
                error: true,
                errorMessage: 'No se encontró el producto con el ID proporcionado'
            });
        }

        // Cerrar la conexion
        closeConnection(pool, res);

    } catch (error) {
        // manejo de errores
        console.error('Error al ejecutar el delete:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// mostra un producto especifico
async function getProduct(req, res) {
    try {
        // validación de token
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    status:400,
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }

        // capturamos el parametro
        const id = req.params.id;
        // llamos la conexion
        const pool = await getPool();
        // ejecutamos el query 
        const result = await pool.query('SELECT * FROM t_productos where NCODIGO = $1', [id]);
        // mandamos la respuesta
        res.json({
            status: 200,
            error: false,
            des: 'ruta de productos',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });
        // Cerramos la conexion
        closeConnection(pool, res);
    } catch (error) {
        // manejos de errores
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// exportamos las funciones  
module.exports = {
    getsProducts,
    addProducts,
    updateProducts,
    deleteProduct,
    getProduct
}