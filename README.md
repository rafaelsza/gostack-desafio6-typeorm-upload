# Back-end com NodeJS, TypeScript e TypeORM

Desafio n°6 do bootcamp GoStack, onde desenvolvemos um back-end utilizando os conhecimentos adquiridos durante as aulas do segundo módulo do segundo nível.

Sua funcionalidade é cadastrar transações em um banco de dados Postgres, salvando dados como:
- title: Título da transação.
- value: Valor da transação.
- type: Tipo da transação onde pode ter apenas os valores:
  - 'income' para transações de entrada.
  - 'outcome' para transações de sáida.
- category: Categoria da transação.

No método GET da rota /transaction além de retornar todas as transações retorna também o balanço de todas as transações.<br/>

Também é possível excluir uma transação informando seu ID na rota e importar transações de um arquivo .csv na rota de importação.

Utilizado:
- express: para definir rotas e suas funcionalidades.
- uuidv4: para gerar ID's aleatórios e únicos.
- ts-node-dev: para criar um servidor local e converter códigos TypeScript em JavaScript.
- multer: para realizar o upload de arquivos.
- pg: driver para conexão do TypeORM com o banco de dados Postgres.
- TypeORM: para realizar toda a interação com o banco de dados.
- express-async-errors: para utilização da nossa própria classe de erro no express.
- reflect-metadata: para utilização de sintaxe com definição declarativa.
- csv-parse: para realizar a leitura de arquivos CSV.

Padronização de código utilizando:
- ESLint
- Prettier

<h2>Para utilizar em sua máquina:</h2>

<b>* Necessário ter o <a href="https://yarnpkg.com/getting-started/install">yarn</a>, <a href="https://nodejs.org/en/download/">NodeJS</a> e <a href="https://www.postgresql.org/download/">Postgres</a> instalados em sua máquina.</b>

Atualize o arquivo <i>ormconfig.json</i> com os dados da sua conexão com o banco de dados.

Para utilizar as rotas do projeto será preciso utilizar o <a href="https://insomnia.rest/download/">Insomnia</a> ou o <a href="https://www.postman.com/downloads/">Postman</a>, conforme sua preferência.

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

Agora rode as migrations para criar as tabelas no banco de dados:
```
yarn typeorm migration:run
```

Para executar o projeto digite:
```
yarn dev:server
```

Agora com o Back-end rodando em sua máquina já pode começar a utilizar as rotas e seus métodos HTTP.

<h2>Métodos HTTP e suas rotas:</h2>

<b>ROTA</b>: <a href="http://localhost:3333/transactions">http://localhost:3333/transactions</a>

- <b>POST</b>: para cadastrar uma nova transação no banco de dados.  <br/>
  Crie uma nova requisição do tipo POST no Insomnia/Postman colocando a rota acima e passando dentro do corpo os valores em formato JSON, conforme exemplificados abaixo:
  ```
  {
    "title": "Salário",
    "value": "200",
    "type": "income",
    "category": "Freelance"
  }
  ```
  *Lembrando que type pode ser do tipo 'income' ou 'outcome' conforme informado no início.<br/>
  *Caso uma transação do tipo 'outcome' seja maior que seu saldo em conta, retornará uma mensagem de erro e não será realizado o registro da transação.<br/>
  *Caso a categoria ainda não exista no banco de dados, ela será criada automaticamente.

- <b>GET</b>: retorna todas as transações juntamente com o balanço das mesmas.<br/>
Crie uma nova requisição do tipo GET no Insomnia/Postman colocando a rota acima.

<b>ROTA</b>: <a href="">http://localhost:3333/transactions/id</a>

- <b>DELETE</b>: remove uma transação do banco de dados conforme o ID passado como parâmetro na rota.<br/>
Crie uma nova requisição no Insomnia/Postman do tipo DELETE colocando a rota acima passando como parâmetro o ID de uma transação.

  *Se o ID passado por parâmetro não seja existente no banco de dados será retornado uma mensagem de erro, caso contrário retornará uma resposta com status 200, referenciando sucesso na remoção da transação do banco de dados.

<b>ROTA</b>: <a href="http://localhost:3333/transactions/import">http://localhost:3333/transactions/import</a>

- <b>POST</b>: realiza o upload e importação dos dados de transações de um arquivo CSV.<br/>
Crie uma nova requisição no Insomnia/Postman do tipo POST colocando a rota acima e no corpo utilize o formato Multipart, incluindo um campo com nome "file" do tipo File. Busque pelo arquivo na sua máquina, a formatação do arquivo do arquivo deverá ser da seguinte forma:
  ```
  title, type, value, category
  Salário, income, 500, Freelance
  Padaria, outcome, 200, Alimentação
  ```
  *Após a importação e cadastro das transações no banco de dados será retornado uma resposta no formato JSON com todas as informações das transações importadas.

