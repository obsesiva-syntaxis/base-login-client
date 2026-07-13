import { useMemo } from 'react';
import Table from '../../components/Table';
import type { Column } from '../../components/Table/TableContext';
import './AdministrarPage.scss';

const USUARIOS_MOCK = [
  { nombre: 'Carlos Mendoza', email: 'carlos@empresa.com', rol: 'Admin', estado: 'Activo', ultimoAcceso: '12/07/2026' },
  { nombre: 'María López', email: 'maria@empresa.com', rol: 'Editor', estado: 'Activo', ultimoAcceso: '11/07/2026' },
  { nombre: 'Juan Pérez', email: 'juan@empresa.com', rol: 'Usuario', estado: 'Inactivo', ultimoAcceso: '05/06/2026' },
  { nombre: 'Ana García', email: 'ana@empresa.com', rol: 'Usuario', estado: 'Activo', ultimoAcceso: '13/07/2026' },
  { nombre: 'Roberto Silva', email: 'roberto@empresa.com', rol: 'Editor', estado: 'Activo', ultimoAcceso: '10/07/2026' },
  { nombre: 'Laura Torres', email: 'laura@empresa.com', rol: 'Usuario', estado: 'Activo', ultimoAcceso: '09/07/2026' },
  { nombre: 'Diego Ramírez', email: 'diego@empresa.com', rol: 'Usuario', estado: 'Inactivo', ultimoAcceso: '01/05/2026' },
  { nombre: 'Sofía Herrera', email: 'sofia@empresa.com', rol: 'Admin', estado: 'Activo', ultimoAcceso: '13/07/2026' },
  { nombre: 'Miguel Ángel Ruiz', email: 'miguel@empresa.com', rol: 'Editor', estado: 'Activo', ultimoAcceso: '08/07/2026' },
  { nombre: 'Valentina Díaz', email: 'valentina@empresa.com', rol: 'Usuario', estado: 'Activo', ultimoAcceso: '07/07/2026' },
  { nombre: 'Andrés Castro', email: 'andres@empresa.com', rol: 'Usuario', estado: 'Activo', ultimoAcceso: '06/07/2026' },
  { nombre: 'Camila Vargas', email: 'camila@empresa.com', rol: 'Admin', estado: 'Activo', ultimoAcceso: '13/07/2026' },
];

const AdministrarPage = () => {
  const columns = useMemo<Column[]>(() => [
    { key: 'nombre', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'rol', header: 'Rol', sortable: true },
    { key: 'estado', header: 'Estado', sortable: true },
    { key: 'ultimoAcceso', header: 'Último Acceso', sortable: true },
  ], []);

  return (
    <div className="administrar">
      <div className="administrar__header">
        <h1>Administrar Usuarios</h1>
        <span className="administrar__count">{USUARIOS_MOCK.length} usuarios</span>
      </div>
      <Table data={USUARIOS_MOCK} columns={columns} pageSize={8}>
        <Table.Head />
        <Table.Body />
        <Table.Pagination />
      </Table>
    </div>
  );
};

export default AdministrarPage;
