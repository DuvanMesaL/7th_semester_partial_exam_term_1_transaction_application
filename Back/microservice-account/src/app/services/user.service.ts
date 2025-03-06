import axios from "axios";

export const loginAndGetToken = async (email: string, password: string): Promise<string | null> => {
    try {
        const response = await axios.post("http://localhost:3001/user/login", {
            email,
            password,
        });

        return response.data.token; // ✅ Retorna el token si el login es exitoso
    } catch (error) {
        console.error("❌ Error al obtener token de autenticación:", error);
        return null;
    }
};

export const getUserFromMicroservice = async (userId: string) => {
    try {
        // 1️⃣ Primero, autenticamos un usuario y obtenemos un token
        const token = await loginAndGetToken("juanperes@example.com", "123456");

        if (!token) {
            throw new Error("No se pudo obtener el token");
        }

        // 2️⃣ Luego, usamos el token para hacer la petición a /user/:id
        const response = await axios.get(`http://localhost:3001/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        throw new Error("No se pudo obtener el usuario");
    }
};

