// Loads every NEW Figma screen into the generic `info_pages` table. Full replace + backup.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { infoPages } from '../lib/db/schema';

type Row = typeof infoPages.$inferInsert;
const rows: Row[] = [];
let page = '', pageTitle = '', ord = 0;
function P(slug: string, title: string) { page = slug; pageTitle = title; ord = 0; }
function B(block: string, title: string | null, content: string | null) {
  rows.push({ page, pageTitle, block, title, content, active: true, order: ++ord });
}
const text = (t: string | null, c: string) => B('text', t, c);
// section: título de sección grande centrado (Figma: Poltawski Bold 32)
const section = (t: string, c = '') => B('section', t, c);
// hero: imagen de cabecera (no se renderiza como bloque)
const hero = (img: string) => { rows.push({ page, pageTitle, block: 'hero', title: 'Imagen de cabecera', content: null, image: img, active: true, order: 0 }); };
const intro = (c: string) => B('intro', null, c);
const note = (c: string) => B('note', null, c);
// divider: filete horizontal (Figma: 2px #D7D2CB)
const divider = () => B('divider', null, null);
// button: botón verde de enlace externo (Figma: 'Botón verde 2')
const button = (label: string, url: string) => B('button', label, url);
const link = (label: string, href: string, img?: string) => {
  rows.push({ page, pageTitle, block: 'link', title: label, content: href, image: img ?? null, active: true, order: ++ord });
};
const list = (t: string | null, items: string[]) => B('list', t, items.join('\n'));
const price = (t: string, pairs: [string, string][]) => B('price', t, pairs.map(([n, p]) => `${n} — ${p}`).join('\n'));
// card: título + descripción + "@ubicación" (Figma: carrusel con imagen)
const card = (t: string, desc: string, place: string, img?: string) => {
  rows.push({ page, pageTitle, block: 'card', title: t, content: `${desc}\n@${place}`, image: img ?? null, active: true, order: ++ord });
};

// ══ MI ESTADÍA (menu) ══
P('mi-estadia', 'Mi Estadía');
link('Servicios Incluídos', '/info/servicios-incluidos', '/images/fig-servicios-incluidos.jpg');
link('Check-In y Check-Out', '/info/check-in', '/images/fig-check-in.jpg');
link('Guardería', '/info/guarderia', '/images/fig-guarderia.jpg');
link('Habitación', '/habitacion', '/images/fig-habitacion.jpg');
link('Uso de Llaves y Cerraduras', '/info/uso-llaves', '/images/fig-uso-llaves.jpg');

// ══ SERVICIOS INCLUÍDOS ══
P('servicios-incluidos', 'Servicios Incluídos');
hero('/images/fig-servicios-incluidos.jpg');
intro('Los servicios incluidos pueden variar según la tarifa de tu reserva. Si tienes alguna duda sobre los beneficios disponibles durante tu estadía, nuestro equipo de Front Desk estará encantado de ayudarte.');
section('Traslados', 'El hotel no cuenta con servicio de traslado propio.\n\nEn caso de que necesite gestionar su salida, le recomendamos acercarse con al menos 24 hrs de anticipación al front desk donde le podremos ayudar a gestionar el servicio de traslado.\n\n(*) En caso de requerir servicios adicionales (sillas de bebé o alzadores) es importante verificarlo directamente con la empresa de transporte, pues podría tener un costo adicional, sujeto a disponibilidad.');

// ══ CHECK-IN Y CHECK-OUT ══
P('check-in', 'Check-In y Check-Out');
hero('/images/fig-check-in.jpg');
text('Horarios:', 'Check-in: desde las 16:00 hrs.\nCheck-out: hasta las 12:00 hrs.');
text('Late Check-Out:', 'Sujeto a Disponibilidad*\n- **Hasta las 16:00 hrs.:** 50% de la tarifa diaria por persona (incluye almuerzo).\n- **Desde las 16:00 hrs.:** 100% de la tarifa diaria por persona.');
link('Programa del Viajero', '/info/programa-viajero');
link('Plan de Invierno', '/info/plan-invierno');
link('Preparativos para el Ascenso', '/info/preparativos');
link('Estacionamientos', '/info/estacionamientos');

// ══ PROGRAMA DEL VIAJERO ══
P('programa-viajero', 'Programa del Viajero');
hero('/images/fig-check-in.jpg');
text('¿Qué Debo Empacar?', 'El clima de montaña es tan dinámico como el paisaje. Para que aproveches cada momento, te compartimos algunas recomendaciones.');
text('Temperaturas Según la Época del Año', '- Verano (diciembre – febrero) Temperaturas entre 18 °C y 30 °C, cielos despejados y baja probabilidad de lluvias. La época ideal para senderismo, cicloturismo y paseos por el valle.\n- Primavera y Otoño (marzo – abril / octubre – noviembre) Temperaturas entre 12 °C y 20 °C con lluvias moderadas. El bosque se transforma ofreciendo colores y sensaciones únicas.\n- Invierno (junio – agosto) Temperaturas entre 0 °C y 15 °C con frecuentes nevadas. La temporada perfecta para esquí y actividades en la nieve.');
text('Ropa Recomendada', 'Para disfrutar del hotel y de las actividades al aire libre te recomendamos traer ropa que pueda usarse en capas y así, adaptarte fácilmente a los cambios de temperatura.\n- Primera Capa: Ropa interior térmica de secado rápido.\n- Segunda Capa: Ropa para mantenerse abrigado.\n- Tercera Capa: Chaqueta y pantalón cortaviento e impermeable.\n\nTambién incluye en tu maleta:\n- Traje de Baño\n- Sandalias\n- Zapatos de trekking cómodos (evitar zapatillas de running).\n\nAccesorios:\n- Gorro para el sol y gorro de abrigo\n- Guantes impermeables y cortaviento\n- Cuello tipo buff o bandana\n- Anteojos con filtro UV\n- Bloqueador solar y protector labial\n- Repelente de insectos\n- Botella de agua recargable\n- Mochila pequeña');
text('Medicamentos', 'Si utilizas alguna medicación, recuerda traerla. No hay farmacias en los alrededores del hotel.');
section('¿Cómo Llegar?', '**En avión desde Santiago**\n1. Avión a Concepción, 50 minutos.\n2. Transfer Concepción al Hotel, 2 horas y 30 minutos.\n\n**En Auto desde Santiago**\n1. Auto vía Ruta 5 Sur hasta Chillán, 4 horas (400 km).\n2. Vía ruta N° 55 en km 80, 1 hora 15 minutos.\n\n**En Tren desde Santiago**\n1. De Estación Central a Estación Chillán, 5 horas.\n2. Transfer al Hotel, 1 hora.');

