# Altamira Studio · Itinerarios

Herramienta interna para crear propuestas visuales, guardarlas como JSON,
imprimirlas como PDF y enviarlas por email desde Altamira Travel.

## Acceso

La interfaz se publica en `/admin/itinerarios/` y no se enlaza desde el sitio
público. Los borradores se guardan únicamente en el navegador mediante
`localStorage`. Conviene usar **Guardar copia** al finalizar cada propuesta.

## Activar el envío por email

Crear estas variables de entorno en Netlify:

- `RESEND_API_KEY`: API key del dominio verificado en Resend.
- `ITINERARY_ACCESS_CODE`: código privado largo que se introduce antes de enviar.
- `ITINERARY_FROM`: remitente verificado; por ejemplo
  `Altamira Travel <itinerarios@altamiratravel.com>`.
- `ITINERARY_REPLY_TO`: opcional; por defecto `hola@altamiratravel.com`.

El endpoint `/.netlify/functions/send-itinerary` rechaza envíos sin el código
privado. Las imágenes se reducen en el navegador y se envían embebidas con CID;
se incluye la portada y hasta seis imágenes del itinerario, con un límite total
aproximado de 4 MB codificados.

## PDF

**Descargar PDF** genera un documento Letter paginado en el servidor y lo descarga
directamente. No utiliza el cuadro de impresión ni incluye encabezados del
navegador.
