import {PrismaClient} from '@prisma/client'


export const prisma = new PrismaClient();

export const testConnection = async()=>{
    try {
        // Intenta obtener la lista de tablas (usando un query simple)
        await prisma.$connect();
        console.log('Conexión exitosa a la base de datos');
      } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
      } finally {
        await prisma.$disconnect();
      }
}