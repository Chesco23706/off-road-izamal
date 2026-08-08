import { query } from "../config/db.js";

export const ensureDatabaseSchema = async () => {
  await query(`
    create table if not exists offroad_users (
      id text primary key,
      usuario text not null unique,
      password text,
      rol text not null check (rol in ('admin', 'empleado', 'agenda')) default 'empleado',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists tours (
      id text primary key,
      nombre_cliente text not null,
      fecha date not null,
      hora text not null,
      cantidad_atvs integer not null check (cantidad_atvs >= 1),
      tipo_tour text not null check (tipo_tour in ('city_tours', 'tour_ebula', 'tour_fogata', 'extra')),
      extra text not null default '',
      abono numeric(12,2) not null check (abono >= 0),
      total numeric(12,2) not null check (total >= 0),
      restante numeric(12,2) not null check (restante >= 0),
      status text not null check (status in ('Pagado', 'Pendiente')),
      created_by text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists idx_tours_fecha_hora on tours (fecha, hora);
    create index if not exists idx_tours_status on tours (status);
    create index if not exists idx_tours_fecha_status on tours (fecha, status);
    create index if not exists idx_tours_status_fecha_hora on tours (status, fecha, hora);
    create index if not exists idx_tours_created_at on tours (created_at desc);
    create index if not exists idx_tours_nombre_cliente_lower on tours (lower(nombre_cliente));

    alter table offroad_users enable row level security;
    alter table tours enable row level security;
  `);
};
