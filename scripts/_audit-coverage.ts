import './_env';
import { db } from '../lib/db/index';
import { infoPages, restaurantItems, activities, spaServices, gymClasses, roomInfo, familyPrograms, events } from '../lib/db/schema';

// Figma screen → app route → where its content lives
const MAP: [string, string, string][] = [
  ['PWA- Home','/home','events+alerts+hardcode'],
  ['PWA- Inicio de Sesión','/','hardcode'],
  ['PWA- Datos de Huéspedes','/','hardcode'],
  ['PWA- Comer y Beber','/restaurantes','hardcode(3 cards)'],
  ['PWA- Arboleda','/restaurantes/arboleda','restaurant_items:arboleda'],
  ['PWA- Arboleda Vinos','/restaurantes/arboleda/vinos','restaurant_items:arboleda/Vinos'],
  ['PWA- Arboleda Coctelería','/restaurantes/arboleda/cocteleria-internacional','restaurant_items:arboleda/Coctelería Internacional'],
  ['PWA- Arboleda Destilados y Licores','/restaurantes/arboleda/destilados-y-licores','restaurant_items:arboleda/Destilados y Licores'],
  ['PWA- Arboleda Otras Bebidas','/restaurantes/arboleda/otras-bebidas','restaurant_items:arboleda/Otras Bebidas'],
  ['PWA- La Grieta','/restaurantes/la-grieta','restaurant_items:lagrieta'],
  ['PWA- La Grieta Comida','/restaurantes/la-grieta/comida','restaurant_items:lagrieta/Comida'],
  ['PWA- La Grieta Coctelería','/restaurantes/la-grieta/cocteleria','restaurant_items:lagrieta/Coctelería'],
  ['PWA- La Grieta Licores','/restaurantes/la-grieta/destilados-y-licores','restaurant_items:lagrieta/Destilados y Licores'],
  ['PWA- La Grieta Bebidas c/s Alcohol','/restaurantes/la-grieta/otras-bebidas','restaurant_items:lagrieta/Otras Bebidas'],
  ['PWA- Muffin Café','/restaurantes/muffin','restaurant_items:muffin'],
  ['PWA- Bienestar','/wellness','hardcode(3 cards)'],
  ['PWA- Spa Alunco SubMenú','/wellness/spa','spa_schedules+links'],
  ['PWA- Spa Alunco','/wellness/spa/tratamientos','spa_services'],
  ['PWA- Spa Circuitos Hidrotermales','/info/circuitos-hidrotermales','info_pages:circuitos-hidrotermales'],
  ['PWA- Spa Sala de Yoga','/info/sala-yoga','info_pages:sala-yoga'],
  ['PWA- Gimnasio','/wellness/gimnasio','gym_classes'],
  ['PWA- Gimnasio(Piscinas)','/info/piscinas','info_pages:piscinas'],
  ['PWA- Experiencias VER','/actividades','activities:verano'],
  ['PWA- Experiencias INV','/actividades','activities:invierno'],
  ['PWA- Caminatas y Trecking','/actividades?cat=Caminatas y Trekking','activities/Caminatas y Trekking'],
  ['PWA- Bicicleta','/actividades?cat=Bicicleta','activities/Bicicleta'],
  ['PWA- Contemplación y Recreción','/actividades?cat=Contemplación y Recreación','activities/Contemplación y Recreación'],
  ['PWA- Bienestar y Talleres VER','/actividades?cat=Bienestar y Talleres Indoor','activities/Bienestar y Talleres Indoor'],
  ['Bienestar y Talleres INV','/actividades?cat=Bienestar y Talleres Indoor','activities/Bienestar y Talleres Indoor'],
  ['PWA- Otras Actividades','/actividades?cat=Otras Actividades','activities/Otras Actividades'],
  ['PWA- Deportes de Nieve','/actividades?cat=Deportes de Nieve','activities/Deportes de Nieve'],
  ['PWA- Exploración & Naturaleza','/actividades?cat=Exploración & Naturaleza','activities/Exploración & Naturaleza'],
  ['PWA- Niños Verano','/actividades?cat=Niños','activities/Niños(verano)+club'],
  ['PWA- Niños Invierno','/actividades?cat=Niños','activities/Niños(invierno)+club'],
  ['PWA- Ski','/info/ski','info_pages:ski'],
  ['PWA- Centro de Ski','/actividades?cat=Centro de Ski','activities/SKI –*'],
  ['PWA- Ski Rental','/actividades?cat=Centro de Ski','activities/SKI – Renta por Día|Semanal'],
  ['PWA- Clases de Ski','/info/clases-ski','info_pages:clases-ski'],
  ['PWA- Guarda Ski','/info/guarda-ski','info_pages:guarda-ski'],
  ['PWA- Mi Estadía','/info/mi-estadia','info_pages:mi-estadia'],
  ['PWA- Servicios Incluídos','/info/servicios-incluidos','info_pages:servicios-incluidos'],
  ['PWA- Check-In Verano','/info/check-in','info_pages:check-in'],
  ['PWA- Check-In Invierno','/info/check-in','info_pages:check-in'],
  ['PWA- Programa Del Viajero','/info/programa-viajero','info_pages:programa-viajero'],
  ['PWA- Plan de Invierno','/info/plan-invierno','info_pages:plan-invierno'],
  ['PWA- Preparativos','/info/preparativos','info_pages:preparativos'],
  ['PWA- Estacionamientos','/info/estacionamientos','info_pages:estacionamientos'],
  ['PWA- Uso de LLaves','/info/uso-llaves','info_pages:uso-llaves'],
  ['PWA- Guardería','/info/guarderia','info_pages:guarderia'],
  ['PWA- Habitación','/habitacion','room_info(11 secciones)'],
  ['PWA- Información','/info/informacion-general','info_pages:informacion-general'],
  ['PWA- Reglamento','/info/reglamento','info_pages:reglamento'],
  ['PWA- Políticas de Reserva','/info/politicas-reserva','info_pages:politicas-reserva'],
  ['PWA- Tiendas','/info/tiendas','info_pages:tiendas'],
  ['PWA- Backcountry Store','/info/backcountry-store','info_pages:backcountry-store'],
  ['PWA- Venta en Recepción','/info/venta-recepcion','info_pages:venta-recepcion'],
  ['PWA- Artículos Spatt','/info/articulos-spa','info_pages:articulos-spa'],
  ['PWA- Espacios','/info/espacios','info_pages:espacios'],
  ['PWA- Emergencias','/info/emergencias','info_pages:emergencias'],
];

