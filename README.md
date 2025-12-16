# table-manager

## Passos

1. Instale as dependências na pasta do projeto
npm install mysql2 express

## Iniciando o server mysql
2. Abra o powershell e vá até a pasta do projeto e execute:
`powershell init-mysql.ps1`

3. Insira o caminho para a sua pasta MySQL (ex: C:\Users\eu\MySQL)

3.1 Se desejar não fazer esse passo sempre que iniciar o projeto insira o seu caminho pro MySQL no arquivo init-mysql.ps1 assim:
` # start_mysql_user.ps1
param(
    [string]$MySqlPath = "{INSIRA O SEU CAMINHO AQUI SEM AS CHAVES}"
) `

4. Deixe a janela aberta, o MySQL Server está rodando. Ctrl+C para parar o Server.

## Setup
5. Se for a primeira vez usando o script, use este comando na pasta do projeto:
`node setup.js`

## API
6. Após isso, pode usar esse comando: (Ctrl+C para parar)
`node back-end.js`

7. A API está rodando no localhost.

## Fechamento
8. Quando for finalizar, pare o script back-end.js com Ctrl+C no terminal de execução e Ctrl+C no terminal do MySQL server.