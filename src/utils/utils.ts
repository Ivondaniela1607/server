import moment from 'moment';
import 'moment/locale/es';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import bcrypt from 'bcryptjs';

export function descargarImagen(url: string, destino: string) {
  // @ts-ignore
  let nombreFichero = url.split('/').pop().split('?')[0];

  fetch(url)
    .then((res) => {
      const dest = fs.createWriteStream(destino + '/' + nombreFichero);
      res.body.pipe(dest);
      console.log('Imagen descargada');
    })
    .catch((error) => console.log(error));
}

export function Ahora(devolverHora: boolean = false): string {
  let ahora: any = null;
  devolverHora
    ? (ahora = moment().format('YYYY-MM-DD HH:mm:ss'))
    : (ahora = moment().format('YYYY-MM-DD'));
  return ahora;
}
export function HoraHoy(): string {
  let ahora: any = null;
  ahora = moment().format('HH:mm:ss');
  return ahora;
}
export function Ayer(desde?: string, weekend: boolean = true): string {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));

  let ayer = moment(desde).subtract(1, 'day').format('YYYY-MM-DD');
  const diaSemanaAyer = moment(ayer).day();
  diaSemanaAyer === 0 && weekend === true
    ? (ayer = moment(ayer).subtract(2, 'day').format('YYYY-MM-DD'))
    : '';
  diaSemanaAyer === 6 && weekend === true
    ? (ayer = moment(ayer).subtract(1, 'day').format('YYYY-MM-DD'))
    : '';

  return ayer;
}
export function Sietedias(desde?: string, weekend: boolean = true): string {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));

  let ayer = moment(desde).subtract(7, 'day').format('YYYY-MM-DD');
  const diaSemanaAyer = moment(ayer).day();
  diaSemanaAyer === 0 && weekend === true
    ? (ayer = moment(ayer).subtract(2, 'day').format('YYYY-MM-DD'))
    : '';
  diaSemanaAyer === 6 && weekend === true
    ? (ayer = moment(ayer).subtract(1, 'day').format('YYYY-MM-DD'))
    : '';

  return ayer;
}
export function HaceXdias(
  dias: number,
  desde?: string,
  weekend: boolean = true
): string {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));

  let ayer = moment(desde).subtract(dias, 'day').format('YYYY-MM-DD');
  const diaSemanaAyer = moment(ayer).day();
  diaSemanaAyer === 0 && weekend === true
    ? (ayer = moment(ayer).subtract(2, 'day').format('YYYY-MM-DD'))
    : '';
  diaSemanaAyer === 6 && weekend === true
    ? (ayer = moment(ayer).subtract(1, 'day').format('YYYY-MM-DD'))
    : '';

  return ayer;
}

export function semanasFechas(desde?: string, restar?: number): string[] {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));
  restar === undefined ? restar : 0;

  restar
    ? (desde = moment(desde)
        .subtract(restar, 'days')
        .format('YYYY-MM-DD hh:mm:ss'))
    : '';

  const primerDiaSemana = moment(desde)
    .startOf('week')
    .isoWeekday(1)
    .format('YYYY-MM-DD');

  let ultimoDiaSemana;
  //console.log(restar);
  // @ts-ignore
  restar > 7
    ? (ultimoDiaSemana = moment(desde)
        .add(7, 'days')
        .endOf('week')
        .isoWeekday(6)
        .format('YYYY-MM-DD'))
    : (ultimoDiaSemana = moment(desde)
        .endOf('week')
        .isoWeekday(6)
        .format('YYYY-MM-DD'));

  //const ultimoDiaSemana = moment(primerDiaSemana).add(restar, 'days').format('YYYY-MM-DD');

  return [primerDiaSemana, ultimoDiaSemana];
}

export function PrimerDiaMes(desde?: string): string[] {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));
  const primerDia = moment(desde).startOf('month').format('YYYY-MM-DD');
  const ultimoDia = moment(desde).endOf('month').format('YYYY-MM-DD');

  return [primerDia, ultimoDia];
}

export function esteAno(desde?: string): string[] {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));
  const primerDia = moment(desde).startOf('year').format('YYYY-MM-DD');
  const ultimoDia = moment(desde).endOf('year').format('YYYY-MM-DD');

  return [primerDia, ultimoDia];
}

export function UltimoDiaMes(desde?: string): string {
  desde ? '' : (desde = moment().format('YYYY-MM-DD'));
  const ultimoDia = moment(desde).endOf('month').format('YYYY-MM-DD');

  return ultimoDia;
}

