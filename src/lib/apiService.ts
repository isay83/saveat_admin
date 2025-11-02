import axios from 'axios';

// 1. Definimos la URL base de la API
const API_URL = 'http://localhost:5000/api/v1';

// 2. Creamos una instancia de axios
const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Creamos un "Interceptor"
// Esto es una función que se ejecuta ANTES de cada petición.
apiService.interceptors.request.use(
    (config) => {
        // 4. Intentamos obtener el token de localStorage
        let token: string | null = null;
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('adminToken');
            if (!token) {
                // Si no está en localStorage, revisa sessionStorage (sesión temporal)
                token = sessionStorage.getItem('adminToken');
            }
        }

        // 5. Si el token existe Y la ruta no es de login/register, lo adjuntamos
        if (token && config.url !== '/admins/login' && config.url !== '/admins/register') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config; // Continuamos con la petición modificada
    },
    (error) => {
        // Manejamos errores en la configuración de la petición
        return Promise.reject(error);
    }
);

// --- ¡NUEVO! Interceptor de Respuesta (Response) ---
// Aquí manejaremos globalmente los errores de token expirado
apiService.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa (2xx), simplemente la retornamos.
        return response;
    },
    (error) => {
        // Si hay un error en la respuesta
        if (error.response && error.response.status === 401) {
            // Error 401: No autorizado (token inválido o expirado)
            console.log('Interceptor 401: Token expirado o inválido. Redirigiendo a login.');

            // 1. Limpiamos el localStorage para desloguear al usuario
            if (typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                sessionStorage.removeItem('adminToken');
                sessionStorage.removeItem('adminUser');

                // 2. Redirigimos a la página de login
                // Usamos window.location.href para forzar una recarga completa,
                // lo que limpiará cualquier estado de React/Context.
                window.location.href = '/signin';
            }
        }

        // 3. Para cualquier otro error (ej. 404, 500),
        // simplemente rechazamos la promesa para que el
        // componente que hizo la llamada (ej. InventoryPage) pueda manejarlo.
        return Promise.reject(error);
    }
);
// --- FIN DEL NUEVO INTERCEPTOR ---

export default apiService;