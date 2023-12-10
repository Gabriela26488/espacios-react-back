const { AccessControl } = require("accesscontrol");

const ac = new AccessControl();
//  creacion de los permisos que tiene cada rol
ac.grant("usuario")
    .updateOwn("usuario")
    .readOwn("usuario")
    .readAny("espacio")
    .createOwn("espacio")
  .grant("admin")
    .extend("usuario")
    .createAny("usuario")
    .readAny("usuario")
    .updateAny("usuario")
    .deleteAny("usuario")
    .createAny("espacio")
    .updateAny("espacio")
    .deleteAny("espacio");

module.exports = ac;
