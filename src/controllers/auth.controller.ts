import { LevelFormat } from './../../node_modules/docx/src/file/numbering/level';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authModel from '../models/auth.model';
import { User } from '../interface/auth.interface';
import {
  Document,
  BorderStyle,
  FrameAnchorType,
  HorizontalPositionAlign,
  ImageRun,
  Packer,
  Paragraph,
  SectionType,
  TextRun,
  UnderlineType,
  VerticalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  Footer,
  Header,
  Bookmark,
  PageReference,
  AlignmentType,
  TableRow,
  TableCell,
  Table,
  WidthType,
  PageNumber,
  NumberFormat,
  PageBreak,
} from 'docx';
import * as fs from 'fs-extra';
import { App } from '../app';

//* LOGIN DEL USUARIO
export const login = async (req: Request, res: Response) => {
  try {
    const msjError = 'Credenciales incorrectas o usuario inactivo';
    const result = await authModel.loginDB<User>(req.body);
    if (result.length == 0) {
      let dataLogPermisos = {
        id_usuario: '0',
        usuario: req.body.usuario,
        jwt: null,
        ip: req.headers['x-forwarded-for'],
        msj: msjError,
      };
      await authModel.insertLogDB(dataLogPermisos);
      return res.status(400).json({ ok: false, error: msjError });
    }
    const user = result[0];
    if (user.estado === 0)
      return res.status(400).json({ ok: false, error: msjError });
    const correctoPassword: boolean = await validarPassword(
      req.body.password,
      user.password
    );
    if (!correctoPassword) {
      let dataLogPermisos = {
        id_usuario: '0',
        usuario: req.body.usuario,
        jwt: null,
        ip: req.headers['x-forwarded-for'],
        msj: 'Usuario existe Password Incorrecto',
      };
      await authModel.insertLogDB(dataLogPermisos);
      return res.status(400).json({ ok: false, error: msjError });
    }

    const token: string = jwt.sign(
      {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        documento: user.documento,
        cargo: user.cargo,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        img: user.img,
      },
      process.env.TOKEN_SECRET || 'TokenTest12312!',
      {
        expiresIn: 60 * 60,
      }
    );
    user.password = ':)';

    let dataLog = {
      id_usuario: user.id_usuario,
      usuario: user.usuario,
      jwt: token,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      msj: 'Login',
    };
    await authModel.insertLogDB(dataLog);

    res.header('auth-token', token).json({ user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, mensaje: 'Ha ocurrido un error login: ', error });
  }
};
  
export const renovarToken = async (req: Request, res: Response) => {
  try {    
    const result = await authModel.findUserByIdDB<User>(req.Usuario);
    const user = result[0];
    const token: string = jwt.sign(
      {
        id_usuario: user.id_usuario,
        documento: user.documento,
        usuario: user.usuario,
        cargo: user.cargo,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        img: user.img,
      },
      process.env.TOKEN_SECRET || 'TokenTest12312!',
      {
        expiresIn: 60 * 60,
      }
    );
    user.password = ':)';
    res.status(200).json({
      ok: true,
      token,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, mensaje: 'Ha ocurrido un error login: ', error });
  }
};

