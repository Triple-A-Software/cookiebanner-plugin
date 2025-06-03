create table if not exists settings (
    id text not null primary key,
    enabled boolean not null default true
);

create table if not exists cookie_category (
    id int generated always as identity,
    enabled boolean not null default true,
    label jsonb not null default '{}',
    description jsonb not null default '{}',
    placeholder_html text,

    primary key (id)
);

create table if not exists selector (
    id int generated always as identity,
    cookie_category_id int not null,
    selector text not null default '',

    primary key (id),
    foreign key (cookie_category_id) references cookie_category(id) on delete cascade
);
