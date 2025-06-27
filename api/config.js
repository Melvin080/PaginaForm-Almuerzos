// Se ejecuta en la parte del alojamiento de la pagina.
export default function handler(request, response) {
  // Accede a las variables de entorno.
  const apiGetUrl = process.env.ENV_API_URL_GET;
  const apiPostUrl = process.env.ENV_API_URL_POST;

  // Envía las URLs como un objeto JSON.
  response.status(200).json({
    ENV_API_GET_URL: apiGetUrl,
    ENV_API_POST_URL: apiPostUrl,
  });
}