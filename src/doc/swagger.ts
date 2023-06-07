import swaggerJSDoc,
{ OAS3Definition, OAS3Options } 
 from "swagger-jsdoc";

 

 
 const swaggerDefinition: OAS3Definition = {
	 
	 openapi: "3.0.0",
	 info: {
		title: "DOCUMENTACION API GUTIERREZ DE MATA",
		description: "Api de consutla de los diferentes endPoints asi como la estructura de la aplicación de gestión de clientes de la empresa Gutierrez de Mata",
		version: "1.0.0",
		contact: {
			email: "developer@emprendim.com",
		}
	 },
	 externalDocs: {
		url: "https://gutierrez.com",
		description: "Documentación de la API"
	},
	 servers: [
		 {
		 url: 'https://gutierrezmata.server-cistec.es/api',
		 }
	 ],
	
	 components: {
		securitySchemes: {
			bearerAuth: {
				type: "apiKey",
				name: "auth-token",
				scheme: "bearer",
				in: "header"
			  }
		},
		 
		schemas: {
			UserLogin: {
				type: "object",
				required: [ "usuario", "password"],
				properties: {
					usuario:{
						type: "string",
						description: "Nombre de usuario"
					},
					password: {
						type: "string",
						description: "Password de usuario"
					}
				}
			},
			//Articulos
			Articulos: {
				type: "object",
				properties: {
					id_articulo:{
						type: "integer",
						description: "Id del articulo"
					},
					article:{
						type: "string",
						description: "Nombre del Articulo"
					},
					codigoArt:{
						type: "integer",
						description: "Código del articulo"
					},
					descripcion:{
						type: "string",
						description: "Descripcion del articulo"
					},
					codigoTaric:{
						type: "integer",
						description: "Cdigo ARIC del articulo"
					},
					peso:{
						type: "integer",
						description: "Peso del articulo (Kg.)"
					},
					medida:{
						type: "string",
						description: "Alto x Ancho x Largo (cm.)"
					},
					calidad:{
						type: "string",
						description: "Calidad de aleacion del articulo"
					},
					diametro:{
						type: "number",
						description: "diametro del articulo (mm.)"
					}
					,
					id_padre:{
						type: "number",
						description: "id de la familia a la que pertenece el articulo"
					}
					,
					familia:{
						type: "string",
						description: "familia a la que pertenece el articulo"
					}
				}	
			},
			guardaraArticuloResp:{
				type: "object",
				properties: {
					ok: {
						type: "boolean",
						description: true	
					},
					id:{
						type: "integer",
						description: "id del articulo"
					}
				}	
				
			},
			guardarArticulo: {
				type: "object",
				properties: {
					codigo:{
						type: "integer",
						description: "codigo del articulo"
					},
					descripcion:{
						type: "string",
						description: "descripcion del articulo"
					},
					taric:{
						type: "number",
						description: "Codigo taric del articulo"
					},
					peso:{
						type: "number",
						description: "Peso (Kg) del articulo"
					},
					id_padre:{
						type: "number",
						description: "did de la familia del articulo"
					},
					medida:{
						type: "string",
						description: "Medida del articulo"
					},
					calidad:{
						type: "string",
						description: "calidad del articulo"
					},
					diametro:{
						type: "number",
						description: "diametro del articulo (mm)"
					}
				}	
			},
			Familias: {
				type: "object",
				required: true,
				properties: {
					id_padre:{
						type: "integer",
						description: "Id del padre"
					},
					familia:{
						type: "string",
						description: "Nombre de la familia"
					}
				}	
			},
			//Proveedores
			Proveedores:{
				type:"object",
				properties: {
					id_provider:{
						type: "integer",
						description: "Id del proveedor"
					},
					name_provider:{
						type: "string",
						description: "Nombre del proveedor"
					},
					id_city:{
						type: "integer",
						description: "Id de la ciudad"
					},
					name_city:{
						type: "string",
						description: "Nombre de la ciudad"
					},
					id_province:{
						type: "integer",
						description: "Id de la provincia"
					},
					name_province:{
						type: "string",
						description: "Nombre de la provincia"
					},
					id_country:{
						type: "integer",
						description: "Id del pais"
					},
					name_country:{
						type: "string",
						description: "Nombre del pais"
					},
					id_familia:{
						type: "integer",
						description: "Id de la familia"
					},
					name_familia:{
						type: "string",
						description: "Nombre de la familia"
					},
					address:{
						type: "string",
						description: "Dirección del proveedor"
					}, 
					phone:{
						type: "integer",
						description: "Numero de telefono"//preguntar
					},
					contact_person:{
						type: "integer",
						description: "Contacto del proveedor"
					},
					contact_phone:{
						type: "integer",
						description: "Numero de telefono"//preguntar
					},
					contact_email:{
						type: "string",
						description: "Correo electrónico"
					},
					iso_9001:{
						type: "string",//preguntar
						description: "Iso_9001"
					},
					iso_14001:{
						type: "string",//preguntar
						description: "Iso_14001"
					}, 
					marked_ce:{
						type: "string",//preguntar
						description: "Marcado CE"
					},
					id_payment_conditions:{
						type: "integer",
						description: "Id de las condiciones de pago"//preguntar
					},
					payment_conditions:{
						type: "string",//preguntar
						description: "Condiciones de pago"//preguntar
					},
					observations:{
						type: "string",
						description: "Observaciones"
					},
					img:{
						type: "string",//preguntar
						description: "Logo"
					},
					number_code:{
						type: "string",
						description: "Numero del codigo"
					},
					postal_code:{
						type: "integer",
						description: "Codigo postal"
					},
					last_evaluation:{
						type: "string",//preguntar
						description:"Ultima fecha"
					},
					value_avg:{
						type: "string",//preguntar
						description:"Promedio"//preguntar
					},
					conformities:{
						type: "string",
						description: "Conformidades"
					}
				}
			},
			proveedoresFamilia:{
				type:"object",
				properties: {
					id_family:{
						type: "integer",
						description: "Id del proveedor familia"//preguntar
					},
					name_family:{
						type:"string",
						description: "Nombre del proveedor familia"//preguntar
					}
				}
			},
			condicionespago:{
				type:"object",
				properties: {
					id:{
						type: "integer",
						description: "Id del pago del proveedor"//preguntar y sobre el id_pagopreovedor
					},
					name:{
						type:"string",
						description: "Nombre del pago del proveedor"//preguntar
					}
				}
			},
			guardaproveedor:{
				type:"object",
				properties: {
					id_proveedor_familia:{
						type: "integer",
						description: "Id del proveedor familia"
					},
					numero:{
						type: "string",
						description: "Nombre del proveedor"
					},
					proveedor:{
						type: "string",
						description: "Proveedor"
					},
					logo:{
						type: "string",
						description: "Logo"
					},
					direccion:{
						type: "string",
						description: "Direccion"
					},
					cp:{
						type: "integer",
						description: "Codigo postal"
					},
					ciudad:{
						type: "string",
						description: "Ciudad"
					},
					provincia:{
						type: "string",
						description: "Provicia"
					},
					pais:{
						type: "string",
						description: "Nombre del pais"
					},
					telefono:{
						type: "string",
						description: "Nombre de la familia"
					},
					contacto:{
						type: "string",
						description: "Dirección del proveedor"
					}, 
					email_contacto:{
						type: "string",
						description: "Numero de telefono"//preguntar
					},
					telefono_contacto:{
						type: "integer",
						description: "Telefono de contacto"
					},
					ISO9001:{
						type: "string",//preguntar
						description: "Iso_9001"
					},
					ISO14001:{
						type: "string",//preguntar
						description: "Iso_14001"
					}, 
					marcado_CE:{
						type: "string",//preguntar
						description: "Marcado CE"
					},
					condiciones_pago:{
						type: "string",//preguntar
						description: "Condiciones de pago"//preguntar
					},
					observaciones:{
						type: "string",
						description: "Observaciones"
					}
					
				}
			},
			proveedor_update:{
				type:"object",
				properties: {
					id_proveedor_familia:{
						type: "integer",
						description: "Id de la familia proveedor"
					},
					numero:{
						type: "integer",
						description: "Codigo"
					},
					proveedor:{
						type: "string",
						description: "Nombre del proveedor"
					},
					direccion:{
						type: "string",
						description: "Direccion"
					},
					cp:{
						type: "integer",
						description: "Codigo postal"
					},
					ciudad:{
						type: "string",
						description: "Nombre de la ciudad"
					},
					provincia:{
						type: "string",
						description: "Nombre de la provincia"
					},
					pais:{
						type: "string",
						description: "Nombre del pais"
					},
					telefono:{
						type: "integer",
						description: "Telefono"
					},
					contacto:{//preguntar
						type: "integer",
						description: "Contacto del proveedor"
					},
					email_contacto:{
						type: "string",
						description: "Correo electrónico"
					},
					telefono_contacto:{
						type: "integer",
						description: "Numero de telefono"//preguntar
					},
					ISO9001:{
						type: "string",//preguntar
						description: "Iso_9001"
					},
					ISO14001:{
						type: "string",//preguntar
						description: "Iso_14001"
					}, 
					marcado_CE:{
						type: "string",//preguntar
						description: "Marcado CE"
					},
					condiciones_pago:{
						type: "integer",
						description: "Id de las condiciones de pago"//preguntar
					},
					observaciones:{
						type: "string",
						description: "Observaciones"
					}
				}
			},
			guardaImagen:{
				type: "object",
				properties: {
					logo: {
						type: "string",
						description: "Logo"
					},
					id_proveedor:{
						type: "integer",
						description: "id del proveedor"
					}
				}	
			},
			evaluacionProveedor:{
				type: "object",
				properties: {
					quality: {
						type: "string",
						description: "Calidad"
					},
					celerity:{
						type: "string",
						description: "celeridad"
					},
					price: {
						type: "double",
						description: "precio"
					},
					delivery_time:{
						type: "integer",
						description: "Plazo entrega"
					},
					treat: {
						type: "string",
						description: "Trato"
					},
					avg:{
						type: "integer",
						description: "Promedio"
					},
					date: {
						type: "string",
						description: "Fecha"
					}
					
				}	
			},
			guardaEvaluacionProveedor:{
				type: "object",
				properties: {
					id_provoder:{//preguntar
						type: "integer",
						description: "Id del proveedor"
					},
					calidad: {
						type: "string",
						description: "Calidad"
					},
					celeridad:{
						type: "string",
						description: "celeridad"
					},
					precio: {
						type: "double",
						description: "precio"
					},
					plazo_entrega:{
						type: "integer",
						description: "Plazo entrega"
					},
					trato: {
						type: "string",
						description: "Trato"
					},
					promedio:{
						type: "integer",
						description: "Promedio"
					}
				}	
			},
			//Shipping
			guardaEnvio:{
				type: "object",
				properties: {
					id_pedido:{
						type: "integer",
						description: "Id del pedido"
					},
					id_proveedor:{
						type: "integer",
						description: "Id del proveedor"
					},
					chofer:{
						type: "string",
						description: "Conductor"
					},
					telefono_chofer:{
						type: "integer",
						description: "Numero de telefono del conductor"
					},
					direccion_envio:{
						type: "string",
						description: "Direccion del envio"
					},
					target_tte:{
						type: "string",
						description: "Destino"//preguntar
					},
					portes:{ //preguntar
						type: "integer",
						description: "Portes"
					},
					matricula_camion:{
						type: "integer",
						description: "Numero de registro"
					},
					valor_portes:{
						type: "integer",
						description: "Valor de portes"
					},
					volumen:{
						type: "integer",
						description: "Volumen"
					}
				}	
			},			
			updateEnvio:{//pregunta
				type: "object",
				properties: {
					id_proveedor: {
						type: "integer",
						description: "Id del proveedor"
					},
					chofer:{
						type: "string",
						description: "Conductor"
					},
					telefono_chofer:{
						type:"integer",
						description:"Numero de telefono del conductor"
					},
					direccion_envio:{
						type:"string",
						description:"Direccion del envio"
					},
					target_tte:{
						type: "string",
						description: "Destino"//preguntar
					},
					portes:{ //preguntar
						type: "integer",
						description: "Portes"
					},
					matricula_camion:{
						type: "integer",
						description: "Numero de registro"
					},
					valor_portes:{
						type: "integer",
						description: "Valor de portes"
					},
					volumen:{
						type: "integer",
						description: "Volumen"
					}
				},
					
			},
			Envio:{
				type: "object",
				properties: {
					id_shipping:{
						type: "integer",
						description: "Id del envio"
					},
					id_order:{
						type: "integer",
						description: "Id del pedido"
					},
					id_provider: {
						type: "integer",
						description: "Id del proveedor"
					},
					name_provider:{
						type: "string",
						description: "Nombre del proveedor"
					},
					number_code:{
						type: "integer",
						description: "Codigo"
					},
					driver:{
						type: "string",
						description: "Conductor"
					},
					phone_driver:{
						type: "integer",
						description: "Numero del conductor"
					},
					address_shipping:{
						type:"string",
						description:"Direccion del envio"
					},
					target_tte:{
						type: "string",
						description: "Destino"//preguntar
					},
					portes:{ //preguntar
						type: "integer",
						description: "Portes"
					},
					registration_number:{
						type: "string",
						description: "Numero de matricula"
					},
					value_portes:{
						type: "integer",
						description: "Valor de portes"
					},
					volume:{
						type: "integer",
						description: "Volumen"
					}
				}	
			},
			//Countries
			Pais:{
				type: "object",
				properties: {
					id_country:{
						type: "integer",
						description: "Id del pais"
					},
					name_country:{
						type: "string",
						description: "Nombre del pais"
					},
					abbreviation:{
						type: "string",
						description: "Abreviatura"
					}
				}	
			},
			guardaPais:{
				type: "object",
				properties: {
					nombre:{
						type: "string",
						description: "Nombre del pais"
					},
					abreviatura:{
						type: "string",
						description: "Abreviatura"
					}
				}	
			},
			updatePais:{//pregunta
				type: "object",
				properties: {
					nombre:{
						type: "string",
						description: "Nombre del pais"
					},
					abreviatura:{
						type: "string",
						description: "Abreviatura"
					}
				}
			},
			//Provinces
			Provincia:{
				type: "object",
				properties: {
					name_province:{
						type: "string",
						description: "Nombre de la provincia"
					},
					id_province:{
						type: "integer",
						description: "Id de la provincia"
					},
					name_country:{
						type: "string",
						description: "Nombre del pais"
					},
					id_country:{
						type: "integer",
						description: "Id del pais"
					},
					abbreviation:{
						type: "string",
						description: "Abreviatura"
					}
				}	
			},
			Provincia_por_pais:{
				type: "object",
				properties: {
					name_province:{
						type: "string",
						description: "Nombre de la provincia"
					},
					id_province:{
						type: "integer",
						description: "Id de la provincia"
					}
				}
			},
			guardaProvincia:{
				type: "object",
				properties: {
					nombre:{
						type: "string",
						description: "Nombre de la provincia"
					},
					id_pais:{
						type: "integer",
						description: "Id del pais"
					}
				}
			},
			updateProvincia:{//pregunta
				type: "object",
				properties: {
					nombre:{
						type: "string",
						description: "Nombre de la provincia"
					},
					id_pais:{
						type: "integer",
						description: "Id del pais"
					}
				}
			},
			//City
			Ciudad:{
				type: "object",
				properties: {
					name_city:{
						type: "string",
						description: "Nombre de la ciudad"
					},
					id_city:{
						type: "integer",
						description: "Id de la ciudad"
					},
					name_province:{
						type: "string",
						description: "Nombre de la provincia"
					},
					id_province:{
						type: "integer",
						description: "Id de la provincia"
					},
					name_country:{
						type: "string",
						description: "Nombre del pais"
					},
					id_country:{
						type: "integer",
						description: "Id del pais"
					},
					abbreviation:{
						type: "string",
						description: "Abreviatura"
					}
				}	
			},
			Ciudad_por_provincia:{
				type: "object",
				properties: {
					name_city:{
						type: "string",
						description: "Nombre de la ciudad"
					},
					id_city:{
						type: "integer",
						description: "Id de la ciudad"
					}
				}
			},
			guardaCiudad:{
				type: "object",
				properties: {
					nombre:{
						type: "string",
						description: "Nombre de la ciudad"
					},
					id_provincia:{
						type: "integer",
						description: "Id de la provincia"
					}
				}
			},
			updateCiudad:{
				type: "object",
				properties: {
					nombre:{
						type: "string",
						description: "Nombre de la ciudad"
					},
					id_provincia:{
						type: "integer",
						description: "Id de la provincia"
					}
				}
			},
			//user
			Usuarios:{
				type: "object",
				properties: {
					id:{
						type: "integer",
						description: "Id del usuario"
					},
					name:{
						type: "string",
						description: "Nombre de la persona"
					},
					last_name:{
						type: "string",
						description: "Apellido de la persona"
					},
					full_name:{
						type: "string",
						description:"Nombre y apellido"
					},
					email:{
						type: "string",
						description: "Correo electronico del usuario"
					},
					role:{
						type: "string",
						description: "Roles del usuario"
					},
					user:{
						type: "string",
						description:"Nombre de usuario"
					},
					img:{
						type: "string",
						description: "Imagen del usuario"
					},
					status:{
						type: "string",
						description:"Estado del usuario"
					}
				}
			},
			guardaUsuarios:{
				type: "object",
				properties: {
					usuario:{
						type: "string",
						description:"Nombre de usuario"
					},
					nombre:{
						type: "string",
						description: "Nombre de la persona"
					},
					apellido:{
						type: "string",
						description: "Apellido de la persona"
					},
					password:{
						type: "string",
						description:"Contraseña"
					},
					role:{
						type: "string",
						description: "Roles del usuario"
					},
					email:{
						type: "string",
						description: "Correo electronico del usuario"
					},
					img:{
						type: "string",
						description: "Imagen del usuario"
					},
					estado:{
						type: "string",
						description:"Estado del usuario"
					}
				}
			},
			updateUsuarios:{
				type: "object",
				properties: {
					usuario:{
						type: "string",
						description:"Nombre de usuario"
					},
					nombre:{
						type: "string",
						description: "Nombre de la persona"
					},
					apellido:{
						type: "string",
						description: "Apellido de la persona"
					},
					email:{
						type: "string",
						description: "Correo electronico del usuario"
					},
					estado:{
						type: "string",
						description:"Estado del usuario"
					}
				}
			},
			updateEstado:{//preguntar
				type: "object",
				properties: {
					estado:{
						type: "string",
						description:"Estado del usuario"
					},
					id_usuario:{
						type: "integer",
						description:"Id del usuario"
					}
				}
			},
			guardaImagenUsuario:{//preguntar
				type: "object",
				properties: {
					img:{
						type: "string",
						description:"Imagen del usuario"
					},
					id_usuario:{
						type: "integer",
						description:"Id del usuario"
					}
				}
			},
			//User configuration
			Modulos:{
				type: "object",
				properties: {
					id:{
						type: "integer",
						description:"Id del modulo"
					},
					name:{
						type: "string",
						description:"Nombre del modulo"
					}
				}
			},
			Submodulos:{//preguntar
				type: "object",
				properties: {
					id:{
						type: "integer",
						description:"Id del submodulo"
					},
					name:{
						type: "string",
						description:"Nombre del submodulo"
					},
					id_modulo:{
						type: "integer",
						description:"Id del modulo"
					}
				}
			},
			configuracionUsuario:{//preguntar
				type: "object",
				properties: {
					id:{
						type: "integer",
						description:"Id de los modulos por usuario"
					},
					module:{
						type: "string",
						description:"Nombre del modulo"
					},
					user_name:{
						type: "integer",
						description:"Nombre del usuario"
					},
					role:{
						type: "string",
						description:"Rol que tiene el usuario"
					},
					module_id:{
						type: "integer",
						description:"Id del modulo"
					},
					user_id:{
						type: "integer",
						description:"Id del usuario"
					},
					img:{
						type: "string",
						description:"Imagen del usuario"
					},
					submodule:{
						type: "integer",
						description:"Nombre del submodulo"
					},
					submodule_id:{
						type: "integer",
						description:"Id del submodulo"
					}
				}
			},
			guardaConfiguracionUsuario:{//preguntar
				type: "object",
				properties: {
					id_usuario:{
						type: "integer",
						description:"Id del usuario"
					},
					id_modulo:{
						type: "integer",
						description:"Id del modulo"
					},
					id_submodulo:{
						type: "integer",
						description:"Id del submodulo"
					}
				}
			},
			BorraConfiguracionUsuario:{//preguntar
				type: "object",
				properties: {
					id_usuario:{
						type: "integer",
						description:"Id del usuario"
					},
					id_modulo:{
						type: "integer",
						description:"Id del modulo"
					},
					id_submodulo:{
						type: "integer",
						description:"Id del submodulo"
					}
				}
			},
			//Cliente
			Clientes:{//Preguntar
				type: "object",
				properties: {
					client:{//preguntar
						type: "string",
						description:"Nombre del cliente"
					},
					id_client:{
						type: "integer",
						description:"Id del cliente"
					},
					name_company:{
						type: "string",
						description:"Nombre de la empresa"
					},
					code_company:{
						type: "integer",
						description:"Codigo empresa"
					},
					address:{
						type: "string",
						description:"Direccion"
					},
					id_city:{
						type: "integer",
						description:"Id de la ciudad"
					},
					name_city:{
						type: "string",
						description:"Nombre de la ciudad"
					},
					id_province:{
						type: "integer",
						description:"Id de la provincia"
					},
					name_province:{
						type: "string",
						description:"Nombre de la provincia"
					},
					id_country:{
						type: "integer",
						description:"Id del pais"
					},
					name_country:{
						type: "string",
						description:"Nombre del pais"
					},
					phone:{
						type: "integer",
						description:"Numero de telefono"
					},
					email:{
						type: "string",
						description:"Correo electronico"
					},
					postal_code:{
						type: "integer",
						description:"Codigo postal"
					},
					commercial_phone:{
						type: "integer",
						description:"Numero de telefono comercial"
					},
					comercial_name:{
						type: "string",
						description:"Nombre comercial"
					},
					comercial_observation:{
						type: "string",
						description:"Observaciones comerciales"
					},
					cif:{
						type: "integer",
						description:"CIF de la empresa"
					},
					fax:{
						type: "string",
						description:"FAX"
					},
					current_account:{//preguntar
						type: "string",
						description:"cuenta corriente"
					},
					id_payment_type:{
						type: "integer",
						description:"Id del tipo de pago"
					},
					payment_type:{
						type: "string",
						description:"Descripcion del tipo de pago"
					},
					observation:{
						type: "string",
						description:"Observaciones"
					},
					distance:{//preguntar
						type: "integer",
						description:"Distancia"
					},
					duration:{//preguntar
						type: "string",
						description:"Duracion"
					},
					lat:{//preguntar
						type: "string",
						description:"Latitud"
					},
					lng:{//preguntar
						type: "string",
						description:"Longitud"
					},
				}
			},
			Pagos:{
				type: "object",
				properties: {
					id:{
						type: "integer",
						description:"Id del pago"
					},
					name:{
						type: "string",
						description:"Tipo de pago"
					}
				}
			},
			guardaClientes:{//Preguntar
				type: "object",
				properties: {
					nombre_empresa:{
						type: "string",
						description:"Nombre de la empresa"
					},
					cif:{
						type: "integer",
						description:"CIF de la empresa"
					},
					direccion:{
						type: "string",
						description:"Direccion"
					},
					cp:{
						type: "integer",
						description:"Codigo postal"
					},
					provincia:{
						type: "string",
						description:"Nombre de la provincia"
					},
					ciudad:{
						type: "string",
						description:"Nombre de la ciudad"
					},
					pais:{
						type: "string",
						description:"Nombre del pais"
					},
					telefono:{
						type: "integer",
						description:"Numero de telefono"
					},
					fax:{
						type: "string",
						description:"FAX"
					},
					telefono_comercial:{
						type: "integer",
						description:"Numero de telefono comercial"
					},
					nombre_comercial:{
						type: "string",
						description:"Nombre comercial"
					},
					observacions_comerciales:{
						type: "string",
						description:"Observaciones comerciales"
					},
					email:{
						type: "string",
						description:"Correo electronico"
					},
					codigo_empresa:{//preguntar
						type: "integer",
						description:"codigo_empresa"
					},
					id_tipoPago:{
						type: "integer",
						description:"Id del tipo de pago"
					},
					cc:{//preguntar
						type: "string",
						description:"cuenta corriente"
					},
					observation:{
						type: "string",
						description:"Observaciones"
					}
				}
			},
			updateClientes:{//Preguntar
				type: "object",
				properties: {
					nombre_empresa:{
						type: "string",
						description:"Nombre de la empresa"
					},
					cif:{
						type: "integer",
						description:"CIF de la empresa"
					},
					direccion:{
						type: "string",
						description:"Direccion"
					},
					cp:{
						type: "integer",
						description:"Codigo postal"
					},
					provincia:{
						type: "string",
						description:"Nombre de la provincia"
					},
					ciudad:{
						type: "string",
						description:"Nombre de la ciudad"
					},
					pais:{
						type: "string",
						description:"Nombre del pais"
					},
					telefono:{
						type: "integer",
						description:"Numero de telefono"
					},
					fax:{
						type: "string",
						description:"FAX"
					},
					telefono_comercial:{
						type: "integer",
						description:"Numero de telefono comercial"
					},
					nombre_comercial:{
						type: "string",
						description:"Nombre comercial"
					},
					observacions_comerciales:{
						type: "string",
						description:"Observaciones comerciales"
					},
					email:{
						type: "string",
						description:"Correo electronico"
					},
					codigo_empresa:{//preguntar
						type: "integer",
						description:"codigo_empresa"
					},
					id_tipoPago:{
						type: "integer",
						description:"Id del tipo de pago"
					},
					distancia:{//preguntar
						type: "integer",
						description:"Distancia"
					},
					duracion:{//preguntar
						type: "string",
						description:"Duracion"
					},
					lat:{//preguntar
						type: "string",
						description:"Latitud"
					},
					lng:{//preguntar
						type: "string",
						description:"Longitud"
					}
				}
			},
			archivoClientes:{//Preguntar
				type: "object",
				properties: {
					date_create:{
						type: "string",
						description:"Fecha creacion"
					},
					status:{
						type: "string",
						description:"Estado del archivo"
					},
					filename:{
						type: "string",
						description:"Archivo"
					}
				}
			},
			updateArchivoClientes:{//Preguntar
				type: "object",
				properties: {
					id_pedido:{
						type: "integer",
						description:"Id del pedido"
					},
					id_estado:{
						type: "integer",
						description:"Id del estado del archivo"
					},
					archivo:{
						type: "string",
						description:"Archivo"
					}
				}
			},
			updateOtraDireccion:{
				type: "object",
				properties: {
					id_cliente:{
						type: "integer",
						description:"Id del cliente"
					},
					id_pais:{
						type: "integer",
						description:"Id del pais"
					},
					id_provincia:{
						type: "integer",
						description:"Id de la provincia"
					},
					id_ciudad:{
						type: "integer",
						description:"Id de la ciudad"
					},
					cp:{
						type: "integer",
						description:"Codigo postal"
					},
					direccion:{
						type: "string",
						description:"Direccion"
					},
					id_direcciones_cliente
					:{
						type: "integer",
						description:"Id de la direccion"
					}
				}
			},
			OtraDireccionCliente:{
				type: "object",
				properties: {
					id_other_address:{
						type: "integer",
						description:"Id de las direcciones del cliente"
					},
					id_cliente:{
						type: "integer",
						description:"Id del cliente"
					},
					id_city:{
						type: "integer",
						description:"Id de la ciudad"
					},
					name_city:{
						type: "string",
						description:"Nombre de la ciudad"
					},
					id_province:{
						type: "integer",
						description:"Id de la provincia"
					},
					name_province:{
						type: "string",
						description:"Nombre de la provincia"
					},
					id_country:{
						type: "integer",
						description:"Id del pais"
					},
					name_country:{
						type: "string",
						description:"Nombre del pais"
					},
					postal_code:{
						type: "integer",
						description:"Codigo postal"
					},
					address:{
						type: "string",
						description:"Direccion"
					},
				}
			},
			updateGeolocalizacion:{//Preguntar
				type: "object",
				properties: {
					distancia:{//preguntar
						type: "integer",
						description:"Distancia"
					},
					duracion:{//preguntar
						type: "string",
						description:"Duracion"
					},
					lat:{//preguntar
						type: "string",
						description:"Latitud"
					},
					lng:{//preguntar
						type: "string",
						description:"Longitud"
					},
				}
			},
			guardaCoordenadas:{//Preguntar
				type: "object",
				properties: {
					id_cliente:{
						type: "integer",
						description:"Id del cliente"
					},
					coordenadas:{//preguntar
						type: "string",
						description:"Coordenadas"
					}
				}
			},
			obtenCoordenadasCliente:{//Preguntar
				type: "object",
				properties: {
					id:{
						type: "integer",
						description:"Id de las coordenadas de los clientes"
					},
					id_client:{
						type: "integer",
						description:"Id del cliente"
					},
					coords:{//preguntar
						type: "string",
						description:"Coordenadas"
					}
				}
			},
			//Autorizacion
			noAutorizado: {
				type: "object",
				properties: {
					ok: {
						type: "boolean",
						description: "false",
						default: false
					},
					error: {
						type: "string",
						default: "No autorizado"
					}
				}
			}
		}
	 }
	
 };
 
 const swaggerOptions: OAS3Options = {
	 swaggerDefinition,
	 apis: ["./src/routes/*.ts"]
 };
 
 export default swaggerJSDoc(swaggerOptions);