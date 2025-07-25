const formatearNumCelular = (numCelular) => {
    let telcelAux = numCelular.trim();
    return telcelAux;
}

const formatearGenero = (acronimo) => {
    if (acronimo === 'F') {
        return 'FEMENINO';
    } else if (acronimo === 'M') {
        return 'MASCULINO';
    } else {
        return 'INDETERMINADO';
    }
}

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

const addHoursDate = (fechaString) => {
    fecha = new Date(fechaString);
    fecha.addHours(Number(process.env.COUNT_HOURS_TO_ADD));
    return fecha;
}

const addHoursDateActual = () => {
    fecha = new Date();
    fecha.addHours(Number(process.env.COUNT_HOURS_TO_ADD));
    return fecha;
}

//capitalize only the first letter of the string. 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//capitalize all words of a string. 
function capitalizeWords(string) {
    let resultado = texto.replace(/[ao]/g, (match) => {
        if (match === 'a') return 'x';
        if (match === 'o') return 'y';
    });
    console.log(resultado); // "Hyly mxndy"
};


module.exports = {
    formatearNumCelular,
    formatearGenero,
    addHoursDate,
    capitalizeWords,
    addHoursDateActual
}