// ══ PLAN DE INVIERNO ══
P('plan-invierno', 'Plan de Invierno');
hero('/images/fig-check-in.jpg');
intro('Saca el máximo provecho a tu estadía siguiendo estas recomendaciones:');
text('Disfruta los espacios del hotel', 'Espacios pensados para toda la familia, salones, áreas de descanso y actividades recreativas para complementar tu experiencia.');
text('Prepárate para el clima', '- Viste en capas con ropa térmica e impermeable. Utiliza guantes, gorro, lentes de sol y protector solar.\n- Prefiere calzado antideslizante para caminar sobre nieve o hielo.\n- Lleva traje de baño y sandalias para disfrutar de las piscinas y termas.');
text('Disfruta la montaña', 'Aprovecha el acceso a las canchas de ski y snowboard. También, puedes reservar actividades como motos de nieve, caminatas con raquetas o heli-ski (para esquiadores con experiencia).');
text('Relájate después de la aventura', 'Recupera energías en las piscinas temperadas y termales o disfruta de un masaje y tratamientos disponibles en el spa, ideales para descansar después de un día en la nieve.');
text('Vive la experiencia gastronómica', 'Comienza el día con un desayuno buffet y finalízalo con una cena que destaca por su variedad y cocina en vivo. Durante la tarde-noche, el bar con chimenea es el lugar perfecto para compartir y relajarse.');
text(null, 'Si necesitas más información, nuestro equipo de front desk estará encantado de ayudarte.');

// ══ PREPARATIVOS PARA EL ASCENSO ══
P('preparativos', 'Preparativos Para el Ascenso');
hero('/images/fig-check-in.jpg');
text('Seguridad en la Ruta:', 'Por las condiciones de la montaña, es obligatorio el uso de cadenas en su vehículo para garantizar un trayecto seguro hacia el hotel.');
text('Vestimenta adecuada', 'Le sugerimos vestir por capas y contar con ropa técnica impermeable, guantes y protección solar. Si desea disfrutar de nuestras aguas, no olvide su traje de baño.');
text('Equipamiento', 'En el hotel disponemos de un servicio de arriendo de equipos de ski y snowboard, por lo que no es estrictamente necesario traer los suyos.');

// ══ ESTACIONAMIENTOS ══
P('estacionamientos', 'Estacionamientos');
hero('/images/fig-check-in.jpg');
section('Estacionamientos', 'Contamos con estacionamiento en el Nivel -1 del Edificio Conference. Contamos con Accesibilidad y espacios aptos para electromovilidad.');

// ══ USO DE LLAVES (placeholder in Figma) ══
P('uso-llaves', 'Uso de Llaves y Cerraduras');
hero('/images/fig-uso-llaves.jpg');
text('Uso de Llaves y Cerraduras', 'Contenido pendiente de definir.');

// ══ INFORMACIÓN GENERAL (menu) ══
P('informacion-general', 'Información General');
link('Reglamento & Políticas del Hotel', '/info/reglamento');
link('Tiendas', '/info/tiendas');
link('Espacios', '/info/espacios');
link('Políticas de Reserva', '/info/politicas-reserva');

// ══ TIENDAS (menu) ══
P('tiendas', 'Tiendas');
hero('/images/fig-hero-tiendas.jpg');
link('Backcountry Store', '/info/backcountry-store');
link('Venta en Recepción', '/info/venta-recepcion');
link('Artículos Spa', '/info/articulos-spa');

// ══ BACKCOUNTRY STORE ══
P('backcountry-store', 'Backcountry Store');
hero('/images/fig-hero-tiendas.jpg');
text('Horarios:', '**Invierno:** 08:30 a 13:00 y 15:00 a 18:30\n**Verano:** 10:00 a 13:30 y 14:30 a 18:00');
divider();
intro('Todo lo que necesitas para tu aventura en la montaña, ubicada en el primer piso del Hotel.\n\nEncontrarás una selección de artículos para disfrutar al máximo la montaña. Tales como, accesorios de nieve (antiparras, guantes, cascos, calcetines de ski y primeras capas), ropa de trekking, chaquetas y pantalones impermeables, trajes de baño, barro termal, artículos de aseo personal y recuerdos como postales e imanes.\n\nLe invitamos a visitarnos y encontrar todo lo necesario para complementar su experiencia en la montaña.');

// ══ VENTA EN RECEPCIÓN ══
P('venta-recepcion', 'Venta en Recepción');
hero('/images/fig-hero-tiendas.jpg');
intro('Para su comodidad, en la Recepción del Hotel podrá encontrar a la venta artículos esenciales:');
price('Cuidado Personal e Higiene', [
  ['Preservativos', '$3.000'], ['Crema de afeitar', '$8.000'], ['Desodorante', '$3.000'],
  ['Kit Dental-Pasta (Pequeño)', '$2.000'], ['Cepillo de Dientes', '$3.000'], ['Pasta de Dientes', '$3.000'],
  ['Quita esmalte', '$6.000'], ['Tampones', '$5.000'], ['Toalla higiénica', '$5.000'],
  ['Toallitas húmedas', '$2.000'], ['Afeitadora desechable', '$2.000'], ['Peineta/Cepillo de Pelo', '$5.000'],
  ['Corta uñas', '$5.000'], ['Tapones oído', '$1.000'],
]);
price('Bebés y Niños', [
  ['Guatero Semillas Niños', '$6.000'], ['Mamadera', '$5.000'], ['Escobilla Limpia Mamadera', '$5.000'],
  ['Pañal Bebé', '$5.000'], ['Pañales Piscina', '$1.500'], ['Chupete Bebé', '$3.000'],
]);
price('Electrónica y Accesorios', [
  ['Adaptador Tierra', '$5.000'], ['Adaptador Simple', '$3.000'], ['Adaptador Universal', '$10.000'],
  ['Pilas AA y AAA', '$2.000'], ['Bolsa reductora ropa', '$3.000'],
]);
price('Vestuario y Accesorios', [
  ['Anteojos 2.0/2.5', '$10.000'], ['Antiojera Vichy', '$2.000'], ['Cintillo Azul Cotelé', '$5.000'],
  ['Calcetines', '$2.000'], ['Capa de Agua Biodegradable', '$5.000'], ['Capa de Agua Gruesa', '$10.000'],
]);
price('Piscina y Deporte', [
  ['Pañales Piscina', '$1.500'], ['Gorra Natación', '$2.000'], ['Botella de Policarbonato de 500ml', '$4.000'],
]);
note('*Venta de artículos sujeta a disponibilidad');