// Ayuda apra sacara las fechas de los informes
//tipos: hoy, ayer,semana,lastSemana,dosSemanas,mes,ano, entre
export function fechasporTipo(tipo: string): string[] {
  let fechas: string[];

  switch (tipo) {
    case 'hoy':
      fechas = [Ahora(), Ahora()];
      break;
    case 'ayer':
      fechas = [Ayer(), Ayer()];
      break;
    case 'semana':
      let semana = semanasFechas(Ahora());
      fechas = [semana[0], semana[1]];
      break;
    case 'lastSemana':
      let lastSemana = semanasFechas(Ahora(), 7);
      fechas = [lastSemana[0], lastSemana[1]];
      break;
    case 'trimestre':
      let primerDiaTresmeses = moment()
        .subtract(3, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      let ultimodiaTresmeses = moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      fechas = [primerDiaTresmeses, ultimodiaTresmeses];
      break;
    case 'dosSemanas':
      const dosSemanas = semanasFechas(Ahora(), 14);
      fechas = [dosSemanas[0], dosSemanas[1]];
      break;
    case 'mes':
      const mes = PrimerDiaMes(Ahora());
      fechas = [mes[0], mes[1]];
      break;
    case 'ano':
      const ano = esteAno(Ahora());
      fechas = [ano[0], ano[1]];
      break;
    case 'ultimoMes':
      let mesUltimo = moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      let mesAnterior = moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      fechas = [mesUltimo, mesAnterior];
      break;
    default:
      fechas = [Ahora(), Ahora()];
  }

  return fechas;
}

// export function testMoment() {

// 	console.log('Local:', moment.locale()); // es

// 	const now = moment();

// 	console.log('Now:', now.format('YYYY-MM-DD hh:mm:ss')); // en

// 	const dateParse = moment('2020-05-05')

// 	console.log('dateParse:', dateParse); //

// 	const valida = moment('2018-13-23').isValid() //false

// 	console.log('Valida:', valida);

// 	const from = moment('2020-06-08 09:52:57').fromNow() //2 years ago
// 	const from2 = moment('2016-11-23').fromNow(true) //2 years
// 	const from3 = moment('2020-06-08 09:52:57').fromNow(true) //2 years ago

// 	console.log('from:', from);
// 	console.log('from2:', from2);
// 	console.log('from3:', from3);

// 	const anadir = moment('2016-11-23').add(1, 'years')

// 	console.log('anadir:', anadir);

// 	const restar = (moment('2016-11-23').subtract(1, 'years')).format('YYYY-MM-DD hh:mm:ss')

// 	console.log('restar:', restar);

// }

//* ============================================================
//*? RECORDATORIO SACAR FECHA
//const hoy= Ahora();
// const ayer= Ayer();
// const semana = semanasFechas(Ahora());

// console.log(semana[0], semana[1]);

// const ultimaSemana = semanasFechas(Ahora(), 7);

// const dosSemana = semanasFechas(Ahora(), 14);
// const esteMes = PrimerDiaMes(Ahora());
// const ano = esteAno(Ahora());

// console.log('Hoy', hoy);
// console.log('Ayer', ayer);
// console.log('Esta semana', semana[0], semana[1]);
// console.log('Semana pasada', ultimaSemana[0], ultimaSemana[1]);
// console.log('Dos semanas',dosSemana[0], dosSemana[1]);
// console.log('Este mes',esteMes[0], esteMes[1]);
// console.log('Este año',ano[0], ano[1]);
//* ============================================================

export async function encriptarPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export const diffTime = (dateInit, dateEnd) => {
  let text = 'unos segundos';
  let diffMonth = moment(dateEnd).diff(dateInit, 'month');
  let diffWeek = moment(dateEnd).diff(dateInit, 'weeks');
  let diffDay = moment(dateEnd).diff(dateInit, 'day');
  let diffHours = moment(dateEnd).diff(dateInit, 'hours');
  let diffMinutes = moment(dateEnd).diff(dateInit, 'minutes');
  if (diffMonth >= 1) {
    text = `${diffMonth} mes${diffMonth == 1 ? '' : 'es'}`;
  } else if (diffWeek >= 1) {
    text = `${diffWeek} semana${diffWeek == 1 ? '' : 's'}`;
  } else if (diffDay >= 1) {
    text = `${diffDay} dia${diffDay == 1 ? '' : 's'}`;
  } else if (diffHours >= 1) {
    text = `${diffHours} hora${diffHours == 1 ? '' : 's'}`;
  } else if (diffMinutes >= 1) {
    text = `${diffMinutes} minuto${diffMinutes == 1 ? '' : 's'}`;
  }
  return text;
};
