import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import Table from '../../components/Table';
import TableSkeleton from '../../components/Table/Skeleton';
import Modal from '../../components/Modal';
import type { Column, Action } from '../../components/Table/TableContext';
import type { UserApi } from '../../interfaces/user/user.interface';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import './AdministrarPage.scss';

const PAGE_SIZE = 8;

const AdministrarPage = () => {
  const [users, setUsers] = useState<UserApi[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    userService.getAll(page, PAGE_SIZE)
      .then(res => {
        setUsers(res.data.rows);
        setTotal(res.data.total);
      })
      .catch(err => {
        setError(err.message ?? 'Error al cargar usuarios');
      })
      .finally(() => setLoading(false));
  }, [page]);

  const pageTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (pageTimeoutRef.current) clearTimeout(pageTimeoutRef.current);
    };
  }, []);

  const handlePageChange = useCallback((p: number) => {
    if (pageTimeoutRef.current) clearTimeout(pageTimeoutRef.current);
    pageTimeoutRef.current = setTimeout(() => setPage(p), 300);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo<Column[]>(() => [
    { key: 'fullname', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'roles', header: 'Rol', render: (row) => (row.roles as string[]).join(', ') },
    { key: 'active', header: 'Estado', render: (row) => row.active ? 'Activo' : 'Inactivo' },
  ], []);

  const handleVer = useCallback((row: Record<string, unknown>) => {
    console.log('Ver usuario:', row);
  }, []);

  const handleEditar = useCallback((row: Record<string, unknown>) => {
    console.log('Editar usuario:', row);
  }, []);

  const handleEliminar = useCallback((row: Record<string, unknown>) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser) return;
    try {
      await userService.delete(selectedUser.id as string);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setTotal(prev => prev - 1);
      toast.success('Usuario eliminado correctamente');
    } catch {
      toast.error('Error al eliminar el usuario');
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  }, [selectedUser]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const actions = useMemo<Action[]>(() => [
    { icon: '👁', label: 'Ver detalle', onClick: handleVer },
    { icon: '✏️', label: 'Modificar', onClick: handleEditar },
    { icon: '🗑', label: 'Eliminar', variant: 'danger', onClick: handleEliminar },
  ], [handleVer, handleEditar, handleEliminar]);

  return (
    <div className="administrar">
      <div className="administrar__header">
        <h1>Administrar Usuarios</h1>
        {!loading && <span className="administrar__count">{total} usuarios</span>}
      </div>

      {error && (
        <div className="administrar__error">
          {error}
        </div>
      )}

      {loading && !error && (
        <TableSkeleton columns={columns.length} rows={PAGE_SIZE} hasActions />
      )}

      {!loading && !error && (
        <Table
          data={users as unknown as Record<string, unknown>[]}
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
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} type="info">
        <Modal.Header title="Confirmar eliminación" />
        <Modal.Body>
          <p>¿Estás seguro de eliminar a <strong>{selectedUser?.fullname as string}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCloseModal}>Cancelar</button>
          <button onClick={handleConfirmDelete} style={{ color: 'red' }}>Confirmar</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdministrarPage;
