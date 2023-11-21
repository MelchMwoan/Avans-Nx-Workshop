import { IEnvironment } from "./environment.interface";

export const environment : IEnvironment = {
    production: true,
    dataApiUrl: "https://ttvd-trainingen-api-nestjs.azurewebsites.net/api",
    databaseUrl: "mongodb+srv://mwillenborg:NPhTi1xwAyO9AxdI@ttvdtrainingen.ozatvzp.mongodb.net/"
}