(async () => {
  const ip = await db.select().from(infoPages);
  const ri = await db.select().from(restaurantItems);
  const ac = await db.select().from(activities);
  const sp = await db.select().from(spaServices);
  const gy = await db.select().from(gymClasses);
  const rinf = await db.select().from(roomInfo);
  const fp = await db.select().from(familyPrograms);
  const ev = await db.select().from(events);

  const ipPages = new Set(ip.map(x => x.page));
  const acCats = new Set(ac.map(x => x.category));
  const riKey = new Set(ri.map(x => `${x.restaurant}/${x.category}`));

  let ok = 0, warn = 0;
  const problems: string[] = [];
  for (const [screen, route, source] of MAP) {
    let status = 'OK';
    if (source.startsWith('info_pages:')) {
      const slug = source.split(':')[1];
      const n = ip.filter(x => x.page === slug).length;
      if (!ipPages.has(slug)) { status = 'FALTA página ' + slug; }
      else if (n === 0) status = 'VACÍA';
    } else if (source.startsWith('restaurant_items:')) {
      const spec = source.split(':')[1];
      if (spec.includes('/')) {
        const [r, c] = spec.split('/');
        if (!riKey.has(`${r}/${c}`)) status = `FALTA carta ${r}/${c}`;
      } else if (ri.filter(x => x.restaurant === spec).length === 0) status = 'SIN ítems';
    } else if (source.startsWith('activities/')) {
      const c = source.split('/')[1].replace(/\(.*\)/, '').replace('+club', '').trim();
      if (c.endsWith('*')) { if (![...acCats].some(x => x.startsWith('SKI'))) status = 'FALTAN SKI'; }
      else if (c.includes('|')) { if (!c.split('|').some(x => acCats.has(x.trim()))) status = 'FALTA ' + c; }
      else if (!acCats.has(c)) status = 'FALTA categoría ' + c;
    } else if (source === 'spa_services' && sp.length === 0) status = 'VACÍO';
    else if (source === 'gym_classes' && gy.length === 0) status = 'VACÍO';
    else if (source.startsWith('room_info') && rinf.length === 0) status = 'VACÍO';

    if (status === 'OK') ok++; else { warn++; problems.push(`${screen.padEnd(38)} ${route.padEnd(46)} → ${status}`); }
  }
  console.log(`PANTALLAS MAPEADAS: ${MAP.length}`);
  console.log(`  con contenido OK: ${ok}`);
  console.log(`  con problema:     ${warn}`);
  if (problems.length) { console.log('\nPROBLEMAS:'); problems.forEach(p => console.log('  ' + p)); }
  console.log(`\nDatos: info_pages=${ip.length} (${ipPages.size} páginas) | restaurant_items=${ri.length} | activities=${ac.length} | spa_services=${sp.length} | gym=${gy.length} | room_info=${rinf.length} | family=${fp.length} | events=${ev.length}`);
  process.exit(0);
})();