// ══ ARTÍCULOS SPA ══
P('articulos-spa', 'Artículos Spa');
hero('/images/fig-hero-tiendas.jpg');
intro('Descubra una exclusiva selección de productos de aromaterapia, disponibles para su compra en la recepción de nuestro Spa Alunco y lleve la experiencia de bienestar a su hogar:');
price('Listado de Productos', [
  ['Árbol de té', '$6.000'], ['Cedro', '$5.000'], ['Ciprés', '$7.500'], ['Eucaliptus', '$4.500'],
  ['Eucaliptus limón', '$5.000'], ['Lavanda', '$7.500'], ['Lemongrass', '$6.500'], ['Limón', '$6.000'],
  ['Melisa', '$5.000'], ['Menta', '$7.000'], ['Naranja', '$5.000'], ['Pino', '$7.000'],
  ['Rosa', '$12.500'], ['Sándalo', '$9.000'], ['Ylang-ylang mix', '$9.000'], ['Citronela', '$7.500'],
  ['Collar difusor', '$7.000'], ['Collar árbol', '$10.000'], ['Collar flor de vida', '$8.000'],
  ['Bomba aromática', '$4.500'], ['Spray ambiental', '$7.500'], ['Difusor aroma', '$10.000'],
  ['Pack 10 velas', '$3.000'], ['Colets', '$2.000'], ['Pañales xg-g', '$1.000'],
  ['Lentes de agua', '$5.000'], ['Flotador', '$4.500'],
]);
note('*Venta de artículos sujeta a disponibilidad');

// ══ ESPACIOS ══
P('espacios', 'Espacios');
hero('/images/fig-hero-espacios.jpg');
card('Canelo & Lenga', 'Espacios destinados a reuniones, trabajo y lectura. Para ofrecer un ambiente cómodo y tranquilo para todos los huéspedes, te invitamos a mantener silencio durante tu permanencia.', 'Consulta reservas, tarifas y disponibilidad en Recepción.', '/images/fig-hero-espacios.jpg');
card('Espacio de Lectura', 'Este lugar está diseñado para que vivas una experiencia de descanso en un ambiente silencioso y acogedor. Podrás leer tranquilamente y disfrutar de un momento de calma.', 'Disponible las 24 horas\n@Piso 6', '/images/fig-hero-espacios.jpg');

// ══ CIRCUITOS HIDROTERMALES ══
P('circuitos-hidrotermales', 'Circuitos Hidrotermales');
hero('/images/fig-hero-spa.jpg');
text('Recomendaciones', 'Beba abundante agua y descanse cada vez que lo necesite.\n\nPreste atención a las señales del cuerpo, no se sobre exija y evite permanecer en el sauna más de lo recomendado.\n\nSi experimenta mareos, cansancio extremo u otros síntomas detenga el circuito y solicite asistencia al personal del Spa.\n\nEvite realizar más de un circuito por día para disfrutar a pleno de los beneficios.');
text('Contraindicaciones', 'Si tiene presión arterial alta, enfermedades cardiovasculares, cirugías recientes u otra condición médica, la exposición a altas o bajas temperaturas podrían agravar la condición. Consulte con su médico antes de realizar los circuitos.\n\nNo se recomienda realizar los circuitos a personas embarazadas o bajo los efectos del alcohol o drogas.\n\nTome una ducha antes de comenzar los circuitos para eliminar lociones, cremas y toxinas.');
text('Circuito Relajante', 'Duración Aproximada: 120 minutos.\nRecomendado para: Desconexión mental profunda.');
list('Circuito Relajante — Pasos', [
  'Piscina Temperada · 20 min — Relajación muscular inicial.',
  'Baño de Vapor · 15 min — Apertura de poros y sedación del sistema nervioso.',
  'Hidromasaje · 15 min — Masaje hídrico suave en zonas clave.',
  'Descanso e Hidratación · 10 min — Secado y estabilización de la presión.',
  'Masaje Relajante · 50 min — Le sugerimos tomar este masaje para sellar el estado de paz absoluta.',
  'Área de Relax · 10 min — Despertar gradual con una infusión caliente.',
]);
text('Circuito Vigorizante', 'Duración Aproximada: 120 minutos.\nRecomendado para: Después de esquiar o hacer trekking.');
list('Circuito Vigorizante — Pasos', [
  'Sauna · 15 min — Calor seco para flexibilizar fibras musculares.',
  'Piscina Fría · 1 min — Choque térmico para reducir inflamación.',
  'Ducha Escocesa · 5 min — Reactivación de la circulación.',
  'Masaje Descontracturante · 50 min — Trabaja profundo sobre la musculatura ya preparada por el calor.',
  'Piscina Temperada · 20 min — Para "soltar" el cuerpo tras el masaje intenso.',
  'Descanso e Hidratación · 20 min — Rehidratación crítica y reposo.',
]);
text('Circuito Purificante', 'Duración Aproximada: 120 minutos.\nRecomendado para la belleza y limpieza integral.');
list('Circuito Purificante — Pasos', [
  'Ducha Escocesa · 5 min — Preparación sensorial.',
  'Baño de Vapor · 15 min — Limpieza profunda de poros.',
  'Sauna · 10 min — Eliminación de toxinas remanentes.',
  'Piscina Fría · 1 min — Tonificación inmediata.',
  'Piscina Temperada · 30 min — Deleite prolongado y relajación del tejido.',
  'Masaje con Piedras Calientes · 50 min — Sella la hidratación y equilibra la energía.',
  'Descanso e Hidratación · 20 min — Rehidratación y reposo.',
]);

