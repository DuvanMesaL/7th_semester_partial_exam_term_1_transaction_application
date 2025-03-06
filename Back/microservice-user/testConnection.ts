import axios from "axios";

async function testAccountServiceConnection() {
    try {
        const response = await axios.get("http://localhost:5001");
        console.log("✅ Comunicación con Microservicio de Cuentas exitosa:", response.data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error al conectar con Microservicio de Cuentas:", error.message);
        } else {
            console.error("❌ Error desconocido al conectar con Microservicio de Cuentas");
        }
    }
}

testAccountServiceConnection();
