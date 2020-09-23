const { io } = require('../server');

const {Usuarios} = require('../clases/usuarios');

const {crearMensaje} = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

     client.on('entrarChat', (data, callback) =>{
         
         if ( !data.nombre || !data.sala){
             return callback({
                 error: true,
                 mensaje: 'El nombre/sala es necesario'
             });
         }

         //unimos usuario a la sala
         client.join(data.sala);
         let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        //cambiamos la emision, de avisar a todos, a sólo los de la misma sala cuando alguien entre
        //  client.broadcast.emit('listaPersona', usuarios.getPersonas() );
         client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala) );

        callback(personas);
     });

    client.on('crearMensaje', (data)=>{
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        //cambioamos a quien avisamos en la sala cuando alguien entra
        // client.broadcast.emit('crearMensaje', mensaje);
         client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
         
    });


    client.on('disconnect', ()=>{
        
        let personaBorrada = usuarios.borrarPersona( client.id);

        //modificacion para avisar solo a las personas de la misma sala
        // client.broadcast.emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        // client.broadcast.emit('listaPersona', usuarios.getPersonas() );

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala) );
    });

    //Mensajes provados
    client.on('mensajePrivado', data =>{

        let persona = usuarios.getPersona(client.id);

        //super importante: el .to() con la data.para
         client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje) );

    });
   

});