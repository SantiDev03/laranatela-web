import { Resend } from 'resend';

// Evita que texto pegado por el usuario rompa el HTML del mail
// (por ejemplo, si alguien escribe "<b>" en el mensaje).
function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const datos = await request.formData();

    // Honeypot: si un bot completó este campo oculto, fingimos que salió bien
    // y no mandamos nada.
    if (datos.get('sitio-web')) {
      return Response.redirect('https://laranatela.com/contacto/gracias', 303);
    }

    const nombre = datos.get('nombre')?.toString().trim();
    const email = datos.get('email')?.toString().trim();
    const mensaje = datos.get('mensaje')?.toString().trim();

    // Validación del lado del servidor: el "required" del HTML se puede
    // saltear, así que volvemos a chequear acá antes de gastar un envío.
    if (!nombre || !email || !mensaje) {
      return Response.redirect('https://laranatela.com/contacto?error=1', 303);
    }

    const empresa = datos.get('empresa')?.toString().trim() || '—';
    const telefono = datos.get('telefono')?.toString().trim() || '—';
    const producto = datos.get('producto')?.toString().trim() || '—';
    const cantidad = datos.get('cantidad')?.toString().trim() || '—';
    const medidas = datos.get('medidas')?.toString().trim() || '—';
    const fecha = datos.get('fecha')?.toString().trim() || '—';
    const logo = datos.get('logo')?.toString().trim() || '—';

    const resend = new Resend(env.RESEND_API_KEY);

    try {
      const { error } = await resend.emails.send({
        from: 'La Rañatela <cotizaciones@laranatela.com>',
        to: ['lorena.laranatela@gmail.com'],
        replyTo: email,
        subject: `Nueva consulta de ${nombre}${empresa !== '—' ? ` (${empresa})` : ''}`,
        html: `
          <h2>Nueva consulta desde el sitio</h2>
          <p><strong>Nombre:</strong> ${escaparHtml(nombre)}</p>
          <p><strong>Empresa:</strong> ${escaparHtml(empresa)}</p>
          <p><strong>Email:</strong> ${escaparHtml(email)}</p>
          <p><strong>Teléfono:</strong> ${escaparHtml(telefono)}</p>
          <hr />
          <p><strong>Producto de interés:</strong> ${escaparHtml(producto)}</p>
          <p><strong>Cantidad aproximada:</strong> ${escaparHtml(cantidad)}</p>
          <p><strong>Medidas:</strong> ${escaparHtml(medidas)}</p>
          <p><strong>Fecha necesaria:</strong> ${escaparHtml(fecha)}</p>
          <p><strong>Formato del logo:</strong> ${escaparHtml(logo)}</p>
          <hr />
          <p><strong>Mensaje:</strong></p>
          <p>${escaparHtml(mensaje).replace(/\n/g, '<br />')}</p>
        `,
      });

      if (error) {
        console.error('Resend devolvió un error:', error);
        return Response.redirect('https://laranatela.com/contacto?error=1', 303);
      }
    } catch (error) {
      console.error('Error de red enviando el mail con Resend:', error);
      return Response.redirect('https://laranatela.com/contacto?error=1', 303);
    }

    return Response.redirect('https://laranatela.com/contacto/gracias', 303);
  },
};