create table usuario(
  username varchar(40),
  email varchar(64) not null,
  senha varchar(40) not null,
  nome varchar(40) not null,
  constraint pk_usuario primary key(username),
  constraint un_usuario unique(email)
);

create table locatario(
  username varchar(40),
  tipo_pessoa varchar(4),
  cpf varchar(14),
  rg varchar(12),
  cnpj varchar(18),
  constraint ck_usuario check (upper(tipo_pessoa) in ('FIS', 'JUR')),
  constraint pk_locatario primary key (username),
  constraint fk_locatario foreign key (username)
    references usuario(username) on delete cascade
);

create table proprietario(
  username varchar(40),
  cpf varchar(14) not null,
  rg varchar(12) not null,
  constraint pk_proprietario primary key (username),
  constraint fk_proprietario foreign key (username)
    references usuario(username) on delete cascade
);

create table telefone(
  username varchar(40),
  telefone varchar(12),
  constraint pk_telefone primary key (username, telefone),
  constraint fk_telefone foreign key (username)
    references usuario(username) on delete cascade
);

create table local(
  id_local serial,
  username varchar(40),
  rua varchar(30),
  numero int,
  bairro varchar(30),
  cidade varchar(30),
  estado varchar(2),
  descricao_local varchar(300),
  constraint pk_local primary key (id_local),
  constraint fk_local foreign key (username)
    references proprietario(username) on delete cascade,
  constraint ck_local unique(username, rua, numero, bairro, cidade, estado)
);

create table espaco(
  id_local int,
  cod_espaco serial,
  preco real,
  area real,
  nota real,
  constraint pk_espaco primary key (id_local, cod_espaco),
  constraint fk_espaco foreign key (id_local)
    references local(id_local) on delete cascade
);

create table adicional(
  id_local int,
  cod_espaco int,
  nome varchar(40),
  descricao_adic varchar(300),
  constraint pk_adicional primary key (id_local, cod_espaco, nome),
  constraint fk_adicional foreign key (id_local, cod_espaco)
    references espaco(id_local, cod_espaco) on delete cascade
);

create table locacao(
  cod_locacao serial,
  locatario varchar(40) not null,
  proprietario varchar(40) not null,
  local int not null,
  espaco int not null,
  data timestamp not null,
  nro_horas int not null,
  constraint pk_locacao primary key (cod_locacao),
  constraint fk_locacao foreign key (locatario)
    references locatario(username) on delete cascade,
  constraint fk2_locacao foreign key (proprietario)
    references proprietario(username) on delete cascade,
  constraint fk3_locacao foreign key (local, espaco)
    references espaco(id_local, cod_espaco) on delete cascade,
  constraint ck_locacao unique(local, espaco, data)
);

create table pagamento(
  cod_pag serial,
  locacao int not null,
  valor_total real not null,
  forma_pag varchar(15) not null,
  data_hora_pag timestamp not null,
  constraint pk_pagamento primary key (cod_pag),
  constraint fk_pagamento foreign key (locacao)
    references locacao(cod_locacao) on delete cascade,
  constraint ck_pagamento unique(locacao)
);