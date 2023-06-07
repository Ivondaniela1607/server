import { App } from './app';
import { encriptarPassword } from './utils/utils';

async function main() {
  //Inicio APP xpress
  const app = App.instance;
  await app.listen();

  const passwordEncruptado = await encriptarPassword('123456');
  console.log('123456', passwordEncruptado);
}
main();