// ══ SALA DE YOGA ══
P('sala-yoga', 'Sala de Yoga & Meditaciones');
hero('/images/fig-hero-spa.jpg');
intro('Regala a tu día con un momento de conexión y bienestar.');
note('Conoce horarios y disponibilidad consultando en el front desk.');
card('Sesiones de Yoga', 'Diseñadas para ayudarte a relajarte, mejorar tu equilibrio y disfrutar plenamente de la tranquilidad de la montaña.', 'Sala de Yoga & Meditaciones', '/images/spa.jpg');
card('Actividades Guiadas', 'Combinan movimiento, respiración y conexión con el entorno, ideales para comenzar o cerrar el día en equilibrio.', 'Sala de Yoga & Meditaciones', '/images/spa.jpg');

// ══ PISCINAS ══
P('piscinas', 'Piscinas');
hero('/images/fig-hero-piscinas.jpg');
text('Horarios de Atención:', 'Puede disfrutar de la piscina todos los días de 09:00 a 20:00 hrs.');
section('Reglamento de Higiene y Seguridad', 'Para que su experiencia de descanso sea placentera y segura, siga las siguientes reglas:');
list(null, [
  'Para mantener el agua en óptimas condiciones, tome una ducha antes de ingresar al agua.',
  'Deposite los desechos en los contenedores correspondientes.',
  'La piscina no cuenta con servicio de salvavidas permanente.',
  'Siempre siga y respete las instrucciones del personal del hotel.',
  'El uso de gorro de baño es obligatorio para todos.',
  'Si tiene alguna herida, vendaje o apósito, por favor evite entrar al agua.',
  'Se requiere traje de baño adecuado. No se permite el uso de ropa de calle o calzado en el área inmediata de nado.',
  'El uso de pañales especiales para piscina es obligatorio para bebés y niños pequeños. Por favor, diríjase al baño y revise el estado de los pañales al menos cada 30 minutos.',
  'Los niños deben estar acompañados por un adulto responsable en todo momento.',
  'Está prohibido correr, realizar clavados o saltos acrobáticos.',
  'Nuestra piscina es un espacio de descanso. Evite gritos, altavoces externos o juegos bruscos que puedan incomodar a otros huéspedes.',
  'No se permite fumar ni consumir alimentos o bebidas (incluyendo alcohol) en ningún lugar del recinto. El consumo de drogas está terminantemente prohibido.',
  'No se permiten botellas, vasos o cualquier objeto de vidrio en el área de la piscina.',
  'Se prohíbe reservar reposeras con toallas u objetos personales. Si una reposera permanece desocupada por más de 1 hora, el personal tiene autorización para retirar los objetos personales.',
]);

// ══ CLASES DE SKI ══
P('clases-ski', 'Clases de Ski y Snowboard');
hero('/images/fig-hero-clases-ski.jpg');
text(null, 'Estimado huésped, si está interesado en tomar clases de ski o snowboard durante su estadía, estas pueden agendarse directamente con la Escuela de Ski Nevados de Chillán de forma online o presencial en Plaza Otto.\n\nPara conocer valores le invitamos a visitar:');
button('Escuela de Ski Nevados de Chillán', 'https://www.nevadosdechillan.com/escuela');
text(null, 'El valor de las clases varía según la duración de la sesión y la cantidad de participantes.\n\nEs importante tener presente que las clases no incluyen equipo ni ticket y se dividen en categoría de niños (6-12 años) y Adultos (desde 12 años)\n\nPara su comodidad, en nuestro Guarda Ski podrá encontrar un mesón de reserva de clases **desde las 9.00 hasta las 15.30 hrs**.\n\nSi realiza la reserva de forma online es importante que indique en las observaciones que el punto de encuentro e inicio de la clase sea en Hotel Termas Chillán, de lo contrario se asumirá que la clase iniciará y terminará en Plaza Otto y deberá gestionar el traslado de forma particular.\n\nEn la Base Tata (a 500 mts desde el Hotel) también podrá encontrar la “Zona Debutantes”, ideal para agendar clases de niños y principiantes. Ofrecen paquetes de Clase+Equipo.\n\nLe invitamos a visitar el siguiente link para mayor información:');
button('Zona Debutantes', 'https://issuu.com/nevadosdechillan/docs/zona_debutantes_productos?fr=sNTUyMDg2OTM3ODE');
section('Recomendaciones');
list(null, [
  'Reserve con anticipación.',
  'Si necesita equipo, gestione el arriendo al menos 2 hrs antes del inicio de su clase.',
  'Utilice ropa adecuada y protección solar.',
  'Preséntese 15 minutos antes del inicio de la clase.',
]);
text(null, 'Si necesita más información o asistencia para realizar su reserva, nuestro equipo de Recepción estará encantado de ayudarle.');

// ══ GUARDERÍA ══
P('guarderia', 'Guardería');
hero('/images/fig-guarderia.jpg');
text('Horarios:', 'Lunes a Sábado: 08:30 a 18:30\nDomingo: 08:30 a 16:30');
section('Reglamento', 'Con el fin de asegurar el bienestar, la seguridad y una buena convivencia, solicitamos respetar las siguientes normas:');
text(null, '**1. Edad y supervisión**\nPara niños/as de 3 a 7 años con control de esfínter. Menores de 3 años deben estar siempre con un adulto (opción de babysitter disponible).');
text(null, '**2. Ingreso y retiro**\nSiempre con un adulto responsable.\nSe debe firmar ingreso y entregar información actualizada (salud, alergias, contacto).\nMantener teléfono disponible ante emergencias.\nAnte cualquier situación, el equipo contactará al adulto registrado.');
text(null, '**3. Bienestar**\nLa permanencia debe ser voluntaria.\nNo se permite consumo de alimentos dentro del recinto.');
text(null, '**4. Autonomía**\nNiños/as deben ser autónomos en el uso del baño (educadoras solo acompañan).');
text(null, '**5. Uso de espacios y materiales**\nJuguetes permanecen en la guardería (solo se llevan manualidades).\nEspacios y mobiliario son de uso preferente de los niños/as.\nAdultos pueden acompañar en zonas habilitadas.');
text(null, '**6. Convivencia**\nCaminar dentro del espacio y jugar de forma respetuosa.\nCuidar y ordenar materiales.\nRespetar a otros niños/as, especialmente a los más pequeños.\nUsar juegos y estructuras de forma segura.');

