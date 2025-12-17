# table-manager

## Passos para utilização

1. Clone ou faça download do repositório:
   
  `git clone {html}`

3. Tenha o MySQL funcionando


4. Entre no diretório "backend" e instale as dependecias:
   
  `npm install`


5. Altere o arquivo .env inserindo o seu usuário para o MySQL em DB_USER e sua senha em DB_PASSWORD (use "git add" e "git commit" para salvar o arquivo localmente e continuar)


6. Execute o arquivo de setup do banco de dados:


`node reservas-setup.js`

7. Coloque o back-end para rodar com o comando(deixe este terminal aberto enquanto roda o projeto):

  `node reservas.js`

(Backend está rodando na porta 3000)

9. Após isso abra outro terminal e entre no diretório "frontend" e execute este comando:
    
  `npm install`

  `npm run dev`

7. O frontend está rodando, e a porta deve ser informada no output do comando anterior.

8. Quando for finalizar, use CTRL+C nos dois terminais.
