// Sync Wellness (Spa services + Gym classes) to match Figma 1:1. Backs up first.
// Scoped: replaces ALL spa_services and ALL gym_classes. Does NOT touch spa_schedules or reglamento.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { spaServices, gymClasses } from '../lib/db/schema';

type Svc = typeof spaServices.$inferInsert;
const spa: Svc[] = [];
let ord = 0;
// [name, description, price, duration?]
function svc(category: string, list: [string, string, string, string?][]) {
  for (const [name, description, price, duration] of list)
    spa.push({ category, name, description, price, duration: duration ?? null, active: true, order: ++ord });
}

svc('Masajes y Terapias', [
  ['Masaje Barro', 'Fangoterapia: Barro termal, regenerador celular, nutre profundamente, tonifica y reafirma.', '$60.000', '50 min'],
  ['Masaje Serenidad', 'Con aromaterapia, relajante antiestrés, calma y alivia la fatiga.', '$30.000 - $50.000', '30 min - 50 min'],
  ['Masaje Recarga Vital', 'Descontracturante, promueve la relajación muscular y alivia tensiones.', '$40.000 - $60.000', '30 min - 50 min'],
  ['Masaje Regenerativo', 'Deportivo, activa la recuperación muscular y previene lesiones deportivas.', '$70.000', '50 min'],
  ['Masaje Piedras Calientes', 'Estimula la circulación, libera el estrés y mejora la calidad del sueño.', '$60.000 - $75.000', '50 min - 80 min'],
  ['Masaje Champi Hindú', 'Relajante, despierta los sentidos, con aceites aromáticos y sonido de Thingshas.', '$40.000 - $50.000', '30 min - 50 min'],
  ['Masaje Alunco', 'Relajante y descontracturante.', '$60.000', '50 min'],
  ['Masaje Sueco', 'Masaje de intensidad media, activa la circulación sanguínea y linfática.', '$60.000 - $75.000', '50 min - 80 min'],
  ['Masaje Relajante', 'Masaje relajante con lavado y secado de pelo.', '$45.000', '50 min'],
  ['Alunco Kids', 'Relajante para niños entre 5 a 14 años. Efecto relajante y de calma.', '$35.000', '30 min'],
  ['Reflexología Podal', 'Alivia dolores y relaja el cuerpo.', '$45.000', '30 min'],
  ['Relajante + Reflexología', 'Combinación de técnicas de relajación y presión en puntos reflejos.', '$70.000', '80 min'],
]);
svc('Rituales de Renovación', [
  ['Ritual Volcánico', 'Masaje de manos, masaje con piedras calientes y toques de piedras frías. En puntos de la columna y piernas.', '$65.000', '50 min'],
  ['Ritual Árbol de la Vida', 'Masaje de pies, hombros y cabeza.', '$60.000', '50 min'],
  ['Ritual Kundalini de Bosque', 'Cuidado de la piel y masaje reconstituyente de espalda.', '$60.000', '50 min'],
  ['Ritual Sabiduría de la Naturaleza', 'Exfoliación facial, máscara nutritiva y masaje relajante corporal.', '$60.000', '50 min'],
  ['Ritual Agua Curativa Détox', 'Drenaje linfático, limpia toxinas y relaja la musculatura.', '$65.000', '50 min'],
  ['Ritual del Montañista', 'Reflexología pies y relajación piernas.', '$60.000', '50 min'],
  ['Ritual Signature Termal Alunco', 'Tratamiento corporal integral con barro termal: exfoliante, masaje e hidratación.', '$95.000', '80 min'],
  ['Ritual del Chocolate', 'Tina caliente y masaje relajante.', '$100.000', '80 min'],
  ['Ritual de Renovación Energética', 'Tina caliente, con sal del Himalaya y masaje relajante.', '$95.000', '80 min'],
]);
svc('Faciales y Jacuzzi', [
  ['Baño Relajante en Jacuzzi', 'Jacuzzi individual con sales aromáticas.', '$18.000', '50 min'],
  ['Hidratación Profunda', 'Hidratación y relajación.', '$55.000', '30 min'],
  ['Facial Descongestionante Post Sol', 'Mascarilla calmante con suero revitalizante.', '$80.000', '80 min'],
  ['Facial Completo Alunco', 'Limpieza, exfoliación y máscara de ampolla nutritiva.', '$80.000', '80 min'],
  ['Facial Completo para Hombre', 'Limpieza profunda, lavado de barba y aceite suavizante.', '$60.000', '50 min'],
  ['Facial de Rejuvenecimiento', 'Energizante y restaurador.', '$80.000', '80 min'],
  ['Facial Deluxe', 'Potencia la espiración celular y brillo de la piel.', '$65.000', '50 min'],
]);
svc('Peluquería y Manicure', [
  ['Lavado de Pelo', 'Servicio básico de limpieza capilar.', '$15.000'],
  ['Planchado de Pelo Largo', 'Alisado con plancha para cabello largo.', '$25.000'],
  ['Planchado de Pelo Corto', 'Alisado con plancha para cabello corto.', '$18.000'],
  ['Brushing Largo', 'Secado y moldeado para cabello largo.', '$25.000'],
  ['Brushing Corto', 'Secado y moldeado para cabello corto.', '$18.000'],
  ['Masaje Capilar Largo', 'Incluye spa de pies para cabello largo.', '$28.000'],
  ['Masaje Capilar Corto', 'Incluye spa de pies para cabello corto.', '$24.000'],
  ['Manicure Permanente', 'Esmaltado de larga duración.', '$25.000'],
  ['Manicure Permanente con Diseño', 'Esmaltado de larga duración con arte decorativo.', '$28.000'],
  ['Retiro de Esmalte Permanente', 'Remoción técnica de esmaltado previo.', '$6.000'],
]);
svc('Circuitos de Agua', [
  ['Circuito Alunco', 'Masaje Alunco, aromaterapia y musicoterapia.', '$80.000', '50 min'],
  ['Circuito Enamorados', 'Masaje Serenidad, aromaterapia y musicoterapia.', '$70.000', '50 min'],
  ['Circuito Amistad', 'Champi Hindú, aromaterapia y musicoterapia.', '$50.000', '30 min'],
  ['Circuito Súper Mamá', 'Reflexología podal, masaje capilar, aromaterapia y musicoterapia.', '$80.000', '30 min'],
  ['Circuito Para Ellos', 'Facial completo para hombre, aromaterapia y musicoterapia.', '$80.000', '50 min'],
  ['Circuito Trabajólico', 'Masaje recarga vital, aromaterapia y musicoterapia.', '$80.000', '50 min'],
  ['Circuito Relax', 'Masaje relajante, aromaterapia y musicoterapia.', '$70.000', '50 min'],
  ['Circuito Tonificante', 'Masaje descontracturante, aromaterapia y musicoterapia.', '$90.000', '50 min'],
]);