// ══ SKI (menu — orden Figma: Rental, Guarda, Clases, Centro) ══
P('ski', 'Ski');
link('Ski Rental', '/ski-rental', '/images/fig-hero-ski-rental.jpg');
link('Guarda Ski', '/info/guarda-ski', '/images/fig-hero-guarda-ski.jpg');
link('Clases de Ski y Snowboard', '/info/clases-ski', '/images/fig-hero-clases-ski.jpg');
link('Centro de Ski', '/actividades?cat=Centro%20de%20Ski', '/images/fig-hero-ski.jpg');

// ══ GUARDA SKI ══
P('guarda-ski', 'Guarda Ski');
hero('/images/fig-hero-guarda-ski.jpg');
text(null, 'Para que disfrute al máximo su experiencia en la montaña, ponemos a su disposición nuestro servicio de Guarda Ski, **desde las 8:30 hasta las 18:00 hrs.**\n\nDisponemos de espacios designados por número de habitación para asegurar el almacenamiento seguro de su equipo de ski, snowboard y bastones.\n\n**RECOMENDACIÓN:** Guarde casco, antiparras y accesorios en su habitación y evite dejarlos en el Guarda Ski.');

// ══ EMERGENCIAS ══
P('emergencias', 'Emergencia');
intro('El hotel cuenta con Sala de Primeros Auxilios y médico de turno para brindar atención médica inicial, básica y de urgencia de baja complejidad en caso de accidentes o síntomas repentinos. Su objetivo principal es estabilizar a la persona antes de que sea derivada a un centro médico de mayor complejidad si es necesario.');
text('Si necesitas atención médica inmediata, comunícate con la recepción llamando desde tu habitación al:', '3500');
text('Si te encuentras fuera del Hotel, llama al:', '+562 2322 3500');

// ══ POLÍTICAS DE RESERVA ══
P('politicas-reserva', 'Políticas de Reserva');
hero('/images/fig-hero-hotel.jpg');
text('Reserva y Pago', '- La reserva es personal e intransferible y queda registrada a nombre del titular del voucher.\n- Al reservar deberá proporcionar correo electrónico, dirección y teléfono de contacto.\n- La reserva online requiere el pago del 100% del programa. Los consumos adicionales no están incluidos.');
text('Check-in y Garantía', '- Check-in: desde las 16:00 hrs.\n- Check-out: hasta las 12:00 hrs.\n- Al ingresar, la reserva debe estar completamente pagada.\n- Se solicitará una tarjeta de crédito como garantía, autorizando una retención de $400.000 por habitación, la cual será liberada al realizar el check-out, siempre que no existan consumos o cargos pendientes.\n- Los consumos adicionales, daños o multas podrán cargarse a la tarjeta registrada.');
text('Late Check-out', 'Sujeto a disponibilidad:\n- Hasta las 16:00 hrs.: 50% de la tarifa diaria por persona (incluye almuerzo).\n- Desde las 16:00 hrs.: 100% de la tarifa diaria por persona.');
text('Formas de Pago', '- Tarjetas de crédito.\n- Tarjetas de débito.');
text('Normas del Hotel', '- Hotel 100% libre de humo. Fumar fuera de las áreas habilitadas tiene una multa de USD 500.\n- No se permiten mascotas.\n- Las habitaciones tienen capacidad máxima según su categoría (hasta 3 personas).\n- Niños que no controlan esfínter deben usar pañal para piscina.\n- Los huéspedes deben respetar las normas de convivencia, seguridad y conducta del hotel.\n- Los objetos faltantes del inventario de la habitación serán cobrados al huésped.');
text('Cambios y Cancelaciones', 'Todas las solicitudes deben realizarse por escrito a reservas@termaschillan.cl y estarán sujetas a disponibilidad.\n\nCancelaciones:\n- 30 días o más antes del ingreso: Carta de Crédito por el 100% del monto pagado (vigencia de 12 meses).\n- Entre 29 y 10 días: Carta de Crédito por el 50% del monto pagado (vigencia de 12 meses).\n- Menos de 10 días: No corresponde devolución ni Carta de Crédito.\n- Si el huésped no se presenta antes de las 15:00 hrs. del día siguiente a la fecha de ingreso (No Show), perderá el total pagado.');
text('Cambios de Fecha', '- 30 días o más: sin costo.\n- Entre 30 y 15 días: cargo del 20% del valor de la reserva.\n- Menos de 15 días: cargo del 30% del valor de la reserva.\n- Toda modificación queda sujeta a disponibilidad y a las tarifas vigentes.');
text('Programas y Servicios', '- Los programas de invierno y verano deben pagarse íntegramente al momento de reservar.\n- No se realizan devoluciones por servicios o noches no utilizadas durante la estadía.');
text('Cierre del Centro de Ski por Falta de Nieve', 'Antes del viaje:\n- Si el Centro de Ski permanece totalmente cerrado por falta de nieve, podrá elegir entre:\n- Cambiar la fecha de su reserva.\n- Solicitar una Carta de Crédito (vigencia 12 meses).\n- Solicitar devolución del dinero (hasta 30 días).\n- Mantener la reserva.\n\nDurante la estadía, podrá optar por:\n- Finalizar la estadía y recibir una Carta de Crédito por las noches no utilizadas.\n- Finalizar la estadía y solicitar devolución del saldo pendiente.\n- Continuar con la reserva.');
text('Traslados', 'Los traslados incluidos en algunos programas son operados por empresas externas.\n\nHotel Termas Chillán actúa únicamente como intermediario y no es responsable por retrasos, cancelaciones o cierres de caminos y aeropuertos.\n\nSi el huésped no puede llegar al hotel por estas causas, las noches no utilizadas podrán transformarse en un crédito, el cual podrá:\n- Aplicarse a consumos extras.\n- Utilizarse en una nueva reserva dentro de la misma temporada.\n- Utilizarse en la temporada siguiente mediante una Carta de Crédito equivalente al 50% de las noches perdidas, según corresponda. No hay devolución de dinero.');

