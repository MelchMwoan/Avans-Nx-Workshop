import { IEnvironment } from "./environment.interface";

export const environment : IEnvironment = {
    production: true,
    dataApiUrl: "https://ttvd-trainingen-api-nestjs.azurewebsites.net/api",
    databaseUrl: "mongodb+srv://mwillenborg:Atlas123@ttvdtrainingen.ozatvzp.mongodb.net/"
}