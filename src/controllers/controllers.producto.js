// este es el archivo del controlador de los productos
const getPool = require('../connection');
const { closeConnection } = require('../funciones');


// esta funcion es para obtener todos los productos registrados
async function getsProducts (req,res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }
        const pool = await getPool();
        const result = await pool.query('SELECT * FROM tx_productos');
        res.json({
            status: 200,
            error: false,
            des: 'ruta de productos',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });
        closeConnection(pool, res);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// esta funcion es para hacer el regsitro de un nuevo producto
async function addProducts (req,res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({
                error: true,
                errorMessage: 'No hay token, acceso no autorizado'
            });
        }
        const { codProducto, nombre, descripcion, precio } = req.body;
        const pool = await getPool();
        const resultSeq = await pool.query('SELECT max(NCODIGO) + 1 as seq FROM tx_productos');
        const seq = resultSeq.rows[0].seq;  
        const query = 'INSERT INTO tx_productos (NCODIGO, NCODIGO_PRODUCTO, VNOMBRE, VDESCRIPCION, NPRECIO) VALUES ($1, $2, $3, $4, $5)';
        const result = await pool.query(query, [seq, codProducto, nombre, descripcion, precio]);

        if (result.rowCount > 0) {
            res.json({
                status: 200,
                error: false,
                message: 'Se guardó correctamente',
                results: result.rows[0]
            });
        } else {
            res.json({
                status: 500,
                error: true,
                message: 'Error al guardar los campos',
                results: null
            });
        }

        closeConnection(pool, res);

    } catch (error) {
        console.error('Error al ejecutar el insert:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// este fucion es para actualizar los produstos
async function updateProducts (req,res){
    try{
        const token = req.cookies.token;
        if(!token){
            return res.json({
                error: true,
                errorMessage: 'No hay token, acceso no autorizado'
            });
        }
        const { codigo ,codProducto, nombre, descripcion, precio } = req.body;
        const pool = await getPool();
        const query = 'UPDATE tx_productos SET NCODIGO_PRODUCTO = $2, VNOMBRE = $3, VDESCRIPCION = $4, NPRECIO = $5 WHERE NCODIGO = $1';
        const result = await pool.query(query,[codigo,codProducto,nombre,descripcion,precio]);

        if (result.rowCount > 0) {
            res.json({
                status: 200,
                error: false,
                message: 'Se actualizo correctamente',
                results: result.rows[0]
            });
        } else {
            res.json({
                status: 500,
                error: true,
                message: 'Error al actualizar los campos',
                results: null
            });
        }

        closeConnection(pool, res);

    }catch(error){
        console.error('Error al ejecutar el update:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

// esta funcion es para elimiar un producto 
async function deleteProduct(req,res){
    try {
        const id = req.params.id;
        const pool = await getPool();
        const result = await pool.query('DELETE FROM tx_productos WHERE NCODIGO = $1',[id]);

        if (result.rowCount > 0) {

            res.json({
                status: 200,
                error: false,
                message: 'Producto eliminado correctamente',
                results: result.rows[0]
            });
        } else {
            res.json({
                status: 404,
                error: true,
                message: 'No se encontró el producto con el ID proporcionado',
                result:null
            });
        }

        closeConnection(pool, res);
        
    } catch (error) {
        console.error('Error al ejecutar el delete:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        }); 
    }
}

// esta funcion muestra un producto en especifico
async function getProduct (req,res){
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(
                {
                    error: true,
                    errorMessage: 'No hay token, acceso no autorizado'
                }
            );
        }
        const id = req.params.id;
        const pool = await getPool();
        const result = await pool.query('SELECT * FROM tx_productos where NCODIGO = $1',[id]);
        res.json({
            status: 200,
            error: false,
            des: 'ruta de productos',
            message: 'this is OK',
            token: req.results,
            results: result.rows
        });
        closeConnection(pool, res);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.json({
            status: 500,
            error: true,
            errorDes: 'Error interno del servidor',
            errorMessage: error.message
        });
    }
}

module.exports = {
    getsProducts,
    addProducts,
    updateProducts,
    deleteProduct,
    getProduct
}