type Gym = typeof gymClasses.$inferInsert;
const gym: Gym[] = [
  { name: 'Clase de Yoga', description: 'Clase guiada de yoga suave enfocada en respiración y estiramiento.', price: '$15.000', schedule: '8:30 - 9:30', active: true, order: 1 },
  { name: 'Entrenamiento para Trekking', description: 'Sesión dinámica adaptada al entorno de altura para mejorar el rendimiento físico.', price: '$15.000', schedule: '8:30 - 9:30', active: true, order: 2 },
];

async function main() {
  const beforeSpa = await db.select().from(spaServices);
  const beforeGym = await db.select().from(gymClasses);
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(backupDir, `wellness-${stamp}.json`), JSON.stringify({ spaServices: beforeSpa, gymClasses: beforeGym }, null, 2));
  console.log(`Backup: scripts/backups/wellness-${stamp}.json`);
  console.log(`Before: ${beforeSpa.length} spa_services, ${beforeGym.length} gym_classes`);
  console.log(`Prepared (Figma): ${spa.length} spa_services, ${gym.length} gym_classes`);

  await db.delete(spaServices);
  await db.delete(gymClasses);
  for (let i = 0; i < spa.length; i += 50) await db.insert(spaServices).values(spa.slice(i, i + 50));
  await db.insert(gymClasses).values(gym);

  const afterSpa = await db.select().from(spaServices);
  const afterGym = await db.select().from(gymClasses);
  const cats: Record<string, number> = {};
  for (const s of afterSpa) cats[s.category] = (cats[s.category] ?? 0) + 1;
  console.log(`After:  ${afterSpa.length} spa_services, ${afterGym.length} gym_classes`);
  console.log('Spa by category:', JSON.stringify(cats, null, 2));
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
