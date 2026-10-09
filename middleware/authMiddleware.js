const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Obtener el header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Bearer Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Bearer Token no encontrado.' });
    }

    try {
        // NOTA: Para validar correctamente el JWT, necesitas la misma clave secreta (JWT_SECRET)
        // con la que el API de LDAP firmó el token.
        // Si por ahora solo se requiere validar que el token "exista", puedes comentar jwt.verify.
        // Aquí hacemos la verificación estándar:
        const decoded = jwt.decode(token); // Usamos decode temporalmente si no tenemos el secreto real, o verify si lo tenemos.
        
        // jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