// ══ REGLAMENTO ══
P('reglamento', 'Reglamentos & Políticas del Hotel');
hero('/images/fig-hero-hotel.jpg');
section('Generalidades');
text(null, '**1. Datos reserva.**\nReserva nominativa y quedará registrada a nombre del suscriptor del “Voucher o Comprobante de Reserva”. Al momento de efectuarla deberá informar su correo electrónico, domicilio y número de contacto.\n\n**2. Monto de la reserva.**\nEl abono por concepto de reserva online debe ser del 100% del costo total del programa, sin contabilizar los extras que se consuman durante la estadía y sin perjuicio de los programas especiales de invierno o verano. Los programas no incluyen bebestibles, coctel ni ningún alimento no señalado expresamente.\n\n**3. Obligaciones al ingreso.**\n- Al momento del Check-in debe estar pagado el 100% de la tarifa correspondiente.\n- Se solicitará una Tarjeta de Crédito como garantía. Siendo obligatorio para el Cliente o Huésped presentarla. En ese momento autorizará a que Hotel Termas Chillán le descuente la suma de $400.000 (Cuatrocientos mil pesos) por cada habitación reservada por el titular, suma que será restituida al momento de hacer el Check-out y le será entregado el comprobante respectivo de cancelación.\n- En el caso en que el Cliente no cumpla con la obligación de egreso regulada en el numeral 5 siguiente, autoriza irrevocablemente para que Hotel Termas Chillán haga los cargos correspondientes por consumos no incluidos en los programas o extras, el saldo por pagar del programa reservado, las multas por las infracciones y en general cualquier suma adeudada por el Cliente o Huésped originada por la estadía en el Hotel.\n\n**4. Horarios.**\n- Check-in: a partir de las 16:00 hrs.\n- Check-out: hasta las 12:00 hrs.\n- Extraordinariamente y sujeto a disponibilidad, se podrá autorizar el late Check-out de acuerdo con las siguientes condiciones:\n- Entre las 12:00 hrs. y las 16:00 hrs. tendrá el valor equivalente al 50% de la tarifa diaria por persona, con derecho a almorzar.\n- Desde las 16:00 hrs. en adelante tendrá el valor equivalente al 100% de la tarifa diaria por persona.\n\n**5. Obligación al egreso.**\nEl huésped que se retira, deberá presentarse en la recepción del Hotel para hacer el Check-out, restituir la tarjeta entregada, pagar el saldo pendiente del programa reservado, los consumos no incluidos, las multas por las infracciones y en general cualquier suma adeudada por su estadía en el Hotel.\n\n**6. Formas de pago.**\nFormas de pago existentes en nuestro Hotel son: Tarjetas de Crédito y Tarjeta de Débito.\n\n**7. Prohibiciones.**\n- Todas las habitaciones cuentan con un inventario, en donde se individualizan los bienes que se encuentran en su interior. En el evento que alguno de estos no se encuentre presente al momento de hacer el Check-out, el cliente o huésped faculta para que se le cobre y cargue en su tarjeta de crédito el valor de cada uno de los bienes faltantes. Valores que se encuentran a disposición en la recepción del Hotel.\n- Cada habitación se encuentra habilitada según el número de personas que la ocuparán. Las que en ningún caso podrán albergar más de tres personas.\n- El Hotel es apto para NO Fumadores, pudiendo hacerlo solo en lugares habilitados. En el evento en que se infrinja esta obligación el pasajero sorprendido será objeto de una multa equivalente a 500 USD (Quinientos dólares americanos), la que será cargada directamente a la Tarjeta de Crédito.\n- No se permite el ingreso de infantes o niños que no controlen esfínter a la piscina.\n- No se permite el ingreso ni tenencia de animales en habitaciones ni espacios comunes.\n- El Cliente o Huésped se obliga a respetar las normas de conducta, vestimenta, respeto y seguridad, facultando al Hotel para hacer cumplir dichas directrices.');
section('Aspectos relevantes de la Reserva');
text('Condiciones de anulación - dejar sin efecto - la Reserva.', 'A. El pasajero se obliga a respetar la reserva en las condiciones establecidas en ella. Toda modificación que desee formular a esta, relativa a su fecha, duración y demás términos, deberá convenirse expresamente con Hotel Termas de Chillán, quien podrá rechazar por razones de disponibilidad u otras causas, sin necesidad de justificar o acreditar.\n\nB. Todas las solicitudes de anulación de una reserva, deberá ser requerida por escrito a reservas@termaschillan.cl. Solo se considerará anulada, una vez recibida la respuesta de Hotel Termas Chillán.\n\nC. Si el pasajero solicita anular su reserva con a lo menos 30 días de anticipación a la fecha en que deba empezar a hacer uso de su estadía, Hotel Termas Chillán le otorgará una Carta de Crédito que podrá ser usada en una próxima reserva por el total del monto pagado. El uso de la Carta de Crédito deberá realizarse dentro de los siguientes 12 meses siguientes a que se cursó la reserva original. Pasado los 12 meses, la Carta de Crédito no tendrá validez. No hay devolución de dinero.\n\nD. Si el pasajero solicita anular su reserva entre 29 y 10 días de anticipación a la fecha de ingreso al hotel, Hotel Termas Chillán le otorgará una Carta de Crédito para ser usada en una próxima reserva por el 50% del monto pagado. El uso de la Carta de Crédito deberá realizarse dentro de los siguientes 12 meses a que se cursó la reserva original. Pasado los 12 meses, la Carta de Crédito no tendrá validez. No hay devolución de dinero.\n\nE. Si el pasajero solicita anular – dejar sin efecto - su reserva con menos de 10 días de anticipación a la fecha de ingreso al Hotel, NO TENDRÁ DERECHO A DEVOLUCION DEL PAGO REALIZADO NI TAMPOCO AL OTORGAMIENTO DE UNA CARTA DE CRÉDITO.\n\nF. Se considerará anulada la reserva, si cumplidas las 15:00 horas del día siguiente a la fecha de ingreso establecido en el “Voucher o Comprobante de Reserva”, el pasajero no se haya registrado en la recepción del Hotel Termas Chillán. En tal caso, no existirá devolución del pago realizado ni tampoco al otorgamiento de una Carta de Crédito.\n\nG. Las partes estipulan que las sumas a las que se hace referencia en las letras B, C, D y E, sin perjuicio del otorgamiento de la Carta de Crédito cuando corresponda, quedarán a beneficio de Hotel Termas Chillán, a título de indemnización anticipada de perjuicios de conformidad con lo prescrito en los artículos 1535 y siguientes del Código Civil de Chile.\n\nH. El pasajero que cambie la fecha de su reserva, y esta sea autorizada por el Hotel Termas Chillán, deberá pagar las tarifas vigentes a la fecha de su nueva estadía.');
text('Modificación de la Reserva.', 'El cambio de la fecha de la reserva, requerida por el pasajero, cualquiera que sea la causa que la origine, queda sujeta a las siguientes condiciones:\n\nA. Toda solicitud de cambio de fecha de la reserva deberá hacerse por escrito a reservas@termaschillan.cl. Solo se considerará respondida la petición una vez recibida la respuesta del Hotel Termas Chillán.\n\nB. Si el pasajero solicita el cambio de la fecha de reserva con a lo menos 30 días de anticipación a la fecha de ingreso establecida en el “Voucher o Comprobante de Reserva”, la modificación no tendrá costo alguno para éste.\n\nC. Si el pasajero solicita el cambio de la fecha de reserva con a lo menos 15 días de anticipación a la fecha del ingreso establecida en el “Voucher o Comprobante de Reserva”, tendrá un costo para este ascendente al 20% del valor de la reserva.\n\nD. Si el pasajero solicita el cambio de la fecha de reserva con menos de 15 días de anticipación a la fecha del ingreso establecida en el “Voucher o Comprobante de Reserva”, tendrá un costo para este ascendente al 30% del total de la reserva.\n\nE. El pasajero que cambie la fecha de su reserva, y ésta sea autorizada por el Hotel Termas Chillán, deberá pagar las tarifas vigentes a la fecha de su nueva estadía.');
text('Programas.', 'En el caso de las estadías contratadas como programas de invierno de 7, 4 y 3 noches o programas de verano de 1 o más noches, el monto a pagar por el pasajero al realizar la reserva debe ser por el total del programa.\n\nNo se efectuarán devoluciones ni se otorgarán Cartas de Crédito por servicios no consumidos o no ocupados (abandono del hotel antes que termine el programa, etc.), cualesquiera sean las causas o razones que origine esa situación.');
text('Actividades realizadas por terceros ajenos al Hotel. Generalidades.', 'Hotel Termas Chillán no es responsable en ningún caso por los programas, viajes, traslados y en general por actividades que no sean desarrolladas directamente por este, aún cuando se hayan comprado, facilitado u obtenido por su intermedio.');
text('Cierre por Falta de Nieve. Previo al arribo.', 'En la eventualidad de un cierre total del Mountain Park o del Centro de Ski Nevados de Chillán por falta de nieve, durante fechas establecidas en el tarifario como de “Invierno”, se le avisará al Cliente o Huésped de la forma más expedita, a fin de que este pueda elegir algunas de las siguientes opciones:\n1. Solicitar cambio de fecha durante la misma temporada manteniendo la tarifa pagada, independiente de la nueva fecha que reserve. Sujeto a disponibilidad.\n2. Solicitar una Carta de Crédito para ser utilizada en una próxima reserva por el total del monto abonado, la que deberá ser utilizada en un plazo máximo de 12 meses a partir de la fecha establecida en dicha carta, manteniendo la tarifa pagada independiente de la nueva fecha que reserve. Sujeto a disponibilidad.\n3. Solicitar que se le haga la devolución del dinero abonado. En este caso la transferencia el abono será realizado en un plazo máximo de 30 días.\n4. Mantener su reserva.');
text('Traslado', 'El traslado terrestre y/o aéreo incluido en los paquetes turísticos entre las ciudades de Santiago y Chillán, Santiago y Concepción, Chillán y Termas de Chillán, Concepción y Termas de Chillán y viceversa, es realizado por terceros, ajenos a HOTEL TERMAS CHILLÁN, quien sólo actúa como intermediario y en consecuencia no será responsable por los gastos incurridos por los pasajeros debido al cierre de caminos y/o aeropuertos, sea total o parcial, con prescindencia de la causa. No obstante, hará sus mejores esfuerzos para facilitar dicha situación en la medida de lo posible. Si los pasajeros se encuentran impedidos de llegar al Hotel Termas Chillán deberán incurrir directamente con los gastos de su estadía. Sin perjuicio de ello, las noches de estadía no ocupadas en el Hotel, por esta situación, le darán derecho a un crédito al pasajero, el que podrá ser usado a elección del pasajero, de la siguiente forma:\n\nA. Elegir si su crédito devengado por el no uso lo traspasa a su cuenta de extras.\n\nB. Elegir si su crédito devengado por el no uso lo utiliza para una futura reserva dentro de la misma temporada.\n\nC. En ambos casos el monto del crédito será el equivalente a la suma total pagada por el pasajero.\n\nD. Elegir si su crédito devengado por el no uso lo utiliza en la temporada inmediatamente siguiente, en cuyo caso se le otorgará una Carta de Crédito, la que será equivalente al 50% de sus noches perdidas. No hay devolución de dinero.');

