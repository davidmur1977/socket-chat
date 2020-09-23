

class Usuarios {
   
      constructor() {

        this.personas = [];
      }

      agregarPersona(id, nombre, sala) {
        
        let persona = { id, nombre, sala};

        this.personas.push(persona);

        return this.personas;
       
      }

      getPersona( id) {
          let persona = this.personas.filter(persona =>  persona.id === id)[0];  //esto devuelve un array, asi que devuelvo sólo 1º posición
          return persona;
      }

      getPersonas(){
         return this.personas; 
      }

      getPersonasPorSala(sala){
           let personasEnSala = this.personas.filter(persona =>  persona.sala === sala);

           return personasEnSala;
           
      }

      borrarPersona(id) {

         let personaBorrada = this.getPersona(id);
          this.personas = this.personas.filter(persona => persona.id != id);

          return personaBorrada; //esto lo hacemos para poder decir "tal persona abandonó el chat"
      }


}

module.exports = {
    Usuarios
}

