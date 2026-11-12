export function errorHandler(error, _request, response, _next) {
  console.error(error);
  response.status(500).json({ error: 'CampusMind could not answer right now. Please try again.' });
}