// ══ TEXTOS DE INTERFAZ (editables desde el admin) ══
// Índice Bienestar
P('ui-bienestar', 'Bienestar (tarjetas del índice)');
B('link', 'Spa Alunco', '/wellness/spa');
B('link', 'Gimnasio', '/wellness/gimnasio');
B('link', 'Piscinas', '/info/piscinas');

// Índice Comer y Beber
P('ui-comer-y-beber', 'Comer y Beber (tarjetas del índice)');
B('link', 'Arboleda', '/restaurantes/arboleda');
B('link', 'La Grieta', '/restaurantes/la-grieta');
B('link', 'Muffin Café', '/restaurantes/muffin');

// Textos de la pantalla Actividades
P('ui-actividades', 'Actividades (textos de la pantalla)');
text('Cuidado del Entorno', 'Nos comprometemos a mantener el bosque en su estado natural y te pedimos que nos acompañes en ese cuidado:');
list('Cuidado del Entorno — puntos', [
  'Regresa siempre con tu basura al hotel.',
  'Evita fumar o encender fuego fuera de las áreas permitidas.',
  'Durante el verano el riesgo de incendios es muy alto. Tu precaución protege el entorno de todos.',
]);
B('note', 'Nota full day', 'Las actividades full day son operadas por proveedor externo y tienen costo adicional.');
text('Actividades Gratuitas', 'Acceso a espacios deportivos y recreativos en las dependencias del hotel.');
text('Actividades con Costo Extra', 'Experiencias para explorar el entorno.');
text('Intro — Caminatas y Trekking', 'Exploración del entorno natural. Snacks incluidos y cocktail en salidas de puesta de sol.');
text('Intro — Bicicleta', 'Recorridos de diversos niveles por los alrededores del hotel y el Valle de las Trancas.');
text('Intro — Contemplación y Recreación', 'Actividades de aprendizaje, respeto por la naturaleza y aventura.');
text('Intro — Bienestar y Talleres Indoor', 'Actividades de activación corporal, arte y gastronomía.');
text('Intro — Niños', 'Actividades de activación corporal, arte y gastronomía.');
text('Intro — Deportes de Nieve', 'Vive la montaña al máximo: adrenalina en la nieve, aventuras en la naturaleza y momentos de bienestar y relax.');
text('Intro — Exploración & Naturaleza', 'Vive la montaña al máximo: adrenalina en la nieve, aventuras en la naturaleza y momentos de bienestar y relax.');
B('note', 'Nota mesón', 'Conoce las actividades disponibles consultando en el mesón de experiencias.');

