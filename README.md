# Back-end com NodeJS, TypeScript e TypeORM

Desafio n°6 do bootcamp GoStack, onde desenvolvemos um back-end utilizando os conhecimentos adquiridos durante as aulas do segundo módulo do segundo nível.

### Funcionalidades:

- Cadastrar transações em um banco de dados Postgres.
- Listar todas as transações salvas no banco de dados.
- Excluir uma transação informando seu ID como parâmetro na rota.
- Importar um arquivo .csv com dados de transações e salvá-las no banco de dados.

### Utilizado:

- **express**: para definir rotas e suas funcionalidades.
- **uuidv4**: para gerar ID's aleatórios e únicos.
- **ts-node-dev**: para criar um servidor local e converter códigos TypeScript em JavaScript.
- **multer**: para realizar o upload de arquivos.
- **pg**: driver para conexão do TypeORM com o banco de dados Postgres.
- **TypeORM**: para realizar toda a interação com o banco de dados.
- **express-async-errors**: para utilização da nossa própria classe de erro no express.
- **reflect-metadata**: para utilização de sintaxe com definição declarativa.
- **csv-parse**: para realizar a leitura de arquivos CSV.

### Padronização de código utilizando:

- ESLint
- Prettier

## Para utilizar em sua máquina:

**Necessário ter o
[NodeJS](https://nodejs.org/en/download)
e
[Postgres](https://www.postgresql.org/download)
instalados.**

> No projeto foi utilizado o
[yarn](https://yarnpkg.com/getting-started/install)
como gerenciador de pacotes, mas caso queira utilizar o npm basta substituír os comandos que começam com yarn por npm.

Para utilizar as rotas do projeto será preciso utilizar o
[Insomnia](https://insomnia.rest/download)
ou o
[Postman](https://www.postman.com/downloads)
, conforme sua preferência.

Clone o projeto:
```
git clone https://github.com/rafaelsza/gostack-desafio6-typeorm-upload.git
```

Entre na pasta raíz do projeto:
```
cd gostack-desafio6-typeorm-upload
```

Execute yarn para instalar todas as dependências do projeto.
```
yarn
```

Atualize o arquivo **_ormconfig.json_** com os dados da sua conexão com o banco de dados.

Agora rode as migrations para criar as tabelas no banco de dados:
```
yarn typeorm migration:run
```

Para executar o projeto digite:
```
yarn dev:server
```

Agora com o Back-end rodando em sua máquina já pode começar a utilizar as rotas e seus métodos HTTP.

## Métodos HTTP e suas rotas:

**ROTA**: [http://localhost:3333/transactions]()

- **POST**: para cadastrar uma nova transação no banco de dados.

  Crie uma nova requisição do tipo POST no Insomnia/Postman colocando a rota acima e passando dentro do corpo os valores em formato JSON, conforme exemplificados abaixo:
  ```json
  {
    "title": "Salário",
    "value": "200",
    "type": "income",
    "category": "Freelance"
  }
  ```
  > "type" pode ser apenas do tipo "income" para transações de entrada ou "outcome" para transações de saída.

  > Caso uma transação do tipo "outcome" seja maior que seu saldo em conta, retornará uma mensagem de erro e não será realizado o registro da transação.

  > Caso a categoria ainda não exista no banco de dados, ela será criada automaticamente.

- **GET**: retorna todas as transações juntamente com o balanço das mesmas.

  Crie uma nova requisição do tipo GET no Insomnia/Postman colocando a rota acima.

  > Essa requisição retornará todas as transações e balanço das mesmas.

**ROTA**: [http://localhost:3333/transactions/id]()

- **DELETE**: remove uma transação do banco de dados conforme o ID passado como parâmetro na rota.

  Crie uma nova requisição no Insomnia/Postman do tipo DELETE colocando a rota acima passando como parâmetro o ID de uma transação.

  > Se o ID passado por parâmetro não seja existente no banco de dados será retornado uma mensagem de erro, caso contrário retornará uma resposta com status 200, referenciando sucesso na remoção da transação do banco de dados.

**ROTA**: [http://localhost:3333/transactions/import]()

- **POST**: realiza o upload e importação dos dados de transações de um arquivo CSV.

  Crie uma nova requisição no Insomnia/Postman do tipo POST colocando a rota acima e no corpo utilize o formato Multipart, incluindo um campo com nome "file" do tipo File. Busque pelo arquivo na sua máquina, a formatação do arquivo do arquivo deverá ser da seguinte forma:
  ```json
  title, type, value, category
  Salário, income, 500, Freelance
  Padaria, outcome, 200, Alimentação
  ```

  > Após a importação e cadastro das transações no banco de dados será retornado uma resposta no formato JSON com todas as informações das transações importadas.
