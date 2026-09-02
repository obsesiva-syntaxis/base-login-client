import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import Table from '../../components/Table';
import TableSkeleton from '../../components/Table/Skeleton';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import type { Column, Action } from '../../components/Table/TableContext';
import type { UserApi } from '../../interfaces/user/user.interface';
import { userService } from '../../services/userService';
import { useUsersStore } from '../../store/usersStore';
import toast from 'react-hot-toast';
import './AdministrarPage.scss';

const PAGE_SIZE = 8;

interface EditUserForm {
  fullname: string;
  email: string;
  roles: string;
  active: boolean;
}

const editSchema = Yup.object({
  fullname: Yup.string().required('Campo requerido'),
  email: Yup.string().email('Email debe ser en un formato válido').required('Campo requerido'),
  roles: Yup.string(),
  active: Yup.boolean(),
});

const AdministrarPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserApi | null>(null);
  const [rowsPhase, setRowsPhase] = useState<'in' | 'out'>('in');

  const users = useUsersStore((state) => state.users);
  const total = useUsersStore((state) => state.total);
  const page = useUsersStore((state) => state.page);
  const loading = useUsersStore((state) => state.loading);
  const error = useUsersStore((state) => state.error);
  const editingUser = useUsersStore((state) => state.editingUser);
  const isEditModalOpen = useUsersStore((state) => state.isEditModalOpen);
  const fetchUsers = useUsersStore((state) => state.fetchUsers);
  const setPage = useUsersStore((state) => state.setPage);
  const startEdit = useUsersStore((state) => state.startEdit);
  const closeEdit = useUsersStore((state) => state.closeEdit);
  const prevLoadingRef = useRef(loading);

  useEffect(() => {
    void fetchUsers(page);
  }, [page, fetchUsers]);

  useEffect(() => {
    if (prevLoadingRef.current === true && loading === false) {
      setRowsPhase('in');
    }
    prevLoadingRef.current = loading;
  }, [loading]);

  const pageTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (pageTimeoutRef.current) clearTimeout(pageTimeoutRef.current);
    };
  }, []);

  const handlePageChange = useCallback((p: number) => {
    if (p === page) return;
    setRowsPhase('out');
    if (pageTimeoutRef.current) clearTimeout(pageTimeoutRef.current);
    pageTimeoutRef.current = setTimeout(() => setPage(p), 300);
  }, [page, setPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo<Column<UserApi>[]>(() => [
    { key: 'fullname', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'roles', header: 'Rol', render: (row) => row.roles.join(', ') },
    { key: 'active', header: 'Estado', render: (row) => row.active ? 'Activo' : 'Inactivo' },
  ], []);

  const handleVer = useCallback((row: UserApi) => {
    console.log('Ver usuario:', row);
  }, []);

  const handleEditar = useCallback((row: UserApi) => {
    startEdit(row);
  }, [startEdit]);

  const handleCloseEditModal = useCallback(() => {
    closeEdit();
  }, [closeEdit]);

  const handleEditSubmit = useCallback(async (values: EditUserForm) => {
    if (!editingUser) return;
    try {
      await userService.update(editingUser.id, {
        fullname: values.fullname,
        email: values.email,
        active: values.active,
        roles: values.roles.split(',').map(r => r.trim()).filter(Boolean),
      });
      toast.success('Usuario actualizado correctamente');
      closeEdit();
      void fetchUsers(page);
    } catch {
      toast.error('Error al actualizar el usuario');
    }
  }, [editingUser, page, closeEdit, fetchUsers]);

  const handleEliminar = useCallback((row: UserApi) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser) return;
    try {
      await userService.delete(selectedUser.id);
      toast.success('Usuario eliminado correctamente');
      void fetchUsers(page);
    } catch {
      toast.error('Error al eliminar el usuario');
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  }, [selectedUser, page, fetchUsers]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const actions = useMemo<Action<UserApi>[]>(() => [
    { icon: '👁', label: 'Ver detalle', onClick: handleVer },
    { icon: '✏️', label: 'Modificar', onClick: handleEditar },
    { icon: '🗑', label: 'Eliminar', variant: 'danger', onClick: handleEliminar },
  ], [handleVer, handleEditar, handleEliminar]);

  return (
    <div className="administrar">
      <div className="administrar__header">
        <h1>Administrar Usuarios</h1>
        {users.length > 0 && <span className="administrar__count">{total} usuarios</span>}
      </div>

      {error && users.length === 0 && (
        <div className="administrar__error">
          {error}
        </div>
      )}

      {users.length === 0 && loading && !error && (
        <TableSkeleton columns={columns.length} rows={PAGE_SIZE} hasActions />
      )}

      {users.length > 0 && (
        <div className={`administrar__table administrar__table--${rowsPhase}`}>
          <Table
            data={users}
            columns={columns}
            pageSize={PAGE_SIZE}
            actions={actions}
            controlled
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            onPageChange={handlePageChange}
          >
            <Table.Head />
            <Table.Body />
            <Table.Pagination />
          </Table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} type="info">
        <Modal.Header title="Confirmar eliminación" />
        <Modal.Body>
          <p>¿Estás seguro de eliminar a <strong>{selectedUser?.fullname}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCloseModal}>Cancelar</button>
          <button onClick={handleConfirmDelete} style={{ color: 'red' }}>Confirmar</button>
        </Modal.Footer>
      </Modal>

      {isEditModalOpen && editingUser && (
        <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} type="form">
          <Formik
            initialValues={{
              fullname: editingUser.fullname,
              email: editingUser.email,
              roles: editingUser.roles.join(', '),
              active: editingUser.active,
            }}
            onSubmit={handleEditSubmit}
            validationSchema={editSchema}
          >
            {({ isSubmitting }) => (
              <Form>
                <Modal.Header title={`Editar usuario: ${editingUser.fullname}`} />
                <Modal.Body>
                  <div className="administrar__form">
                    <div className="administrar__form-group">
                      <label htmlFor="edit-fullname">Nombre completo</label>
                      <Field id="edit-fullname" className="administrar__form-group-input" name="fullname" type="text" />
                      <ErrorMessage name="fullname">{(msg) => <span>{msg ?? ''}</span>}</ErrorMessage>
                    </div>
                    <div className="administrar__form-group">
                      <label htmlFor="edit-email">Email</label>
                      <Field id="edit-email" className="administrar__form-group-input" name="email" type="email" />
                      <ErrorMessage name="email">{(msg) => <span>{msg ?? ''}</span>}</ErrorMessage>
                    </div>
                    <div className="administrar__form-group">
                      <label htmlFor="edit-roles">Roles (separados por coma)</label>
                      <Field id="edit-roles" className="administrar__form-group-input" name="roles" type="text" />
                      <ErrorMessage name="roles">{(msg) => <span>{msg ?? ''}</span>}</ErrorMessage>
                    </div>
                    <div className="administrar__form-group administrar__form-group--inline">
                      <label htmlFor="edit-active">Activo</label>
                      <Field id="edit-active" name="active" type="checkbox" />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button type="button" className="administrar__btn administrar__btn--ghost" onClick={handleCloseEditModal}>Cancelar</button>
                  <button type="submit" className="administrar__btn" disabled={isSubmitting}>
                    {isSubmitting ? <Loader /> : 'Guardar'}
                  </button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </div>
  );
};

export default AdministrarPage;