export const testDevelopement = async (req: Request, res: Response) => {
  try {
    //const result = await authModel.testDevelopementDB(req.body)

    const doc = new Document({
      creator: 'Clippy',
      title: 'Sample Document',
      description: 'A brief example of using docx',
      styles: {
        paragraphStyles: [
          {
            id: 'myWonkyStyle',
            name: 'My Wonky Style',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              italics: true,
              color: '999999',
            },
            paragraph: {
              spacing: {
                line: 276,
              },
              indent: {
                left: 720,
              },
            },
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 26,
              bold: true,
              color: '999999',
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
        ],
      },

      sections: [
        {
          properties: {
            page: {
              pageNumbers: {
                start: 1,
                formatType: NumberFormat.DECIMAL,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun('Foo Bar corp. '),
                    new TextRun({
                      children: ['Page Number ', PageNumber.CURRENT],
                    }),
                    new TextRun({
                      children: [' to ', PageNumber.TOTAL_PAGES],
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun('Foo Bar corp. '),
                    new TextRun({
                      children: ['Page Number: ', PageNumber.CURRENT],
                    }),
                    new TextRun({
                      children: [' to ', PageNumber.TOTAL_PAGES],
                    }),
                  ],
                }),
              ],
            }),
          },

          children: [
            new Paragraph({
              children: [new TextRun('Hello World 1'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 2'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 3'), new PageBreak()],
            }),
            new Paragraph({
              children: [new TextRun('Hello World 4'), new PageBreak()],
            }),
            new Paragraph({
              style: 'strikeUnderline',
              children: [
                new TextRun({
                  scale: 50,
                  text: 'Hello World 5',
                }),
                new PageBreak(),
              ],
            }),
            new Table({
              rows: [
                new TableRow({
                  tableHeader: true,
                  cantSplit: true,
                  children: [
                    new TableCell({
                      width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph('hello')],
                    }),
                  ],
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.DASH_DOT_STROKED,
                  size: 1,
                  color: 'ff0000',
                },
                bottom: {
                  style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                  size: 5,
                  color: '889900',
                },
              },
            }),
            new Paragraph({
              text: 'Bullet points',
              bullet: {
                level: 0, // How deep you want the bullet to be. Maximum level is 9
              },
            }),
            new Paragraph({
              text: 'Are awesome',
              bullet: {
                level: 0,
              },
            }),
            // new TextRun('Chapter 1 can be seen on page '),
            // new PageReference('anchorForChapter1'),

            new Paragraph({
              children: [
                new ImageRun({
                  data: fs.readFileSync('./uploads/images/firma_empresa.png'),
                  transformation: {
                    width: 100,
                    height: 100,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: HorizontalPositionRelativeFrom.RIGHT_MARGIN,
                      offset: 1014400,
                    },
                    verticalPosition: {
                      relative: VerticalPositionRelativeFrom.BOTTOM_MARGIN,
                      offset: 1014400,
                    },
                  },
                  altText: {
                    title: 'This is an ultimate title',
                    description: 'This is an ultimate image',
                    name: 'My Ultimate Image',
                  },
                }),
                new TextRun({
                  text: 'break',
                  break: 3,
                }),
                new TextRun({
                  text: 'Foo Bar',
                  bold: true,
                  underline: {
                    type: UnderlineType.DOUBLE,
                    color: '990011',
                  },
                }),
                new TextRun({
                  text: '\tGithub is the best',
                  bold: true,
                }),
              ],
            }),

            // new Paragraph({
            //   frame: {
            //     position: {
            //       x: 1000,
            //       y: 3000,
            //     },
            //     width: 4000,
            //     height: 1000,
            //     anchor: {
            //       horizontal: FrameAnchorType.MARGIN,
            //       vertical: FrameAnchorType.MARGIN,
            //     },
            //     alignment: {
            //       x: HorizontalPositionAlign.CENTER,
            //       y: VerticalPositionAlign.TOP,
            //     },
            //   },
            //   border: {
            //     top: {
            //       color: 'auto',
            //       space: 1,
            //       style: BorderStyle.SINGLE,
            //       size: 6,
            //     },
            //     bottom: {
            //       color: 'auto',
            //       space: 1,
            //       style: BorderStyle.SINGLE,
            //       size: 6,
            //     },
            //     left: {
            //       color: 'auto',
            //       space: 1,
            //       style: BorderStyle.SINGLE,
            //       size: 6,
            //     },
            //     right: {
            //       color: 'auto',
            //       space: 1,
            //       style: BorderStyle.SINGLE,
            //       size: 6,
            //     },
            //   },
            //   children: [
            //     new TextRun('Hello World'),
            //     new TextRun({
            //       text: 'Foo Bar',
            //       bold: true,
            //     }),
            //     new TextRun({
            //       text: '\tGithub is the best',
            //       bold: true,
            //     }),
            //   ],
            // }),
          ],
        },
      ],
    });

    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync('My Document.docx', buffer);
    });

    return res.status(200).json({ ok: true, mensaje: 'Todo ok' });

    // Packer.toBlob(doc).then((blob) => {
    //   console.log(blob)
    //   saveAs(blob, 'example.docx')
    //   console.log('Document created successfully')
    // })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, mensaje: 'Ha ocurrido un error login: ', error });
  }
};

export const restablecerPassword = async (req: Request, res: Response) => {
  try {
    const result = await authModel.restablecerPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error restablecerPassword: ',
      error,
    });
  }
};

//VALIDAR LA CONTRASEÑA
const validarPassword = async function (
  password: string,
  passwordBBDD: string
): Promise<boolean> {
  return await bcrypt.compare(password, passwordBBDD);
};
