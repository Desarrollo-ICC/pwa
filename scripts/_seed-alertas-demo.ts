import './_env';
import { db } from '../lib/db/index';
import { alerts } from '../lib/db/schema';
(async () => {
  await db.delete(alerts);
  await db.insert(alerts).values([
    { title: 'Clases de Ski canceladas', message: 'Por condiciones de viento blanco, las clases de hoy quedan suspendidas.', type: 'warning', active: true },
    { title: 'Mantención de piscina', message: 'La piscina temperada estará cerrada entre 14:00 y 16:00 hrs.', type: 'info', active: true },
  ]);
  console.log('2 alertas de ejemplo creadas');
  process.exit(0);
})();
