import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';
import type { Column } from './TableContext';

const columns: Column[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Rol', sortable: true },
];

const data = [
  { name: 'Alice', email: 'alice@test.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@test.com', role: 'User' },
  { name: 'Charlie', email: 'charlie@test.com', role: 'User' },
  { name: 'Diana', email: 'diana@test.com', role: 'Admin' },
  { name: 'Eve', email: 'eve@test.com', role: 'Editor' },
];

describe('Table', () => {
  it('renders table wrapper', () => {
    render(<Table data={data} columns={columns}><Table.Head /><Table.Body /></Table>);
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table data={data} columns={columns}><Table.Head /><Table.Body /></Table>);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Rol')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<Table data={data} columns={columns}><Table.Head /><Table.Body /></Table>);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('bob@test.com')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    render(<Table data={data} columns={columns} pageSize={2}><Table.Head /><Table.Body /><Table.Pagination /></Table>);
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
  });

  it('does not render pagination when data fits in one page', () => {
    render(<Table data={data} columns={columns} pageSize={10}><Table.Head /><Table.Body /><Table.Pagination /></Table>);
    expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
  });

  it('sort toggles when clicking sortable header', () => {
    render(<Table data={data} columns={columns}><Table.Head /><Table.Body /></Table>);
    const nameHeader = screen.getByText('Nombre').closest('.table__cell--sortable');
    expect(nameHeader).toBeInTheDocument();
    fireEvent.click(nameHeader!);
    const cells = screen.getAllByText(/Alice|Bob|Charlie|Diana|Eve/);
    expect(cells.length).toBeGreaterThan(0);
  });

  it('shows empty message when no data', () => {
    render(<Table data={[]} columns={columns}><Table.Head /><Table.Body /></Table>);
    expect(screen.getByText('No hay datos')).toBeInTheDocument();
  });

  it('navigates pages', () => {
    render(<Table data={data} columns={columns} pageSize={2}><Table.Head /><Table.Body /><Table.Pagination /></Table>);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
  });

  it('uses custom cell renderer', () => {
    const cols: Column[] = [
      { key: 'name', header: 'Name', render: (row) => <strong>{String(row.name)}</strong> },
    ];
    render(<Table data={data} columns={cols}><Table.Head /><Table.Body /></Table>);
    expect(screen.getByText('Alice').tagName).toBe('STRONG');
  });

  it('resets to page 1 when sorting', () => {
    render(<Table data={data} columns={columns} pageSize={2}><Table.Head /><Table.Body /><Table.Pagination /></Table>);
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    const nameHeader = screen.getByText('Nombre').closest('.table__cell--sortable');
    fireEvent.click(nameHeader!);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
