insert into usuario(username, email, senha, nome) 
values
  (
    'Victor',
    'victor95@hotmail.com',
    'vict999',
    'Victor Lima'
  ),
  (
    'Messi',
    'lionelmessi@hotmail.com',
    'uefa123',
    'Lionel Messi'
  ),
  (
    'Barack',
    'barack@hotmail.com',
    'usa2013',
    'Barack Obama'
  ),
  (
    'Trump',
    'trump@hotmail.com',
    'usa2017',
    'Donald Trump'
  );

insert into locatario(username, tipo_pessoa, cpf, rg, cnpj)
values
  (
    'Victor',
    'FIS',
    '750.613.747-03',
    '57.459.926-2',
    null
  ),
  (
    'Messi',
    'JUR',
    null,
    null,
    '51.061.521/0001-90'
  );

insert into proprietario(username, cpf, rg)
values
  ('Barack', '208.925.764-48', '13.044.742-2'),
  ('Trump', '399.875.189-07', '10.951.502-3');

insert into telefone(username, telefone)
values
  ('Victor', '16981004343'),
  ('Barack', '17147137133'),
  ('Barack', '11111111111');

insert into local(username, rua, numero, bairro, cidade, estado, descricao_local)
values
  (
    'Barack',
    'John Kennedy',
    50,
    'Center',
    'New York',
    'NY',
    'air conditioning, high speed internet'
  ),
  (
    'Trump',
    'Bridge Street',
    52,
    'Center',
    'Seattle',
    'WA',
    null
  );

insert into espaco(id_local, preco, area, nota)
values
  (1, 250.00, 100.3, 8.9),
  (1, 149.99, 30.5, null),
  (2, 130, 20.0, 9.5);

insert into locacao(locatario, proprietario, local, espaco, data, nro_horas)
values
  (
    'Messi',
    'Trump',
    2,
    3,
    TO_DATE('2012-06-24', 'yyyy/mm/dd'),
    24
  ),
  (
    'Victor',
    'Barack',
    1,
    2,
    TO_DATE('2015-01-26', 'yyyy/mm/dd'),
    48
  ),
  (
    'Victor',
    'Barack',
    1,
    2,
    TO_DATE('2015-01-27', 'yyyy/mm/dd'),
    10
  );

insert into adicional(id_local, cod_espaco, nome, descricao_adic)
values
  (
    1,
    1,
    'Central Park',
    'Besides all the technology, this place has a view to the Central Park.'
  ),
  (
    2,
    3,
    'Hidden Cameras',
    'The space has hidden cameras for security.'
  );

insert into pagamento(locacao, valor_total, forma_pag, data_hora_pag)
values
  (
    1,
    250.50,
    'Débito',
    TO_DATE('2012-06-23', 'yyyy/mm/dd')
  ),
  (
    2,
    150.30,
    'Crédito',
    TO_DATE('2015-01-26', 'yyyy/mm/dd')
  ),
  (
    3,
    200.30,
    'Crédito',
    TO_DATE('2015-01-27', 'yyyy/mm/dd')
  );