// Accesos rápidos del Home
P('ui-home', 'Home (accesos rápidos y emergencia)');
B('link', 'Mi Estadía', '/info/mi-estadia');
B('link', 'Comer y Beber', '/restaurantes');
B('link', 'Bienestar', '/wellness');
B('link', 'Experiencias y Actividades', '/actividades');
B('link', 'Ski', '/info/ski');
B('link', 'Información General', '/info/informacion-general');
text('Emergencia — intro', 'Si necesitas atención médica inmediata, comunícate con la recepción llamando desde tu habitación al:');
text('Emergencia — teléfono interno', '3500');
text('Emergencia — intro externa', 'Si te encuentras fuera del Hotel, llama al:');
text('Emergencia — teléfono externo', '+562 2322 3500');

// Submenú del Spa
P('ui-spa-submenu', 'Spa Alunco (accesos del submenú)');
B('link', 'Menú de Tratamientos', '/wellness/spa/tratamientos');
B('link', 'Circuitos Hidrotermales', '/info/circuitos-hidrotermales');
B('link', 'Sala de Yoga y Meditación', '/info/sala-yoga');
text('Nota agendar', 'Para agendar, llama al 3544 desde tu habitación o acércate a la recepción del Spa.');

async function main() {
  const before = await db.select().from(infoPages);
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(backupDir, `info-pages-${stamp}.json`), JSON.stringify({ blocks: before }, null, 2));
  console.log(`Backup: scripts/backups/info-pages-${stamp}.json`);
  console.log(`Before: ${before.length} blocks | Prepared (Figma): ${rows.length}`);

  await db.delete(infoPages);
  for (let i = 0; i < rows.length; i += 50) await db.insert(infoPages).values(rows.slice(i, i + 50));

  const after = await db.select().from(infoPages);
  const byPage: Record<string, number> = {};
  for (const r of after) byPage[r.page] = (byPage[r.page] ?? 0) + 1;
  console.log(`After:  ${after.length} blocks across ${Object.keys(byPage).length} pages`);
  console.log(JSON.stringify(byPage, null, 2));
  process.exit(0);
}
main().catch((e) => {
  console.error('ERROR:', e.message);
  if (e.cause) console.error('CAUSE:', (e.cause as Error).message ?? e.cause);
  process.exit(1);
});

// ══ UI SKI RENTAL / GIMNASIO / TRATAMIENTOS / HABITACIÓN / RESTAURANTES (textos editables) ══
P('ui-ski-rental', 'Ski Rental (textos)');
text('Título', 'Ski Rental');
text('Intro', 'Para que disfrute al máximo su experiencia en la montaña, ponemos a su disposición nuestro servicio de Ski Rental, desde las 8:30 hasta las 18:00 hrs.\n\nReserve su equipo con anticipación, idealmente el día previo a su uso, para asegurar tallas, modelos y accesorios requeridos.');
text('Advertencia', 'Estos precios pueden variar según el valor del dólar');
text('Título — SKI – Renta por Día', 'Renta por Día');
text('Título — SKI – Renta Semanal', 'Renta por Semana');
text('Título — SKI – Servicios', 'Servicios');

P('ui-gimnasio', 'Gimnasio (textos)');
text('Título', 'Gimnasio');
text('Título horarios', 'Horarios de Atención:');
text('Horarios', 'Horario Continuo.');
text('Título sección', 'Fitness y Clases');

P('ui-tratamientos', 'Menú de Tratamientos (textos)');
text('Título', 'Menú de Tratamientos');

P('ui-habitacion', 'Habitación (textos)');
text('Título', 'Habitación');

P('ui-restaurantes', 'Restaurantes (textos)');
text('Título horarios', 'Horarios de Atención:');
text('Título menú del día', 'Menú del día');
text('Título carta — arboleda', 'Bebidas');
text('Título carta — la-grieta', 'Menús');
text('Título carta — muffin', 'Menús');

// ══ UI CENTRO DE SKI (tablas editables; filas separadas por |) ══
P('ui-centro-ski', 'Centro de Ski (tablas)');
text('Intro', 'Ski con más de 35 km de pistas y opciones para todos los niveles. Vive una experiencia en un entorno natural privilegiado.');
text('Nota mesón', 'Conoce las actividades disponibles consultando en el mesón de experiencias.');
text('Título andariveles', 'Reporte Andariveles');
text('Título pistas', 'Pistas');
list('Reporte Andariveles', [
  'Tata | Silla Cuádruple | Zona Baja | Cerrado',
  'Refugio | Silla Triple | Zona Baja | Abierto',
]);
list('Pistas', [
  'Cóndor | Cerrado | Experto | Ninguna',
  'Cóndor II | Abierto | Experto | Ninguna',
  'Moto-X | Cerrado | Intermedio | Ninguna',
  'Curvitas | Abierto | Intermedio | Ninguna',
  'Novicios | Cerrado | Principiante | Ninguna',
  'Súper-X | Abierto | Avanzado | Ninguna',
  'Nacional | Cerrado | Avanzado | Ninguna',
  'Bosque Zion | Abierto | Intermedio | Ninguna',
  'Renegado | Cerrado | Avanzado | Ninguna',
  'Águila | Abierto | Experto | Ninguna',
  'Fumarolas – Sendero Enduro | Cerrado | Intermedio | Ninguna',
  'Candado – Sendero Enduro | Abierto | Experto | Ninguna',
  'Garganta – Sendero Enduro | Cerrado | Experto | Ninguna',
  'Sendero E-Bike | Abierto | Principiante | Ninguna',
  'Sendero Familiar | Cerrado | Principiante | Ninguna',
]);


