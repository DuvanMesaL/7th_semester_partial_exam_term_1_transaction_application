import axios from "axios";

export const loginAndGetToken = async (email: string, password: string): Promise<string | null> => {
    try {
        const response = await axios.post("http://localhost:3001/user/login", {
            email,
            password,
        });

        return response.data.token; 
    } catch (error) {
        console.error("❌ Error al obtener token de autenticación:", error);
        return null;
    }
};

export const getUserFromMicroservice = async (userId: string) => {
    try {
 
        const token = await loginAndGetToken("juanperes@example.com", "123456");

        if (!token) {
            throw new Error("No se pudo obtener el token");
        }

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

